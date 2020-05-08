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
        eyeLoc:             null,
        basisVecsLoc:       null,
        basisVecs:          [vec3(), vec3()],

        spheres: {
            Count:   4,
            reflectionCount: 3,
            Centers:[   vec3(-0.5, -0.5, -0.5), vec3(-0.5, -0.5, 0.0), vec3(-0.5, -0.5, 0.5),
                        vec3( 0.0,  0.0, -0.5), vec3( 0.0,  0.0, 0.0), vec3( 0.0,  0.0, 0.5),
                        vec3( 0.5,  0.5, -0.5), vec3( 0.5,  0.5, 0.0), vec3( 0.5,  0.5, 0.5)    ],
            Radii:  [ 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
            colors: [   vec4(0.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0),
                        vec4(0.0, 0.0, 1.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0),
                        vec4(1.0, 0.0, 0.0, 1.0), vec4(1.0, 0.0, 0.0, 1.0), vec4(1.0, 0.0, 0.0, 1.0) ],
            reflectivity: [ 0.3, 0.3, 0.3,  0.1, 0.1, 0.1,  0.7, 0.7, 0.7],

            reflectivityLoc:    null,
            RadiiLoc:           null,
            CentersLoc:         null,
            CountLoc:           null,
            colorsLoc:          null,
            reflectionCountLoc: null,
        }
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