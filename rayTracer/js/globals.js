var state = {
    gl: null,
    program_rayTracer: null,

    ui: {
        dragging: false,
        mouse: {
            lastX: -1,
            lastY: -1,
        },
        inRotation: false,
    },

    uniforms: {
        mvmLoc:           null,
        projLoc:          null,
        modelViewMatrix:  null,
        projectionMatrix: null,
    },

    renders: {
        points:         [],
        vBuffer:        null,
        vPosition_attr: null,
    },

    view: {
        aspect: null,
        near:   0.1,
        far:    100,
        fovy:   60,           // in degrees

        phi:    0,
        theta:  0,
        radius: 2,
        eye: vec3(0, 0, 0), // will get updated during render-time
        at:  vec3(0,0,0),    // origin
        up:  vec3(0,1,0),    // positive y axis is up

        rotAngles:          vec3(0.0, 0.0, 0.0),
        rotAnglesIncrement: vec3(0.0, 0.0, 0.0),
    },
};