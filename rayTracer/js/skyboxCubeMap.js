

function createBackgroundObject(d)
{
    createBackgroundObject.quad =  (p1, p2, p3, p4) =>
    {
        let ind = [p1, p2, p3, p1, p3, p4];

        for (let i = 0; i < ind.length; ++i)
            state.renders.points.push(ind[i]);
    };

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


    createBackgroundObject.quad(vertices[1], vertices[0], vertices[3], vertices[2]);
}


