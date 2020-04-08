var state = {
    gl: null,
    program_skybox: null,
    program_envMap: null,
    program_spinObj: null,

    ui: {
        dragging: false,
        mouse: {
            lastX: -1,
            lastY: -1,
        },

        inRotation: false,
    },
    spinningObjects: {
        count: 3,
        vertices: [],
        start_idx: [],
        length: [],

        parameters:   [],
        parametersLoc: null,

        spinning: false,
    },
    cubeMap: {
        modelViewMatrix: null,
        projectionMatrix: null,

        reflect_obj_vertices: [],
        skybox_vertices: [],
        normals: [],
        texCords: [],

        vNormal_attr:      null,
        vPosition_attr_em: null,
        vPosition_attr_sb: null,
        vPosition_attr_so: null,

        nBuffer:    null,
        vBuffer_em: null,
        vBuffer_sb: null,
        vBuffer_so: null,

        skyboxTexture:  null,
        skyboxTexSampler: null,

        glossTextureLoc_em:      null,
        backgroundTextureLoc_em: null,
        objRotTexCordsLoc_em:    null,
        backgroundTextureLoc_sb: null,

        reflectorCubeMapFramebuffer: null,
        reflectorCubemapFramebuffers_belongings: [],
        reflectorTexture:  null,
        reflectorTexSampler: null,

    },
    view: {
        modelViewMatrixLoc_em:  null,
        projectionMatrixLoc_em: null,
        cameraPositionLoc_em:   null,
        objRotAngleLoc_em:      null,

        skyboxViewMatLoc_sb:    null,

        modelViewMatrixLoc_so:  null,
        projectionMatrixLoc_so: null,

        aspect: null,
        near: 0.1,
        far:  100,
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