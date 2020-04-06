precision mediump float;

uniform   samplerCube texMap;

varying   vec4 texel_pos;

uniform   mat4 skyboxViewMat;

void main()
{
    gl_FragColor = textureCube(texMap, (skyboxViewMat * texel_pos).xyz);
}