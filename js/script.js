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

function bindAnchorClicks(frame) {
  // Get all anchor tags in the iframe document
  var anchors = frame.contentDocument.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default anchor handling
      var targetId = anchor.getAttribute("href").substring(1); // Get the ID, removing '#'
      var targetElement = frame.contentDocument.getElementById(targetId);
      if (targetElement) {
        // Scroll to the target element within the iframe
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
      type = "warning"; // Set the type to "warning" for 'doctype-first' errors
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
