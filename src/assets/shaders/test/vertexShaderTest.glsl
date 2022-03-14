precision mediump float;

attribute float aRandom;

varying float vRandom;

void main()
{
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    
    // modelPosition.z+=sin(modelPosition.x*10.)*.1;
    modelPosition.z+=aRandom*.1;
    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    
    gl_Position=projectedPosition;
    //gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
    
    vRandom=aRandom;
    
}