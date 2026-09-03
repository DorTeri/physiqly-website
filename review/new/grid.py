from PIL import Image, ImageDraw
im = Image.open('hero2-a.png').convert('RGB')
print('full', im.size)
X0, Y0, W, H = 1500, 730, 460, 700
crop = im.crop((X0, Y0, X0+W, Y0+H))
S = 2
crop = crop.resize((W*S, H*S), Image.LANCZOS)
d = ImageDraw.Draw(crop)
for gx in range(0, W+1, 20):
    col = (255,0,0) if gx % 100 == 0 else (0,255,255)
    d.line([(gx*S,0),(gx*S,H*S)], fill=col, width=1)
    if gx % 100 == 0:
        d.text((gx*S+3, 4), str(X0+gx), fill=(255,255,0))
for gy in range(0, H+1, 20):
    col = (255,0,0) if gy % 100 == 0 else (0,255,255)
    d.line([(0,gy*S),(W*S,gy*S)], fill=col, width=1)
    if gy % 100 == 0:
        d.text((4, gy*S+3), str(Y0+gy), fill=(255,255,0))
crop.save('grid-phone.png')
print('saved', crop.size)
