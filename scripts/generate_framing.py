import urllib.request
import os
from PIL import Image, ImageDraw, ImageFont

font_path = "C:/Windows/Fonts/arialbd.ttf"
# if not os.path.exists(font_path):
#    urllib.request.urlretrieve(font_url, font_path)

SCALE = 150
OFFSET = 150

W_inches = 24
H_inches = 20

img_w = W_inches * SCALE + OFFSET * 2
img_h = H_inches * SCALE + OFFSET * 2

# Colors
COLOR_BG = "#2a2a2a"  # Dark grey background around the mat
COLOR_MAT = "#161616"  # Almost black mat board
COLOR_GOLD = "#D4AF37"
COLOR_HOLE = "#0a0a0a" # Black for the inside aperture
COLOR_TEXT_WHITE = "#FFFFFF"
COLOR_TEXT_GOLD = "#D4AF37"
COLOR_DIMENSION = "#888888" # Gray for arrows

img = Image.new("RGB", (img_w, img_h), COLOR_BG)
draw = ImageDraw.Draw(img)

# Draw Mat
draw.rectangle(
    [OFFSET, OFFSET, OFFSET + W_inches * SCALE, OFFSET + H_inches * SCALE],
    fill=COLOR_MAT,
    outline="#000000",
    width=2
)

# Helper function to draw an aperture with a gold border
def draw_aperture(x_inch, y_inch, w_inch, h_inch, gold_border_w, gold_border_h):
    # Outer gold rectangle
    x0 = OFFSET + x_inch * SCALE
    y0 = OFFSET + y_inch * SCALE
    x1 = x0 + w_inch * SCALE
    y1 = y0 + h_inch * SCALE
    draw.rectangle([x0, y0, x1, y1], fill=COLOR_GOLD)
    
    # Inner black rectangle
    # Calculate difference
    diff_w = (w_inch - gold_border_w) * SCALE
    diff_h = (h_inch - gold_border_h) * SCALE
    
    ix0 = x0 + diff_w / 2
    iy0 = y0 + diff_h / 2
    ix1 = x1 - diff_w / 2
    iy1 = y1 - diff_h / 2
    
    draw.rectangle([ix0, iy0, ix1, iy1], fill=COLOR_HOLE)
    return (x0, y0, x1, y1)

# Jersey Section
j_x0, j_y0, j_x1, j_y1 = draw_aperture(2, 2, 15, 16, 14.75, 15.75)

# Top Photo
t_x0, t_y0, t_x1, t_y1 = draw_aperture(18, 2, 4, 6, 3.75, 5.75)

# Middle Plaque
m_x0, m_y0, m_x1, m_y1 = draw_aperture(18, 9, 4, 2, 3.75, 1.75)

# Bottom Photo
b_x0, b_y0, b_x1, b_y1 = draw_aperture(18, 12, 4, 6, 3.75, 5.75)

# Fonts
try:
    font_large = ImageFont.truetype(font_path, 80)
    font_med = ImageFont.truetype(font_path, 40)
    font_small = ImageFont.truetype(font_path, 30)
    font_tiny = ImageFont.truetype(font_path, 24)
except Exception as e:
    print("Font error, falling back to default:", e)
    font_large = font_med = font_small = font_tiny = ImageFont.load_default()

def draw_text_center(xy, text, font, fill):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    draw.text((xy[0] - w/2, xy[1] - h/2), text, font=font, fill=fill)

# Overall Title
draw_text_center((img_w / 2, OFFSET / 2), 'OVERALL MAT SIZE: 24" x 20"', font_med, COLOR_TEXT_GOLD)

# Jersey Text
draw_text_center((j_x0 + (j_x1-j_x0)/2, j_y0 + (j_y1-j_y0)/2), '15" x 16"', font_large, COLOR_TEXT_WHITE)

# Jersey Gold Border Text (rotated)
txt_img = Image.new('RGBA', (600, 50), (255, 255, 255, 0))
txt_draw = ImageDraw.Draw(txt_img)
txt_draw.text((0, 0), 'GOLD INNER BORDER: 14.75" x 15.75"', font=font_small, fill=COLOR_TEXT_GOLD)
txt_img = txt_img.rotate(90, expand=1)
img.paste(txt_img, (int(j_x0) + 20, int(j_y0 + (j_y1-j_y0)/2 - txt_img.height/2)), txt_img)

