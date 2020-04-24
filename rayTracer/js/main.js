
window.onload = function init()
{
    state.gl = WebGLUtils.setupWebGL( document.getElementById("gl-canvas") );
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);
    state.view.aspect = state.gl.canvas.width/state.gl.canvas.height;

    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);

    state.program_rayTracer = initShaders(state.gl, "shaders/vertex_shader.glsl", "shaders/frag_shader.glsl");
    state.gl.useProgram(state.program_rayTracer);

    state.gl.enable(state.gl.DEPTH_TEST);
    // state.gl.depthFunc(state.gl.LEQUAL);
    // state.gl.enable(state.gl.CULL_FACE);

    createBackgroundObject(1.0);

    state.uniforms.mvmLoc  = state.gl.getUniformLocation(state.program_rayTracer, "modelViewMatrix" );
    state.uniforms.projLoc = state.gl.getUniformLocation(state.program_rayTracer, "projectionMatrix");
    state.uniforms.sphereRadiiLoc   = state.gl.getUniformLocation(state.program_rayTracer, "sphereRadii" );
    state.uniforms.sphereCentersLoc = state.gl.getUniformLocation(state.program_rayTracer, "sphereCenters" );
    state.uniforms.sphereValsLoc    = state.gl.getUniformLocation(state.program_rayTracer, "sphereValues" );
    state.uniforms.sphereCountLoc   = state.gl.getUniformLocation(state.program_rayTracer, "sphereCount" );

    // only need to happen once
    state.gl.uniform1fv( state.uniforms.sphereRadiiLoc,   flatten(state.uniforms.sphereRadii));
    state.gl.uniform3fv( state.uniforms.sphereCentersLoc, flatten(state.uniforms.sphereCenters));

    state.renders.vBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.renders.vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.renders.points), state.gl.STATIC_DRAW);

    state.renders.vPosition_attr = state.gl.getAttribLocation(state.program_rayTracer, "vPosition");
    state.gl.vertexAttribPointer(state.renders.vPosition_attr, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.renders.vPosition_attr);

    listenToEvents();
    render();
};
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listenToEvents()
{
    document.getElementById("sphere-number").onchange =
        (event) =>
        {
            state.uniforms.sphereCount = parseInt(event.target.value);

            // Code copied from: https://javascript.info/task/shuffle (it shuffles the array)
            for (let i = state.uniforms.sphereValues.length - 1; i > 0; i--) {
                let j = Math.floor(Math.random() * (i + 1));
                [state.uniforms.sphereValues[i], state.uniforms.sphereValues[j]] = [state.uniforms.sphereValues[j], state.uniforms.sphereValues[i]];
            }
        }
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    // update the point-of-view (canvas)'s model view matrix and projection matrix
    state.view.eye = vec3(  state.view.radius*Math.cos(state.view.phi)*Math.sin(state.view.theta),
                            state.view.radius*Math.sin(state.view.phi),
                            state.view.radius*Math.cos(state.view.phi)*Math.cos(state.view.theta));
    state.uniforms.modelViewMatrix  = lookAt(state.view.eye, state.view.at, state.view.up);
    state.uniforms.projectionMatrix = perspective(state.view.fovy, state.view.aspect, state.view.near, state.view.far);

    // update uniforms
    state.gl.uniformMatrix4fv( state.uniforms.mvmLoc, false,  flatten(state.uniforms.modelViewMatrix));
    state.gl.uniformMatrix4fv( state.uniforms.projLoc, false, flatten(state.uniforms.projectionMatrix));
    state.gl.uniform1iv( state.uniforms.sphereValsLoc,    flatten(state.uniforms.sphereValues));
    state.gl.uniform1i(  state.uniforms.sphereCountLoc,   state.uniforms.sphereCount);


    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.renders.points.length);

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}