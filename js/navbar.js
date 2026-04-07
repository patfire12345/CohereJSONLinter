class Navbar extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    let active = '"nav-item active"';
    let inactive = '"nav-item"';
    this.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="#">Cohere Helper</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">              
                    <li class=${this.innerText === "index.html" ? active : inactive}>
                    <a class="nav-link" href="index.html">HTML Renderer</a>
                    </li>
                    <li class=${this.innerText === "mathjax.html" ? active : inactive}>
                    <a class="nav-link" href="mathjax.html">HTML (with LaTeX) Renderer</a>
                    </li>
                    <li class=${this.innerText === "JSONlint.html" ? active : inactive}>
                    <a class="nav-link" href="JSONlint.html">JSON Linter</a>
                    </li>
                    <li class=${this.innerText === "JSONLlint.html" ? active : inactive}>
                    <a class="nav-link" href="JSONLlint.html">JSONL Linter</a>
                    </li>
                    <li class=${this.innerText === "CSVlint.html" ? active : inactive}>
                    <a class="nav-link" href="CSVlint.html">CSV Linter</a>
                    </li>
                    <li class=${this.innerText === "TSVlint.html" ? active : inactive}>
                    <a class="nav-link" href="TSVlint.html">TSV Linter</a>
                    </li>
                    <li class=${this.innerText === "Customlint.html" ? active : inactive}>
                    <a class="nav-link" href="Customlint.html">Custom Linter</a>
                    </li>
                </ul>
            </div>
        </nav>
    `;
  }
}

customElements.define("navbar-header", Navbar);
