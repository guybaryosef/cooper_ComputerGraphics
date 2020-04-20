
window.onload = function init()
{
    state.gl = WebGLUtils.setupWebGL( document.getElementById("gl-canvas") );
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.viewport(0, 0, state.gl.canvas.width, state.gl.canvas.height);
    state.view.aspect = state.gl.canvas.width/state.gl.canvas.height;

    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);

    state.program_rayTracer = initShaders(state.gl, "shaders/vertex_shader.glsl", "shaders/frag_shader.glsl");

    state.gl.enable(state.gl.DEPTH_TEST);
    // state.gl.depthFunc(state.gl.LEQUAL);
    // state.gl.enable(state.gl.CULL_FACE);

    state.renders.vBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.renders.vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.renders.points), state.gl.STATIC_DRAW);
    state.renders.vPosition_attr = state.gl.getAttribLocation(state.program_rayTracer, "vPosition");

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.renders.vBuffer);
    state.gl.vertexAttribPointer(state.renders.vPosition_attr, 4, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(state.renders.vPosition_attr);

    render();
};
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

    //// RAY TRACER PROGRAM ////
    state.gl.useProgram(state.program_rayTracer);

    // update uniforms
    state.gl.uniformMatrix4fv( state.uniforms.mvmLoc, false,  flatten(state.uniforms.modelViewMatrix) );
    state.gl.uniformMatrix4fv( state.uniforms.projLoc, false, flatten(state.uniforms.projectionMatrix) );

    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.renders.points.length);


    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}