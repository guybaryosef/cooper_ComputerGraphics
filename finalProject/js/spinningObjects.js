
function configureSpinningObjects(num)
{
    state.spinningObjects.count      = num;
    state.spinningObjects.vertices   = [];
    state.spinningObjects.start_idx  = [];
    state.spinningObjects.length     = [];
    state.spinningObjects.parameters = [];

    let theta_inc = 2*Math.PI/num;
    let theta = 0;

    let scale_vec = vec4(0.5, 0.5, 0.5, 1.0);
    for (let i = 0; i < num; ++i)
    {
        //get a random number to decide the shape type
        let shape = Math.floor(Math.random() * 5);
        let cur_obj = null;
        switch (shape)
        {
            case 0: cur_obj = cube();       break;
            case 1: cur_obj = cylinder();   break;
            case 2: cur_obj = teapot();     break;
            default:cur_obj = sphere(3);     break;
        }

        // get a random number to decide the radius and rotation speeds
        let radius     = 4*Math.random() + 3;
        let phi        = Math.random()*Math.PI - Math.PI/2;
        let phi_incr   = Math.random()/150 + 0.005;
        let theta_incr = Math.random()/150 + 0.005;
        let x_incr     = Math.random();
        let y_incr     = Math.random();

        state.spinningObjects.start_idx.push(state.spinningObjects.vertices.length);
        state.spinningObjects.length.push(cur_obj.TriangleVertices.length);

        cur_obj.TriangleVertices.forEach( x => state.spinningObjects.vertices.push(mult(scale_vec,x)) );
        state.spinningObjects.parameters.push( mat3(radius, theta,  theta_incr,
                                                    0,      x_incr, phi,
                                                    0,      y_incr, phi_incr) );

        theta += theta_inc;
    }

    initializeShaderAttributes_spinningObjs()
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function initializeShaderAttributes_spinningObjs()
{
    state.cubeMap.vBuffer_so = state.gl.createBuffer();
    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, state.cubeMap.vBuffer_so);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.spinningObjects.vertices), state.gl.STATIC_DRAW);

    state.cubeMap.vPosition_attr_so = state.gl.getAttribLocation(state.program_spinObj, "vPosition");
}
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
//  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function spinObjects()
{
    if (state.spinningObjects.spinning)
    {
        for (let i = 0; i < state.spinningObjects.count; ++i)
        {
            state.spinningObjects.parameters[i][0][1] += state.spinningObjects.parameters[i][0][2];   // theta angle
            state.spinningObjects.parameters[i][1][2] += state.spinningObjects.parameters[i][2][2];   // phi angle
            state.spinningObjects.parameters[i][1][2] += state.spinningObjects.parameters[i][2][2];   // phi angle
            state.spinningObjects.parameters[i][1][0] += state.spinningObjects.parameters[i][1][1];   // x-axis rot
            state.spinningObjects.parameters[i][2][0] += state.spinningObjects.parameters[i][2][1];   // y-axis rot

            // 'randomly' change the radius
            let tmp = state.spinningObjects.parameters[i][0][0] + Math.cos(state.spinningObjects.parameters[i][0][2])
                    + Math.sin(state.spinningObjects.parameters[i][0][2]);
            state.spinningObjects.parameters[i][0][0] = Math.min(8.0, Math.max(tmp, 3.0));
        }
    }
}