import io
p='index.html'
s=io.open(p,encoding='utf-8').read()
a="    linear-gradient(0deg,rgba(7,7,11,.72),rgba(7,7,11,0) 34%);"
b="    linear-gradient(0deg,rgba(7,7,11,.82),rgba(7,7,11,0) 38%);"
assert s.count(a)==1, s.count(a)
io.open(p,'w',encoding='utf-8',newline='\n').write(s.replace(a,b))
print('bottom wash deepened')
