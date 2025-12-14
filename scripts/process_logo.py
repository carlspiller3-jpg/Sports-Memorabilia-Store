from PIL import Image
import sys

def remove_black_background(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check for black (allow some tolerance if needed, e.g. < 15)
            if item[0] < 15 and item[1] < 15 and item[2] < 15:
                newData.append((0, 0, 0, 0))
            else:
                newData.append(item)

        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully processed {input_path} to {output_path}")
    except Exception as e:
        print(f"Error processing image: {e}")

if __name__ == "__main__":
    remove_black_background("public/logo-new.png", "public/logo-transparent.png")
