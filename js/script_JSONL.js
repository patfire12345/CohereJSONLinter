// script_JSONL.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/json");
editor.setOptions({
  useWorker: false,
  showLineNumbers: true,
  showGutter: true,
});

function hasDuplicateKey(jsonString) {
  let splitData = jsonString.split(",");
  console.log(splitData);
  for (let i = 0; i < splitData.length; i++) {
    let splitDataList = splitData[i].split('"');
    splitData[i] = splitDataList[1];
    console.log(splitDataList);
  }

  let uniqueKeySet = new Set();
  for (let j = 0; j < splitData.length; j++) {
    if (uniqueKeySet.has(splitData[j])) {
      return true;
    }

    uniqueKeySet.add(splitData[j]);
  }

  return false;
}

function lintJSONL() {
  try {
    var rawData = editor.getValue(); // Get JSONL data from editor
    var lines = rawData.trim().split("\n"); // Split the input into lines
    var validJSONLines = [];
    lines.forEach((line) => {
      var data = JSON.parse(line); // Parse each line to validate JSONL
      validJSONLines.push(JSON.stringify(data)); // Add valid JSONL line back to array
    });
    var formattedJSONL = validJSONLines.join("\n"); // Combine valid JSONL lines, separated by newlines
    let hasDuplicate = false;
    let start = 0;
    let counter = 0;
    for (let i = 0; i < rawData.length; i++) {
      if (rawData[i] === "{") {
        counter += 1;
      } else if (rawData[i] === "}") {
        counter -= 1;

        if (counter === 0) {
          console.log(rawData.slice(start, i));
          start = i + 1;

          if (hasDuplicateKey(rawData.slice(start, i))) {
            hasDuplicate = true;
            break;
          }
        }
      }
    }

    if (hasDuplicate === true) {
      document.getElementById("output").innerHTML =
        '<div class="alert alert-warning" role="alert">Duplicate keys found.</div>';
    } else {
      editor.setValue(formattedJSONL, -1); // Set formatted JSONL back to editor, -1 moves cursor to the start
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
