from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import os
import math

# We need a highly aesthetic image that exactly matches the requested dimensions.
SCALE = 80
W_inches = 24
H_inches = 20

mat_w = int(W_inches * SCALE)
mat_h = int(H_inches * SCALE)

bg_w = int(mat_w * 1.3)
bg_h = int(mat_h * 1.3)
offset_x = (bg_w - mat_w) // 2
offset_y = (bg_h - mat_h) // 2

# Colors
COLOR_MAT = (20, 20, 20)
COLOR_HOLE = (10, 10, 10)
COLOR_TEXT_WHITE = (255, 255, 255)
COLOR_TEXT_GOLD = (212, 175, 55)
COLOR_DIMENSION = (180, 160, 100) # Soft goldish gray

font_path = "C:/Windows/Fonts/arialbd.ttf"
try:
    font_large = ImageFont.truetype(font_path, 40)
    font_med = ImageFont.truetype(font_path, 28)
    font_small = ImageFont.truetype(font_path, 18)
    font_tiny = ImageFont.truetype(font_path, 14)
except:
    font_large = font_med = font_small = font_tiny = ImageFont.load_default()

# 1. Create Wood Background
# We'll create a simple horizontal striped gradient to simulate wood grain, then add noise.
img = Image.new("RGB", (bg_w, bg_h), (50, 30, 20))
draw = ImageDraw.Draw(img)
for y in range(bg_h):
    # Base wood color
    r = 50 + int(15 * math.sin(y * 0.05) + 10 * math.sin(y * 0.01))
    g = 30 + int(10 * math.sin(y * 0.05 + 1) + 5 * math.sin(y * 0.01))
    b = 20 + int(5 * math.sin(y * 0.05 + 2))
    r = max(0, min(255, r))
    g = max(0, min(255, g))
    b = max(0, min(255, b))
    draw.line([(0, y), (bg_w, y)], fill=(r, g, b))

# 2. Draw Mat Drop Shadow
shadow = Image.new("RGBA", (bg_w, bg_h), (0, 0, 0, 0))
shadow_draw = ImageDraw.Draw(shadow)
shadow_offset = 20
shadow_draw.rectangle([offset_x + shadow_offset, offset_y + shadow_offset, offset_x + mat_w + shadow_offset, offset_y + mat_h + shadow_offset], fill=(0, 0, 0, 180))
shadow = shadow.filter(ImageFilter.GaussianBlur(15))
img.paste(shadow, (0, 0), shadow)

# 3. Draw Mat Board
mat = Image.new("RGBA", (bg_w, bg_h), (0, 0, 0, 0))
mat_draw = ImageDraw.Draw(mat)
mat_draw.rectangle([offset_x, offset_y, offset_x + mat_w, offset_y + mat_h], fill=(22, 22, 24, 255))

# We will cut out the holes by drawing transparent pixels, but PIL doesn't easily support clearing alpha.
# Instead, we will draw the holes directly on the mat as COLOR_HOLE.

def draw_aperture(x_inch, y_inch, w_inch, h_inch, gold_border_w, gold_border_h):
    x0 = offset_x + int(x_inch * SCALE)
    y0 = offset_y + int(y_inch * SCALE)
    x1 = x0 + int(w_inch * SCALE)
    y1 = y0 + int(h_inch * SCALE)
    
    # Inner shadow for depth
    mat_draw.rectangle([x0-2, y0-2, x1+2, y1+2], fill=(40, 40, 40, 255)) # slight highlight on outer edge
    mat_draw.rectangle([x0, y0, x1, y1], fill=(10, 10, 10, 255)) # hole
    
    # Gold border
    diff_w = (w_inch - gold_border_w) * SCALE
    diff_h = (h_inch - gold_border_h) * SCALE
    gx0 = x0 + diff_w / 2
    gy0 = y0 + diff_h / 2
    gx1 = x1 - diff_w / 2
    gy1 = y1 - diff_h / 2
    
    # We draw the gold border as a rectangle outline
    for i in range(4):
        mat_draw.rectangle([gx0-i, gy0-i, gx1+i, gy1+i], outline=(212, 175, 55, 255))
        
    return (x0, y0, x1, y1)

# Jersey Section
j_x0, j_y0, j_x1, j_y1 = draw_aperture(2, 2, 15, 16, 14.75, 15.75)

# Top Photo
t_x0, t_y0, t_x1, t_y1 = draw_aperture(18, 2, 4, 6, 3.75, 5.75)

# Middle Plaque
m_x0, m_y0, m_x1, m_y1 = draw_aperture(18, 9, 4, 2, 3.75, 1.75)

# Bottom Photo
b_x0, b_y0, b_x1, b_y1 = draw_aperture(18, 12, 4, 6, 3.75, 5.75)

img.paste(mat, (0, 0), mat)

# 4. Text & Annotations
text_layer = Image.new("RGBA", (bg_w, bg_h), (0, 0, 0, 0))
t_draw = ImageDraw.Draw(text_layer)

def draw_text_center(xy, text, font, fill):
    bbox = t_draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    # small drop shadow for text readability
    t_draw.text((xy[0] - w/2 + 2, xy[1] - h/2 + 2), text, font=font, fill=(0,0,0,150))
    t_draw.text((xy[0] - w/2, xy[1] - h/2), text, font=font, fill=fill)

