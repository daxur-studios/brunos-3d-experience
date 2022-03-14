float simplex3dFractal(vec3 m){
    mat3 rot1=mat3(-.37,.36,.85,-.14,-.93,.34,.92,.01,.4);
    mat3 rot2=mat3(-.55,-.39,.74,.33,-.91,-.24,.77,.12,.63);
    mat3 rot3=mat3(-.71,.52,-.47,-.08,-.72,-.68,-.7,-.45,.56);
    return .5333333*simplex3d(m*rot1)
    +.2666667*simplex3d(2.*m*rot2)
    +.1333333*simplex3d(4.*m*rot3)
    +.0666667*simplex3d(8.*m);
}