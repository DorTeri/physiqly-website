from PIL import Image, ImageDraw
im = Image.open('v4-c.png').convert('RGB')
print('size', im.size)
X0,Y0,W,H = 1480,720,500,720
c = im.crop((X0,Y0,X0+W,Y0+H)).resize((W*2,H*2), Image.LANCZOS)
d = ImageDraw.Draw(c)
for gx in range(0,W+1,20):
    col=(255,0,0) if gx%100==0 else (0,255,255)
    d.line([(gx*2,0),(gx*2,H*2)], fill=col, width=1)
    if gx%100==0: d.text((gx*2+3,4), str(X0+gx), fill=(255,255,0))
for gy in range(0,H+1,20):
    col=(255,0,0) if gy%100==0 else (0,255,255)
    d.line([(0,gy*2),(W*2,gy*2)], fill=col, width=1)
    if gy%100==0: d.text((4,gy*2+3), str(Y0+gy), fill=(255,255,0))
c.save('v4c-grid.png')
print('ok')
