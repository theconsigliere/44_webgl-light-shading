varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;


    // apply the object transformation to the normal not the rotation, hence 0.0 for the last position
    vec4 modelNormal = modelMatrix * vec4(normal, 0.0);

    // varyings
    vNormal = modelNormal.xyz;
    vPosition = modelPosition.xyz;
}