


var vBuffer;


window.onload = function init()
{
    let canvas = document.getElementById("gl-canvas");
    state.gl = WebGLUtils.setupWebGL(canvas);
    if (!state.gl)
        alert("WebGL isn't working.");

    state.gl.viewport(0, 0, canvas.width, canvas.height);
    state.gl.clearColor(1.0, 1.0, 1.0, 1.0);

    state.program = initShaders(state.gl, "shaders/vertexShader.glsl", "shaders/fragmentShader.glsl");
    state.gl.useProgram(state.program);

    state.gl.enable(state.gl.DEPTH_TEST);

    createRubiksCube();

    // initialize the uniform variables
    state.view.thetaLoc = state.gl.getUniformLocation(state.program, "theta");
    state.view.ctmLoc = state.gl.getUniformLocation(state.program, "ctm");

    vBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.points), state.gl.STATIC_DRAW);

    var vPosition = state.gl.getAttribLocation(state.program, "vPosition");
    state.gl.vertexAttribPointer(vPosition, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(vPosition);

    var cBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, cBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.colors), state.gl.STATIC_DRAW);

    var vColor = state.gl.getAttribLocation(state.program, "vColor");
    state.gl.vertexAttribPointer(vColor, 4, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(vColor);

    listenToEvents(); // initialize events

    render();
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listenToEvents()
{
    // rotate whole cube
    document.getElementById("gl-canvas").onmousedown = (event) =>
    {
        state.ui.dragging = true;
        state.ui.mouse.lastX = event.clientX;
        state.ui.mouse.lastY = event.clientY;
    };

    document.getElementById("gl-canvas").onmouseup = (event) =>
    {
        state.ui.dragging = false;
    };

    document.getElementById("gl-canvas").onmouseleave = (event) =>
    {
        state.ui.dragging = false;
    };

    document.getElementById("gl-canvas").onmousemove = (event) =>
    {
        if (state.ui.dragging)
        {
            let x = event.clientX;
            let y = event.clientY;

            let x_factor = (Math.abs(state.view.theta[0]) % 360 > 180) ? 0.5 : -0.5;
            let dx = x_factor*(x - state.ui.mouse.lastX);
            let dy = -0.5*(y - state.ui.mouse.lastY);

            state.view.theta[1] += dx;
            state.view.theta[0] += dy;

            state.ui.mouse.lastX = x;
            state.ui.mouse.lastY = y;
        }
    };


    document.getElementById("rotateFaceRedNeg").onclick = () => {rotateFace("Red", -1);};
    document.getElementById("rotateFaceRedPos").onclick = () => {rotateFace("Red", 1);};

    document.getElementById("rotateFaceCyanNeg").onclick = () => {rotateFace("Cyan", -1);};
    document.getElementById("rotateFaceCyanPos").onclick = () => {rotateFace("Cyan", 1);};

    document.getElementById("rotateFaceOrangeNeg").onclick = () => {rotateFace("Orange", -1);};
    document.getElementById("rotateFaceOrangePos").onclick = () => {rotateFace("Orange", 1);};

    document.getElementById("rotateFaceGreenNeg").onclick = () => {rotateFace("Green", -1);};
    document.getElementById("rotateFaceGreenPos").onclick = () => {rotateFace("Green", 1);};

    document.getElementById("rotateFaceBlueNeg").onclick = () => {rotateFace("Blue", -1);};
    document.getElementById("rotateFaceBluePos").onclick = () => {rotateFace("Blue", 1);};

    document.getElementById("rotateFaceYellowNeg").onclick = () => {rotateFace("Yellow", -1);};
    document.getElementById("rotateFaceYellowPos").onclick = () => {rotateFace("Yellow", 1);};

    // scramble cube randomly
    document.getElementById("randomScamblerForm")
            .addEventListener('submit', (event) => randomlyShuffle(event));

    // save and load cube
    document.getElementById("saveCubeForm")
        .addEventListener('submit', (event) => saveFileAsJSON(event));

    document.getElementById("loadCubeForm")
        .addEventListener('submit', (event) => loadFileFromJSON(event));
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    state.gl.drawArrays(state.gl.TRIANGLES, 0, state.cube.points.length);

    // update uniform variables
    state.gl.uniform2fv(state.view.thetaLoc, flatten(state.view.theta));
    state.gl.uniformMatrix4fv(state.view.ctmLoc, false, flatten(state.view.ctm));

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render again).
    requestAnimFrame(render);
}