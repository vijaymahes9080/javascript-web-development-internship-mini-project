/**
 * JS PRACTICAL STUDIO - Main Application Orchestrator
 */

import { assignmentsData } from "./assignments.js";
import { ExecutionConsole } from "./console.js";
import { InventoryManager, capstoneExpectedOutput, runCapstoneDemo } from "./inventory.js";
import { DashboardManager } from "./dashboard.js";

// Import tests for in-browser execution
import {
  runAssignment1,
  calculateBillAndTip,
  evaluateGrade,
  runLoopsDemo,
  calculateRectangleAreaStandard,
  calculateRectangleAreaArrow,
  runFunctionsAndScope,
  runArrayMethods
} from "./assignments.js";

import {
  classifyProduct,
  validateProductInput,
  calculateFinancialAdjustment
} from "./inventory.js";

class StudioApp {
  constructor() {
    this.currentAssignmentId = "assignment-1";
    this.completedAssignments = new Set();
    this.inventoryManager = new InventoryManager();

    // DOM Elements
    this.consoleElement = document.getElementById("console-output");
    this.diffElement = document.getElementById("console-diff-inspector");
    this.console = new ExecutionConsole(this.consoleElement, this.diffElement);
    this.dashboard = new DashboardManager(this.console, this.inventoryManager);

    this.testResults = [];
  }

  init() {
    this.renderNavigator();
    this.bindGlobalEvents();
    this.dashboard.init();
    this.selectAssignment(this.currentAssignmentId);
    this.updateProgress();
  }

