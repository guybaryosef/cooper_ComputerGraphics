
function saveFileAsJSON(event)
{
    event.preventDefault();

    let file_name = (document.getElementById("saveCube").value != "" ) ?
        document.getElementById("saveCube").value : "rubiksCube.json";

    let stateJSON = JSON.stringify(state);

    let blob = new Blob([stateJSON], {type: "application/json"});

    let saveAs = window.saveAs;
    saveAs(blob, file_name);
}



function loadFileFromJSON(event)
{
    event.preventDefault();

    let file = document.getElementById("loadCubeInput").files[0];
    if (!file)
    {
        alert("Select a file to upload before pressing load.");
        return;
    }

    let fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
}

function receivedText(e) {
    let lines = e.target.result;
    let newArr = JSON.parse(lines);
    console.log(newArr);
    state.cube.subCubes = newArr.cube.subCubes;
    state.cube.faces = newArr.cube.faces;

    state.view.theta = newArr.view.theta;
    state.view.ctm   = newArr.view.ctm;

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.points), state.gl.STATIC_DRAW);

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, cBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.colors), state.gl.STATIC_DRAW);
}