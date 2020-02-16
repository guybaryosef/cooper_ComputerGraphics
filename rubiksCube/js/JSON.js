
function saveFileAsJSON(event)
{
    let file_name = (document.getElementById("saveCube").value != "" ) ?
        document.getElementById("saveCube").value : "rubiksCube.json";
    event.preventDefault();

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

    state.ui = newArr.ui;
    state.cube = newArr.cube;
    state.view.theta = newArr.view.theta;
    state.view.ctm = newArr.view.ctm;

    state.gl.bindBuffer(state.gl.ARRAY_BUFFER, vBuffer);
    state.gl.bufferData(state.gl.ARRAY_BUFFER, flatten(state.cube.points), state.gl.STATIC_DRAW);
}