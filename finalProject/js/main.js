


window.onload = function init()
{
    state.gl = WebGLUtils.setupWebGL( document.getElementById("gl-canvas") );
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);

    state.program_envMap = initShaders(state.gl, "shaders/envMap_vertex_shader.glsl", "shaders/envMap_frag_shader.glsl");
    state.program_skybox = initShaders(state.gl, "shaders/skybox_vertex_shader.glsl", "shaders/skybox_frag_shader.glsl");
    state.program_spinObj= initShaders(state.gl, "shaders/spinObj_vertex_shader.glsl","shaders/spinObj_frag_shader.glsl");

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

    state.view.modelViewMatrixLoc_so  = state.gl.getUniformLocation(state.program_spinObj, "modelViewMatrix" );
    state.view.projectionMatrixLoc_so = state.gl.getUniformLocation(state.program_spinObj, "projectionMatrix" );
    state.spinningObjects.parametersLoc=state.gl.getUniformLocation(state.program_spinObj, "parameters" );

    createBackgroundObject(1.0);
    configureSkyboxCubeMap("Museum");
    configureReflectingObject("Cube");
    configureReflectingCubeMap();
    configureGloss();
    configureSpinningObjects(state.spinningObjects.count);

    initializeShaderAttributes_envMap();
    initializeShaderAttributes_skybox();
    initializeShaderAttributes_spinningObjs();

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
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2));
                break;
            case listenToEvents.arrows.down:
                state.view.phi -= 0.1;
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2));
                break;
        }
    };

    document.getElementById("gl-canvas").onwheel = function(event)
    {
        state.view.radius += event.deltaY*0.01;
        state.view.radius = Math.min(10.0, Math.max(state.view.radius, 2.0));
        state.view.eye = vec3(0, 0, state.view.radius);
    };

    document.getElementById("x-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[0] = parseFloat(event.target.value);
    };

    document.getElementById("y-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[1] = parseFloat(event.target.value);
    };

    document.getElementById("z-axis-slider").onchange = function(event) {
        state.view.rotAnglesIncrement[2] = parseFloat(event.target.value);
    };

    document.getElementById("spinning-objects-count").onchange = function(event) {
        configureSpinningObjects(parseInt(event.target.value));
    };

    document.getElementById("spin-objects").onclick=function(e) {
        state.spinningObjects.spinning = !state.spinningObjects.spinning;
        this.style.borderStyle = (this.style.borderStyle!=='inset' ? 'inset' : 'outset');
    }

    document.getElementById("museum_background").onclick = () => configureSkyboxCubeMap("Museum");
    document.getElementById("skybox_background").onclick = () => configureSkyboxCubeMap("Skybox");
    document.getElementById("bridge_background").onclick = () => configureSkyboxCubeMap("Bridge");
    document.getElementById("yoko_background").onclick   = () => configureSkyboxCubeMap("Yoko");
    document.getElementById("chapel_background").onclick = () => configureSkyboxCubeMap("Chapel");

    document.getElementById("cube_reflect").onclick     =  () => configureReflectingObject("Cube");
    document.getElementById("sphere_reflect").onclick   =  () => configureReflectingObject("Sphere");
    document.getElementById("cylinder_reflect").onclick =  () => configureReflectingObject("Cylinder");
    document.getElementById("teapot_reflect").onclick   =  () => configureReflectingObject("Teapot");
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    ////// CANVAS //////
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, null);
    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.view.aspect = state.gl.canvas.width/state.gl.canvas.height;

    // set up the uniforms passed to shaders
    state.view.eye = vec3(  state.view.radius*Math.cos(state.view.phi)*Math.sin(state.view.theta),
                            state.view.radius*Math.sin(state.view.phi),
                            state.view.radius*Math.cos(state.view.phi)*Math.cos(state.view.theta));
    state.cubeMap.modelViewMatrix  = lookAt(state.view.eye, state.view.at, state.view.up);
    state.cubeMap.projectionMatrix = perspective(state.view.fovy, state.view.aspect, state.view.near, state.view.far);

    // increment the rotation angles
    state.view.rotAngles = add(state.view.rotAngles, state.view.rotAnglesIncrement);
    spinObjects();  // update the spinning objects

    ////// DRAW SKYBOX IMAGE ///////////
    // instead of bringing from object coordinates to eye coordinates, bring eye to object.
    drawSkybox( inverse4(mult(state.cubeMap.projectionMatrix, state.cubeMap.modelViewMatrix)) );

    ////// DRAW ENVIRONMENT MAP ////////
    drawReflector();

    ////// DRAW SPINNING OBJECTS ///////
    for (let i = 0; i < state.spinningObjects.count; ++i)
        drawSpinningObjects(i, state.cubeMap.modelViewMatrix, state.cubeMap.projectionMatrix);

    ////// UPDATE THE FRAMEBUFFER //////
    updateFrameBuffer();

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateFrameBuffer()
{
    state.gl.bindFramebuffer(state.gl.FRAMEBUFFER, state.cubeMap.reflectorCubeMapFramebuffer);
    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);

    let projectionMatrix = perspective(90, state.view.aspect, state.view.near, state.view.far);

    state.cubeMap.reflectorCubemapFramebuffers_belongings.forEach((obj) =>
        {
            state.gl.framebufferTexture2D(state.gl.FRAMEBUFFER, state.gl.COLOR_ATTACHMENT0, obj.face, state.cubeMap.reflectorTexture, 0);
            drawToReflectorCubeMap(obj.modelViewMat, projectionMatrix);
        }
    );
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawToReflectorCubeMap(modelViewMatrix, projectionMatrix)
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    drawSkybox( inverse4(mult(projectionMatrix, modelViewMatrix)) );
    for (let i = 0; i < state.spinningObjects.count; ++i)
        drawSpinningObjects(i, modelViewMatrix, projectionMatrix);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawSkybox(matrix)
{
    state.gl.useProgram(state.program_skybox);

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_sb);
    state.gl.vertexAttribPointer(state.cubeMap.vPosition_attr_sb, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.vPosition_attr_sb);

    state.gl.activeTexture(state.gl.TEXTURE0);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.skyboxTexture);
    state.gl.uniform1i(state.cubeMap.backgroundTextureLoc_sb, 0);

    state.gl.uniformMatrix4fv( state.view.skyboxViewMatLoc_sb, false, flatten(matrix) );
    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cubeMap.skybox_vertices.length);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawReflector()
{
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
    state.gl.activeTexture(state.gl.TEXTURE1);
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.reflectorTexture);
    state.gl.uniform1i(state.cubeMap.backgroundTextureLoc_em, 1);

    state.gl.activeTexture(state.gl.TEXTURE2);
    state.gl.bindTexture(state.gl.TEXTURE_2D, state.cubeMap.glossTexture);
    state.gl.uniform1i(state.cubeMap.glossTextureLoc_em, 2);

    // update uniforms
    state.gl.uniform3fv( state.view.cameraPositionLoc_em, flatten(state.view.eye) );
    state.gl.uniform3fv( state.view.objRotAngleLoc_em, flatten(state.view.rotAngles) );
    state.gl.uniform2fv( state.cubeMap.objRotTexCordsLoc_em, flatten(state.cubeMap.texCords) );

    state.gl.uniformMatrix4fv( state.view.modelViewMatrixLoc_em, false, flatten(state.cubeMap.modelViewMatrix) );
    state.gl.uniformMatrix4fv( state.view.projectionMatrixLoc_em, false, flatten(state.cubeMap.projectionMatrix) );
    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cubeMap.reflect_obj_vertices.length);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawSpinningObjects(index, modelViewMat, projMat)
{
    state.gl.useProgram(state.program_spinObj);

    // link attributes
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_so);
    state.gl.vertexAttribPointer(state.cubeMap.vPosition_attr_so, 4, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.cubeMap.vPosition_attr_so);

    // update uniforms
    state.gl.uniformMatrix3fv( state.spinningObjects.parametersLoc,false,flatten(state.spinningObjects.parameters[index]) );
    state.gl.uniformMatrix4fv( state.view.modelViewMatrixLoc_so, false,  flatten(modelViewMat) );
    state.gl.uniformMatrix4fv( state.view.projectionMatrixLoc_so, false, flatten(projMat) );

    state.gl.drawArrays(state.gl.TRIANGLES, state.spinningObjects.start_idx[index], state.spinningObjects.length[index]);
}