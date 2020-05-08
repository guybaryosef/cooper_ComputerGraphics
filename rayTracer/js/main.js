
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

    createBackgroundObject(0.99);
    state.uniforms.basisVecsLoc = state.gl.getUniformLocation(state.program_rayTracer, "BasisVecs");
    state.uniforms.eyeLoc = state.gl.getUniformLocation(state.program_rayTracer, "eyeVec");

    // sphere uniforms
    state.uniforms.spheres.RadiiLoc   = state.gl.getUniformLocation(state.program_rayTracer, "sphereRadii" );
    state.uniforms.spheres.CentersLoc = state.gl.getUniformLocation(state.program_rayTracer, "sphereCenters" );
    state.uniforms.spheres.CountLoc   = state.gl.getUniformLocation(state.program_rayTracer, "sphereCount" );
    state.uniforms.spheres.colorsLoc  = state.gl.getUniformLocation(state.program_rayTracer, "sphereColors" );
    state.uniforms.spheres.reflectivityLoc = state.gl.getUniformLocation(state.program_rayTracer, "sphereReflectivity" );
    state.uniforms.spheres.reflectionCountLoc = state.gl.getUniformLocation(state.program_rayTracer, "reflectionCount");

    // only need to happen once
    state.gl.uniform1fv( state.uniforms.spheres.RadiiLoc,       flatten(state.uniforms.spheres.Radii)       );
    state.gl.uniform4fv( state.uniforms.spheres.colorsLoc,      flatten(state.uniforms.spheres.colors)      );
    state.gl.uniform1fv( state.uniforms.spheres.reflectivityLoc,flatten(state.uniforms.spheres.reflectivity));
    state.gl.uniform3fv( state.uniforms.spheres.CentersLoc,     flatten(state.uniforms.spheres.Centers)     );
    state.gl.uniform1i(  state.uniforms.spheres.reflectionCountLoc,   state.uniforms.spheres.reflectionCount);

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
    document.getElementById("sphere-number").onchange = () => state.uniforms.spheres.Count = parseInt(event.target.value);


    /////// ARROW KEYS ///////
    listenToEvents.arrows = { left: 37, up: 38, right: 39, down: 40 };
    window.onkeydown = function(event)
    {
        switch(event.keyCode)
        {
            case listenToEvents.arrows.left:
                state.view.theta -= 0.05;
                break;
            case listenToEvents.arrows.right:
                state.view.theta += 0.05;
                break;
            case listenToEvents.arrows.up:
                state.view.phi += 0.05;
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2));
                break;
            case listenToEvents.arrows.down:
                state.view.phi -= 0.05;
                state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2));
                break;
        }
    };

    /////// MOUSE DRAGS ///////
    document.getElementById("gl-canvas").onmousedown = (event) =>
    {
        state.ui.dragging = true;
        state.ui.mouse.lastX = event.clientX;
        state.ui.mouse.lastY = event.clientY;
    };

    document.getElementById("gl-canvas").onmouseup = (event)    => state.ui.dragging = false;

    document.getElementById("gl-canvas").onmouseleave = (event) => state.ui.dragging = false;

    document.getElementById("gl-canvas").onmousemove = (event) =>
    {
        if (state.ui.dragging)
        {
            let x = event.clientX;
            let y = event.clientY;

            let x_factor = (Math.abs(state.view.theta[0]) % 360 > 180) ? 0.5 : -0.5;
            let dx = x_factor*(x - state.ui.mouse.lastX);
            let dy = -0.5*(y - state.ui.mouse.lastY);

            state.view.theta += dx/100;
            state.view.phi   -= dy/100;
            state.view.phi = Math.min(Math.PI/2, Math.max(state.view.phi, -Math.PI/2));

            state.ui.mouse.lastX = x;
            state.ui.mouse.lastY = y;
        }
    };
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

    state.uniforms.basisVecs[0] = normalize(vec3(-state.view.eye[2], 0.0, state.view.eye[0]));
    state.uniforms.basisVecs[1] = cross(state.uniforms.basisVecs[0], mult(vec3(-1.0, -1.0, -1.0), normalize(state.view.eye)) );

    // update uniforms
    state.gl.uniform1i( state.uniforms.spheres.CountLoc, state.uniforms.spheres.Count);
    state.gl.uniform3fv( state.uniforms.eyeLoc,         flatten(state.view.eye) );
    state.gl.uniform3fv( state.uniforms.basisVecsLoc,   flatten(state.uniforms.basisVecs) );

    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.renders.points.length);

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render) again.
    requestAnimFrame(render);
}