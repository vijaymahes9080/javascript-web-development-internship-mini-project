/**
 * JS PRACTICAL STUDIO - Capstone Inventory Intelligence Engine
 * Handles product management, classification, financial analytics, and deterministic execution.
 */

export const INITIAL_PRODUCTS = [
  { id: "prod-1", name: "Laptop", price: 800 },
  { id: "prod-2", name: "Mouse", price: 25 }
];

/**
 * Classify a product based on strict price boundaries.
 * Rules:
 * - Budget: price < 50
 * - Standard: price >= 50 && price < 200
 * - Premium: price >= 200
 */
export function classifyProduct(price) {
  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return "Invalid";
  }

  // Meaningful use of if...else to derive category token
  let categoryKey;
  if (numericPrice < 50) {
    categoryKey = "BUDGET_TIER";
  } else if (numericPrice < 200) {
    categoryKey = "STANDARD_TIER";
  } else {
    categoryKey = "PREMIUM_TIER";
  }

  // Switch statement to map category token to human label
  switch (categoryKey) {
    case "BUDGET_TIER":
      return "Budget";
    case "STANDARD_TIER":
      return "Standard";
    case "PREMIUM_TIER":
      return "Premium";
    default:
      return "Unclassified";
  }
}

/**
 * Validates product creation parameters.
 * Returns { valid: boolean, error?: string, sanitized?: { name: string, price: number } }
 */
export function validateProductInput(rawName, rawPrice) {
  if (rawName === null || rawName === undefined) {
    return { valid: false, error: "Product name is required." };
  }

  const trimmedName = String(rawName).trim();
  if (trimmedName.length === 0) {
    return { valid: false, error: "Product name cannot be blank." };
  }

  if (rawPrice === null || rawPrice === undefined || rawPrice === "") {
    return { valid: false, error: "Product price is required." };
  }

  const price = Number(rawPrice);
  if (Number.isNaN(price)) {
    return { valid: false, error: "Product price must be a valid number." };
  }

  if (price <= 0) {
    return { valid: false, error: "Product price must be greater than zero." };
  }

  // Round price to 2 decimal places to avoid floating point anomalies
  const roundedPrice = Math.round(price * 100) / 100;

  return {
    valid: true,
    sanitized: {
      name: trimmedName,
      price: roundedPrice
    }
  };
}

/**
 * Calculate financial adjustments (discounts and taxes) on a given subtotal.
 * Pure function, does not mutate inventory items.
 */
export function calculateFinancialAdjustment(subtotal, { discountPercent = 0, taxPercent = 0 } = {}) {
  const baseSubtotal = Number(subtotal);
  if (Number.isNaN(baseSubtotal) || baseSubtotal < 0) {
    throw new Error("Invalid subtotal for financial calculations.");
  }

  const discountRate = Number(discountPercent);
  const taxRate = Number(taxPercent);

  if (Number.isNaN(discountRate) || discountRate < 0 || discountRate > 100) {
    throw new Error("Discount percentage must be between 0% and 100%.");
  }

  if (Number.isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
    throw new Error("Tax percentage must be between 0% and 100%.");
  }

  // Regular function for discount computation
  function computeDiscount(amount, percent) {
    return Math.round(amount * (percent / 100) * 100) / 100;
  }

  // Arrow function for tax computation
  const computeTax = (amount, percent) => Math.round(amount * (percent / 100) * 100) / 100;

  const discountAmount = computeDiscount(baseSubtotal, discountRate);
  const discountedSubtotal = Math.round((baseSubtotal - discountAmount) * 100) / 100;
  const taxAmount = computeTax(discountedSubtotal, taxRate);
  const finalTotal = Math.round((discountedSubtotal + taxAmount) * 100) / 100;

  return {
    originalSubtotal: baseSubtotal,
    discountRate,
    discountAmount,
    discountedSubtotal,
    taxRate,
    taxAmount,
    finalTotal
  };
}

/**
 * Inventory Intelligence Data Store
 */
export class InventoryManager {
  constructor(initialItems = INITIAL_PRODUCTS) {
    this.products = [];
    this.nextId = 1;
    this.load(initialItems);
  }

