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

var customAnnotations = [
  {
    row: 1, // line number 2 (0-indexed)
    column: 0,
    text: "Special characters MUST be escaped (unless contained within valid LaTeX delimiters): [ < ]",
    type: "error", // can be "error", "warning", or "info"
  },
];

editor.session.on("change", function () {
  renderHTML();
});

editor.session.on("changeAnnotation", function () {
  let i = 0;
  while (i < editor.renderer.$gutterLayer.$annotations.length) {
    if (
      editor.renderer.$gutterLayer.$annotations[i].text.includes(
        "Doctype must be declared before any non-comment content.",
      )
    ) {
      if (editor.renderer.$gutterLayer.$annotations[i].text.length === 1) {
        editor.renderer.$gutterLayer.$annotations = [
          ...editor.renderer.$gutterLayer.$annotations.slice(0, i),
          ...editor.renderer.$gutterLayer.$annotations.slice(i + 1),
        ];
        continue;
      } else {
        const doctypeIndex = editor.renderer.$gutterLayer.$annotations[
          i
        ].text.indexOf(
          "Doctype must be declared before any non-comment content.",
        );
        editor.renderer.$gutterLayer.$annotations[i].text = [
          ...editor.renderer.$gutterLayer.$annotations[i].text.slice(
            0,
            doctypeIndex,
          ),
          ...editor.renderer.$gutterLayer.$annotations[i].text.slice(
            doctypeIndex + 1,
          ),
        ];
      }
    }
    if (
      editor.renderer.$gutterLayer.$annotations[i].text.includes(
        "Special characters must be escaped : [ > ].",
      )
    ) {
      editor.renderer.$gutterLayer.$annotations[i].text = [
        "Special characters MUST be escaped (unless contained within valid LaTeX delimiters): [ > ]",
      ];
    }

    if (
      editor.renderer.$gutterLayer.$annotations[i].text.includes(
        "Special characters must be escaped : [ &#60; ].",
      )
    ) {
      editor.renderer.$gutterLayer.$annotations[i].text = [
        "Special characters MUST be escaped (unless contained within valid LaTeX delimiters): [ &#60 ]",
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
