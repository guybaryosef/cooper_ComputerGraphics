

const CUBE_SIZE = 36;


var gl;
var canvas;
var program;
var points = [];    // the vertices of the cubes that make up the rubik's cube.
var vBuffer;

var colors = [];    // the colors of the cubes

var cubeIndex = new Array(27).fill(0);
// An object of 6 faces, each holding the 9 beginning index in 'points' of the cubes in the face.
// The indexes are ordered usch that if one looks at the face from the center of the cube, we list the elements in ro-
// major order.
var faces  = {
    Red: {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    },
    Cyan:  {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    },
    Green:   {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    },
    Blue:  {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    },
    Yellow:   {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    },
    Orange:     {
        rotationPoint: vec3(),
        points: new Array(9).fill(0),
    }
};


window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl)
        alert("WebGL isn't working.");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    program = initShaders(gl, "shaders/vertexShader.glsl", "shaders/fragmentShader.glsl");
    gl.useProgram(program);

    gl.enable(gl.DEPTH_TEST);

    createRubiksCube();

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW);

    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    listenToEvents(); // initialize events

    render();
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function listenToEvents()
{
    var ctm    = mat4();
    var ctmLoc = gl.getUniformLocation(program, "ctm");
    gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));

    var theta = vec3(0, 0, 0);

    const EventType = Object.freeze({
        SCALE:    Symbol("scale"),
        ROTATE_X: Symbol("rotatex"),
        ROTATE_Y: Symbol("rotatey"),
        ROTATE_Z: Symbol("rotatez"),
    });

    function transformCtm(event_type, param1)
    {
        if ( typeof transformCtm.thetaLoc == 'undefined' )
        {
            // pseudo static variable
            transformCtm.thetaLoc = gl.getUniformLocation(program, "theta");
        }

        switch(event_type)
        {
            case EventType.SCALE:
                if (param1 > 0)
                    ctm = mult(ctm, scalem(1.1, 1.1, 1.1));
                else
                    ctm = mult(ctm, scalem(0.9, 0.9, 0.9));
                gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));
                break;

            case EventType.ROTATE_X: theta[0] += param1>0 ? 10 : -10;   break;
            case EventType.ROTATE_Y: theta[1] += param1>0 ? 10 : -10;   break;
            case EventType.ROTATE_Z: theta[2] += param1>0 ? 10 : -10;   break;
        }
        gl.uniform3fv(transformCtm.thetaLoc, flatten(theta));
    }

    // rotations
    document.getElementById("rotateCubeXpos").onclick = () => {transformCtm(EventType.ROTATE_X, +1);};
    document.getElementById("rotateCubeXneg").onclick = () => {transformCtm(EventType.ROTATE_X, -1);};
    document.getElementById("rotateCubeYpos").onclick = () => {transformCtm(EventType.ROTATE_Y, +1);};
    document.getElementById("rotateCubeYneg").onclick = () => {transformCtm(EventType.ROTATE_Y, -1);};
    document.getElementById("rotateCubeZpos").onclick = () => {transformCtm(EventType.ROTATE_Z, +1);};
    document.getElementById("rotateCubeZneg").onclick = () => {transformCtm(EventType.ROTATE_Z, -1);};

    // scale
    document.getElementById("scaleCubeLarger").onclick   = () => {transformCtm(EventType.SCALE, +1);};
    document.getElementById("scaleCubeSmaller").onclick  = () => {transformCtm(EventType.SCALE, -1);};

    // translations
    canvas.addEventListener("click", (event) =>
        {
            ctm[0][3] = -1 + (2*event.clientX)/canvas.width;
            ctm[1][3] = -1 + (2*(canvas.height - event.clientY))/canvas.height;
            gl.uniformMatrix4fv(ctmLoc, false, flatten(ctm));
        });

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

    let randomScambler = document.getElementById("randomScamblerForm");
    function handleForm(event)
    {
        event.preventDefault();
        randomlyShuffle();
    }
    randomScambler.addEventListener('submit', handleForm);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, points.length);

    // updates screen at next possible moment, then exits current render() and execute specified fnc (render again).
    requestAnimFrame(render);
}