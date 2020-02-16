attribute vec3 vPosition;
attribute vec4 vColor;

varying   vec4 fColor;

uniform   vec2 theta;
uniform   mat4 ctm;


void main()
{
    vec2 angles = radians(theta);
    vec2 c = cos(angles);
    vec2 s = sin(angles);

    mat4 rx = mat4(1.0,  0.0,  0.0, 0.0,
    0.0,  c.x,  s.x, 0.0,
    0.0, -s.x,  c.x, 0.0,
    0.0,  0.0,  0.0, 1.0);
    mat4 ry = mat4(c.y,  0.0, -s.y, 0.0,
    0.0,  1.0,  0.0, 0.0,
    s.y,  0.0,  c.y, 0.0,
    0.0,  0.0,  0.0, 1.0);

    gl_Position = ctm * rx * ry * vec4(vPosition, 1);

    fColor      = vColor;
}