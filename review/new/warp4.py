import numpy as np
from PIL import Image, ImageDraw, ImageFilter

BASE, SHOT, OUT = 'v4-a.png', 'app-screen.png', 'v4-a-final.png'
quad  = [(1566,786),(1772,762),(1926,1212),(1785,1243)]   # TL TR BR BL
notch = (1612,757,1712,786)

base = Image.open(BASE).convert('RGB'); Wb,Hb = base.size
shot = Image.open(SHOT).convert('RGB'); ws,hs = shot.size

def coeffs(dst, src):
    A,B = [],[]
    for (X,Y),(x,y) in zip(dst,src):
        A.append([X,Y,1,0,0,0,-x*X,-x*Y]); B.append(x)
        A.append([0,0,0,X,Y,1,-y*X,-y*Y]); B.append(y)
    return np.linalg.solve(np.array(A,float), np.array(B,float))

c = coeffs(quad, [(0,0),(ws,0),(ws,hs),(0,hs)])
warped = shot.transform((Wb,Hb), Image.PERSPECTIVE, tuple(c), resample=Image.BICUBIC)
warped = warped.filter(ImageFilter.GaussianBlur(0.5))
warped = Image.blend(warped, Image.new('RGB',(Wb,Hb),(12,10,16)), 0.10)

mask = Image.new('L',(Wb,Hb),0)
ImageDraw.Draw(mask).polygon(quad, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(1.0))

# carry the glass reflection off the original blank screen onto the new one
m  = np.asarray(mask, float)/255.0
bo = np.asarray(base, float)
inside = m > 0.5
med = np.median(bo[inside], axis=0)
hl = np.clip(bo - med, 0, None) * m[...,None] * 0.85

out = np.asarray(warped, float) + hl
out = np.clip(out, 0, 255)
comp = Image.fromarray(out.astype(np.uint8))

res = base.copy()
res.paste(comp, (0,0), mask)

# the notch is part of the phone, not of the screenshot
nm = Image.new('L',(Wb,Hb),0)
ImageDraw.Draw(nm).rounded_rectangle(notch, radius=13, fill=255)
nm = nm.filter(ImageFilter.GaussianBlur(1.4))
res.paste(base, (0,0), nm)

res.save(OUT); print('saved', OUT)
