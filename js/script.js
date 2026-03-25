// script.js
var editor = ace.edit("editor");
editor.session.setMode("ace/mode/html");

editor.session.setUseSoftTabs(false);
editor.session.setTabSize(4);
editor.focus();

editor.setOptions({
  useWorker: false,
  showLineNumbers: true,
  showGutter: true,
});

editor.session.on("change", function () {
  renderHTML();
});

editor.session.on("changeAnnotation", function () {
  let i = 0;
  while (i < editor.session.$annotations?.length ?? 0) {
    if (
      editor.session.$annotations[i].text.includes(
        "Doctype must be declared before any non-comment content.",
      )
    ) {
      editor.session.setAnnotations([
        ...editor.session.$annotations.slice(0, i),
        ...editor.session.$annotations.slice(i + 1),
      ]);
      continue;
    }
    if (
      editor.session.$annotations[i].text ===
      "Special characters must be escaped : [ > ]."
    ) {
      editor.session.$annotations[i].text = [
        "Special characters MUST be escaped (unless contained within valid LaTeX delimiters): [ > ]",
      ];
    }

    if (
      editor.session.$annotations[i].text ===
      "Special characters must be escaped : [ < ]."
    ) {
      editor.session.$annotations[i].text = [
        "Special characters MUST be escaped (unless contained within valid LaTeX delimiters): [ < ]",
      ];
    }

    i++;
  }
});

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

function renderHTML() {
  var html = editor.getValue();
  html = html.replace(/›/g, ">").replace(/‹/g, "<");

  var outputFrame = document.getElementById("output");
  outputFrame.srcdoc = html;

  lintHTML(html);

  outputFrame.onload = function () {
    bindAnchorClicks(outputFrame);
  };
}

// Prevent iframe from interacting with resizer
const iframe = document.getElementById("output");

resizer.addEventListener("mousedown", () => {
  iframe.style.pointerEvents = "none";
  document.addEventListener("mouseup", stopDrag);
});

function stopDrag() {
  iframe.style.pointerEvents = "auto";
  document.removeEventListener("mouseup", stopDrag);
}

function bindAnchorClicks(frame) {
  // Get all anchor tags in the iframe document
  var anchors = frame.contentDocument.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      event.preventDefault();
      var targetId = anchor.getAttribute("href").substring(1);
      var targetElement = frame.contentDocument.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView();

        // Update the hash in the iframe's URL
        frame.contentWindow.location.hash = targetId;
      }
    });
  });
}

function lintHTML(html) {
  var rules = HTMLHint.HTMLHint.defaultRuleset;

  var errors = HTMLHint.HTMLHint.verify(html, rules);

  var annotations = [];

  errors.forEach(function (error) {
    var type = "error";
    if (error.rule.id === "doctype-first") {
      type = "warning";
    }
    annotations.push({
      row: error.line - 1,
      column: error.col - 1,
      text: error.message,
      type: type,
    });
  });

  editor.session.setAnnotations(annotations);
}
