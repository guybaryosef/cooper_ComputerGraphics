

attribute vec4 vPosition;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform mat3 parameters;
// parameters formatin row major order, (so transpose the following for glsl indexing):
//  RADIUS,           THETA,                      THETA_INCREMENT
//  X_ROTATION_ANGLE, X_ROTATION_ANGLE_INCREMENT, PHI
//  Y_ROTATION_ANGLE, X_ROTATION_ANGLE_INCREMENT, PHI_INCREMENT


void main()
{
    vec2 angles = vec2(parameters[1][0], parameters[2][0]);
    vec2 c = cos(angles);
    vec2 s = sin(angles);

    mat4 rx = mat4( 1.0,  0.0,  0.0, 0.0,
    0.0,  c.x,  s.x, 0.0,
    0.0, -s.x,  c.x, 0.0,
    0.0,  0.0,  0.0, 1.0);
    mat4 ry = mat4( c.y,  0.0, -s.y, 0.0,
    0.0,  1.0,  0.0, 0.0,
    s.y,  0.0,  c.y, 0.0,
    0.0,  0.0,  0.0, 1.0);

    // translation matrix - glsl is column major order
    mat4 translate = mat4(  1.0, 0.0, 0.0, 0.0,
                            0.0, 1.0, 0.0, 0.0,
                            0.0, 0.0, 1.0, 0.0,
                            parameters[0][0]*cos(parameters[2][1])*sin(parameters[1][0]),
                            parameters[0][0]*sin(parameters[2][1]),
                            parameters[0][0]*cos(parameters[2][1])*cos(parameters[1][0]), 1.0);

        gl_Position = projectionMatrix * modelViewMatrix * translate * ry * rx * vPosition;
}