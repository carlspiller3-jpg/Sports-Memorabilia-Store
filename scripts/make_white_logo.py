from PIL import Image

def make_pure_white(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If the pixel is not transparent, make it pure white
        if item[3] > 0:
            new_data.append((255, 255, 255, item[3]))
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(output_path, "PNG")

make_pure_white("c:/Users/carls/.gemini/antigravity/Scratch/sports-memorabilia-store/public/logo-transparent.png", 
                "c:/Users/carls/.gemini/antigravity/Scratch/sports-memorabilia-store/public/logo-pure-white.png")
print("Pure white logo created successfully!")
