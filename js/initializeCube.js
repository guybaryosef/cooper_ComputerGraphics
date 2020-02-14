
function createRubiksCube()
{
    let d = 0.33; // distance of one cube

    faces["Orange"]["rotationPoint"] = vec3(0, 0, -d);
    faces["Red"]["rotationPoint"]    = vec3(0, 0, d);
    faces["Cyan"]["rotationPoint"]   = vec3(0, d, 0);
    faces["Blue"]["rotationPoint"]   = vec3(0, -d, 0);
    faces["Green"]["rotationPoint"]  = vec3(d, 0, 0);
    faces["Yellow"]["rotationPoint"] = vec3(-d, 0, 0);

    cubeIndex[0] = createCube(vec3(-d, d, d));
    cubeIndex[1] = createCube(vec3(0,  d, d));
    cubeIndex[2] = createCube(vec3(d,  d, d));

    cubeIndex[3] = createCube(vec3(-d, 0, d));
    cubeIndex[4] = createCube(vec3(0,  0, d));
    cubeIndex[5] = createCube(vec3(d,  0, d));

    cubeIndex[6] = createCube(vec3(-d,-d, d));
    cubeIndex[7] = createCube(vec3(0, -d, d));
    cubeIndex[8] = createCube(vec3(d, -d, d));

    cubeIndex[9] = createCube(vec3(-d, d, 0));
    cubeIndex[10] = createCube(vec3(0,  d, 0));
    cubeIndex[11] = createCube(vec3(d,  d, 0));

    cubeIndex[12] = createCube(vec3(-d, 0, 0));
    cubeIndex[14] = createCube(vec3(d,  0, 0));

    cubeIndex[15] = createCube(vec3(-d,-d, 0));
    cubeIndex[16] = createCube(vec3(0, -d, 0));
    cubeIndex[17] = createCube(vec3(d, -d, 0));

    cubeIndex[18] = createCube(vec3(-d, d,-d));
    cubeIndex[19] = createCube(vec3(0,  d,-d));
    cubeIndex[20] = createCube(vec3(d,  d,-d));

    cubeIndex[21] = createCube(vec3(-d, 0,-d));
    cubeIndex[22] = createCube(vec3(0,  0,-d));
    cubeIndex[23] = createCube(vec3(d,  0,-d));

    cubeIndex[24] = createCube(vec3(-d,-d,-d));
    cubeIndex[25] = createCube(vec3(0, -d,-d));
    cubeIndex[26] = createCube(vec3(d, -d,-d));

    populateFace();
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createCube(center)
{
    const beg_ind = points.length;

    createCube.quad = function(p1, p2, p3, p4, color)
    {
        let ind = [p1, p2, p3, p1, p3, p4];

        for (let i = 0; i < ind.length; ++i)
        {
            points.push(add(center, vertices[ind[i]]) );
            colors.push(vertexColors[color]);
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