
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

    for (let i=0; i<27; ++i)
    {
        state.cube.subCubes[i].idx    = newArr.cube.subCubes[i].idx;
        state.cube.subCubes[i].rotMat = newArr.cube.subCubes[i].rotMat;
        state.cube.subCubes[i].rotMat.matrix = true;
    }
    state.cube.faces = newArr.cube.faces;

    state.view.theta = newArr.view.theta;
}