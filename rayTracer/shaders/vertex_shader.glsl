
attribute vec3 vPosition;

varying   vec3 curPos;

void main()
{
    gl_Position = vec4(vPosition, 1.0);
    curPos = vPosition;
}