



function addRotation(whichFace, val)
{
    state.ui.rotationQueue.push([whichFace, val]);
}

function processFaceRotationQueue()
{
    while (!state.ui.inRotation && state.ui.rotationQueue.length!==0) {
        state.ui.inRotation = true;

        let [whichFace, val] = state.ui.rotationQueue.shift();

        timeoutLoop(rotateAngle, 90 / Math.abs(state.ui.ROTATION_DEG), state.ui.ROTATION_DELAY, whichFace, val);

        setTimeout(
            () =>
            {
                updateFaces(whichFace, val);
                populateFace();
                state.ui.inRotation = false;
            },
            2.2*(90 / Math.abs(state.ui.ROTATION_DEG))* state.ui.ROTATION_DELAY);
    }
}

function rotateAngle(whichFace, val)
{
    let rotation_deg  = (val > 0) ? state.ui.ROTATION_DEG : -state.ui.ROTATION_DEG;

    switch(whichFace)
    {
        case "Middle1":
            var rotationMat = rotateY(rotation_deg);
            break;
        case "Middle2":
            var rotationMat = rotateX(rotation_deg);
            break;
        case "Middle3":
            var rotationMat = rotateZ(rotation_deg);
            break;
        default:
            var rotationMat = rotate(rotation_deg, state.cube.faces[whichFace]["rotationPoint"]);
    }

    for (let cubeNum = 0; cubeNum < 9; ++cubeNum) {
        for (let p = 0; p < state.cube.CUBE_SIZE; ++p) {
            state.cube.points[state.cube.faces[whichFace]["points"][cubeNum] + p] =
                mult(rotationMat, vec4(state.cube.points[state.cube.faces[whichFace]["points"][cubeNum] + p], 1)).slice(0, 3);
        }
    }

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.points), state.gl.STATIC_DRAW);
}

