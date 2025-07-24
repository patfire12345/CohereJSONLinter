// script_TSV.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/text");
editor.setOptions({
  useWorker: false,
  showLineNumbers: true,
  showGutter: true,
});

function lintTSV() {
  var input = editor.getValue(); // Get TSV data from editor

  // Check if the input is empty
  if (!input.trim()) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML = `<div class="alert alert-danger">Error: No TSV data provided. Please enter some TSV data for validation.</div>`;
    return; // Stop the function if no input is provided
  }

  const rows = input.split("\n");
  const numColumns = rows[0].split("\t").length;
  const errorMessages = [];
  const tableRows = [];
  const headerRow = [];

  rows.forEach((row, index) => {
    const columns = row.split("\t");

    if (!columns) {
      errorMessages.push(
        `Error on row ${index + 1}: Row could not be parsed correctly.`
      );
      return;
    }

    // Check for column consistency
    if (index !== 0 && numColumns !== columns.length) {
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
    if (errorMessages.length === 0) {
      if (index === 0) {
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
    outputDiv.innerHTML = `<div class="alert alert-success" role="alert">Valid TSV!</div><table class="table table-bordered"><thead>${headerRow.join(
      ""
    )}</thead><tbody>${tableRows.join("")}</tbody></table>`;
  }
}