  load(items) {
    this.products = items.map((item, idx) => ({
      id: item.id || `prod-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      name: item.name,
      price: item.price,
      category: classifyProduct(item.price)
    }));
  }

  reset() {
    this.load(INITIAL_PRODUCTS);
    return this.products;
  }

  getAll() {
    return [...this.products];
  }

  addProduct(name, price) {
    const validation = validateProductInput(name, price);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const newProduct = {
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: validation.sanitized.name,
      price: validation.sanitized.price,
      category: classifyProduct(validation.sanitized.price)
    };

    this.products.push(newProduct);
    return newProduct;
  }

  removeProduct(id) {
    const initialLen = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < initialLen;
  }

  filterAndSort({ search = "", category = "all", sortBy = "name-asc" } = {}) {
    let result = [...this.products];

    // Filter by search query
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Filter by category
    if (category && category !== "all") {
      result = result.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    // Sort products
    result.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    return result;
  }

  /**
   * Analytics Engine using correct array methods:
   * - forEach()
   * - filter()
   * - map()
   * - reduce()
   */
  getAnalytics() {
    const count = this.products.length;

    // reduce() for total value
    const totalValue = this.products.reduce((acc, curr) => acc + curr.price, 0);
    const roundedTotalValue = Math.round(totalValue * 100) / 100;

    // Average price
    const averagePrice = count > 0 ? Math.round((totalValue / count) * 100) / 100 : 0;

    // Highest and lowest
    let highest = null;
    let lowest = null;
    if (count > 0) {
      highest = this.products.reduce((prev, curr) => (curr.price > prev.price ? curr : prev), this.products[0]);
      lowest = this.products.reduce((prev, curr) => (curr.price < prev.price ? curr : prev), this.products[0]);
    }

    // filter() for affordable products below $200
    const affordableProducts = this.products.filter((p) => p.price < 200);

    // filter() for premium products (>= $200)
    const premiumProducts = this.products.filter((p) => p.price >= 200);

    // map() for formatted report tags: "NAME: $PRICE"
    const formattedReports = this.products.map((p) => `${p.name.toUpperCase()}: $${p.price}`);

    return {
      totalProducts: count,
      totalInventoryValue: roundedTotalValue,
      averageProductPrice: averagePrice,
      highestPriced: highest,
      lowestPriced: lowest,
      affordableProducts,
      affordableItemNames: affordableProducts.map((p) => p.name),
      premiumProductCount: premiumProducts.length,
      formattedReportList: formattedReports
    };
  }
}

/**
 * Deterministic Capstone Demonstration Executor
 * Adds Monitor ($150) to initial inventory and outputs exact specification lines.
 */
export function runCapstoneDemo(demoInput = { name: "Monitor", price: 150 }) {
  const manager = new InventoryManager();

  // Add deterministic input
  manager.addProduct(demoInput.name, demoInput.price);

  const lines = [];
  lines.push("--- Initializing Inventory System ---");
  lines.push(`[Demo Input: ${demoInput.name}, $${demoInput.price}]`);
  lines.push("");
  lines.push("--- Processing Inventory Roster ---");

  // forEach() demonstration
  manager.getAll().forEach((product) => {
    lines.push(`Item: ${product.name} ($${product.price}) -> Category: ${product.category}`);
  });

  lines.push("");
  lines.push("--- Financial Analytics ---");

  const analytics = manager.getAnalytics();
  const formatArrayWithSpaces = (arr) => JSON.stringify(arr).replace(/","/g, '", "');
  lines.push(`Total Products: ${analytics.totalProducts}`);
  lines.push(`Total Inventory Value: $${analytics.totalInventoryValue}`);
  lines.push(`Affordable Items (Under $200): ${formatArrayWithSpaces(analytics.affordableItemNames)}`);
  lines.push(`Formatted Report List: ${formatArrayWithSpaces(analytics.formattedReportList)}`);

  return {
    rawOutput: lines.join("\n"),
    data: {
      roster: manager.getAll(),
      analytics
    }
  };
}

export const capstoneExpectedOutput = `--- Initializing Inventory System ---
[Demo Input: Monitor, $150]

--- Processing Inventory Roster ---
Item: Laptop ($800) -> Category: Premium
Item: Mouse ($25) -> Category: Budget
Item: Monitor ($150) -> Category: Standard

--- Financial Analytics ---
Total Products: 3
Total Inventory Value: $975
Affordable Items (Under $200): ["Mouse", "Monitor"]
Formatted Report List: ["LAPTOP: $800", "MOUSE: $25", "MONITOR: $150"]`;