function updateFaces(whichFace, val)
{
    /* Faces and their colors:
  * - Positive Z: Red
  * - Positive X: Green
  * - Negative Y: Blue
  * - Positive Y: Cyan
  * - Negative Z: Orange
  * - Negative X: Yellow
  */
    let tmp = Array.from(state.cube.idx); // enforces a deep copy
    switch (whichFace)
    {
        case "Red":
            if (val > 0) {
                state.cube.idx[2] = tmp[8];
                state.cube.idx[1] = tmp[5];
                state.cube.idx[0] = tmp[2];
                state.cube.idx[5] = tmp[7];
                state.cube.idx[3] = tmp[1];
                state.cube.idx[8] = tmp[6];
                state.cube.idx[7] = tmp[3];
                state.cube.idx[6] = tmp[0];
            } else {
                state.cube.idx[2] = tmp[0];
                state.cube.idx[1] = tmp[3];
                state.cube.idx[0] = tmp[6];
                state.cube.idx[5] = tmp[1];
                state.cube.idx[3] = tmp[7];
                state.cube.idx[8] = tmp[2];
                state.cube.idx[7] = tmp[5];
                state.cube.idx[6] = tmp[8];
            }
            break;
        case "Orange":
            if (val > 0) {
                state.cube.idx[18] = tmp[24];
                state.cube.idx[19] = tmp[21];
                state.cube.idx[20] = tmp[18];
                state.cube.idx[21] = tmp[25];
                state.cube.idx[23] = tmp[19];
                state.cube.idx[24] = tmp[26];
                state.cube.idx[25] = tmp[23];
                state.cube.idx[26] = tmp[20];
            } else {
                state.cube.idx[18] = tmp[20];
                state.cube.idx[19] = tmp[23];
                state.cube.idx[20] = tmp[26];
                state.cube.idx[21] = tmp[19];
                state.cube.idx[23] = tmp[25];
                state.cube.idx[24] = tmp[18];
                state.cube.idx[25] = tmp[21];
                state.cube.idx[26] = tmp[24];
            }
            break;
        case "Blue":
            if (val > 0) {
                state.cube.idx[24] = tmp[6];
                state.cube.idx[25] = tmp[15];
                state.cube.idx[26] = tmp[24];
                state.cube.idx[15] = tmp[7];
                state.cube.idx[17] = tmp[25];
                state.cube.idx[6] = tmp[8];
                state.cube.idx[7] = tmp[17];
                state.cube.idx[8] = tmp[26];
            } else {
                state.cube.idx[24] = tmp[26];
                state.cube.idx[25] = tmp[17];
                state.cube.idx[26] = tmp[8];
                state.cube.idx[15] = tmp[25];
                state.cube.idx[17] = tmp[7];
                state.cube.idx[6] = tmp[24];
                state.cube.idx[7] = tmp[15];
                state.cube.idx[8] = tmp[6];
            }
            break;
        case "Green":
            if (val > 0) {
                state.cube.idx[26] = tmp[8];
                state.cube.idx[23] = tmp[17];
                state.cube.idx[20] = tmp[26];
                state.cube.idx[17] = tmp[5];
                state.cube.idx[11] = tmp[23];
                state.cube.idx[8] = tmp[2];
                state.cube.idx[5] = tmp[11];
                state.cube.idx[2] = tmp[20];
            } else {
                state.cube.idx[26] = tmp[20];
                state.cube.idx[23] = tmp[11];
                state.cube.idx[20] = tmp[2];
                state.cube.idx[17] = tmp[23];
                state.cube.idx[11] = tmp[5];
                state.cube.idx[8] = tmp[26];
                state.cube.idx[5] = tmp[17];
                state.cube.idx[2] = tmp[8];
            }
            break;
        case "Cyan":
            if (val > 0) {
                state.cube.idx[20] = tmp[2];
                state.cube.idx[19] = tmp[11];
                state.cube.idx[18] = tmp[20];
                state.cube.idx[11] = tmp[1];
                state.cube.idx[9] = tmp[19];
                state.cube.idx[2] = tmp[0];
                state.cube.idx[1] = tmp[9];
                state.cube.idx[0] = tmp[18];
            } else {
                state.cube.idx[20] = tmp[18];
                state.cube.idx[19] = tmp[9];
                state.cube.idx[18] = tmp[0];
                state.cube.idx[11] = tmp[19];
                state.cube.idx[9] = tmp[1];
                state.cube.idx[2] = tmp[20];
                state.cube.idx[1] = tmp[11];
                state.cube.idx[0] = tmp[2];
            }
            break;
        case "Yellow":
            if (val > 0) {
                state.cube.idx[18] = tmp[0];
                state.cube.idx[21] = tmp[9];
                state.cube.idx[24] = tmp[18];
                state.cube.idx[9] = tmp[3];
                state.cube.idx[15] = tmp[21];
                state.cube.idx[0] = tmp[6];
                state.cube.idx[3] = tmp[15];
                state.cube.idx[6] = tmp[24];
            } else {
                state.cube.idx[18] = tmp[24];
                state.cube.idx[21] = tmp[15];
                state.cube.idx[24] = tmp[6];
                state.cube.idx[9] = tmp[21];
                state.cube.idx[15] = tmp[3];
                state.cube.idx[0] = tmp[18];
                state.cube.idx[3] = tmp[9];
                state.cube.idx[6] = tmp[0];
            }
            break;
        case "Middle1":
            if (val < 0)
            {
                state.cube.idx[21] = tmp[3];
                state.cube.idx[22] = tmp[12];
                state.cube.idx[23] = tmp[21];
                state.cube.idx[12] = tmp[4];
                state.cube.idx[14] = tmp[22];
                state.cube.idx[3] = tmp[5];
                state.cube.idx[4] = tmp[14];
                state.cube.idx[5] = tmp[23];
            }
            else
            {
                state.cube.idx[21] = tmp[23];
                state.cube.idx[22] = tmp[14];
                state.cube.idx[23] = tmp[5];
                state.cube.idx[12] = tmp[22];
                state.cube.idx[14] = tmp[4];
                state.cube.idx[3] = tmp[21];
                state.cube.idx[4] = tmp[12];
                state.cube.idx[5] = tmp[3];
            }
            break;
        case "Middle2":
            if (val < 0)
            {
                state.cube.idx[19] = tmp[1];
                state.cube.idx[22] = tmp[10];
                state.cube.idx[25] = tmp[19];
                state.cube.idx[10] = tmp[4];
                state.cube.idx[16] = tmp[22];
                state.cube.idx[1] = tmp[7];
                state.cube.idx[4] = tmp[16];
                state.cube.idx[7] = tmp[25];
            }
            else
            {
                state.cube.idx[19] = tmp[25];
                state.cube.idx[22] = tmp[16];
                state.cube.idx[25] = tmp[7];
                state.cube.idx[10] = tmp[22];
                state.cube.idx[16] = tmp[4];
                state.cube.idx[1] = tmp[19];
                state.cube.idx[4] = tmp[10];
                state.cube.idx[7] = tmp[1];
            }
            break;
        case "Middle3":
            if (val < 0)
            {
                state.cube.idx[9] = tmp[15];
                state.cube.idx[10] = tmp[12];
                state.cube.idx[11] = tmp[9];
                state.cube.idx[12] = tmp[16];
                state.cube.idx[14] = tmp[10];
                state.cube.idx[15] = tmp[17];
                state.cube.idx[16] = tmp[14];
                state.cube.idx[17] = tmp[11];
            }
            else
            {
                state.cube.idx[9] = tmp[11];
                state.cube.idx[10] = tmp[14];
                state.cube.idx[11] = tmp[17];
                state.cube.idx[12] = tmp[10];
                state.cube.idx[14] = tmp[16];
                state.cube.idx[15] = tmp[9];
                state.cube.idx[16] = tmp[12];
                state.cube.idx[17] = tmp[15];
            }
            break;
    }
}


