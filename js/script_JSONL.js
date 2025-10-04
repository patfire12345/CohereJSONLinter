// script_JSONL.js
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
    resizer.style.top = newHeight + "px";
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

function lintJSONL() {
  try {
    var rawData = editor.getValue();
    var lines = rawData.trim().split("\n");
    var validJSONLines = [];
    lines.forEach((line) => {
      var data = JSON.parse(line);
      validJSONLines.push(JSON.stringify(data));
    });
    var formattedJSONL = validJSONLines.join("\n");
    let hasDuplicate = false;
    let start = 0;
    let counter = 0;
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] === "{") {
        counter += 1;
      } else if (rawData[i] === "}") {
        counter -= 1;

        if (counter === 0) {
          if (hasDuplicateKey(rawData.slice(start, i))) {
            hasDuplicate = true;
            break;
          }

          start = i + 1;
        }
      }
    }

    if (hasDuplicate === true) {
      document.getElementById("output").innerHTML =
        '<div class="alert alert-warning" role="alert">Duplicate keys found.</div>';
    } else {
      editor.setValue(formattedJSONL, -1);
      document.getElementById("output").innerHTML =
        '<div class="alert alert-success" role="alert">Valid JSONL! Formatted successfully.</div>';
    }
  } catch (error) {
    document.getElementById("output").innerHTML =
      '<div class="alert alert-danger" role="alert">Invalid JSONL: ' +
      error.message +
      "</div>";
  }
}
