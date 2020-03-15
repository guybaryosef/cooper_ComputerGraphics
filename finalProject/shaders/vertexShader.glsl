

attribute vec3 vPosition;
attribute vec4 vColor;
attribute vec3 vNormal;

varying   vec4 fColor;
varying   vec3 R;

uniform   mat4 modelViewMatrix;
uniform   mat4 projectionMatrix;


void main()
{
    vec4 N = normalize(modelViewMatrix * vec4(vNormal, 0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    R = reflect((modelViewMatrix * vec4(vPosition, 1.0)).xyz, N.xyz);

    fColor      = vColor;
}