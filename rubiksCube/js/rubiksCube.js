


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
    state.view.thetaLoc  = state.gl.getUniformLocation(state.program, "theta");
    state.view.ctmLoc    = state.gl.getUniformLocation(state.program, "ctm");
    state.cube.rotMatLoc = state.gl.getUniformLocation(state.program, "rotMat");

    let vBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.points), state.gl.STATIC_DRAW);

    let vPosition = state.gl.getAttribLocation(state.program, "vPosition");
    state.gl.vertexAttribPointer(vPosition, 3, state.gl.FLOAT, false, 0, 0);
    state.gl.enableVertexAttribArray(vPosition);

    let cBuffer = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, cBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.colors), state.gl.STATIC_DRAW);

    let vColor = state.gl.getAttribLocation(state.program, "vColor");
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

    // rotate the rubik's cube faces & middles (9 total, w/ 2 directions for each)
    document.getElementById("rotateFaceRedNeg").onclick = () => {addRotation("Red", -1);};
    document.getElementById("rotateFaceRedPos").onclick = () => {addRotation("Red", 1);};

    document.getElementById("rotateFaceCyanNeg").onclick = () => {addRotation("Cyan", -1);};
    document.getElementById("rotateFaceCyanPos").onclick = () => {addRotation("Cyan", 1);};

    document.getElementById("rotateFaceOrangeNeg").onclick = () => {addRotation("Orange", -1);};
    document.getElementById("rotateFaceOrangePos").onclick = () => {addRotation("Orange", 1);};

    document.getElementById("rotateFaceGreenNeg").onclick = () => {addRotation("Green", -1);};
    document.getElementById("rotateFaceGreenPos").onclick = () => {addRotation("Green", 1);};

    document.getElementById("rotateFaceBlueNeg").onclick = () => {addRotation("Blue", -1);};
    document.getElementById("rotateFaceBluePos").onclick = () => {addRotation("Blue", 1);};

    document.getElementById("rotateFaceYellowNeg").onclick = () => {addRotation("Yellow", -1);};
    document.getElementById("rotateFaceYellowPos").onclick = () => {addRotation("Yellow", 1);};

    document.getElementById("rotateMiddle1Pos").onclick = () => {addRotation("Middle1", -1);};
    document.getElementById("rotateMiddle1Neg").onclick = () => {addRotation("Middle1", 1);};

    document.getElementById("rotateMiddle2Pos").onclick = () => {addRotation("Middle2", -1);};
    document.getElementById("rotateMiddle2Neg").onclick = () => {addRotation("Middle2", 1);};

    document.getElementById("rotateMiddle3Pos").onclick = () => {addRotation("Middle3", -1);};
    document.getElementById("rotateMiddle3Neg").onclick = () => {addRotation("Middle3", 1);};

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
function isSolved()
{
    for (let i=0; i<state.cube.subCubes.length; ++i)
    {
        if (state.cube.subCubes[i].idx !== state.cube.solvedCube[i])
        {
            document.getElementById("solvedCube").textContent = "";
            return;
        }
    }
    document.getElementById("solvedCube").textContent = "Cube is Solved!!!";
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);

    processFaceRotationQueue();
    isSolved();

    state.gl.uniform2fv(state.view.thetaLoc, flatten(state.view.theta));

    // The wierdest thing- I cannot get rid of this next line & line 23 (which connects ctmLoc to the "ctm" variable in
    // the vertex shader). This strange to me, because there is no ctm uniform in the vertex shader. Yet still, without
    // this uniform being passed on the rubkis cube does not render.
    state.gl.uniformMatrix4fv(state.view.ctmLoc, false, flatten(mat4()));

    // update uniform variables
    state.cube.subCubes.forEach((val) => {
        state.gl.uniformMatrix4fv(state.cube.rotMatLoc, false, flatten(val.rotMat));
        state.gl.drawArrays(state.gl.TRIANGLES, val.idx, state.cube.CUBE_SIZE);
    });

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render again).
    requestAnimFrame(render);
}