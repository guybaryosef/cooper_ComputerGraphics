

attribute vec3 vPosition;

uniform   mat4 modelViewMatrix;
uniform   mat4 projectionMatrix;

varying   vec3 curPos;

void main()
{
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);

    curPos = gl_Position.xyz;
}