# Banner
t_draw.text((50, 50), "HIGH-RESOLUTION MAT Y-TO-SCALE", font=font_med, fill=(255, 255, 255, 255))
t_draw.line([(50, 90), (450, 90)], fill=(212, 175, 55, 255), width=3)

# Overall Title
draw_text_center((offset_x + mat_w / 2, offset_y + int(1 * SCALE)), 'OVERALL MAT SIZE: 24" x 20"', font_med, COLOR_TEXT_WHITE)

# Jersey
draw_text_center((j_x0 + (j_x1-j_x0)/2, j_y0 + (j_y1-j_y0)/2), '15" x 16"', font_large, COLOR_TEXT_WHITE)

txt_img = Image.new('RGBA', (400, 40), (0, 0, 0, 0))
txt_draw = ImageDraw.Draw(txt_img)
txt_draw.text((0, 0), 'GOLD INNER BORDER: 14.75" x 15.75"', font=font_small, fill=COLOR_TEXT_GOLD)
txt_img = txt_img.rotate(90, expand=1)
text_layer.paste(txt_img, (int(j_x0) + 10, int(j_y0 + (j_y1-j_y0)/2 - txt_img.height/2)), txt_img)

# Right photos
draw_text_center((t_x0 + (t_x1-t_x0)/2, t_y0 + (t_y1-t_y0)/2), '4" x 6"', font_med, COLOR_TEXT_WHITE)
draw_text_center((t_x0 + (t_x1-t_x0)/2, t_y1 - 30), 'GOLD BORDER: 3.75" x 5.75"', font_tiny, COLOR_TEXT_GOLD)

draw_text_center((m_x0 + (m_x1-m_x0)/2, m_y0 + (m_y1-m_y0)/2), '4" x 2"', font_med, COLOR_TEXT_WHITE)
draw_text_center((m_x0 + (m_x1-m_x0)/2, m_y1 - 15), 'GOLD BORDER: 3.75" x 1.75"', font_tiny, COLOR_TEXT_GOLD)

draw_text_center((b_x0 + (b_x1-b_x0)/2, b_y0 + (b_y1-b_y0)/2), '4" x 6"', font_med, COLOR_TEXT_WHITE)
draw_text_center((b_x0 + (b_x1-b_x0)/2, b_y1 - 30), 'GOLD BORDER: 3.75" x 5.75"', font_tiny, COLOR_TEXT_GOLD)

# Dimension Arrows
def draw_h_arrow(x0, x1, y, text):
    t_draw.line([(x0, y), (x1, y)], fill=COLOR_DIMENSION, width=2)
    t_draw.polygon([(x0, y), (x0+8, y-5), (x0+8, y+5)], fill=COLOR_DIMENSION)
    t_draw.polygon([(x1, y), (x1-8, y-5), (x1-8, y+5)], fill=COLOR_DIMENSION)
    bbox = t_draw.textbbox((0, 0), text, font=font_small)
    w = bbox[2] - bbox[0]
    t_draw.rectangle([x0 + (x1-x0)/2 - w/2 - 4, y - 12, x0 + (x1-x0)/2 + w/2 + 4, y + 12], fill=(22,22,24,255))
    draw_text_center((x0 + (x1-x0)/2, y), text, font_small, COLOR_TEXT_GOLD)

def draw_v_arrow(x, y0, y1, text):
    t_draw.line([(x, y0), (x, y1)], fill=COLOR_DIMENSION, width=2)
    t_draw.polygon([(x, y0), (x-5, y0+8), (x+5, y0+8)], fill=COLOR_DIMENSION)
    t_draw.polygon([(x, y1), (x-5, y1-8), (x+5, y1-8)], fill=COLOR_DIMENSION)
    bbox = t_draw.textbbox((0, 0), text, font=font_small)
    h = bbox[3] - bbox[1]
    t_draw.rectangle([x - 15, y0 + (y1-y0)/2 - h/2 - 4, x + 15, y0 + (y1-y0)/2 + h/2 + 4], fill=(22,22,24,255))
    draw_text_center((x, y0 + (y1-y0)/2), text, font_small, COLOR_TEXT_GOLD)

draw_h_arrow(offset_x, j_x0, j_y0 + 100, '2"')
draw_h_arrow(t_x1, offset_x + mat_w, t_y0 + 100, '2"')
draw_v_arrow(j_x0 + 60, offset_y, j_y0, '2"')
draw_v_arrow(j_x0 + 60, j_y1, offset_y + mat_h, '2"')
draw_v_arrow(t_x0 - 40, t_y1, m_y0, '1"')
draw_v_arrow(m_x0 - 40, m_y1, b_y0, '1"')

img.paste(text_layer, (0, 0), text_layer)

# 5. Lamp Lighting Overlay
lamp = Image.new("RGBA", (bg_w, bg_h), (0, 0, 0, 0))
lamp_draw = ImageDraw.Draw(lamp)
cx, cy = bg_w - 100, 100 # Lamp position top right
max_radius = bg_w * 1.5
for r in range(int(max_radius), 0, -20):
    alpha = int(120 * (1 - r/max_radius))
    lamp_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 230, alpha))

img.paste(lamp, (0, 0), lamp)

# Final contrast/color enhance
enhancer = ImageEnhance.Contrast(img)
img = enhancer.enhance(1.1)

output_path = "public/framing-dimensions.jpg"
img.save(output_path, quality=95)
