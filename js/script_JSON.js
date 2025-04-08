// script_JSON.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/json");
editor.setOptions({
  useWorker: false,
  showLineNumbers: true,
  showGutter: true,
});

function hasDuplicateKey(jsonString) {
  let splitData = jsonString.split(",");
  for (let i = 0; i < splitData.length; i++) {
    let splitDataList = splitData[i].split('"');
    splitData[i] = splitDataList[1];
  }

  let uniqueKeySet = new Set();
  for (let j = 0; j < splitData.length; j++) {
    if (uniqueKeySet.has(splitData[j])) {
      return true;
    }

    if (splitData[j] !== undefined) {
      if (splitData[j].length !== 0) {
        uniqueKeySet.add(splitData[j]);
      }
    }
  }

  return false;
}

function lintJSON() {
  try {
    var rawData = editor.getValue(); // Get JSON data from editor
    var data = JSON.parse(rawData); // Parse JSON to validate
    var formattedJSON = JSON.stringify(data, null, 4); // Reformat JSON with 4-space indentation

    let hasDuplicate = false;
    let start = [];
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] === "{") {
        start.push(i);
      } else if (rawData[i] === "}") {
        console.log(start);
        let start_i = start.pop();

        if (hasDuplicateKey(rawData.slice(start_i, i))) {
          hasDuplicate = true;
          break;
        }
      }
    }

    if (hasDuplicate === true) {
      document.getElementById("output").innerHTML =
        '<div class="alert alert-warning" role="alert">Duplicate keys found.</div>';
    } else {
      editor.setValue(formattedJSON, -1); // Set formatted JSON back to editor, -1 moves cursor to the start
      document.getElementById("output").innerHTML =
        '<div class="alert alert-success" role="alert">Valid JSON! Formatted successfully.</div>';
    }
  } catch (error) {
    document.getElementById("output").innerHTML =
      '<div class="alert alert-danger" role="alert">Invalid JSON: ' +
      error.message +
      "</div>";
  }
}
