varying vec3 vPosition;

void main(){
    vPosition=normalize(position);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
}
