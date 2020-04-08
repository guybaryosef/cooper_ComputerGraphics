

function configureSkyboxCubeMap(which_one)
{
    state.cubeMap.skyboxTexture = state.gl.createTexture();
    state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.skyboxTexture);

    switch(which_one)
    {
        case "Museum":  loadCubeImages("museum"); break;
        case "Skybox":  loadCubeImages("skybox"); break;
        case "Bridge":  loadCubeImages("bridge"); break;
        case "Yoko":  loadCubeImages("yokohama"); break;
        case "Chapel":  loadCubeImages("chapel"); break;

    }

    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MAG_FILTER, state.gl.NEAREST);
    state.gl.texParameteri(state.gl.TEXTURE_CUBE_MAP, state.gl.TEXTURE_MIN_FILTER, state.gl.NEAREST);
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
        case "bridge":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/GoldenGateBridge/posx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/GoldenGateBridge/negx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/GoldenGateBridge/posy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/GoldenGateBridge/negy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/GoldenGateBridge/posz.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/GoldenGateBridge/negz.jpg", 2048]
            ];
            break;
        case "yokohama":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/Yokohama/posx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/Yokohama/negx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/Yokohama/posy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/Yokohama/negy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/Yokohama/posz.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/Yokohama/negz.jpg", 2048]
            ];
            break;
        case "chapel":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/LancellottiChapel/posx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/LancellottiChapel/negx.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/LancellottiChapel/posy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/LancellottiChapel/negy.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/LancellottiChapel/posz.jpg", 2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/LancellottiChapel/negz.jpg", 2048]
            ];
            break;
        case "museum":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/computer-history-museum/pos-x.jpg", 512],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/computer-history-museum/neg-x.jpg", 512],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/computer-history-museum/pos-y.jpg", 512],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/computer-history-museum/neg-y.jpg", 512],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/computer-history-museum/pos-z.jpg", 512],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/computer-history-museum/neg-z.jpg", 512]
            ];
            break;
        case "skybox":
            image_files = [
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_X, "images/skybox/right.jpg",   2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_X, "images/skybox/left.jpg",    2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Y, "images/skybox/top.jpg",     2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, "images/skybox/bottom.jpg",  2048],
                [state.gl.TEXTURE_CUBE_MAP_POSITIVE_Z, "images/skybox/front.jpg",   2048],
                [state.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, "images/skybox/back.jpg",    2048]
            ];
            break;
    }

    image_files.forEach((img) =>
    {
        state.gl.texImage2D(img[0], 0, state.gl.RGBA, img[2], img[2], 0, state.gl.RGBA, state.gl.UNSIGNED_BYTE, null);
        const cur_img = new Image();
        cur_img.src = img[1];
        cur_img.onload = () =>
        {
            state.gl.bindTexture(state.gl.TEXTURE_CUBE_MAP, state.cubeMap.skyboxTexture);
            state.gl.texImage2D(img[0], 0, state.gl.RGBA, state.gl.RGBA, state.gl.UNSIGNED_BYTE, cur_img);
        }
    });

}
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function createBackgroundObject(d)
{
    createBackgroundObject.quad =  (p1, p2, p3, p4) =>
    {
        let ind = [p1, p2, p3, p1, p3, p4];

        for (let i = 0; i < ind.length; ++i)
            state.cubeMap.skybox_vertices.push(ind[i]);
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

    createBackgroundObject.quad(vertices[3], vertices[0], vertices[4], vertices[7]);
    createBackgroundObject.quad(vertices[4], vertices[5], vertices[6], vertices[7]);
    createBackgroundObject.quad(vertices[6], vertices[5], vertices[1], vertices[2]);
    createBackgroundObject.quad(vertices[1], vertices[0], vertices[3], vertices[2]);
    createBackgroundObject.quad(vertices[2], vertices[3], vertices[7], vertices[6]);
    createBackgroundObject.quad(vertices[5], vertices[4], vertices[0], vertices[1]);
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeShaderAttributes_skybox()
{
    state.cubeMap.vBuffer_sb = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_sb);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cubeMap.skybox_vertices), state.gl.STATIC_DRAW);

    state.cubeMap.vPosition_attr_sb = state.gl.getAttribLocation(state.program_skybox, "vPosition");
}