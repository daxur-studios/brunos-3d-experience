vec3 vertexDisplacementNoise(vec3 position,vec3 normal,float scale,vec3 offset,float movement,float intensity,out vec3 displaced_normal){
    vec3 displaced_position=distorted(position,normal,scale,intensity,offset,neighbor_offset,movement);
    vec3 tangent1=orthogonal(normal);
    vec3 tangent2=normalize(cross(normal,tangent1));
    
    // TODO(Max): The distance to the neighbors was originally scaled by 0.1.
    // This caused some small oval/circular visual artifacts in the lighting.
    // For now, simply using neighbors further away betters the problem,
    // but we should figure out the underlying cause when we have some time.
    // Maybe its related to how we calculate the tangent and bitangent?
    vec3 nearby1=position+tangent1;
    vec3 nearby2=position+tangent2;
    vec3 distorted1=distorted(nearby1,normal,scale,intensity,offset,neighbor_offset,movement);
    vec3 distorted2=distorted(nearby2,normal,scale,intensity,offset,neighbor_offset,movement);
    displaced_normal=normalize(cross(distorted1-displaced_position,distorted2-displaced_position));
    return displaced_position;
}