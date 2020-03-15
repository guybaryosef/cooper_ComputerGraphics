



function configureCubeMap(which_one) {
    let red = new Uint8Array([255, 0, 0, 255]);
    let green = new Uint8Array([0, 255, 0, 255]);
    let blue = new Uint8Array([0, 0, 255, 255]);
    let cyan = new Uint8Array([0, 255, 255, 255]);
    let magenta = new Uint8Array([255, 0, 255, 255]);
    let yellow = new Uint8Array([255, 255, 0, 255]);

    state.cubeMap.textureObj = state.gl.createTexture();
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.textureObj);
    state.gl.activeTexture(state.gl.TEXTURE0);

    switch(which_one)
    {
        case "Cube":
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_X ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, red);
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, green);
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, blue);
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, cyan);
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, yellow);
            state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ,0,state.gl.RGBA,
                1,1,0,state.gl.RGBA,state.gl.UNSIGNED_BYTE, magenta);
            break;
    }

    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP,state.gl.TEXTURE_MAG_FILTER,state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP,state.gl.TEXTURE_MIN_FILTER,state.gl.NEAREST);

    state.gl.uniform1i(state.cubeMap.textureLoc, 0);  // 0-default texture unit
}
// //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeMirrors()
{
    initializeMirrors.quad = function(p1, p2, p3, p4, color)
    {
        let ind    = [p1, p3, p2, p1, p4, p3];
        let normal = cross(subtract(vertices[p1], vertices[p2]), subtract(vertices[p3], vertices[p2]) );

        for (let i = 0; i < ind.length; ++i)
        {
            state.cubeMap.points.push(vertices[ind[i]]);
            state.cubeMap.colors.push(color);
            state.cubeMap.normals.push(normal);
        }
    };

    let d = 0.5;
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

    let color = [0.2, 0.2, 0.2, 1.0];

    initializeMirrors.quad(4, 5, 6, 7, color);
    initializeMirrors.quad(3, 0, 4, 7, color);
    initializeMirrors.quad(6, 5, 1, 2, color);
    initializeMirrors.quad(1, 0, 3, 2, color);
    initializeMirrors.quad(2, 3, 7, 6, color);
    initializeMirrors.quad(5, 4, 0, 1, color);
}
