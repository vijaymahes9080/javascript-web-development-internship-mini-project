/**
 * JS PRACTICAL STUDIO - Execution Console & Output Diff Engine
 */

export class ExecutionConsole {
  constructor(consoleElement, diffElement = null) {
    this.container = consoleElement;
    this.diffContainer = diffElement;
    this.logs = [];
    this.lastActualOutput = "";
    this.lastExpectedOutput = "";
  }

  clear() {
    this.logs = [];
    if (this.container) {
      this.container.innerHTML = "";
    }
    if (this.diffContainer) {
      this.diffContainer.innerHTML = "";
      this.diffContainer.classList.add("hidden");
    }
  }

  log(message, type = "output") {
    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    this.logs.push({ timestamp, message, type });
    this.renderLogEntry(timestamp, message, type);
  }

  error(message) {
    this.log(message, "error");
  }

  success(message) {
    this.log(message, "success");
  }

  info(message) {
    this.log(message, "info");
  }

  warn(message) {
    this.log(message, "warn");
  }

  renderLogEntry(timestamp, message, type) {
    if (!this.container) return;

    const entry = document.createElement("div");
    entry.className = `console-line line-${type}`;

    const timeSpan = document.createElement("span");
    timeSpan.className = "console-timestamp";
    timeSpan.textContent = `[${timestamp}]`;

    const contentSpan = document.createElement("pre");
    contentSpan.className = "console-text";
    contentSpan.textContent = typeof message === "object" ? JSON.stringify(message, null, 2) : String(message);

    entry.appendChild(timeSpan);
    entry.appendChild(contentSpan);
    this.container.appendChild(entry);
    this.container.scrollTop = this.container.scrollHeight;
  }

  displayOutput(rawOutput, type = "output") {
    this.lastActualOutput = rawOutput;
    this.log(rawOutput, type);
  }

  setExpectedOutput(expected) {
    this.lastExpectedOutput = expected;
  }

  compareOutputs(actual = this.lastActualOutput, expected = this.lastExpectedOutput) {
    if (!this.diffContainer) return { match: false, diffLines: [] };

    const cleanActual = (actual || "").trim().replace(/\r\n/g, "\n");
    const cleanExpected = (expected || "").trim().replace(/\r\n/g, "\n");

    const actualLines = cleanActual ? cleanActual.split("\n") : [];
    const expectedLines = cleanExpected ? cleanExpected.split("\n") : [];

    const isMatch = cleanActual === cleanExpected;
    const maxLines = Math.max(actualLines.length, expectedLines.length);
    const diffRows = [];

    for (let i = 0; i < maxLines; i++) {
      const act = actualLines[i] !== undefined ? actualLines[i] : "<missing>";
      const exp = expectedLines[i] !== undefined ? expectedLines[i] : "<missing>";
      const lineMatches = act === exp;
      diffRows.push({
        lineNumber: i + 1,
        actual: act,
        expected: exp,
        matches: lineMatches
      });
    }

    this.renderDiff({ isMatch, diffRows });
    return { isMatch, diffRows };
  }

  renderDiff({ isMatch, diffRows }) {
    if (!this.diffContainer) return;

    this.diffContainer.classList.remove("hidden");
    this.diffContainer.innerHTML = `
      <div class="diff-header">
        <div class="diff-title">
          <span class="diff-indicator ${isMatch ? "indicator-success" : "indicator-fail"}">
            ${isMatch ? "✓ 100% EXACT MATCH" : "⚠ OUTPUT MISMATCH"}
          </span>
          <span class="diff-subtitle">Comparing Actual Execution Output vs Curriculum Expected Output</span>
        </div>
        <button id="btn-close-diff" class="btn-diff-close" title="Close Diff Inspector">&times;</button>
      </div>
      <div class="diff-table-wrapper">
        <table class="diff-table">
          <thead>
            <tr>
              <th class="diff-col-num">#</th>
              <th class="diff-col-side">Actual Execution Output</th>
              <th class="diff-col-side">Expected Curriculum Output</th>
              <th class="diff-col-status">Status</th>
            </tr>
          </thead>
          <tbody>
            ${diffRows
              .map(
                (r) => `
              <tr class="${r.matches ? "diff-row-match" : "diff-row-mismatch"}">
                <td class="diff-line-no">${r.lineNumber}</td>
                <td class="diff-content diff-actual"><code>${this.escapeHtml(r.actual)}</code></td>
                <td class="diff-content diff-expected"><code>${this.escapeHtml(r.expected)}</code></td>
                <td class="diff-status-cell">
                  <span class="badge ${r.matches ? "badge-success" : "badge-danger"}">
                    ${r.matches ? "PASS" : "FAIL"}
                  </span>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>
    `;

    const closeBtn = this.diffContainer.querySelector("#btn-close-diff");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        this.diffContainer.classList.add("hidden");
      });
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  getRawText() {
    return this.logs.map((l) => `[${l.timestamp}] [${l.type.toUpperCase()}] ${l.message}`).join("\n");
  }
}
