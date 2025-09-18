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

function lintJSON() {
  try {
    var rawData = editor.getValue(); // Get JSON data from editor
    var data = JSON.parse(rawData); // Parse JSON to validate
    var formattedJSON = JSON.stringify(data, null, 4); // Reformat JSON with 4-space indentation

    let count1 = 0;
    let count2 = 0;

    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] == '"') {
        count1 += 1;
      }
    }

    for (let i = 0; i < formattedJSON.length; i++) {
      if (formattedJSON[i] == '"') {
        count2 += 1;
      }
    }

    let hasDuplicate =
      rawData.replace(/\s/g, "").length !==
        formattedJSON.replace(/\s/g, "").length && count1 !== count2;

    console.log(rawData.length);
    console.log(formattedJSON.length);
    console.log(hasDuplicate);

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
