/**
 * JS PRACTICAL STUDIO - Capstone Dashboard Manager
 * Manages UI interactions, live inventory table, analytics KPI cards, and financial calculator.
 */

import {
  InventoryManager,
  classifyProduct,
  calculateFinancialAdjustment,
  runCapstoneDemo,
  capstoneExpectedOutput
} from "./inventory.js";

export class DashboardManager {
  constructor(consoleInstance, inventoryManager = new InventoryManager()) {
    this.console = consoleInstance;
    this.inventory = inventoryManager;

    // Filters and sorting state
    this.searchQuery = "";
    this.categoryFilter = "all";
    this.sortBy = "name-asc";

    // Financial adjustment state
    this.discountPercent = 0;
    this.taxPercent = 0;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // Add product form submission
    const form = document.getElementById("form-add-product");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddProduct();
      });
    }

    // Add via Prompt button
    const btnPrompt = document.getElementById("btn-add-prompt");
    if (btnPrompt) {
      btnPrompt.addEventListener("click", () => {
        this.handleAddViaPrompt();
      });
    }

    // Search input
    const searchInput = document.getElementById("input-product-search");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        this.searchQuery = e.target.value;
        this.renderTable();
      });
    }

    // Category filter dropdown
    const catSelect = document.getElementById("select-category-filter");
    if (catSelect) {
      catSelect.addEventListener("change", (e) => {
        this.categoryFilter = e.target.value;
        this.renderTable();
      });
    }

    // Sort dropdown
    const sortSelect = document.getElementById("select-product-sort");
    if (sortSelect) {
      sortSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderTable();
      });
    }

    // Reset inventory button
    const btnReset = document.getElementById("btn-reset-inventory");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (window.confirm("Reset inventory to original demo dataset (Laptop $800, Mouse $25)?")) {
          this.inventory.reset();
          this.console.info("Inventory reset to default demonstration records.");
          this.render();
        }
      });
    }

    // Run Capstone Demo button
    const btnRunDemo = document.getElementById("btn-run-capstone-demo");
    if (btnRunDemo) {
      btnRunDemo.addEventListener("click", () => {
        this.runDemo();
      });
    }

    // Financial adjustment inputs
    const discountInput = document.getElementById("input-calc-discount");
    const taxInput = document.getElementById("input-calc-tax");

    if (discountInput) {
      discountInput.addEventListener("input", (e) => {
        this.discountPercent = Number(e.target.value) || 0;
        this.renderFinancials();
      });
    }

    if (taxInput) {
      taxInput.addEventListener("input", (e) => {
        this.taxPercent = Number(e.target.value) || 0;
        this.renderFinancials();
      });
    }
  }

  handleAddProduct() {
    const nameInput = document.getElementById("input-product-name");
    const priceInput = document.getElementById("input-product-price");
    const errorBanner = document.getElementById("product-form-error");

    if (!nameInput || !priceInput) return;

    try {
      const added = this.inventory.addProduct(nameInput.value, priceInput.value);
      if (errorBanner) {
        errorBanner.classList.add("hidden");
        errorBanner.textContent = "";
      }

      nameInput.value = "";
      priceInput.value = "";

      this.console.success(`Added product: "${added.name}" ($${added.price}) [Category: ${added.category}]`);
      this.render();
    } catch (err) {
      if (errorBanner) {
        errorBanner.classList.remove("hidden");
        errorBanner.textContent = err.message;
      }
      this.console.error(`Failed to add product: ${err.message}`);
    }
  }

  handleAddViaPrompt() {
    const rawName = window.prompt("Enter Product Name (e.g. 'Monitor'):");
    if (rawName === null) return; // User cancelled

    const rawPrice = window.prompt("Enter Product Price ($):", "150");
    if (rawPrice === null) return; // User cancelled

    try {
      const added = this.inventory.addProduct(rawName, rawPrice);
      this.console.success(
        `Added via browser prompt: "${added.name}" ($${added.price}) [Category: ${added.category}]`
      );
      this.render();
    } catch (err) {
      window.alert(`Validation Error: ${err.message}`);
      this.console.error(`Prompt input rejected: ${err.message}`);
    }
  }

  handleRemoveProduct(id, name) {
    if (window.confirm(`Are you sure you want to delete "${name}" from inventory?`)) {
      const removed = this.inventory.removeProduct(id);
      if (removed) {
        this.console.warn(`Product "${name}" deleted.`);
        this.render();
      }
    }
  }

  runDemo() {
    this.console.clear();
    this.console.setExpectedOutput(capstoneExpectedOutput);
    this.console.info("Running deterministic Capstone Inventory demonstration...");

    const demo = runCapstoneDemo({ name: "Monitor", price: 150 });
    this.console.displayOutput(demo.rawOutput);

    // Synchronize active inventory to match demo state
    this.inventory.reset();
    this.inventory.addProduct("Monitor", 150);
    this.render();

    this.console.success("Capstone demonstration executed. Total verified at $975.");
  }

  render() {
    this.renderTable();
    this.renderAnalytics();
    this.renderFinancials();
  }

  renderTable() {
    const tbody = document.getElementById("inventory-table-body");
    const countBadge = document.getElementById("inventory-count-badge");
    if (!tbody) return;

    const filtered = this.inventory.filterAndSort({
      search: this.searchQuery,
      category: this.categoryFilter,
      sortBy: this.sortBy
    });

    if (countBadge) {
      countBadge.textContent = `${filtered.length} items`;
    }

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr class="table-empty-row">
          <td colspan="4" class="text-center py-6 text-muted">
            No products match the selected criteria.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = filtered
      .map(
        (product) => `
        <tr class="table-row-product" data-id="${product.id}">
          <td class="font-medium text-white">${this.escapeHtml(product.name)}</td>
          <td class="font-mono text-emerald">$${product.price.toFixed(2)}</td>
          <td>
            <span class="badge badge-cat badge-cat-${product.category.toLowerCase()}">
              ${product.category}
            </span>
          </td>
          <td class="text-right">
            <button class="btn-action-delete" data-id="${product.id}" data-name="${this.escapeHtml(product.name)}" title="Remove Product">
              Delete
            </button>
          </td>
        </tr>
      `
      )
      .join("");

    // Bind delete events dynamically
    tbody.querySelectorAll(".btn-action-delete").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");
        this.handleRemoveProduct(id, name);
      });
    });
  }

  renderAnalytics() {
    const analytics = this.inventory.getAnalytics();

    const elCount = document.getElementById("kpi-total-products");
    const elValue = document.getElementById("kpi-total-value");
    const elAvg = document.getElementById("kpi-average-price");
    const elHighLow = document.getElementById("kpi-high-low");
    const elAffordable = document.getElementById("kpi-affordable-count");
    const elPremium = document.getElementById("kpi-premium-count");
    const elReports = document.getElementById("kpi-formatted-reports");

    if (elCount) elCount.textContent = analytics.totalProducts;
    if (elValue) elValue.textContent = `$${analytics.totalInventoryValue.toLocaleString()}`;
    if (elAvg) elAvg.textContent = `$${analytics.averageProductPrice.toFixed(2)}`;

    if (elHighLow) {
      if (analytics.highestPriced && analytics.lowestPriced) {
        elHighLow.textContent = `High: $${analytics.highestPriced.price} / Low: $${analytics.lowestPriced.price}`;
      } else {
        elHighLow.textContent = "N/A";
      }
    }

    if (elAffordable) {
      elAffordable.textContent = `${analytics.affordableProducts.length} items (${analytics.affordableItemNames.join(", ") || "None"})`;
    }

    if (elPremium) {
      elPremium.textContent = `${analytics.premiumProductCount} items`;
    }

    if (elReports) {
      elReports.textContent = analytics.formattedReportList.length
        ? analytics.formattedReportList.join(" | ")
        : "None";
    }
  }

  renderFinancials() {
    const analytics = this.inventory.getAnalytics();
    const baseSubtotal = analytics.totalInventoryValue;

    try {
      const calc = calculateFinancialAdjustment(baseSubtotal, {
        discountPercent: this.discountPercent,
        taxPercent: this.taxPercent
      });

      const elSubtotal = document.getElementById("fin-subtotal");
      const elDiscountAmt = document.getElementById("fin-discount-amount");
      const elDiscSub = document.getElementById("fin-discounted-subtotal");
      const elTaxAmt = document.getElementById("fin-tax-amount");
      const elTotal = document.getElementById("fin-final-total");

      if (elSubtotal) elSubtotal.textContent = `$${calc.originalSubtotal.toFixed(2)}`;
      if (elDiscountAmt) elDiscountAmt.textContent = `-$${calc.discountAmount.toFixed(2)}`;
      if (elDiscSub) elDiscSub.textContent = `$${calc.discountedSubtotal.toFixed(2)}`;
      if (elTaxAmt) elTaxAmt.textContent = `+$${calc.taxAmount.toFixed(2)}`;
      if (elTotal) elTotal.textContent = `$${calc.finalTotal.toFixed(2)}`;
    } catch (err) {
      // Input out of range
      this.console.warn(`Financial Calculation: ${err.message}`);
    }
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}
