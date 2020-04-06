

attribute vec3 vPosition;

varying   vec4 texel_pos;


void main()
{
    gl_Position = vec4(vPosition, 1.0); // set the z position to be as far away as possible.
    texel_pos   = gl_Position;
}