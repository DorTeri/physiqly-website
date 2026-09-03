from PIL import Image, ImageDraw
im = Image.open('hero2-a.png').convert('RGB')
quad = [(1547,787),(1743,766),(1889,1211),(1735,1227)]   # TL, TR, BR, BL
X0,Y0,W,H = 1500,730,460,700
c = im.crop((X0,Y0,X0+W,Y0+H)).resize((W*2,H*2), Image.LANCZOS)
d = ImageDraw.Draw(c)
pts = [((x-X0)*2,(y-Y0)*2) for x,y in quad]
d.line(pts+[pts[0]], fill=(0,255,0), width=4)
for i,(px,py) in enumerate(pts):
    d.ellipse([px-9,py-9,px+9,py+9], outline=(255,0,0), width=4)
    d.text((px+12,py-6), 'TL TR BR BL'.split()[i], fill=(255,255,0))
c.save('quad-check.png')
print('ok')
