precision mediump float;

uniform   samplerCube texMap;

varying   vec4      fColor;
varying   vec3      R;


void main()
{
    //    gl_FragColor = fColor * textureCube(texMap, R);
        gl_FragColor = textureCube(texMap, R);
}