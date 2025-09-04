// script_JSON.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/json");
editor.setOptions({
  useWorker: false,
  showLineNumbers: true,
  showGutter: true,
});

editor.focus();

// Drag-to-resize functionality
const editorContainer = document.getElementById("editor-container");
const editorDiv = document.getElementById("editor");
const resizer = document.getElementById("resizer");

let isDragging = false;

resizer.addEventListener("mousedown", (e) => {
  isDragging = true;
  document.body.style.cursor = "ns-resize";
  e.preventDefault();
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  const containerTop = editorContainer.getBoundingClientRect().top;
  const newHeight = e.clientY - containerTop;

  if (newHeight > 100) {
    editorDiv.style.height = newHeight + "px";
    resizer.style.top = newHeight + "px"; // Move the resizer with the cursor
    editor.resize();
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
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

    // let hasDuplicate = false;
    // let start = [];
    // let i = 0;
    // while (i < rawData.length) {
    //   if (rawData[i] === "{") {
    //     start.push(i);
    //   } else if (rawData[i] === "}") {
    //     let start_i = start.pop();
    //     let stringLen = rawData.slice(start_i, i).length;

    //     if (hasDuplicateKey(rawData.slice(start_i, i))) {
    //       hasDuplicate = true;
    //       break;
    //     } else {
    //       rawData = rawData.slice(0, start_i) + rawData.slice(i + 1);
    //       i -= stringLen;
    //     }
    //   }

    //   i++;
    // }

    // if (hasDuplicate === true) {
    //   document.getElementById("output").innerHTML =
    //     '<div class="alert alert-warning" role="alert">Duplicate keys found.</div>';
    // } else {
    editor.setValue(formattedJSON, -1); // Set formatted JSON back to editor, -1 moves cursor to the start
    document.getElementById("output").innerHTML =
      '<div class="alert alert-success" role="alert">Valid JSON! Formatted successfully.</div>';
    // }
  } catch (error) {
    document.getElementById("output").innerHTML =
      '<div class="alert alert-danger" role="alert">Invalid JSON: ' +
      error.message +
      "</div>";
  }
}
