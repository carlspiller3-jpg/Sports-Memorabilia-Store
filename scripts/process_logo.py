from PIL import Image

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # item is (R, G, B, A)
        r, g, b, a = item
        
        if a == 0:
            new_data.append(item)
            continue

        # Check if it's "dark" (likely the navy text)
        # Gold pixels have higher R and G values than B.
        # Navy text has very low values for all.
        
        # Simple threshold: if brightness is low, it's text.
        # But we must be careful not to catch the dark parts of the gold gradient.
        # Gold is generally yellower: R > B and G > B.
        
        brightness = (r + g + b) / 3
        
        if brightness < 100: # This should catch the navy text (#1c273a is ~42 brightness)
            # Change to white
            new_data.append((255, 255, 255, a))
        else:
            # Keep original (gold)
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

process_logo("c:/Users/carls/.gemini/antigravity/Scratch/sports-memorabilia-store/public/logo-transparent.png", 
             "c:/Users/carls/.gemini/antigravity/Scratch/sports-memorabilia-store/public/logo-white-text.png")
print("Logo processed successfully!")