# Top Photo Text
draw_text_center((t_x0 + (t_x1-t_x0)/2, t_y0 + (t_y1-t_y0)/2), '4" x 6"', font_med, COLOR_TEXT_WHITE)
draw_text_center((t_x0 + (t_x1-t_x0)/2, t_y1 + 40), 'GOLD BORDER:\n3.75" x 5.75"', font_tiny, COLOR_TEXT_GOLD)

# Middle Plaque Text
draw_text_center((m_x0 + (m_x1-m_x0)/2, m_y0 + (m_y1-m_y0)/2), '4" x 2"', font_med, COLOR_TEXT_WHITE)
draw_text_center((m_x0 + (m_x1-m_x0)/2, m_y1 + 25), 'GOLD BORDER:\n3.75" x 1.75"', font_tiny, COLOR_TEXT_GOLD)

# Bottom Photo Text
draw_text_center((b_x0 + (b_x1-b_x0)/2, b_y0 + (b_y1-b_y0)/2), '4" x 6"', font_med, COLOR_TEXT_WHITE)
draw_text_center((b_x0 + (b_x1-b_x0)/2, b_y1 + 40), 'GOLD BORDER:\n3.75" x 5.75"', font_tiny, COLOR_TEXT_GOLD)

# Draw arrows (dimensions)
def draw_h_arrow(x0, x1, y, text):
    draw.line([(x0, y), (x1, y)], fill=COLOR_DIMENSION, width=4)
    # Arrow heads
    draw.polygon([(x0, y), (x0+15, y-10), (x0+15, y+10)], fill=COLOR_DIMENSION)
    draw.polygon([(x1, y), (x1-15, y-10), (x1-15, y+10)], fill=COLOR_DIMENSION)
    # Text
    bbox = draw.textbbox((0, 0), text, font=font_small)
    w = bbox[2] - bbox[0]
    # Draw text background
    draw.rectangle([x0 + (x1-x0)/2 - w/2 - 10, y - 20, x0 + (x1-x0)/2 + w/2 + 10, y + 20], fill=COLOR_MAT)
    draw_text_center((x0 + (x1-x0)/2, y), text, font_small, COLOR_TEXT_GOLD)

def draw_v_arrow(x, y0, y1, text):
    draw.line([(x, y0), (x, y1)], fill=COLOR_DIMENSION, width=4)
    # Arrow heads
    draw.polygon([(x, y0), (x-10, y0+15), (x+10, y0+15)], fill=COLOR_DIMENSION)
    draw.polygon([(x, y1), (x-10, y1-15), (x+10, y1-15)], fill=COLOR_DIMENSION)
    # Text
    bbox = draw.textbbox((0, 0), text, font=font_small)
    h = bbox[3] - bbox[1]
    # Draw text background
    draw.rectangle([x - 30, y0 + (y1-y0)/2 - h/2 - 10, x + 30, y0 + (y1-y0)/2 + h/2 + 10], fill=COLOR_MAT)
    draw_text_center((x, y0 + (y1-y0)/2), text, font_small, COLOR_TEXT_GOLD)

# Left 2"
draw_h_arrow(OFFSET, j_x0, j_y0 + 200, '2"')
# Right 2"
draw_h_arrow(t_x1, OFFSET + W_inches * SCALE, t_y0 + 200, '2"')
# Top 2" (Jersey)
draw_v_arrow(j_x0 + 100, OFFSET, j_y0, '2"')
# Bottom 2" (Jersey)
draw_v_arrow(j_x0 + 100, j_y1, OFFSET + H_inches * SCALE, '2"')
# Right side vertical gaps
# Gap 1" (Photo 1 to Plaque)
draw_v_arrow(t_x0 + 100, t_y1, m_y0, '1"')
# Gap 1" (Plaque to Photo 2)
draw_v_arrow(m_x0 + 100, m_y1, b_y0, '1"')

# Output to public folder
output_path = "public/framing-dimensions.jpg"
img.save(output_path, quality=95)
print(f"Saved highly accurate dimension graphic to {output_path}")
