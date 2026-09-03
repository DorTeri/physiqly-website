import sys
from PIL import Image, ImageDraw
quad = [(1566,786),(1772,762),(1926,1212),(1785,1243)]
im = Image.open('v4-a.png').convert('RGB')
X0,Y0,W,H = 1440,700,560,760
c = im.crop((X0,Y0,X0+W,Y0+H)).resize((W*2,H*2), Image.LANCZOS)
d = ImageDraw.Draw(c)
p = [((x-X0)*2,(y-Y0)*2) for x,y in quad]
d.line(p+[p[0]], fill=(0,255,0), width=3)
for i,(px,py) in enumerate(p):
    d.ellipse([px-8,py-8,px+8,py+8], outline=(255,0,0), width=3)
    d.text((px+11,py-7), 'TL TR BR BL'.split()[i], fill=(255,255,0))
c.save('v4a-quad.png'); print('ok')
