


window.onload = function init()
{
    let canvas = document.getElementById("gl-canvas");
    state.gl = WebGLUtils.setupWebGL(canvas);
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.viewport(0, 0, canvas.width, canvas.height);
    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    state.view.aspect = canvas.width/canvas.height;

    state.program = initShaders(state.gl, "shaders/vertex_shader.glsl", "shaders/fragment_shader.glsl");
    state.gl.useProgram(state.program);

    state.gl.enable(state.gl.DEPTH_TEST);
    // state.gl.enable(state.gl.BLEND);
    // state.gl.depthMask(false); // enables hidden-surface removal & make the z-buffer read-only for translucent polygons

    // initialize the uniform variables
    state.view.modelViewMatrixLoc  = state.gl.getUniformLocation( state.program, "modelViewMatrix" );
    state.view.projectionMatrixLoc = state.gl.getUniformLocation( state.program, "projectionMatrix" );
    state.cubeMap.textureLoc       = state.gl.getUniformLocation(state.program, "texMap");

    initializeMirrors();
    configureCubeMap("Museum");

    initializeShaderAttributes();

    listenToEvents();

    render();
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeShaderAttributes()
{
    let vBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.points), state.gl.STATIC_DRAW);

    let vPosition = state.gl.getAttribLocation(state.program, "vPosition");
    state.gl.vertexAttribPointer(vPosition, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(vPosition);

    // let cBuffer = state.gl.createBuffer();
    // state.gl.bindBuffer(state.gl.ARRAY_BUFFER, cBuffer);
    // state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.colors), state.gl.STATIC_DRAW);
    //
    // let vColor = state.gl.getAttribLocation(state.program, "vColor");
    // state.gl.vertexAttribPointer(vColor, 4, state.gl.FLOAT, false, 0, 0);
    // state.gl.enableVertexAttribArray(vColor);

    let nBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, nBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.normals), state.gl.STATIC_DRAW);

    let vNormal = state.gl.getAttribLocation(state.program, "vNormal");
    state.gl.vertexAttribPointer(vNormal, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(vNormal);
}
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
                state.view.theta += 0.1;
                break;
            case listenToEvents.arrows.right:
                state.view.theta -= 0.1;
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

    document.getElementById("museum_background").onclick = () => configureCubeMap("Museum");
    document.getElementById("colors_background").onclick = () => configureCubeMap("Cube");
    document.getElementById("skybox_background").onclick = () => configureCubeMap("Skybox");
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    state.view.eye = vec3(  state.view.radius*Math.cos(state.view.phi)*Math.sin(state.view.theta),
        state.view.radius*Math.sin(state.view.phi),
        state.view.radius*Math.cos(state.view.phi)*Math.cos(state.view.theta));
    modelViewMatrix = lookAt(state.view.eye, state.view.at , state.view.up); // re-initialize it
    state.gl.uniformMatrix4fv( state.view.modelViewMatrixLoc, false, flatten(modelViewMatrix) );

    projectionMatrix = perspective(state.view.fovy, state.view.aspect, state.view.near, state.view.far);
    state.gl.uniformMatrix4fv( state.view.projectionMatrixLoc, false, flatten(projectionMatrix) );

    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cubeMap.points.length);

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}