

function createBackgroundObject(d)
{
    createBackgroundObject.quad =  (p1, p2, p3, p4) =>
    {
        let ind = [p1, p2, p3, p1, p3, p4];

        for (let i = 0; i < ind.length; ++i)
            state.renders.points.push(ind[i]);
    };

    let vertices = [
        vec3(-d, -d,  d),   // left bottom
        vec3(-d,  d,  d),   // left top
        vec3( d,  d,  d),   // right top
        vec3( d, -d,  d)    // right bottom
    ];


    createBackgroundObject.quad(vertices[1], vertices[0], vertices[3], vertices[2]);
}