function populateFace()
{
    state.cube.faces["Red"]["points"][0] = state.cube.faces["Yellow"]["points"][2]  = state.cube.faces["Cyan"]["points"][0]   = state.cube.idx[0]; // vec3(-d, d, d)
    state.cube.faces["Red"]["points"][1] = state.cube.faces["Cyan"]["points"][1]   = state.cube.faces["Middle2"]["points"][6] = state.cube.idx[1]; // vec3(0,  d, d)
    state.cube.faces["Red"]["points"][2] = state.cube.faces["Green"]["points"][0]  = state.cube.faces["Cyan"]["points"][2]    = state.cube.idx[2]; // vec3(d,  d, d)

    state.cube.faces["Red"]["points"][3] = state.cube.faces["Yellow"]["points"][1]  = state.cube.faces["Middle1"]["points"][6] = state.cube.idx[3];     // vec3(-d, 0, d)
    state.cube.faces["Red"]["points"][4] = state.cube.faces["Middle2"]["points"][7] = state.cube.faces["Middle1"]["points"][7] = state.cube.idx[4];     // vec3(0,  0, d)
    state.cube.faces["Red"]["points"][5] = state.cube.faces["Green"]["points"][1]   = state.cube.faces["Middle1"]["points"][8] = state.cube.idx[5];     // vec3(d,  0, d)

    state.cube.faces["Red"]["points"][6] = state.cube.faces["Blue"]["points"][2] = state.cube.faces["Yellow"]["points"][0]  = state.cube.idx[6]; // vec3(-d,-d, d)
    state.cube.faces["Red"]["points"][7] = state.cube.faces["Blue"]["points"][1] = state.cube.faces["Middle2"]["points"][8] = state.cube.idx[7]; // vec3(0, -d, d)
    state.cube.faces["Red"]["points"][8] = state.cube.faces["Blue"]["points"][0] = state.cube.faces["Green"]["points"][2]   = state.cube.idx[8]; // vec3(d, -d, d)

    state.cube.faces["Cyan"]["points"][3] = state.cube.faces["Yellow"]["points"][5]  = state.cube.faces["Middle3"]["points"][0] = state.cube.idx[9];  // vec3(-d, d, 0)
    state.cube.faces["Cyan"]["points"][4] = state.cube.faces["Middle2"]["points"][3] = state.cube.faces["Middle3"]["points"][1] = state.cube.idx[10]; // vec3(0,  d, 0)
    state.cube.faces["Cyan"]["points"][5] = state.cube.faces["Green"]["points"][3]   = state.cube.faces["Middle3"]["points"][2] = state.cube.idx[11]; // vec3(d,  d, 0)

    state.cube.faces["Yellow"]["points"][4] = state.cube.faces["Middle1"]["points"][3] = state.cube.faces["Middle3"]["points"][3] = state.cube.idx[12]; //vec3(-d, 0, 0)
    state.cube.faces["Middle2"]["points"][4] = state.cube.faces["Middle1"]["points"][4] = state.cube.faces["Middle3"]["points"][4] = state.cube.idx[13]; //vec3(-d, 0, 0)
    state.cube.faces["Green"]["points"][4]  = state.cube.faces["Middle1"]["points"][5] = state.cube.faces["Middle3"]["points"][5] = state.cube.idx[14]; //vec3(d,  0, 0)

    state.cube.faces["Blue"]["points"][5] = state.cube.faces["Yellow"]["points"][3]  = state.cube.faces["Middle3"]["points"][6] = state.cube.idx[15]; // vec3(-d,-d, 0)
    state.cube.faces["Blue"]["points"][4] = state.cube.faces["Middle2"]["points"][5] = state.cube.faces["Middle3"]["points"][7] = state.cube.idx[16]; // vec3(0, -d, 0)
    state.cube.faces["Blue"]["points"][3] = state.cube.faces["Green"]["points"][5]   = state.cube.faces["Middle3"]["points"][8] = state.cube.idx[17]; // vec3(d, -d, 0)

    state.cube.faces["Orange"]["points"][0] = state.cube.faces["Yellow"]["points"][8] = state.cube.faces["Cyan"]["points"][6] = state.cube.idx[18]; // vec3(-d, d,-d)
    state.cube.faces["Orange"]["points"][1] = state.cube.faces["Cyan"]["points"][7]   = state.cube.faces["Middle2"]["points"][0] = state.cube.idx[19]; // vec3(0,  d,-d)
    state.cube.faces["Orange"]["points"][2] = state.cube.faces["Green"]["points"][6]  = state.cube.faces["Cyan"]["points"][8] = state.cube.idx[20]; // vec3(d,  d,-d)

    state.cube.faces["Orange"]["points"][3] = state.cube.faces["Yellow"]["points"][7]  = state.cube.faces["Middle1"]["points"][0] = state.cube.idx[21]; // vec3(-d, 0,-d)
    state.cube.faces["Orange"]["points"][4] = state.cube.faces["Middle1"]["points"][1] = state.cube.faces["Middle2"]["points"][1] = state.cube.idx[22]; // vec3(0,  0,-d)
    state.cube.faces["Orange"]["points"][5] = state.cube.faces["Green"]["points"][7]   = state.cube.faces["Middle1"]["points"][2] = state.cube.idx[23]; // vec3(d,  0,-d)

    state.cube.faces["Orange"]["points"][6] = state.cube.faces["Blue"]["points"][8] = state.cube.faces["Yellow"]["points"][6]  = state.cube.idx[24]; // vec3(-d,-d,-d)
    state.cube.faces["Orange"]["points"][7] = state.cube.faces["Blue"]["points"][7] = state.cube.faces["Middle2"]["points"][2] = state.cube.idx[25]; // vec3(0, -d,-d)
    state.cube.faces["Orange"]["points"][8] = state.cube.faces["Blue"]["points"][6] = state.cube.faces["Green"]["points"][8]   = state.cube.idx[26]; // vec3(d, -d,-d)
}


