

attribute vec4 vPosition;
attribute vec3 vNormal;

varying   vec3      eyePos;
varying   vec3      N;

uniform   mat4 modelViewMatrix;
uniform   mat4 projectionMatrix;
uniform   vec3 rotAngles;

attribute   vec2 texCords;

varying   vec2 texCords_varying;

void main()
{
    texCords_varying = texCords;
    vec3 angles = radians(rotAngles);
    vec3 c = cos(angles);
    vec3 s = sin(angles);

    mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
                    0.0,  c.x,  s.x, 0.0,
                    0.0, -s.x,  c.x, 0.0,
                    0.0,  0.0,  0.0, 1.0);
    mat4 ry = mat4( c.y,  0.0, -s.y, 0.0,
                    0.0,  1.0,  0.0, 0.0,
                    s.y,  0.0,  c.y, 0.0,
                    0.0,  0.0,  0.0, 1.0);
    mat4 rz = mat4( c.z, -s.z,  0.0, 0.0,
                    s.z,  c.z,  0.0, 0.0,
                    0.0,  0.0,  1.0, 0.0,
                    0.0,  0.0,  0.0, 1.0);

    vec4 newPos = rx * ry * rz * vPosition;
    eyePos = newPos.xyz;
    N      = (rx * ry * rz *vec4(vNormal, 0.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * newPos;
}