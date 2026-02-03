from PIL import Image
import os

def create_cover():
    bg_color = "#1c273a" # Navy from CSS
    width = 1640
    height = 856
    
    # Create background
    img = Image.new("RGBA", (width, height), bg_color)
    
    # Load logo
    # Prefer logo-white-text.png for dark background, else logo-transparent.png
    candidates = [
        "public/logo-white-text.png",
        "public/logo-transparent.png",
        "dist/logo-white-text.png",
        "dist/logo-transparent.png"
    ]
    
    logo = None
    used_path = ""
    
    for path in candidates:
        if os.path.exists(path):
            try:
                logo = Image.open(path)
                used_path = path
                print(f"Using logo: {path}")
                break
            except Exception as e:
                print(f"Failed to open {path}: {e}")
    
    if logo is None:
        print("Error: No logo found.")
        return

    # Safe zone calculation
    # Vertical safe zone: 662px in the middle.
    # Top crop triggers at y < 97 and y > 759 on desktop
    # We want to keep content safe. 
    # Let's set a max height for the logo to fit comfortably.
    # Safe zone height is 662. Let's use 60% of safe zone height -> ~400px
    # Can go up to 500px if needed.
    
    target_height = 450
    
    # Check if resizing based on width is better?
    # Max width: safe zone width is 1640 (can be cropped on mobile sides)
    # Mobile safe width is conservative, maybe inner 1000px?
    # Let's constrain to 450px height or 1200px width, whichever is smaller
    
    aspect_ratio = logo.width / logo.height
    new_width = int(target_height * aspect_ratio)
    new_height = target_height
    
    if new_width > 1200:
        new_width = 1200
        new_height = int(new_width / aspect_ratio)

    print(f"Resizing logo from {logo.size} to ({new_width}, {new_height})")
    
    # Resize logo
    logo = logo.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Center position
    x = (width - new_width) // 2
    y = (height - new_height) // 2
    
    # Check safe zone bounds
    # Safe Y: 97 to 759
    logo_top = y
    logo_bottom = y + new_height
    
    print(f"Logo vertical position: {logo_top} to {logo_bottom}")
    if logo_top < 97 or logo_bottom > 759:
        print("WARNING: Logo exceeds vertical safe zone!")
    else:
        print("Logo is within vertical safe zone.")
        
    # Paste logo (using alpha channel as mask if available)
    if logo.mode == 'RGBA':
        img.paste(logo, (x, y), logo)
    else:
        img.paste(logo, (x, y))
    
    # Output path
    output_path = "public/facebook_group_cover.png"
    img.save(output_path)
    print(f"Created {output_path} with size {width}x{height}")

if __name__ == "__main__":
    create_cover()
