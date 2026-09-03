import io
p = 'index.html'
s = io.open(p, encoding='utf-8').read()
a = ".hero-media img{width:100%;height:100%;object-fit:cover;object-position:58% 42%;display:block}"
b = ".hero-media img{width:100%;height:100%;object-fit:cover;object-position:55% 50%;display:block}"
assert s.count(a) == 1
s = s.replace(a, b)
c = "  .hero-media img{object-position:50% 24%}"
d = "  .hero-media img{object-position:50% 46%}"
assert s.count(c) == 1
s = s.replace(c, d)
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('object-position updated for the new frame')
