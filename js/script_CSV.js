// script_CSV.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/text");
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

function lintCSV() {
  var input = editor.getValue(); // Get CSV data from editor

  // Check if the input is empty
  if (!input.trim()) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<div class="alert alert-danger">Error: No CSV data provided. Please enter some CSV data for validation.</div>`;
    return; // Stop the function if no input is provided
  }

  const rows = input.split("\n");
  const numColumns = rows[0].match(/(".*?"|[^,\n]+|(?<=,|^)(?=,|$))/g).length;
  const errorMessages = [];
  const tableRows = [];
  const headerRow = [];

  rows.forEach((row, index) => {
    const columns = row.match(/(".*?"|[^,\n]+|(?<=,|^)(?=,|$))/g);

    if (!columns) {
      errorMessages.push(
        `Error on row ${index + 1}: Row could not be parsed correctly.`
      );
      return;
    }

    // Check for column consistency
    if (index != 0 && numColumns != columns.length) {
      errorMessages.push(
        `Error on row ${index + 1}: Expected ${numColumns} columns, found ${
          columns.length
        }.`
      );
    }

    // Check for numeric values formatted with commas
    columns.forEach((column, columnIndex) => {
      if (/^\$\d{1,3}(,\d{3})*(\.\d+)?$/.test(column)) {
        errorMessages.push(
          `Error on row ${index + 1}, column ${
            columnIndex + 1
          }: Numeric value '${column}' should not contain commas or should be quoted.`
        );
      }
    });

    // Prepare data for table rendering if no errors
    if (errorMessages.length == 0) {
      if (index == 0) {
        // Set headerRow
        headerRow.push(
          `<tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr>`
        );
      } else {
        tableRows.push(
          `<tr>${columns.map((column) => `<td>${column}</td>`).join("")}</tr>`
        );
      }
    }
  });

  const outputDiv = document.getElementById("output");
  if (errorMessages.length > 0) {
    outputDiv.innerHTML = `<div class="alert alert-danger"><ul>${errorMessages
      .map((msg) => `<li>${msg}</li>`)
      .join("")}</ul></div>`;
  } else {
    console.log(headerRow);
    outputDiv.innerHTML = `<div class="alert alert-success" role="alert">Valid CSV!</div><table class="table table-bordered"><thead><tr>${headerRow.join(
      ""
    )}</tr></thead><tbody>${tableRows.join("")}</tbody></table>`;
  }
}