  bindGlobalEvents() {
    // Sidebar toggle for desktop & mobile
    const toggleSidebarBtn = document.getElementById("btn-toggle-sidebar");
    const sidebar = document.getElementById("app-sidebar");
    if (toggleSidebarBtn && sidebar) {
      toggleSidebarBtn.addEventListener("click", () => {
        sidebar.classList.toggle("collapsed");
      });
    }

    // Execution toolbar buttons
    const btnRunExample = document.getElementById("btn-run-example");
    if (btnRunExample) {
      btnRunExample.addEventListener("click", () => this.runCurrentExample());
    }

    const btnResetExample = document.getElementById("btn-reset-example");
    if (btnResetExample) {
      btnResetExample.addEventListener("click", () => this.resetCurrentExample());
    }

    const btnShowExpected = document.getElementById("btn-show-expected");
    if (btnShowExpected) {
      btnShowExpected.addEventListener("click", () => this.showCurrentExpected());
    }

    const btnCompareDiff = document.getElementById("btn-compare-diff");
    if (btnCompareDiff) {
      btnCompareDiff.addEventListener("click", () => this.compareCurrentDiff());
    }

    const btnRunTests = document.getElementById("btn-run-tests");
    if (btnRunTests) {
      btnRunTests.addEventListener("click", () => this.runCurrentAssignmentTests());
    }

    const btnRunAllTests = document.getElementById("btn-run-all-tests");
    if (btnRunAllTests) {
      btnRunAllTests.addEventListener("click", () => this.runAllTestsSuite());
    }

    const btnClearConsole = document.getElementById("btn-clear-console");
    if (btnClearConsole) {
      btnClearConsole.addEventListener("click", () => this.console.clear());
    }

    const btnCopyConsole = document.getElementById("btn-copy-console");
    if (btnCopyConsole) {
      btnCopyConsole.addEventListener("click", () => {
        const text = this.console.getRawText();
        navigator.clipboard.writeText(text).then(() => {
          btnCopyConsole.textContent = "Copied!";
          setTimeout(() => {
            btnCopyConsole.textContent = "Copy";
          }, 1500);
        });
      });
    }

    // Keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      // Ctrl+Enter or Cmd+Enter to run example
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        this.runCurrentExample();
      }
    });
  }

  renderNavigator() {
    const navList = document.getElementById("assignment-nav-list");
    if (!navList) return;

    const items = [
      ...assignmentsData.map((a) => ({ id: a.id, badge: a.badge, title: a.title, isCapstone: false })),
      { id: "capstone", badge: "CP", title: "Inventory Intelligence", isCapstone: true }
    ];

    navList.innerHTML = items
      .map(
        (item) => `
        <li class="nav-item">
          <button class="nav-btn ${item.id === this.currentAssignmentId ? "active" : ""}" data-id="${item.id}">
            <span class="nav-badge ${item.isCapstone ? "badge-capstone" : ""}">${item.badge}</span>
            <span class="nav-label">${item.title}</span>
            <span class="nav-status-dot ${this.completedAssignments.has(item.id) ? "status-done" : ""}" title="${
          this.completedAssignments.has(item.id) ? "Completed" : "Pending execution"
        }"></span>
          </button>
        </li>
      `
      )
      .join("");

    navList.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.selectAssignment(id);
      });
    });
  }

  selectAssignment(id) {
    this.currentAssignmentId = id;

    // Update nav active states
    document.querySelectorAll(".nav-btn").forEach((btn) => {
      if (btn.getAttribute("data-id") === id) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const isCapstone = id === "capstone";

    // Panels visibility
    const assignmentLearningPanel = document.getElementById("learning-panel-assignment");
    const capstoneWorkspacePanel = document.getElementById("capstone-workspace-panel");

    if (isCapstone) {
      if (assignmentLearningPanel) assignmentLearningPanel.classList.add("hidden");
      if (capstoneWorkspacePanel) capstoneWorkspacePanel.classList.remove("hidden");
      this.console.setExpectedOutput(capstoneExpectedOutput);
    } else {
      if (assignmentLearningPanel) assignmentLearningPanel.classList.remove("hidden");
      if (capstoneWorkspacePanel) capstoneWorkspacePanel.classList.add("hidden");

      const assignment = assignmentsData.find((a) => a.id === id);
      if (assignment) {
        this.renderAssignmentDetails(assignment);
        this.console.setExpectedOutput(assignment.expectedOutput);
      }
    }

    // Auto-run example on assignment switch for immediate responsiveness
    this.runCurrentExample();
  }

  renderAssignmentDetails(assignment) {
    document.getElementById("assignment-badge-title").textContent = assignment.badge;
    document.getElementById("assignment-title").textContent = assignment.title;
    document.getElementById("assignment-objective").textContent = assignment.objective;
    document.getElementById("assignment-description").textContent = assignment.description;
    document.getElementById("assignment-demo-input").textContent = assignment.demoInput;
    document.getElementById("assignment-code-preview").textContent = assignment.codeSample;

    // Render Concept tags
    const conceptsContainer = document.getElementById("assignment-concepts");
    if (conceptsContainer) {
      conceptsContainer.innerHTML = assignment.concepts
        .map((c) => `<span class="concept-tag">${c}</span>`)
        .join("");
    }

    // Render Validation Rules
    const rulesContainer = document.getElementById("assignment-rules");
    if (rulesContainer) {
      rulesContainer.innerHTML = assignment.validationRules
        .map((r) => `<li class="rule-item"><span class="rule-check">✓</span><span>${r}</span></li>`)
        .join("");
    }

    // Render Interactive Inputs if configurable
    const customInputsContainer = document.getElementById("assignment-custom-inputs");
    if (customInputsContainer) {
      if (assignment.hasCustomInputs && assignment.inputConfig) {
        customInputsContainer.classList.remove("hidden");
        customInputsContainer.innerHTML = `
          <h4 class="custom-inputs-heading">Interactive Parameter Controls</h4>
          <div class="custom-inputs-grid">
            ${assignment.inputConfig
              .map(
                (cfg) => `
              <div class="input-control-group">
                <label for="ctrl-${cfg.id}">${cfg.label}</label>
                <input 
                  type="${cfg.type}" 
                  id="ctrl-${cfg.id}" 
                  value="${cfg.default}" 
                  ${cfg.min !== undefined ? `min="${cfg.min}"` : ""} 
                  ${cfg.max !== undefined ? `max="${cfg.max}"` : ""} 
                  ${cfg.step !== undefined ? `step="${cfg.step}"` : ""} 
                  class="studio-input"
                />
              </div>
            `
              )
              .join("")}
          </div>
        `;

        // Bind input change to re-run
        assignment.inputConfig.forEach((cfg) => {
          const inp = document.getElementById(`ctrl-${cfg.id}`);
          if (inp) {
            inp.addEventListener("input", () => this.runCurrentExample());
          }
        });
      } else {
        customInputsContainer.classList.add("hidden");
        customInputsContainer.innerHTML = "";
      }
    }
  }

  getCurrentInputs() {
    if (this.currentAssignmentId === "capstone") return {};

    const assignment = assignmentsData.find((a) => a.id === this.currentAssignmentId);
    if (!assignment || !assignment.hasCustomInputs || !assignment.inputConfig) return {};

    const inputs = {};
    assignment.inputConfig.forEach((cfg) => {
      const el = document.getElementById(`ctrl-${cfg.id}`);
      if (el) {
        inputs[cfg.id] = el.type === "number" ? Number(el.value) : el.value;
      }
    });
    return inputs;
  }

  runCurrentExample() {
    this.console.clear();

    if (this.currentAssignmentId === "capstone") {
      this.dashboard.runDemo();
      this.completedAssignments.add("capstone");
      this.updateProgress();
      return;
    }

    const assignment = assignmentsData.find((a) => a.id === this.currentAssignmentId);
    if (!assignment) return;

    try {
      const inputs = this.getCurrentInputs();
      this.console.info(`Executing [${assignment.badge}] ${assignment.title}...`);

      const result = assignment.execute(inputs);
      this.console.displayOutput(result.rawOutput);

      if (result.explanation) {
        this.console.info(`Technical note: ${result.explanation}`);
      }

      this.completedAssignments.add(assignment.id);
      this.updateProgress();
    } catch (err) {
      this.console.error(`Execution error: ${err.message}`);
    }
  }

  resetCurrentExample() {
    if (this.currentAssignmentId === "capstone") {
      this.inventoryManager.reset();
      this.dashboard.render();
      this.console.clear();
      this.console.info("Reset Capstone workspace to initial dataset.");
      return;
    }

    const assignment = assignmentsData.find((a) => a.id === this.currentAssignmentId);
    if (!assignment) return;

    if (assignment.hasCustomInputs && assignment.inputConfig) {
      assignment.inputConfig.forEach((cfg) => {
        const inp = document.getElementById(`ctrl-${cfg.id}`);
        if (inp) inp.value = cfg.default;
      });
    }

    this.runCurrentExample();
  }

  showCurrentExpected() {
    this.console.clear();

    if (this.currentAssignmentId === "capstone") {
      this.console.info("Displaying Expected Curriculum Output for Capstone Demonstration:");
      this.console.displayOutput(capstoneExpectedOutput);
      return;
    }

    const assignment = assignmentsData.find((a) => a.id === this.currentAssignmentId);
    if (assignment) {
      this.console.info(`Displaying Expected Curriculum Output for [${assignment.badge}]:`);
      this.console.displayOutput(assignment.expectedOutput);
    }
  }

  compareCurrentDiff() {
    const expected =
      this.currentAssignmentId === "capstone"
        ? capstoneExpectedOutput
        : assignmentsData.find((a) => a.id === this.currentAssignmentId)?.expectedOutput;

    this.console.compareOutputs(this.console.lastActualOutput, expected);
  }

  runCurrentAssignmentTests() {
    this.console.clear();
    const id = this.currentAssignmentId;

    this.console.info(`Running automated verification for ${id}...`);

    let passed = 0;
    let failed = 0;

    const testFn = (title, assertion) => {
      try {
        assertion();
        this.console.success(`✔ PASS: ${title}`);
        passed++;
      } catch (err) {
        this.console.error(`✖ FAIL: ${title} -> ${err.message}`);
        failed++;
      }
    };

    if (id === "assignment-1") {
      testFn("Variable types and typeof outputs", () => {
        const res = runAssignment1();
        if (res.data.types.name !== "string") throw new Error("name not string");
        if (res.data.types.age !== "number") throw new Error("age not number");
        if (res.data.types.isEmployed !== "boolean") throw new Error("isEmployed not boolean");
        if (res.data.types.skills !== "object") throw new Error("skills not object");
      });
      testFn("Skills JSON formatting", () => {
        const res = runAssignment1();
        if (!res.rawOutput.includes('Skills: ["HTML","CSS","JavaScript"] (Type: object)')) {
          throw new Error("Skills output format mismatch");
        }
      });
    } else if (id === "assignment-2") {
      testFn("Valid bill and tip calculation", () => {
        const res = calculateBillAndTip({ billAmount: 100, tipPercentage: 15 });
        if (res.data.tipAmount !== 15 || res.data.totalAmount !== 115) throw new Error("Calculation mismatch");
      });
      testFn("Rejection of negative and empty values", () => {
        let threw = false;
        try {
          calculateBillAndTip({ billAmount: -10, tipPercentage: 15 });
        } catch {
          threw = true;
        }
        if (!threw) throw new Error("Did not reject negative bill");
      });
    } else if (id === "assignment-3") {
      testFn("Score evaluation boundaries (0-100)", () => {
        if (evaluateGrade(85).data.grade !== "B") throw new Error("85 should be B");
        if (evaluateGrade(90).data.grade !== "A") throw new Error("90 should be A");
        if (evaluateGrade(59).data.grade !== "F") throw new Error("59 should be F");
      });
      testFn("Pass/Fail ternary status", () => {
        if (evaluateGrade(60, 60).data.status !== "Passed") throw new Error("60 should pass");
        if (evaluateGrade(59, 60).data.status !== "Failed") throw new Error("59 should fail");
      });
    } else if (id === "assignment-4") {
      testFn("For loop multiplication table", () => {
        const res = runLoopsDemo();
        if (res.data.multiplicationTable.length !== 5 || res.data.multiplicationTable[4] !== 25) {
          throw new Error("Multiplication table mismatch");
        }
      });
      testFn("While loop break condition", () => {
        const res = runLoopsDemo();
        if (res.data.foundNumber !== 12) throw new Error("Did not find 12");
      });
      testFn("Do...while continue skipping", () => {
        const res = runLoopsDemo();
        if (res.data.doWhileSkipped.length !== 2) throw new Error("Did not skip 3 and 5");
      });
    } else if (id === "assignment-5") {
      testFn("Standard function default parameters", () => {
        if (calculateRectangleAreaStandard() !== 20) throw new Error("Standard default != 20");
      });
      testFn("Arrow function calculation", () => {
        if (calculateRectangleAreaArrow(10, 3) !== 30) throw new Error("Arrow 10x3 != 30");
      });
      testFn("Controlled block scope ReferenceError", () => {
        const res = runFunctionsAndScope();
        if (!res.data.scopeErrorText.includes("ReferenceError")) throw new Error("No ReferenceError caught");
      });
    } else if (id === "assignment-6") {
      testFn("forEach, filter (< $50), and map uppercase tags", () => {
        const res = runArrayMethods();
        if (res.data.filtered.length !== 2) throw new Error("Filter count != 2");
        if (res.data.mapped[0] !== "LAPTOP costs $800") throw new Error("Map mismatch");
      });
    } else if (id === "capstone") {
      testFn("Capstone deterministic demo total = $975", () => {
        const demo = runCapstoneDemo({ name: "Monitor", price: 150 });
        if (demo.data.analytics.totalInventoryValue !== 975) throw new Error("Value != 975");
      });
      testFn("Category boundary classification", () => {
        if (classifyProduct(49.99) !== "Budget") throw new Error("49.99 should be Budget");
        if (classifyProduct(50) !== "Standard") throw new Error("50 should be Standard");
        if (classifyProduct(200) !== "Premium") throw new Error("200 should be Premium");
      });
    }

    this.console.info(`Verification finished: ${passed} passed, ${failed} failed.`);
  }

  runAllTestsSuite() {
    this.console.clear();
    this.console.info("Executing comprehensive test suite across all 16 domains...");

    const startTime = performance.now();
    const results = [];

    const assertEqual = (act, exp, msg) => {
      if (act !== exp) throw new Error(`${msg}: expected ${exp}, got ${act}`);
    };

    const assertDeepEqual = (act, exp, msg) => {
      if (JSON.stringify(act) !== JSON.stringify(exp)) {
        throw new Error(`${msg}: expected ${JSON.stringify(exp)}, got ${JSON.stringify(act)}`);
      }
    };

    const runCase = (name, fn) => {
      try {
        fn();
        results.push({ name, passed: true });
        this.console.success(`✔ [PASS] ${name}`);
      } catch (err) {
        results.push({ name, passed: false, error: err.message });
        this.console.error(`✖ [FAIL] ${name} -> ${err.message}`);
      }
    };

    // 1. Variable values and types
    runCase("1. Variable values and types (A1)", () => {
      const res = runAssignment1();
      assertEqual(res.data.name, "Alice", "name");
      assertEqual(res.data.age, 25, "age");
      assertEqual(res.data.isEmployed, true, "isEmployed");
      assertDeepEqual(res.data.skills, ["HTML", "CSS", "JavaScript"], "skills");
      assertEqual(res.data.types.skills, "object", "skills type");
    });

    // 2. Tip and total calculations
    runCase("2. Tip and total calculations (A2)", () => {
      const res = calculateBillAndTip({ billAmount: 100, tipPercentage: 15 });
      assertEqual(res.data.tipAmount, 15, "tip");
      assertEqual(res.data.totalAmount, 115, "total");
    });

    // 3. Invalid numeric input
    runCase("3. Invalid numeric input handling (A2)", () => {
      let rejected = 0;
      try {
        calculateBillAndTip({ billAmount: -10, tipPercentage: 15 });
      } catch {
        rejected++;
      }
      try {
        calculateBillAndTip({ billAmount: "abc", tipPercentage: 15 });
      } catch {
        rejected++;
      }
      try {
        calculateBillAndTip({ billAmount: 100, tipPercentage: 120 });
      } catch {
        rejected++;
      }
      assertEqual(rejected, 3, "rejected invalid count");
    });

    // 4. Grade selection and pass/fail status
    runCase("4. Grade selection and pass/fail status (A3)", () => {
      assertEqual(evaluateGrade(85).data.grade, "B", "85");
      assertEqual(evaluateGrade(90).data.grade, "A", "90");
      assertEqual(evaluateGrade(70).data.grade, "C", "70");
      assertEqual(evaluateGrade(60).data.grade, "D", "60");
      assertEqual(evaluateGrade(59).data.grade, "F", "59");
      assertEqual(evaluateGrade(60, 60).data.status, "Passed", "pass");
      assertEqual(evaluateGrade(59, 60).data.status, "Failed", "fail");
    });

    // 5. Loop results and termination
    runCase("5. Loop results and termination (A4)", () => {
      const res = runLoopsDemo();
      assertEqual(res.data.multiplicationTable[4], 25, "table 5x5");
      assertEqual(res.data.foundNumber, 12, "found 12");
      assertDeepEqual(res.data.doWhileSkipped, [3, 5], "skipped items");
    });

    // 6. Rectangle area calculations
    runCase("6. Rectangle area calculations (A5)", () => {
      assertEqual(calculateRectangleAreaStandard(), 20, "default 5x4");
      assertEqual(calculateRectangleAreaArrow(10, 3), 30, "arrow 10x3");
    });

    // 7. Block scope error handling
    runCase("7. Block scope error handling (A5)", () => {
      const res = runFunctionsAndScope();
      if (!res.data.scopeErrorText.includes("ReferenceError")) throw new Error("ReferenceError missing");
    });

    // 8. Array filtering and mapping
    runCase("8. Array filtering and mapping (A6)", () => {
      const res = runArrayMethods();
      assertEqual(res.data.all.length, 3, "all count");
      assertEqual(res.data.filtered.length, 2, "filtered count");
      assertEqual(res.data.mapped[0], "LAPTOP costs $800", "mapped tag");
    });

    // 9. Product insertion
    runCase("9. Product insertion (Capstone)", () => {
      const mgr = new InventoryManager();
      const p = mgr.addProduct("Monitor", 150);
      assertEqual(p.name, "Monitor", "name");
      assertEqual(mgr.getAll().length, 3, "count");
    });

    // 10. Inventory totals
    runCase("10. Inventory totals and analytics (Capstone $975)", () => {
      const demo = runCapstoneDemo({ name: "Monitor", price: 150 });
      assertEqual(demo.data.analytics.totalInventoryValue, 975, "total 975");
      assertEqual(demo.data.analytics.totalProducts, 3, "product count");
    });

    // 11. Category boundaries at 49.99, 50, 199.99, and 200
    runCase("11. Category boundaries at 49.99, 50, 199.99, 200", () => {
      assertEqual(classifyProduct(49.99), "Budget", "49.99");
      assertEqual(classifyProduct(50), "Standard", "50");
      assertEqual(classifyProduct(199.99), "Standard", "199.99");
      assertEqual(classifyProduct(200), "Premium", "200");
    });

    // 12. Empty inventory
    runCase("12. Empty inventory handling (Capstone)", () => {
      const mgr = new InventoryManager([]);
      const a = mgr.getAnalytics();
      assertEqual(a.totalProducts, 0, "total count");
      assertEqual(a.totalInventoryValue, 0, "total value");
      assertEqual(a.averageProductPrice, 0, "average");
    });

    // 13. Invalid product submission
    runCase("13. Invalid product submission handling (Capstone)", () => {
      const mgr = new InventoryManager();
      let rejected = 0;
      try {
        mgr.addProduct("", 100);
      } catch {
        rejected++;
      }
      try {
        mgr.addProduct("Test", 0);
      } catch {
        rejected++;
      }
      try {
        mgr.addProduct("Test", -5);
      } catch {
        rejected++;
      }
      assertEqual(rejected, 3, "rejected invalid products");
    });

    // 14. Search and sorting
    runCase("14. Search and sorting (Capstone)", () => {
      const mgr = new InventoryManager();
      mgr.addProduct("Monitor", 150);
      const search = mgr.filterAndSort({ search: "mo" });
      assertEqual(search.length, 2, "search match count");
      const sorted = mgr.filterAndSort({ sortBy: "price-asc" });
      assertEqual(sorted[0].name, "Mouse", "lowest price");
    });

    // 15. Product removal and reset
    runCase("15. Product removal and reset (Capstone)", () => {
      const mgr = new InventoryManager();
      const firstId = mgr.getAll()[0].id;
      mgr.removeProduct(firstId);
      assertEqual(mgr.getAll().length, 1, "after remove");
      mgr.reset();
      assertEqual(mgr.getAll().length, 2, "after reset");
    });

    // 16. Tax and discount calculations
    runCase("16. Tax and discount calculations (Capstone)", () => {
      const adj = calculateFinancialAdjustment(1000, { discountPercent: 10, taxPercent: 5 });
      assertEqual(adj.discountAmount, 100, "discount");
      assertEqual(adj.taxAmount, 45, "tax");
      assertEqual(adj.finalTotal, 945, "final total");
    });

    const elapsed = (performance.now() - startTime).toFixed(1);
    const passCount = results.filter((r) => r.passed).length;
    const failCount = results.filter((r) => !r.passed).length;

    this.console.info(
      `Test Run Summary: ${passCount} passed, ${failCount} failed in ${elapsed}ms.`
    );

    // Update Progress Panel Test Status
    this.renderTestMatrix(results, passCount, failCount, elapsed);
  }

  renderTestMatrix(results, passCount, failCount, elapsed) {
    const statusContainer = document.getElementById("test-matrix-container");
    const summaryBadge = document.getElementById("test-summary-badge");

    if (summaryBadge) {
      summaryBadge.textContent = `${passCount}/${results.length} Passing (${elapsed}ms)`;
      summaryBadge.className = `badge ${failCount === 0 ? "badge-success" : "badge-danger"}`;
    }

    if (statusContainer) {
      statusContainer.innerHTML = `
        <div class="test-matrix-header">
          <span class="text-xs text-muted uppercase tracking-wider">Automated Verification Suite</span>
          <span class="text-xs ${failCount === 0 ? "text-emerald" : "text-rose"} font-semibold">
            ${failCount === 0 ? "All Tests Passing ✓" : `${failCount} Failure(s)`}
          </span>
        </div>
        <div class="test-matrix-list">
          ${results
            .map(
              (r) => `
            <div class="test-item ${r.passed ? "test-item-pass" : "test-item-fail"}">
              <span class="test-indicator-icon">${r.passed ? "✔" : "✖"}</span>
              <span class="test-item-name">${r.name}</span>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    }
  }

  updateProgress() {
    const total = 7; // 6 assignments + 1 capstone
    const completed = this.completedAssignments.size;
    const pct = Math.round((completed / total) * 100);

    const progressFill = document.getElementById("progress-fill-bar");
    const progressCount = document.getElementById("progress-count-text");

    if (progressFill) {
      progressFill.style.width = `${pct}%`;
    }

    if (progressCount) {
      progressCount.textContent = `${completed} of ${total} exercises executed`;
    }

    // Refresh nav status dots
    this.renderNavigator();
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new StudioApp();
  app.init();
  window.studioApp = app; // Expose for debugging/inspection
});
