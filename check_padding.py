import os
from PIL import Image, ImageChops, ImageOps

files = ["public/products/new_assets/origi_solid.jpg", "public/products/new_assets/torres_solid.jpg"]

for f in files:
    if os.path.exists(f):
        img = Image.open(f).convert("RGB")
        w, h = img.size
        # Find bbox of non-white pixels
        bg = Image.new("RGB", (w, h), (255, 255, 255))
        diff = ImageChops.difference(img, bg)
        diff = ImageOps.invert(diff.convert('L'))
        # Using a threshold to account for jpg artifacts
        bbox = diff.point(lambda p: p < 240 and 255).getbbox()
        
        if bbox:
            left, upper, right, lower = bbox
            frame_w = right - left
            frame_h = lower - upper
            
            coverage = (frame_w * frame_h) / (w * h) * 100
            print(f"File: {os.path.basename(f)}")
            print(f"Total Size: {w}x{h}")
            print(f"Frame Size: {frame_w}x{frame_h}")
            print(f"Padding: Top={upper}, Bottom={h-lower}, Left={left}, Right={w-right}")
            print(f"Frame takes up {coverage:.1f}% of the image area.\n")
        else:
            print(f"File {f} is completely white or empty.\n")
    else:
        print(f"File {f} not found.")

