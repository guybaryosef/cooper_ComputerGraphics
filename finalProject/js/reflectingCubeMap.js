
function configureReflectingObject(whichOne)
{
    let obj = null;
    if (whichOne === "Teapot")
    {
        obj = teapot(15);
        state.cubeMap.texCords              = obj.TextureCoordinates;

        obj.scale(0.5, 0.5, 0.5);
        state.cubeMap.reflect_obj_vertices  = obj.TriangleVertices;

        for (let i = 0; i < obj.Normals.length; ++i)
            obj.Normals[i] = vec3(obj.Normals[i][0], obj.Normals[i][1], obj.Normals[i][2]);
        state.cubeMap.normals               = obj.Normals;
    }
    else
    {
        switch(whichOne)
        {
            case "Cube":    obj = cube();                                               break;
            case "Sphere":  obj = sphere(5);                              break;
            case "Cylinder":obj = cylinder(1500, 3  , true);   break;
        }
        state.cubeMap.reflect_obj_vertices  = obj.TriangleVertices;
        state.cubeMap.normals               = obj.TriangleNormals;
        state.cubeMap.texCords              = obj.TextureCoordinates;
    }

    initializeShaderAttributes_envMap();
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configureGloss()
{
    state.cubeMap.glossTexture = state.gl.createTexture();
    state.gl.bindTexture(state.gl.TEXTURE_2D, state.cubeMap.glossTexture);

    state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, 852, 480, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    const glossy_image = new Image();
    glossy_image.src = "images/glossyTexture.jpg";
    glossy_image.onload = () =>
            state.gl.texImage2D(state.gl.TEXTURE_2D, 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, glossy_image);

    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MAG_FILTER, state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_MIN_FILTER, state.gl.NEAREST);

    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_T, state.gl.CLAMP_TO_EDGE);
    state.gl.texParameteri(state.gl.TEXTURE_2D, state.gl.TEXTURE_WRAP_S, state.gl.CLAMP_TO_EDGE);
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function configureReflectingCubeMap()
{
    // initialize the reflecting texture
    state.cubeMap.reflectorTexture = state.gl.createTexture();
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.reflectorTexture);

    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, state.gl.RGBA, state.gl.canvas.width, state.gl.canvas.height, 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);

    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MAG_FILTER, state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MIN_FILTER, state.gl.NEAREST);

    state.cubeMap.reflectorCubeMapFramebuffer = state.gl.createFramebuffer();
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, state.cubeMap.reflectorCubeMapFramebuffer);

    // create a depth renderbuffer
    let depthBuffer = state.gl.createRenderbuffer();
    state.gl.bindRenderbuffer(state.gl.RENDERBUFFER, depthBuffer);

    // make the depth buffer the same size as the targetTexture & canvas and attach it to the framebuffer
    state.gl.renderbufferStorage(state.gl.RENDERBUFFER, state.gl.DEPTH_COMPONENT16, state.gl.canvas.width, state.gl.canvas.height);
    state.gl.framebufferRenderbuffer(state.gl.FRAMEBUFFER, state.gl.DEPTH_ATTACHMENT, state.gl.RENDERBUFFER, depthBuffer);

    // framebuffer will be a cube map texture w/ model view matrices that correspond with each of the 6 axis directions
    state.cubeMap.reflectorCubemapFramebuffers_belongings = [
        {
            face: state.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            modelViewMat: mult(rotateY(-90), rotateZ(180))
        },
        {
            face: state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            modelViewMat: mult(rotateY(90), rotateZ(180))
        },
        {
            face: state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            modelViewMat: rotateX(-90)
        },
        {
            face: state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            modelViewMat: rotateX(90)
        },
        {
            face: state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            modelViewMat: rotateZ(180)
        },
        {
            face: state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            modelViewMat: mult(rotateZ(180), rotateY(180))
        }
    ];
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeShaderAttributes_envMap()
{
    state.cubeMap.vBuffer_em = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_em);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.reflect_obj_vertices), state.gl.STATIC_DRAW);
    state.cubeMap.vPosition_attr_em = state.gl.getAttribLocation(state.program_envMap, "vPosition");

    state.cubeMap.nBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.nBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.normals), state.gl.STATIC_DRAW);
    state.cubeMap.vNormal_attr = state.gl.getAttribLocation(state.program_envMap, "vNormal");

    state.cubeMap.texBuffer = state.gl.createBuffer();      // for the glossy water texture
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.texBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.texCords), state.gl.STATIC_DRAW);
    state.cubeMap.texBuffer_attr = state.gl.getAttribLocation(state.program_envMap, "texCords");
}