precision mediump float;

uniform   samplerCube texMap;
uniform   sampler2D   glossMap;

varying   vec2 texCords_varying;
uniform   vec3 cameraPosition;

varying   vec3      eyePos;
varying   vec3      N;


void main()
{
        vec3 R = reflect(eyePos-cameraPosition, N);

        gl_FragColor = 0.25*texture2D(glossMap, texCords_varying) + 0.75*textureCube(texMap, R);
        gl_FragColor.a = 1.0;
}
