import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BASE, SHOT, OUT = 'hero2-a.png', 'app-screen.png', 'hero2-a-realscreen.png'
quad = [(1544,784),(1752,764),(1897,1217),(1732,1230)]   # TL, TR, BR, BL

base = Image.open(BASE).convert('RGB'); Wb, Hb = base.size
shot = Image.open(SHOT).convert('RGB'); ws, hs = shot.size

def coeffs(dst, src):
    A, B = [], []
    for (X, Y), (x, y) in zip(dst, src):
        A.append([X, Y, 1, 0, 0, 0, -x*X, -x*Y]); B.append(x)
        A.append([0, 0, 0, X, Y, 1, -y*X, -y*Y]); B.append(y)
    return np.linalg.solve(np.array(A, float), np.array(B, float))

c = coeffs(quad, [(0,0),(ws,0),(ws,hs),(0,hs)])
warped = shot.transform((Wb,Hb), Image.PERSPECTIVE, tuple(c), resample=Image.BICUBIC)
warped = warped.filter(ImageFilter.GaussianBlur(0.55))

# the room is dark, so the screen is not printed white: pull it back a little
warped = Image.blend(warped, Image.new('RGB',(Wb,Hb),(12,10,16)), 0.12)

mask = Image.new('L',(Wb,Hb),0)
ImageDraw.Draw(mask).polygon(quad, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.1))

out = base.copy()
out.paste(warped, (0,0), mask)

# specular sheen only: a soft diagonal band of white, clipped to the screen
sheen = Image.new('L',(Wb,Hb),0)
sd = ImageDraw.Draw(sheen)
sd.polygon([(1500,700),(1810,700),(1660,1260),(1470,1260)], fill=255)
sheen = sheen.filter(ImageFilter.GaussianBlur(70))
sheen = Image.fromarray((np.asarray(sheen,float)*0.16).astype(np.uint8))
sheen = Image.composite(sheen, Image.new('L',(Wb,Hb),0), mask)
out.paste(Image.new('RGB',(Wb,Hb),(226,232,246)), (0,0), sheen)

out.save(OUT)
print('saved')
