
function createRubiksCube()
{
    let d = 0.33; // distance of one cube

    state.cube.faces["Orange"]["rotationPoint"] = vec3(0, 0, -d);
    state.cube.faces["Red"]["rotationPoint"]    = vec3(0, 0, d);
    state.cube.faces["Cyan"]["rotationPoint"]   = vec3(0, d, 0);
    state.cube.faces["Blue"]["rotationPoint"]   = vec3(0, -d, 0);
    state.cube.faces["Green"]["rotationPoint"]  = vec3(d, 0, 0);
    state.cube.faces["Yellow"]["rotationPoint"] = vec3(-d, 0, 0);

    state.cube.faces["Middle1"]["rotationPoint"] = vec3(0, 0, 0);
    state.cube.faces["Middle2"]["rotationPoint"] = vec3(0, 0, 0);
    state.cube.faces["Middle3"]["rotationPoint"] = vec3(0, 0, 0);

    state.cube.subCubes[0] = {
        idx: createCube(vec3(-d, d, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[1] = {
        idx: createCube(vec3(0,  d, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[2] = {
        idx: createCube(vec3(d,  d, d)),
        rotMat: mat4(),
    };

    state.cube.subCubes[3] = {
        idx: createCube(vec3(-d, 0, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[4] = {
        idx: createCube(vec3(0,  0, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[5] = {
        idx: createCube(vec3(d,  0, d)),
        rotMat: mat4(),
    };

    state.cube.subCubes[6] = {
        idx: createCube(vec3(-d,-d, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[7] = {
        idx: createCube(vec3(0, -d, d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[8] = {
        idx: createCube(vec3(d, -d, d)),
        rotMat: mat4(),
    };

    state.cube.subCubes[9] = {
        idx: createCube(vec3(-d, d, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[10] = {
        idx: createCube(vec3(0,  d, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[11] = {
        idx: createCube(vec3(d,  d, 0)),
        rotMat: mat4(),
    };

    state.cube.subCubes[12] = {
        idx: createCube(vec3(-d, 0, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[13] = {
        idx: createCube(vec3(0, 0, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[14] = {
        idx: createCube(vec3(d,  0, 0)),
        rotMat: mat4(),
    };

    state.cube.subCubes[15] = {
        idx: createCube(vec3(-d,-d, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[16] = {
        idx: createCube(vec3(0, -d, 0)),
        rotMat: mat4(),
    };
    state.cube.subCubes[17] = {
        idx: createCube(vec3(d, -d, 0)),
        rotMat: mat4(),
    };

    state.cube.subCubes[18] = {
        idx: createCube(vec3(-d, d,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[19] = {
        idx: createCube(vec3(0,  d,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[20] = {
        idx: createCube(vec3(d,  d,-d)),
        rotMat: mat4(),
    };

    state.cube.subCubes[21] = {
        idx: createCube(vec3(-d, 0,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[22] = {
        idx: createCube(vec3(0,  0,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[23] = {
        idx: createCube(vec3(d,  0,-d)),
        rotMat: mat4(),
    };

    state.cube.subCubes[24] = {
        idx: createCube(vec3(-d,-d,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[25] = {
        idx: createCube(vec3(0, -d,-d)),
        rotMat: mat4(),
    };
    state.cube.subCubes[26] = {
        idx: createCube(vec3(d, -d,-d)),
        rotMat: mat4(),
    };

    populateFace();

    state.cube.solvedCube = Array.from(state.cube.subCubes);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createCube(center)
{
    const beg_ind = state.cube.points.length;

    createCube.quad = function(p1, p2, p3, p4, color)
    {
        let ind = [p1, p2, p3, p1, p3, p4];

        for (let i = 0; i < ind.length; ++i)
        {
            state.cube.points.push(add(center, vertices[ind[i]]) );
            state.cube.colors.push(vertexColors[color]);
        }
    };

    let d = 0.15;
    let vertices = [
        vec3(-d, -d,  d),
        vec3(-d,  d,  d),
        vec3( d,  d,  d),
        vec3( d, -d,  d),
        vec3(-d, -d, -d),
        vec3(-d,  d, -d),
        vec3( d,  d, -d),
        vec3( d, -d, -d),
    ];

    /* Faces and their colors:
     * - Positive X: Green
     * - Negative X: Yellow
     * - Positive Y: Cyan
     * - Negative Y: Blue
     * - Positive Z: Red
     * - Negative Z: Orange
     */
    let vertexColors = {
        Black:  [0, 0, 0, 1],
        Red:    [1, 0, 0, 1],
        Green:  [0, 1, 0, 1],
        Blue:   [0, 0, 1, 1],
        Cyan:   [0, 1, 1, 1],
        Orange: [1, 0.6, 0, 1],
        Yellow: [1, 1, 0, 1],
    };


    // Z-axis faces
    if (center[2] < 0)
    {
        createCube.quad(1, 0, 3, 2, "Black"); // Positive Z
        createCube.quad(4, 5, 6, 7, "Orange"); // Negative Z
    }
    else if (center[2] == 0)
    {
        createCube.quad(1, 0, 3, 2, "Black"); // Positive Z
        createCube.quad(4, 5, 6, 7, "Black"); // Negative Z
    }
    else if (center[2] > 0)
    {
        createCube.quad(1, 0, 3, 2, "Red"); // Positive Z
        createCube.quad(4, 5, 6, 7, "Black"); // Negative Z
    }

    // Y-axis faces
    if (center[1] < 0)
    {
        createCube.quad(3, 0, 4, 7, "Blue"); // Negative Y
        createCube.quad(6, 5, 1, 2, "Black"); // Positive Y
    }
    else if (center[1] == 0)
    {
        createCube.quad(3, 0, 4, 7, "Black"); // Negative Y
        createCube.quad(6, 5, 1, 2, "Black"); // Positive Y
    }
    else if (center[1] > 0)
    {
        createCube.quad(3, 0, 4, 7, "Black"); // Negative Y
        createCube.quad(6, 5, 1, 2, "Cyan"); // Positive Y
    }

    // X-axis faces
    if (center[0] < 0)
    {
        createCube.quad(2, 3, 7, 6, "Black"); // Positive X
        createCube.quad(5, 4, 0, 1, "Yellow"); // Negative X
    }
    else if (center[0] == 0)
    {
        createCube.quad(2, 3, 7, 6, "Black"); // Positive X
        createCube.quad(5, 4, 0, 1, "Black"); // Negative X
    }
    else if (center[0] > 0)
    {
        createCube.quad(2, 3, 7, 6, "Green"); // Positive X
        createCube.quad(5, 4, 0, 1, "Black"); // Negative X
    }
    
    return beg_ind;
}
