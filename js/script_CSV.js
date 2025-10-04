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
    resizer.style.top = newHeight + "px";
    editor.resize();
  }
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  document.body.style.cursor = "default";
});

function lintCSV() {
  var csvString = editor.getValue();
  const errorMessages = [];
  const tableRows = [];
  const headerRow = [];
  const outputDiv = document.getElementById("output");

  // RFC 4180 requires CRLF (\r\n) line endings, but we allow LF too for practicality
  const lines = csvString.split(/\r\n|\n/);

  if (lines.length === 0) {
    outputDiv.innerHTML = `<div class="alert alert-danger">Error: No CSV data provided. Please enter some CSV data for validation.</div>`;
    return;
  }

  // Count number of columns
  const firstRow = parseCSVRow(lines[0]);
  if (!firstRow) {
    outputDiv.innerHTML = `<div class="alert alert-danger">Error on row 1: Row could not be parsed correctly.</div>`;
    return;
  }

  const columnCount = firstRow.length;

  for (let i = 0; i < lines.length; i++) {
    const row = parseCSVRow(lines[i]);
    if (!row) {
      errorMessages.push(
        `Error on row ${i + 1}: Row could not be parsed correctly.`
      );
    }

    if (row.length !== columnCount) {
      errorMessages.push(
        `Error on row ${i + 1}: Expected ${columnCount} columns, found ${
          row.length
        }.`
      );
    }

    // Prepare data for table rendering if no errors
    if (errorMessages.length === 0) {
      if (i === 0) {
        headerRow.push(
          `<tr>${row.map((column) => `<th>${column}</th>`).join("")}</tr>`
        );
      } else {
        tableRows.push(
          `<tr>${row.map((column) => `<td>${column}</td>`).join("")}</tr>`
        );
      }
    }
  }

  if (errorMessages.length > 0) {
    outputDiv.innerHTML = `<div class="alert alert-danger"><ul>${errorMessages
      .map((msg) => `<li>${msg}</li>`)
      .join("")}</ul></div>`;
  } else {
    outputDiv.innerHTML = `<div class="alert alert-success" role="alert">Valid CSV!</div><table class="table table-bordered"><thead><tr>${headerRow.join(
      ""
    )}</tr></thead><tbody>${tableRows.join("")}</tbody></table>`;
  }
}

function parseCSVRow(row) {
  const result = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < row.length) {
    const char = row[i];

    if (inQuotes) {
      if (char === '"') {
        if (row[i + 1] === '"') {
          // Escaped quote
          field += '"';
          i++;
        } else {
          // Closing quote
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        result.push(field);
        field = "";
      } else {
        field += char;
      }
    }
    i++;
  }

  result.push(field);

  if (inQuotes) return null;

  return result;
}
