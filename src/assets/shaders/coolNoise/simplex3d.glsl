float simplex3d(vec3 p){
    vec3 s=floor(p+dot(p,vec3(F3)));
    vec3 x=p-s+dot(s,vec3(G3));
    
    vec3 e=step(vec3(0.),x-x.yzx);
    vec3 i1=e*(1.-e.zxy);
    vec3 i2=1.-e.zxy*(1.-e);
    
    vec3 x1=x-i1+G3;
    vec3 x2=x-i2+2.*G3;
    vec3 x3=x-1.+3.*G3;
    
    vec4 w,d;
    
    w.x=dot(x,x);
    w.y=dot(x1,x1);
    w.z=dot(x2,x2);
    w.w=dot(x3,x3);
    
    w=max(.6-w,0.);
    
    d.x=dot(random3(s),x);
    d.y=dot(random3(s+i1),x1);
    d.z=dot(random3(s+i2),x2);
    d.w=dot(random3(s+1.),x3);
    
    w*=w;
    w*=w;
    d*=w;
    
    return dot(d,vec4(52.));
}