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
        textureSampler: null,
    },
    view: {
        modelViewMatrixLoc: null,
        projectionMatrixLoc: null,

        aspect: null,
        near: 1,
        far:  10,
        fovy: 60,           // in degrees

        phi: 0,
        theta: 0,
        radius: 2,
        eye: vec3(0, 0, 0),
        at: vec3(0,0,0),    // origin
        up: vec3(0,1,0),    // y coordinate
    },
};