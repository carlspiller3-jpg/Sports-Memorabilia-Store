import os
import glob
from PIL import Image, ImageChops, ImageOps, ImageDraw, ImageFilter

def crop_white_bg(img):
    rgb_img = img.convert("RGB")
    bg = Image.new("RGB", rgb_img.size, (255, 255, 255))
    diff = ImageChops.difference(rgb_img, bg)
    diff = ImageOps.invert(diff.convert('L'))
    bbox = diff.point(lambda p: p < 240 and 255).getbbox()
    if bbox:
        return img.crop(bbox)
    return img

def process_image(filepath, is_mount):
    print(f"\nProcessing: {os.path.basename(filepath)}")
    
    img = Image.open(filepath).convert("RGBA")
    
    # 1. Crop any white background bounds
    raw_cropped = crop_white_bg(img)
    
    # 2. Add Black Frame if it's just a mount
    if is_mount:
        frame_thickness = 40
        w, h = raw_cropped.size
        framed_w = w + (frame_thickness * 2)
        framed_h = h + (frame_thickness * 2)
        
        framed_item = Image.new("RGBA", (framed_w, framed_h), "#111111")
        # Paste the mount inside the frame
        framed_item.paste(raw_cropped, (frame_thickness, frame_thickness), raw_cropped)
        
        # Add a subtle bevel to the frame
        f_draw = ImageDraw.Draw(framed_item)
        f_draw.rectangle([0, 0, framed_w-1, framed_h-1], outline="#333333", width=2)
        
        processed_item = framed_item
    else:
        # It's already a full frame
        processed_item = raw_cropped

    # 3. Scale down appropriately so we have room for the ultra-tight 95% crop
    target_canvas = (1024, 1024)
    TARGET_MARGIN_PERCENT = 0.95
    
    max_dim = int(target_canvas[0] * TARGET_MARGIN_PERCENT)
    w, h = processed_item.size
    
    if w > h:
        new_w = max_dim
        new_h = int((float(max_dim) / w) * h)
    else:
        new_h = max_dim
        new_w = int((float(max_dim) / h) * w)
        
    scaled_item = processed_item.resize((new_w, new_h), Image.Resampling.LANCZOS)
    
    # 4. Generate the Drop Shadow
    shadow_padding = 60
    shadow_w = new_w + shadow_padding * 2
    shadow_h = new_h + shadow_padding * 2
    shadow_layer = Image.new("RGBA", (shadow_w, shadow_h), (0,0,0,0))
    
    s_draw = ImageDraw.Draw(shadow_layer)
    s_draw.rectangle(
        [shadow_padding, shadow_padding, shadow_padding+new_w, shadow_padding+new_h],
        fill=(0, 0, 0, 160)
    )
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(15))

    # 5. Composite everything on a 1024x1024 pure white solid background
    final_img = Image.new("RGB", target_canvas, (255, 255, 255))
    
    x = (target_canvas[0] - new_w) // 2
    y = (target_canvas[1] - new_h) // 2
    
    light_offset_x = 10
    light_offset_y = 15
    shadow_pos_x = x - shadow_padding + light_offset_x
    shadow_pos_y = y - shadow_padding + light_offset_y
    
    # Paste shadow via mask
    final_img.paste(shadow_layer, (shadow_pos_x, shadow_pos_y), shadow_layer)
    
    # Paste actual item via mask
    final_img.paste(scaled_item, (x, y), scaled_item)
    
    # Save the output
    out_dir = "public/products/final_assets"
    os.makedirs(out_dir, exist_ok=True)
    
    filename = os.path.basename(filepath)
    name, ext = os.path.splitext(filename)
    out_path = os.path.join(out_dir, f"{name}_shopify{ext}")
    final_img.save(out_path, "JPEG", quality=95)
    print(f" -> Successfully saved to {out_path}")

def main():
    print("=======================================")
    print(" Sports Memorabilia - Asset Processor ")
    print("=======================================\n")
    
    input_dir = "public/products/new_assets"
    files = glob.glob(os.path.join(input_dir, "*.*"))
    valid_files = [f for f in files if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
    
    if not valid_files:
        print(f"No images found in {input_dir}")
        return

    for f in valid_files:
        # Only process files that don't already have 'shopify' in the name to avoid infinite loops
        if "shopify" in f.lower() or "tight" in f.lower() or "scaled" in f.lower() or "v3" in f.lower():
            continue
            
        print(f"\nFound asset: {os.path.basename(f)}")
        while True:
            choice = input("Is this item just a MOUNT (needs a black frame added)? [y/n/skip]: ").strip().lower()
            if choice in ['y', 'n', 'skip']:
                break
            print("Please enter 'y' for Mount, 'n' for perfectly framed, or 'skip' to ignore.")
            
        if choice == 'skip':
            print("Skipping...")
            continue
            
        is_mount = (choice == 'y')
        process_image(f, is_mount)

    print("\nAll assets processed!")

if __name__ == "__main__":
    main()
