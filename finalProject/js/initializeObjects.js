

function configureCubeMap(which_one) {

    state.cubeMap.textureObj = state.gl.createTexture();
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.textureObj);
    state.gl.activeTexture(state.gl.TEXTURE0);

    switch(which_one)
    {
        case "Cube":    textureColors();                break;
        case "Museum":  loadCubeImages("museum"); break;
        case "Skybox":  loadCubeImages("skybox"); break;
    }

    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP,state.gl.TEXTURE_MAG_FILTER,state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP,state.gl.TEXTURE_MIN_FILTER,state.gl.NEAREST);

    state.gl.uniform1i(state.cubeMap.textureLoc, 0);  // 0-default texture unit
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * textureMuseum - Provides a Cube map texture of the Computer
 * History Museum in Mountain View, California.
 *
 * The reason we have to first preallocate the image into the
 * texture cube and then load the image in afterward is because
 * we have to load the image before we can use it, and that can
 * take a little bit of time. So we create a function that the
 * images call when finished loading (onload).
 */
function loadCubeImages(cube)
{
    let image_files = [];
    switch(cube)
    {
        case "museum":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/computer-history-museum/pos-x.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/computer-history-museum/neg-x.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/computer-history-museum/pos-y.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/computer-history-museum/neg-y.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/computer-history-museum/pos-z.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/computer-history-museum/neg-z.jpg"]
            ];
            break;
        case "skybox":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/skybox/left.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/skybox/right.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/skybox/top.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/skybox/bottom.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/skybox/front.jpg"],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/skybox/back.jpg"]
            ];
            break;
    }
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_X ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);
    state.gl.texImage2D(state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z ,0,state.gl.RGBA,
        512, 512, 0, state.gl.RGBA,state.gl.UNSIGNED_BYTE, null);

    image_files.forEach((img) =>
    {
        const cur_img = new Image();
        cur_img.src = img[1];
        cur_img.onload = () =>
            state.gl.texImage2D(img[0], 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, cur_img);
    });

}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function textureColors()
{
    let red     = new Uint8Array([255, 0, 0, 255]);
    let green   = new Uint8Array([0, 255, 0, 255]);
    let blue    = new Uint8Array([0, 0, 255, 255]);
    let cyan    = new Uint8Array([0, 255, 255, 255]);
    let magenta = new Uint8Array([255, 0, 255, 255]);
    let yellow  = new Uint8Array([255, 255, 0, 255]);

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
}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

    let color = vec4(0.5, 0.5, 0.5, 1.0);

    initializeMirrors.quad(4, 5, 6, 7, color);
    initializeMirrors.quad(3, 0, 4, 7, color);
    initializeMirrors.quad(6, 5, 1, 2, color);
    initializeMirrors.quad(1, 0, 3, 2, color);
    initializeMirrors.quad(2, 3, 7, 6, color);
    initializeMirrors.quad(5, 4, 0, 1, color);
}
