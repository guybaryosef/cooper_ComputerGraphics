


window.onload = function init()
{
    let canvas = document.getElementById("gl-canvas");
    state.gl = WebGLUtils.setupWebGL(canvas);
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.viewport(0, 0, canvas.width, canvas.height);
    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    state.view.aspect = canvas.width/canvas.height;

    state.program_envMap = initShaders(state.gl, "shaders/envMap_vertex_shader.glsl", "shaders/envMap_frag_shader.glsl");
    state.program_skybox = initShaders(state.gl, "shaders/skybox_vertex_shader.glsl", "shaders/skybox_frag_shader.glsl");

    state.gl.enable(state.gl.DEPTH_TEST);
    state.gl.depthFunc(state.gl.LEQUAL);

    state.gl.enable(state.gl.CULL_FACE);

    // initialize the uniform variables
    state.view.modelViewMatrixLoc_em  = state.gl.getUniformLocation(state.program_envMap, "modelViewMatrix" );
    state.view.projectionMatrixLoc_em = state.gl.getUniformLocation(state.program_envMap, "projectionMatrix" );
    state.view.cameraPositionLoc_em   = state.gl.getUniformLocation(state.program_envMap, "cameraPosition" );
    state.view.objRotAngleLoc_em      = state.gl.getUniformLocation(state.program_envMap, "rotAngles");
    state.cubeMap.glossTextureLoc_em  = state.gl.getUniformLocation(state.program_envMap, "glossMap");
    state.cubeMap.backgroundTextureLoc_em = state.gl.getUniformLocation(state.program_envMap, "texMap");

    state.view.skyboxViewMatLoc_sb        = state.gl.getUniformLocation(state.program_skybox, "skyboxViewMat" );
    state.cubeMap.backgroundTextureLoc_sb = state.gl.getUniformLocation(state.program_skybox, "texMap");

    configureGloss();
    createBackgroundObject(1.0);
    configureCubeMap("Museum");
    configureReflectingObject("Teapot");

    initializeShaderAttributes_skybox();

    listenToEvents();

    render();
};
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listenToEvents()
{
    listenToEvents.arrows = { left: 37, up: 38, right: 39, down: 40 };

    window.onkeydown = function(event)
    {
        switch(event.keyCode)
        {
            case listenToEvents.arrows.left:
                state.view.theta -= 0.1;
                break;
            case listenToEvents.arrows.right:
                state.view.theta += 0.1;
                break;
            case listenToEvents.arrows.up:
                state.view.phi += 0.1;
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2))
                break;
            case listenToEvents.arrows.down:
                state.view.phi -= 0.1;
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2))
                break;
        }
    };

    document.getElementById("gl-canvas").onwheel = function(event)
    {
        state.view.radius += event.deltaY*0.01;
        state.view.radius = Math.min(3.0, Math.max(state.view.radius, 2.0));
        state.view.eye = vec3(0, 0, state.view.radius);
    }

    document.getElementById("x-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[0] = parseFloat(event.target.value);
    };

    document.getElementById("y-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[1] = parseFloat(event.target.value);
    };

    document.getElementById("z-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[2] = parseFloat(event.target.value);
    };

    document.getElementById("museum_background").onclick = () => configureCubeMap("Museum");
    document.getElementById("skybox_background").onclick = () => configureCubeMap("Skybox");
    document.getElementById("bridge_background").onclick = () => configureCubeMap("Bridge");
    document.getElementById("yoko_background").onclick = () =>   configureCubeMap("Yoko");
    document.getElementById("chapel_background").onclick = () => configureCubeMap("Chapel");

    document.getElementById("cube_reflect").onclick = () =>     configureReflectingObject("Cube");
    document.getElementById("sphere_reflect").onclick = () =>   configureReflectingObject("Sphere");
    document.getElementById("cylinder_reflect").onclick = () => configureReflectingObject("Cylinder");
    document.getElementById("teapot_reflect").onclick = () =>   configureReflectingObject("Teapot");
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

    state.cubeMap.texBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.texBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.texCords), state.gl.STATIC_DRAW);
    state.cubeMap.texBuffer_attr = state.gl.getAttribLocation(state.program_envMap, "texCords");

}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeShaderAttributes_skybox()
{
    state.cubeMap.vBuffer_sb = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_sb);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.skybox_vertices), state.gl.STATIC_DRAW);

    state.cubeMap.vPosition_attr_sb = state.gl.getAttribLocation(state.program_skybox, "vPosition");
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    // set up the uniforms passed to shaders
    state.view.eye = vec3(  state.view.radius*Math.cos(state.view.phi)*Math.sin(state.view.theta),
                            state.view.radius*Math.sin(state.view.phi),
                            state.view.radius*Math.cos(state.view.phi)*Math.cos(state.view.theta));
    let modelViewMatrix  = lookAt(state.view.eye, state.view.at , state.view.up);
    let projectionMatrix = perspective(state.view.fovy, state.view.aspect, state.view.near, state.view.far);

    // increment the rotation angles
    state.view.rotAngles = add(state.view.rotAngles, state.view.rotAnglesIncrement);

    /////////// DRAW ENVIRONMENT MAP ///////////
    state.gl.useProgram(state.program_envMap);

    // link attributes
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_em);
    state.gl.vertexAttribPointer(state.cubeMap.vPosition_attr_em, 4, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.vPosition_attr_em);

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.nBuffer);
    state.gl.vertexAttribPointer(state.cubeMap.vNormal_attr, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.vNormal_attr);

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.texBuffer);
    state.gl.vertexAttribPointer(state.cubeMap.texBuffer_attr, 2, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.texBuffer_attr);

    // link textures
    state.gl.activeTexture(state.gl.TEXTURE0);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.textureObj);
    state.gl.uniform1i(state.cubeMap.backgroundTextureLoc_em, 0);

    state.gl.activeTexture(state.gl.TEXTURE1);
    state.gl.bindTexture(state.gl.TEXTURE_2D, state.cubeMap.glossTexture);
    state.gl.uniform1i(state.cubeMap.glossTextureLoc_em, 1);

    // update uniforms
    state.gl.uniform3fv( state.view.cameraPositionLoc_em, flatten(state.view.eye) );
    state.gl.uniform3fv( state.view.objRotAngleLoc_em, flatten(state.view.rotAngles) );
    state.gl.uniform2fv( state.cubeMap.objRotTexCordsLoc_em, flatten(state.cubeMap.texCords) );

    state.gl.uniformMatrix4fv( state.view.modelViewMatrixLoc_em, false, flatten(modelViewMatrix) );
    state.gl.uniformMatrix4fv( state.view.projectionMatrixLoc_em, false, flatten(projectionMatrix) );
    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cubeMap.reflect_obj_vertices.length);

    /////////// DRAW BACKGROUND IMAGE ///////////
    state.gl.useProgram(state.program_skybox);

    let tmp1 = modelViewMatrix;
    tmp1[0][3] = 0; // get rid of the eye translation
    tmp1[1][3] = 0;
    tmp1[2][3] = 0;
    tmp1 = mult(projectionMatrix, tmp1);
    tmp1 = inverse4(tmp1);  // instead of bringing from object coordinates to eye coordinates, bring eye to object.

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_sb);
    state.gl.vertexAttribPointer(state.cubeMap.vPosition_attr_sb, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.vPosition_attr_sb);

    state.gl.activeTexture(state.gl.TEXTURE0);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.textureObj);
    state.gl.uniform1i(state.cubeMap.backgroundTextureLoc_sb, 0);

    state.gl.uniformMatrix4fv( state.view.skyboxViewMatLoc_sb, false, flatten(tmp1) );
    state.gl.uniform1i(state.cubeMap.backgroundTextureLoc_sb, 0);
    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cubeMap.skybox_vertices.length);

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}