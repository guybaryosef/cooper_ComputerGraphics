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

        sphereValues: [0,1,2,3,4,5,6,7,8],
        sphereCount: 1,
        sphereCenters: [vec3(-0.5, -0.5, -0.5), vec3(-0.5, -0.5, 0.0), vec3(-0.5, -0.5, 0.5),
                        vec3( 0.0,  0.0, -0.5), vec3( 0.0,  0.0, 0.0), vec3( 0.0,  0.0, 0.5),
                        vec3( 0.5,  0.5, -0.5), vec3( 0.5,  0.5, 0.0), vec3( 0.5,  0.5, 0.5)    ],
        sphereRadii: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
        sphereRadiiLoc:   null,
        sphereCentersLoc: null,
        sphereValsLoc:    null,
        sphereCountLoc:   null,
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