function randomlyShuffle(event)
{
    event.preventDefault(); // prevents reloading of webpage when this function gets call-backed.

    let num_turns = parseInt(document.getElementById("randomScramblerNum").value, 10);
    if (isNaN(num_turns)) {
        alert("Invalid input to the Random Scrambler! Please enter an integer.");
        return;
    }

    for (let i=0; i<num_turns; ++i) {
        let faceVal = Math.floor(Math.random() * Math.floor(9));
        let whichFace;
        switch (faceVal) {
            case 0:
                whichFace = "Red";
                break;
            case 1:
                whichFace = "Cyan";
                break;
            case 2:
                whichFace = "Green";
                break;
            case 3:
                whichFace = "Yellow";
                break;
            case 4:
                whichFace = "Blue";
                break;
            case 5:
                whichFace = "Orange";
                break;
            case 6:
                whichFace = "Middle1";
                break;
            case 7:
                whichFace = "Middle2";
                break;
            case 8:
                whichFace = "Middle3";
                break;
        }
        let dir = (Math.floor(Math.random() * Math.floor(2)) > 0) ? 1 : -1;

        addRotation(whichFace, dir);
    }
}


function timeoutLoop(fn, reps, delay, param1, param2)
{
    if (reps >0)
    {
        setTimeout(function () {
            fn(param1, param2);
            timeoutLoop(fn, reps - 1, delay, param1, param2);
        }, delay);
    }

}
