



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
    }
}

function rotateAngle(whichFace, val)
{
    let rotation_deg  = (val > 0) ? state.ui.ROTATION_DEG : -state.ui.ROTATION_DEG;

    switch(whichFace)
    {
        case "Middle1":
            var rotMat = rotateY(rotation_deg);
            break;
        case "Middle2":
            var rotMat = rotateX(rotation_deg);
            break;
        case "Middle3":
            var rotMat = rotateZ(rotation_deg);
            break;
        default:
            var rotMat = rotate(rotation_deg, state.cube.faces[whichFace]["rotationPoint"]);
    }

    for (let i=0; i<9; i++)
    {
        let ind = state.cube.faces[whichFace]["points"][i];
        state.cube.subCubes[ind].rotMat = mult(rotMat, state.cube.subCubes[ind].rotMat);
    }
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
    let tmp = Array.from(state.cube.subCubes); // enforces a deep copy
    switch (whichFace)
    {
        case "Red":
            if (val > 0) {
                state.cube.subCubes[2] = tmp[8];
                state.cube.subCubes[1] = tmp[5];
                state.cube.subCubes[0] = tmp[2];
                state.cube.subCubes[5] = tmp[7];
                state.cube.subCubes[3] = tmp[1];
                state.cube.subCubes[8] = tmp[6];
                state.cube.subCubes[7] = tmp[3];
                state.cube.subCubes[6] = tmp[0];
            } else {
                state.cube.subCubes[2] = tmp[0];
                state.cube.subCubes[1] = tmp[3];
                state.cube.subCubes[0] = tmp[6];
                state.cube.subCubes[5] = tmp[1];
                state.cube.subCubes[3] = tmp[7];
                state.cube.subCubes[8] = tmp[2];
                state.cube.subCubes[7] = tmp[5];
                state.cube.subCubes[6] = tmp[8];
            }
            break;
        case "Orange":
            if (val > 0) {
                state.cube.subCubes[18] = tmp[24];
                state.cube.subCubes[19] = tmp[21];
                state.cube.subCubes[20] = tmp[18];
                state.cube.subCubes[21] = tmp[25];
                state.cube.subCubes[23] = tmp[19];
                state.cube.subCubes[24] = tmp[26];
                state.cube.subCubes[25] = tmp[23];
                state.cube.subCubes[26] = tmp[20];
            } else {
                state.cube.subCubes[18] = tmp[20];
                state.cube.subCubes[19] = tmp[23];
                state.cube.subCubes[20] = tmp[26];
                state.cube.subCubes[21] = tmp[19];
                state.cube.subCubes[23] = tmp[25];
                state.cube.subCubes[24] = tmp[18];
                state.cube.subCubes[25] = tmp[21];
                state.cube.subCubes[26] = tmp[24];
            }
            break;
        case "Blue":
            if (val > 0) {
                state.cube.subCubes[24] = tmp[6];
                state.cube.subCubes[25] = tmp[15];
                state.cube.subCubes[26] = tmp[24];
                state.cube.subCubes[15] = tmp[7];
                state.cube.subCubes[17] = tmp[25];
                state.cube.subCubes[6]  = tmp[8];
                state.cube.subCubes[7]  = tmp[17];
                state.cube.subCubes[8]  = tmp[26];
            } else {
                state.cube.subCubes[24] = tmp[26];
                state.cube.subCubes[25] = tmp[17];
                state.cube.subCubes[26] = tmp[8];
                state.cube.subCubes[15] = tmp[25];
                state.cube.subCubes[17] = tmp[7];
                state.cube.subCubes[6]  = tmp[24];
                state.cube.subCubes[7]  = tmp[15];
                state.cube.subCubes[8]  = tmp[6];
            }
            break;
        case "Green":
            if (val > 0) {
                state.cube.subCubes[26] = tmp[8];
                state.cube.subCubes[23] = tmp[17];
                state.cube.subCubes[20] = tmp[26];
                state.cube.subCubes[17] = tmp[5];
                state.cube.subCubes[11] = tmp[23];
                state.cube.subCubes[8]  = tmp[2];
                state.cube.subCubes[5]  = tmp[11];
                state.cube.subCubes[2]  = tmp[20];
            } else {
                state.cube.subCubes[26] = tmp[20];
                state.cube.subCubes[23] = tmp[11];
                state.cube.subCubes[20] = tmp[2];
                state.cube.subCubes[17] = tmp[23];
                state.cube.subCubes[11] = tmp[5];
                state.cube.subCubes[8] = tmp[26];
                state.cube.subCubes[5] = tmp[17];
                state.cube.subCubes[2] = tmp[8];
            }
            break;
        case "Cyan":
            if (val > 0) {
                state.cube.subCubes[20] = tmp[2];
                state.cube.subCubes[19] = tmp[11];
                state.cube.subCubes[18] = tmp[20];
                state.cube.subCubes[11] = tmp[1];
                state.cube.subCubes[9] = tmp[19];
                state.cube.subCubes[2] = tmp[0];
                state.cube.subCubes[1] = tmp[9];
                state.cube.subCubes[0] = tmp[18];
            } else {
                state.cube.subCubes[20] = tmp[18];
                state.cube.subCubes[19] = tmp[9];
                state.cube.subCubes[18] = tmp[0];
                state.cube.subCubes[11] = tmp[19];
                state.cube.subCubes[9] = tmp[1];
                state.cube.subCubes[2] = tmp[20];
                state.cube.subCubes[1] = tmp[11];
                state.cube.subCubes[0] = tmp[2];
            }
            break;
        case "Yellow":
            if (val > 0) {
                state.cube.subCubes[18] = tmp[0];
                state.cube.subCubes[21] = tmp[9];
                state.cube.subCubes[24] = tmp[18];
                state.cube.subCubes[9] = tmp[3];
                state.cube.subCubes[15] = tmp[21];
                state.cube.subCubes[0] = tmp[6];
                state.cube.subCubes[3] = tmp[15];
                state.cube.subCubes[6] = tmp[24];
            } else {
                state.cube.subCubes[18] = tmp[24];
                state.cube.subCubes[21] = tmp[15];
                state.cube.subCubes[24] = tmp[6];
                state.cube.subCubes[9] = tmp[21];
                state.cube.subCubes[15] = tmp[3];
                state.cube.subCubes[0] = tmp[18];
                state.cube.subCubes[3] = tmp[9];
                state.cube.subCubes[6] = tmp[0];
            }
            break;
        case "Middle1":
            if (val < 0)
            {
                state.cube.subCubes[21] = tmp[3];
                state.cube.subCubes[22] = tmp[12];
                state.cube.subCubes[23] = tmp[21];
                state.cube.subCubes[12] = tmp[4];
                state.cube.subCubes[14] = tmp[22];
                state.cube.subCubes[3] = tmp[5];
                state.cube.subCubes[4] = tmp[14];
                state.cube.subCubes[5] = tmp[23];
            }
            else
            {
                state.cube.subCubes[21] = tmp[23];
                state.cube.subCubes[22] = tmp[14];
                state.cube.subCubes[23] = tmp[5];
                state.cube.subCubes[12] = tmp[22];
                state.cube.subCubes[14] = tmp[4];
                state.cube.subCubes[3] = tmp[21];
                state.cube.subCubes[4] = tmp[12];
                state.cube.subCubes[5] = tmp[3];
            }
            break;
        case "Middle2":
            if (val < 0)
            {
                state.cube.subCubes[19] = tmp[1];
                state.cube.subCubes[22] = tmp[10];
                state.cube.subCubes[25] = tmp[19];
                state.cube.subCubes[10] = tmp[4];
                state.cube.subCubes[16] = tmp[22];
                state.cube.subCubes[1] = tmp[7];
                state.cube.subCubes[4] = tmp[16];
                state.cube.subCubes[7] = tmp[25];
            }
            else
            {
                state.cube.subCubes[19] = tmp[25];
                state.cube.subCubes[22] = tmp[16];
                state.cube.subCubes[25] = tmp[7];
                state.cube.subCubes[10] = tmp[22];
                state.cube.subCubes[16] = tmp[4];
                state.cube.subCubes[1] = tmp[19];
                state.cube.subCubes[4] = tmp[10];
                state.cube.subCubes[7] = tmp[1];
            }
            break;
        case "Middle3":
            if (val < 0)
            {
                state.cube.subCubes[9] = tmp[15];
                state.cube.subCubes[10] = tmp[12];
                state.cube.subCubes[11] = tmp[9];
                state.cube.subCubes[12] = tmp[16];
                state.cube.subCubes[14] = tmp[10];
                state.cube.subCubes[15] = tmp[17];
                state.cube.subCubes[16] = tmp[14];
                state.cube.subCubes[17] = tmp[11];
            }
            else
            {
                state.cube.subCubes[9] = tmp[11];
                state.cube.subCubes[10] = tmp[14];
                state.cube.subCubes[11] = tmp[17];
                state.cube.subCubes[12] = tmp[10];
                state.cube.subCubes[14] = tmp[16];
                state.cube.subCubes[15] = tmp[9];
                state.cube.subCubes[16] = tmp[12];
                state.cube.subCubes[17] = tmp[15];
            }
            break;
    }
}


