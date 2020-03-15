var state = {
    gl: null,
    program: null,

    ui: {
        dragging: false,
        mouse: {
            lastX: -1,
            lastY: -1,
        },

        inRotation: false,
        rotationQueue: [],
    },
    cubeMap: {
        points: [],
        colors: [],
        normals: [],
        textureObj: null,
        textureLoc: null,
        textureSampler: null
    },
    view: {
        modelViewMatrixLoc: null,
        projectionMatrixLoc: null,


        aspect: null,
        clipCordNeg: -1,
        clipCordPos: 1,
        theta: Math.PI/2,
        phi:   0,
        radius: 0,
        eye: vec3(0,0,0),
        at: vec3(0,0,0),    // origin
        up: vec3(0,1,0)     // y coordinate
    },
};