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
        ROTATION_DELAY: 5,
        ROTATION_DEG: 3,
        rotationQueue: [],
    },
    cube: {
        CUBE_SIZE: 36,
        idx: new Array(27).fill(0),
        points: [],
        colors: [],

        // An object of 6 faces, each holding the 9 beginning index in 'points' of the cubes in the face.
        // The indexes are ordered usch that if one looks at the face from the center of the cube, we list the elements in ro-
        // major order.
        faces: {
            Red: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Cyan: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Green: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Blue: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Yellow: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Orange: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Middle1: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Middle2: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            },
            Middle3: {
                rotationPoint: vec3(),
                points: new Array(9).fill(0),
            }
        },
        solvedCube: [],
    },
    view: {
        theta: [0,0],
        thetaLoc: null,
        ctmLoc: null,
        ctm: mat4(),
    },
};