function populateFace()
{
    state.cube.faces["Red"]["points"][0] = state.cube.faces["Yellow"]["points"][2]  = state.cube.faces["Cyan"]["points"][0]   = 0;
    state.cube.faces["Red"]["points"][1] = state.cube.faces["Cyan"]["points"][1]   = state.cube.faces["Middle2"]["points"][6] = 1;
    state.cube.faces["Red"]["points"][2] = state.cube.faces["Green"]["points"][0]  = state.cube.faces["Cyan"]["points"][2]    = 2;

    state.cube.faces["Red"]["points"][3] = state.cube.faces["Yellow"]["points"][1]  = state.cube.faces["Middle1"]["points"][6] = 3;
    state.cube.faces["Red"]["points"][4] = state.cube.faces["Middle2"]["points"][7] = state.cube.faces["Middle1"]["points"][7] = 4;
    state.cube.faces["Red"]["points"][5] = state.cube.faces["Green"]["points"][1]   = state.cube.faces["Middle1"]["points"][8] = 5;

    state.cube.faces["Red"]["points"][6] = state.cube.faces["Blue"]["points"][2] = state.cube.faces["Yellow"]["points"][0]  = 6;
    state.cube.faces["Red"]["points"][7] = state.cube.faces["Blue"]["points"][1] = state.cube.faces["Middle2"]["points"][8] = 7;
    state.cube.faces["Red"]["points"][8] = state.cube.faces["Blue"]["points"][0] = state.cube.faces["Green"]["points"][2]   = 8;

    state.cube.faces["Cyan"]["points"][3] = state.cube.faces["Yellow"]["points"][5]  = state.cube.faces["Middle3"]["points"][0] = 9;
    state.cube.faces["Cyan"]["points"][4] = state.cube.faces["Middle2"]["points"][3] = state.cube.faces["Middle3"]["points"][1] = 10;
    state.cube.faces["Cyan"]["points"][5] = state.cube.faces["Green"]["points"][3]   = state.cube.faces["Middle3"]["points"][2] = 11;

    state.cube.faces["Yellow"]["points"][4] = state.cube.faces["Middle1"]["points"][3] = state.cube.faces["Middle3"]["points"][3] = 12;
    state.cube.faces["Middle2"]["points"][4] = state.cube.faces["Middle1"]["points"][4] = state.cube.faces["Middle3"]["points"][4] = 13;
    state.cube.faces["Green"]["points"][4]  = state.cube.faces["Middle1"]["points"][5] = state.cube.faces["Middle3"]["points"][5] = 14;

    state.cube.faces["Blue"]["points"][5] = state.cube.faces["Yellow"]["points"][3]  = state.cube.faces["Middle3"]["points"][6] = 15;
    state.cube.faces["Blue"]["points"][4] = state.cube.faces["Middle2"]["points"][5] = state.cube.faces["Middle3"]["points"][7] = 16;
    state.cube.faces["Blue"]["points"][3] = state.cube.faces["Green"]["points"][5]   = state.cube.faces["Middle3"]["points"][8] = 17;

    state.cube.faces["Orange"]["points"][0] = state.cube.faces["Yellow"]["points"][8] = state.cube.faces["Cyan"]["points"][6]    = 18;
    state.cube.faces["Orange"]["points"][1] = state.cube.faces["Cyan"]["points"][7]   = state.cube.faces["Middle2"]["points"][0] = 19;
    state.cube.faces["Orange"]["points"][2] = state.cube.faces["Green"]["points"][6]  = state.cube.faces["Cyan"]["points"][8]    = 20;

    state.cube.faces["Orange"]["points"][3] = state.cube.faces["Yellow"]["points"][7]  = state.cube.faces["Middle1"]["points"][0] = 21;
    state.cube.faces["Orange"]["points"][4] = state.cube.faces["Middle1"]["points"][1] = state.cube.faces["Middle2"]["points"][1] = 22;
    state.cube.faces["Orange"]["points"][5] = state.cube.faces["Green"]["points"][7]   = state.cube.faces["Middle1"]["points"][2] = 23;

    state.cube.faces["Orange"]["points"][6] = state.cube.faces["Blue"]["points"][8] = state.cube.faces["Yellow"]["points"][6]  = 24;
    state.cube.faces["Orange"]["points"][7] = state.cube.faces["Blue"]["points"][7] = state.cube.faces["Middle2"]["points"][2] = 25;
    state.cube.faces["Orange"]["points"][8] = state.cube.faces["Blue"]["points"][6] = state.cube.faces["Green"]["points"][8]   = 26;
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
    else if (reps==0)
    {
        updateFaces(param1, param2);
        populateFace();
        state.ui.inRotation = false;
    }

}
