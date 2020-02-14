


function rotateFace(whichFace, val)
{
    let rotation_deg  = (val > 0) ? 1 : 360-1;
    const rotationMat = rotate(rotation_deg, faces[whichFace]["rotationPoint"]);

    for(let i = 0; i < 90; ++i)
    {
        setTimeout( () => {
            for (let cubeNum = 0; cubeNum < 9; ++cubeNum)
            {
                for (let p = 0; p < CUBE_SIZE; ++p )
                {
                    points[ faces[whichFace]["points"][cubeNum]+p ] =
                        mult(rotationMat, vec4(points[ faces[whichFace]["points"][cubeNum]+p], 1)).slice(0,3);
                }
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
        },1);
    }

    /* Faces and their colors:
     * - Positive Z: Red
     * - Positive X: Green
     * - Negative Y: Blue
     * - Positive Y: Cyan
     * - Negative Z: Orange
     * - Negative X: Yellow
     */
    let tmp = Array.from(cubeIndex); // enforces a deep copy
    switch (whichFace) {
        case "Red":
            if (val>0)
            {
                cubeIndex[2] = tmp[8]; cubeIndex[1] = tmp[5]; cubeIndex[0] = tmp[2]; cubeIndex[5] = tmp[7];
                cubeIndex[3] = tmp[1]; cubeIndex[8] = tmp[6]; cubeIndex[7] = tmp[3]; cubeIndex[6] = tmp[0];
            }
            else
            {
                cubeIndex[2] = tmp[0]; cubeIndex[1] = tmp[3]; cubeIndex[0] = tmp[6]; cubeIndex[5] = tmp[1];
                cubeIndex[3] = tmp[7]; cubeIndex[8] = tmp[2]; cubeIndex[7] = tmp[5]; cubeIndex[6] = tmp[8];
            }
            break;
        case "Orange":
            if (val>0)
            {
                cubeIndex[18] = tmp[24]; cubeIndex[19] = tmp[21]; cubeIndex[20] = tmp[18]; cubeIndex[21] = tmp[25];
                cubeIndex[23] = tmp[19]; cubeIndex[24] = tmp[26]; cubeIndex[25] = tmp[23]; cubeIndex[26] = tmp[20];
            }
            else
            {
                cubeIndex[18] = tmp[20]; cubeIndex[19] = tmp[23]; cubeIndex[20] = tmp[26]; cubeIndex[21] = tmp[19];
                cubeIndex[23] = tmp[25]; cubeIndex[24] = tmp[18]; cubeIndex[25] = tmp[21]; cubeIndex[26] = tmp[24];
            }
            break;
        case "Blue":
            if (val>0)
            {
                cubeIndex[24] = tmp[6]; cubeIndex[25] = tmp[15];  cubeIndex[26] = tmp[24];   cubeIndex[15] = tmp[7];
                cubeIndex[17] = tmp[25]; cubeIndex[6] = tmp[8]; cubeIndex[7] = tmp[17]; cubeIndex[8] = tmp[26];
            }
            else
            {
                cubeIndex[24] = tmp[26]; cubeIndex[25] = tmp[17]; cubeIndex[26] = tmp[8]; cubeIndex[15] = tmp[25];
                cubeIndex[17] = tmp[7];  cubeIndex[6] = tmp[24];  cubeIndex[7] = tmp[15]; cubeIndex[8] = tmp[6];
            }
            break;
        case "Green":
            if (val>0)
            {
                cubeIndex[26] = tmp[8];  cubeIndex[23] = tmp[17]; cubeIndex[20] = tmp[26]; cubeIndex[17] = tmp[5];
                cubeIndex[11] = tmp[23]; cubeIndex[8] = tmp[2];   cubeIndex[5] = tmp[11];  cubeIndex[2] = tmp[20];
            }
            else
            {
                cubeIndex[26] = tmp[20]; cubeIndex[23] = tmp[11]; cubeIndex[20] = tmp[2]; cubeIndex[17] = tmp[23];
                cubeIndex[11] = tmp[5];  cubeIndex[8] = tmp[26];  cubeIndex[5] = tmp[17]; cubeIndex[2] = tmp[8];
            }
            break;
        case "Cyan":
            if (val>0)
            {
                cubeIndex[20] = tmp[2]; cubeIndex[19] = tmp[11]; cubeIndex[18] = tmp[20]; cubeIndex[11] = tmp[1];
                cubeIndex[9] = tmp[19];  cubeIndex[2] = tmp[0];  cubeIndex[1] = tmp[9];   cubeIndex[0] = tmp[18];
            }
            else
            {
                cubeIndex[20] = tmp[18]; cubeIndex[19] = tmp[9]; cubeIndex[18] = tmp[0]; cubeIndex[11] = tmp[19];
                cubeIndex[9] = tmp[1];   cubeIndex[2] = tmp[20]; cubeIndex[1] = tmp[11]; cubeIndex[0] = tmp[2];
            }
            break;
        case "Yellow":
            if (val>0)
            {
                cubeIndex[18] = tmp[0];  cubeIndex[21] = tmp[9]; cubeIndex[24] = tmp[18]; cubeIndex[9] = tmp[3];
                cubeIndex[15] = tmp[21]; cubeIndex[0] = tmp[6];  cubeIndex[3] = tmp[15];  cubeIndex[6] = tmp[24];
            }
            else
            {
                cubeIndex[18] = tmp[24]; cubeIndex[21] = tmp[15]; cubeIndex[24] = tmp[6]; cubeIndex[9] = tmp[21];
                cubeIndex[15] = tmp[3];  cubeIndex[0] = tmp[18];  cubeIndex[3] = tmp[9];  cubeIndex[6] = tmp[0];
            }
            break;
    }
    populateFace();
}


function populateFace()
{
    faces["Red"]["points"][0] = faces["Yellow"]["points"][2]  = faces["Cyan"]["points"][0] = cubeIndex[0]; // vec3(-d, d, d)
    faces["Red"]["points"][1] = faces["Cyan"]["points"][1]                                 = cubeIndex[1]; // vec3(0,  d, d)
    faces["Red"]["points"][2] = faces["Green"]["points"][0]  = faces["Cyan"]["points"][2]  = cubeIndex[2]; // vec3(d,  d, d)

    faces["Red"]["points"][3] = faces["Yellow"]["points"][1] = cubeIndex[3];     // vec3(-d, 0, d)
    faces["Red"]["points"][4]                                = cubeIndex[4];     // vec3(0,  0, d)
    faces["Red"]["points"][5] = faces["Green"]["points"][1]  = cubeIndex[5];     // vec3(d,  0, d)

    faces["Red"]["points"][6] = faces["Blue"]["points"][2] = faces["Yellow"]["points"][0] = cubeIndex[6]; // vec3(-d,-d, d)
    faces["Red"]["points"][7] = faces["Blue"]["points"][1] = cubeIndex[7];                                // vec3(0, -d, d)
    faces["Red"]["points"][8] = faces["Blue"]["points"][0] = faces["Green"]["points"][2] = cubeIndex[8];  // vec3(d, -d, d)

    faces["Cyan"]["points"][3] = faces["Yellow"]["points"][5] = cubeIndex[9];  // vec3(-d, d, 0)
    faces["Cyan"]["points"][4]                                = cubeIndex[10]; // vec3(0,  d, 0)
    faces["Cyan"]["points"][5] = faces["Green"]["points"][3]  = cubeIndex[11]; // vec3(d,  d, 0)

    faces["Yellow"]["points"][4] = cubeIndex[12];                               //vec3(-d, 0, 0)
    faces["Green"]["points"][4]  = cubeIndex[14];                               //vec3(d,  0, 0)

    faces["Blue"]["points"][5] = faces["Yellow"]["points"][3] = cubeIndex[15]; // vec3(-d,-d, 0)
    faces["Blue"]["points"][4]                                = cubeIndex[16]; // vec3(0, -d, 0)
    faces["Blue"]["points"][3] = faces["Green"]["points"][5]  = cubeIndex[17]; // vec3(d, -d, 0)

    faces["Orange"]["points"][0] = faces["Yellow"]["points"][8]  = faces["Cyan"]["points"][6] = cubeIndex[18]; // vec3(-d, d,-d)
    faces["Orange"]["points"][1] = faces["Cyan"]["points"][7]                                 = cubeIndex[19]; // vec3(0,  d,-d)
    faces["Orange"]["points"][2] = faces["Green"]["points"][6]  = faces["Cyan"]["points"][8]  = cubeIndex[20]; // vec3(d,  d,-d)

    faces["Orange"]["points"][3] = faces["Yellow"]["points"][7]  = cubeIndex[21]; // vec3(-d, 0,-d)
    faces["Orange"]["points"][4]                                 = cubeIndex[22]; // vec3(0,  0,-d)
    faces["Orange"]["points"][5] = faces["Green"]["points"][7]   = cubeIndex[23]; // vec3(d,  0,-d)

    faces["Orange"]["points"][6] = faces["Blue"]["points"][8] = faces["Yellow"]["points"][6] = cubeIndex[24]; // vec3(-d,-d,-d)
    faces["Orange"]["points"][7] = faces["Blue"]["points"][7]                                = cubeIndex[25]; // vec3(0, -d,-d)
    faces["Orange"]["points"][8] = faces["Blue"]["points"][6] = faces["Green"]["points"][8]  = cubeIndex[26]; // vec3(d, -d,-d)
}


async function randomlyShuffle() {
    let num_turns = parseInt(document.getElementById("randomScramblerNum").value, 10);
    if (isNaN(num_turns)) {
        alert("Invalid input to the Random Scrambler! Please enter an integer.");
        return;
    }

    timeoutLoop(
        rotateFace,
        num_turns,
        100
    );
}

function timeoutLoop(fn, reps, delay) {
    if (reps > 0)
    {
        let faceVal = Math.floor(Math.random() * Math.floor(6));
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
        }
        let dir = (Math.floor(Math.random() * Math.floor(2)) > 0) ? 1 : -1;


        setTimeout(function() {
            fn(whichFace, dir);
            timeoutLoop(fn, reps-1, delay);
        }, delay);
    }

}