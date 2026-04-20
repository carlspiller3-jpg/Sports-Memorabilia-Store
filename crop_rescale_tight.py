import os
from PIL import Image, ImageChops, ImageOps

files = ["public/products/new_assets/origi_solid.jpg", "public/products/new_assets/torres_solid.jpg"]

def crop_white_bg(img):
    rgb_img = img.convert("RGB")
    bg = Image.new("RGB", rgb_img.size, (255, 255, 255))
    diff = ImageChops.difference(rgb_img, bg)
    diff = ImageOps.invert(diff.convert('L'))
    bbox = diff.point(lambda p: p < 240 and 255).getbbox()
    if bbox:
        return img.crop(bbox)
    return img

target_canvas = (1024, 1024)
TARGET_MARGIN_PERCENT = 0.95

for f in files:
    if os.path.exists(f):
        img = Image.open(f).convert("RGB")
        frame = crop_white_bg(img)
        
        max_dim = int(target_canvas[0] * TARGET_MARGIN_PERCENT)
        w, h = frame.size
        
        if w > h:
            new_w = max_dim
            new_h = int((float(max_dim) / w) * h)
        else:
            new_h = max_dim
            new_w = int((float(max_dim) / h) * w)
            
        scaled_frame = frame.resize((new_w, new_h), Image.Resampling.LANCZOS)
        
        final_img = Image.new("RGB", target_canvas, (255, 255, 255))
        paste_x = (target_canvas[0] - new_w) // 2
        paste_y = (target_canvas[1] - new_h) // 2
        
        final_img.paste(scaled_frame, (paste_x, paste_y))
        
        filename = os.path.basename(f).replace("_solid", "_tight")
        final_img.save(os.path.join("public/products/new_assets", filename), "JPEG", quality=95)
