var state = {
    gl: null,
    program_skybox: null,
    program_envMap: null,

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
        reflect_obj_vertices: [],
        skybox_vertices: [],
        normals: [],
        texCords: [],

        vNormal_attr:      null,
        vPosition_attr_em: null,
        vPosition_attr_sb: null,

        nBuffer:    null,
        vBuffer_em: null,
        vBuffer_sb: null,

        textureObj:     null,
        textureSampler: null,

        glossTextureLoc_em:      null,
        backgroundTextureLoc_em: null,
        objRotTexCordsLoc_em:    null,
        backgroundTextureLoc_sb: null,
    },
    view: {
        modelViewMatrixLoc_em:  null,
        projectionMatrixLoc_em: null,
        cameraPositionLoc_em:   null,
        objRotAngleLoc_em:      null,
        skyboxViewMatLoc_sb:    null,

        aspect: null,
        near: 1,
        far:  10,
        fovy: 60,           // in degrees

        phi: 0,
        theta: 0,
        radius: 2,
        eye: vec3(0, 0, 0), // will get updated during render-time
        at: vec3(0,0,0),    // origin
        up: vec3(0,1,0),    // positive y axis is up

        rotAngles: vec3(0.0, 0.0, 0.0),
        rotAnglesIncrement: vec3(0.0, 0.0, 0.0),
    },
};