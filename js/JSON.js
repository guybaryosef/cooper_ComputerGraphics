function saveFileAsJSON(file_name)
{
    let rubikCubeData = {
        faces: faces,
        points: points,
        colors: colors,
        cubeIndex: cubeIndex,
        theta: theta
    };

    let file = new File(file_name, "write");
    file.open();
    file.writeline( JSON.stringify(rubikCubeData) );
    file.close();
}



function loadFileFromJSON(file_name)
{
    fetch(file_name)
        .then(response => response.json())
        .then(json => {
            faces     = json.faces;
            points    = json.points;
            colors    = json.colors;
            cubeIndex = json.cubeIndex;
            theta     = json.theta;
        });
}