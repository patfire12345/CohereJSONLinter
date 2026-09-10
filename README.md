# CohereJSONLinter

A lightweight browser-based linter and formatter for structured text formats. This project provides a small collection of static HTML pages for validating and formatting JSON, JSON Lines, CSV, TSV, custom-delimiter tables, and live HTML rendering with MathJax support.

## Features

- JSON validation and pretty-printing
- JSONL validation and formatting
- CSV validation with table output
- TSV validation with delimiter options
- Custom delimiter table validation
- HTML live preview with HTMLHint validation
- MathJax-enabled HTML rendering page
- No build step required; works as a static site

## Project layout

- `index.html` — HTML renderer demo page
- `JSONlint.html` — JSON linter/formatter
- `JSONLlint.html` — JSONL linter/formatter
- `CSVlint.html` — CSV validator
- `TSVlint.html` — TSV validator
- `Customlint.html` — custom delimiter validator
- `mathjax.html` — MathJax rendering preview
- `css/` — stylesheet files
- `js/` — JavaScript logic for editor behavior and validation

## Run locally

Because this is a static app, you can either:

1. Open any HTML file directly in a browser, or
2. Serve the folder locally:

```bash
cd CohereJSONLinter
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

## Notes

- The app uses Ace Editor for editing and Bootstrap for styling.
- External libraries are loaded from CDN sources for HTMLHint, Bootstrap, Ace, and MathJax.
- No backend or package installation is required.

## Files of interest

- `js/script_JSON.js` — JSON validation logic
- `js/script_JSONL.js` — JSONL validation logic
- `js/script_CSV.js` — CSV validation logic
- `js/script_TSV.js` — TSV validation logic
- `js/script_Custom.js` — custom delimiter validation logic
- `js/script_mathjax.js` — HTML/MathJax preview logic

## License

This project does not currently include a formal license file. If you plan to reuse or distribute it publicly, you may want to add an appropriate open-source license.
