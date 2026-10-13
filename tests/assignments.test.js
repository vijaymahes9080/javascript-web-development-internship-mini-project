import { test, describe } from "node:test";
import assert from "node:assert/strict";

import {
  runAssignment1,
  calculateBillAndTip,
  evaluateGrade,
  runLoopsDemo,
  calculateRectangleAreaStandard,
  calculateRectangleAreaArrow,
  runFunctionsAndScope,
  runArrayMethods
} from "../scripts/assignments.js";

import {
  classifyProduct,
  validateProductInput,
  calculateFinancialAdjustment,
  InventoryManager,
  runCapstoneDemo,
  capstoneExpectedOutput
} from "../scripts/inventory.js";

describe("JS Practical Studio - Complete Automated Test Suite", () => {
  // 1. Variable values and types
  test("1. Variable values and types (Assignment 1)", () => {
    const result = runAssignment1();
    assert.equal(result.data.name, "Alice");
    assert.equal(result.data.age, 25);
    assert.equal(result.data.isEmployed, true);
    assert.deepEqual(result.data.skills, ["HTML", "CSS", "JavaScript"]);

    // Verify types
    assert.equal(result.data.types.name, "string");
    assert.equal(result.data.types.age, "number");
    assert.equal(result.data.types.isEmployed, "boolean");
    assert.equal(result.data.types.skills, "object"); // Array typeof is 'object'

    assert.ok(result.rawOutput.includes("Name: Alice (Type: string)"));
    assert.ok(result.rawOutput.includes('Skills: ["HTML","CSS","JavaScript"] (Type: object)'));
    assert.ok(result.explanation.includes("Array.prototype"));
  });

  // 2. Tip and total calculations
  test("2. Tip and total calculations (Assignment 2)", () => {
    const result = calculateBillAndTip({ billAmount: 100, tipPercentage: 15 });
    assert.equal(result.data.subtotal, 100);
    assert.equal(result.data.tipPercentage, 15);
    assert.equal(result.data.tipAmount, 15);
    assert.equal(result.data.totalAmount, 115);

    assert.ok(result.rawOutput.includes("Subtotal: $100"));
    assert.ok(result.rawOutput.includes("Tip Percentage: 15%"));
    assert.ok(result.rawOutput.includes("Calculated Tip: $15"));
    assert.ok(result.rawOutput.includes("Total Amount to Pay: $115"));

    // Precision calculation without floating point glitches
    const resDecimal = calculateBillAndTip({ billAmount: 45.5, tipPercentage: 18 });
    assert.equal(resDecimal.data.tipAmount, 8.19);
    assert.equal(resDecimal.data.totalAmount, 53.69);
  });

  // 3. Invalid numeric input
  test("3. Invalid numeric input handling (Assignment 2)", () => {
    assert.throws(() => calculateBillAndTip({ billAmount: -50, tipPercentage: 15 }), /negative/i);
    assert.throws(() => calculateBillAndTip({ billAmount: "abc", tipPercentage: 15 }), /valid number/i);
    assert.throws(() => calculateBillAndTip({ billAmount: "", tipPercentage: 15 }), /empty/i);
    assert.throws(() => calculateBillAndTip({ billAmount: 100, tipPercentage: -5 }), /between 0% and 100%/i);
    assert.throws(() => calculateBillAndTip({ billAmount: 100, tipPercentage: 120 }), /between 0% and 100%/i);
    assert.throws(() => calculateBillAndTip(null), /Input must be provided/i);
  });

  // 4. Grade selection and pass/fail status
  test("4. Grade selection and pass/fail status (Assignment 3)", () => {
    // Demo value
    const demo = evaluateGrade(85, 60);
    assert.equal(demo.data.grade, "B");
    assert.equal(demo.data.status, "Passed");

    // Boundary matrix tests
    assert.equal(evaluateGrade(100).data.grade, "A");
    assert.equal(evaluateGrade(90).data.grade, "A");
    assert.equal(evaluateGrade(89).data.grade, "B");
    assert.equal(evaluateGrade(80).data.grade, "B");
    assert.equal(evaluateGrade(79).data.grade, "C");
    assert.equal(evaluateGrade(70).data.grade, "C");
    assert.equal(evaluateGrade(69).data.grade, "D");
    assert.equal(evaluateGrade(60).data.grade, "D");
    assert.equal(evaluateGrade(59).data.grade, "F");
    assert.equal(evaluateGrade(0).data.grade, "F");

    // Pass / Fail status checks
    assert.equal(evaluateGrade(60, 60).data.status, "Passed");
    assert.equal(evaluateGrade(59, 60).data.status, "Failed");

    // Configurable threshold
    assert.equal(evaluateGrade(70, 75).data.status, "Failed");
    assert.equal(evaluateGrade(75, 75).data.status, "Passed");

    // Invalid score boundaries
    assert.throws(() => evaluateGrade(-1), /between 0 and 100/i);
    assert.throws(() => evaluateGrade(101), /between 0 and 100/i);
    assert.throws(() => evaluateGrade("not-a-number"), /valid number/i);
    assert.throws(() => evaluateGrade(""), /empty/i);
  });

  // 5. Loop results and termination
  test("5. Loop results and termination (Assignment 4)", () => {
    const result = runLoopsDemo();

    // For loop check
    assert.deepEqual(result.data.multiplicationTable, [5, 10, 15, 20, 25]);
    assert.ok(result.rawOutput.includes("5 x 1 = 5"));
    assert.ok(result.rawOutput.includes("5 x 5 = 25"));

    // While loop with break check
    assert.equal(result.data.foundNumber, 12);
    assert.ok(result.rawOutput.includes("Found: 12"));

    // Do...while with continue check
    assert.deepEqual(result.data.doWhileProcessed, [1, 2, 4, 6]);
    assert.deepEqual(result.data.doWhileSkipped, [3, 5]);
    assert.ok(result.rawOutput.includes("Value 3: Skipped (continue)"));
    assert.ok(result.rawOutput.includes("Value 5: Skipped (continue)"));
  });

  // 6. Rectangle area calculations
  test("6. Rectangle area calculations (Assignment 5)", () => {
    // Standard function default vs custom
    assert.equal(calculateRectangleAreaStandard(), 20); // 5 x 4
    assert.equal(calculateRectangleAreaStandard(8, 2), 16);

    // Arrow function default vs custom
    assert.equal(calculateRectangleAreaArrow(), 20);
    assert.equal(calculateRectangleAreaArrow(10, 3), 30);
  });

  // 7. Block scope error handling
  test("7. Block scope error handling (Assignment 5)", () => {
    const result = runFunctionsAndScope();
    assert.equal(result.data.standardArea, 20);
    assert.equal(result.data.arrowArea, 30);
    assert.ok(result.data.scopeErrorText.includes("ReferenceError"));
    assert.ok(result.data.scopeErrorText.includes("blockVar is not defined"));
    assert.ok(result.rawOutput.includes("Scope Test Error: ReferenceError: blockVar is not defined"));
  });

  // 8. Array filtering and mapping
  test("8. Array filtering and mapping (Assignment 6)", () => {
    const result = runArrayMethods();

    // forEach verification
    assert.equal(result.data.all.length, 3);
    assert.ok(result.rawOutput.includes("Item: Laptop - Price: $800"));

    // filter verification: items under $50
    assert.equal(result.data.filtered.length, 2);
    assert.deepEqual(
      result.data.filtered.map((p) => p.name),
      ["Mouse", "Keyboard"]
    );
    assert.ok(result.rawOutput.includes("Mouse: $25"));
    assert.ok(result.rawOutput.includes("Keyboard: $45"));

    // map verification: uppercase tags
    assert.deepEqual(result.data.mapped, [
      "LAPTOP costs $800",
      "MOUSE costs $25",
      "KEYBOARD costs $45"
    ]);
  });

  // 9. Product insertion
  test("9. Product insertion into inventory (Capstone)", () => {
    const manager = new InventoryManager();
    assert.equal(manager.getAll().length, 2);

    const newProd = manager.addProduct("Monitor", 150);
    assert.equal(newProd.name, "Monitor");
    assert.equal(newProd.price, 150);
    assert.equal(newProd.category, "Standard");

    assert.equal(manager.getAll().length, 3);
    assert.equal(manager.getAll()[2].name, "Monitor");
  });

  // 10. Inventory totals
  test("10. Inventory totals and analytics (Capstone demo $975)", () => {
    const demo = runCapstoneDemo({ name: "Monitor", price: 150 });
    const analytics = demo.data.analytics;

    // 800 + 25 + 150 = 975
    assert.equal(analytics.totalProducts, 3);
    assert.equal(analytics.totalInventoryValue, 975);
    assert.equal(analytics.averageProductPrice, 325);
    assert.deepEqual(analytics.affordableItemNames, ["Mouse", "Monitor"]);
    assert.deepEqual(analytics.formattedReportList, [
      "LAPTOP: $800",
      "MOUSE: $25",
      "MONITOR: $150"
    ]);

    assert.equal(demo.rawOutput.trim(), capstoneExpectedOutput.trim());
  });

  // 11. Category boundaries at 49.99, 50, 199.99, and 200
  test("11. Category boundaries at 49.99, 50, 199.99, and 200 (Capstone)", () => {
    // < 50: Budget
    assert.equal(classifyProduct(49.99), "Budget");
    assert.equal(classifyProduct(0.01), "Budget");

    // 50 to < 200: Standard
    assert.equal(classifyProduct(50), "Standard");
    assert.equal(classifyProduct(199.99), "Standard");

    // >= 200: Premium
    assert.equal(classifyProduct(200), "Premium");
    assert.equal(classifyProduct(200.01), "Premium");
    assert.equal(classifyProduct(1500), "Premium");
  });

  // 12. Empty inventory handling
  test("12. Empty inventory handling (Capstone)", () => {
    const manager = new InventoryManager([]);
    const analytics = manager.getAnalytics();

    assert.equal(analytics.totalProducts, 0);
    assert.equal(analytics.totalInventoryValue, 0);
    assert.equal(analytics.averageProductPrice, 0);
    assert.equal(analytics.highestPriced, null);
    assert.equal(analytics.lowestPriced, null);
    assert.deepEqual(analytics.affordableProducts, []);
    assert.equal(analytics.premiumProductCount, 0);
    assert.deepEqual(analytics.formattedReportList, []);
  });

  // 13. Invalid product submission
  test("13. Invalid product submission handling (Capstone)", () => {
    const manager = new InventoryManager();

    // Blank name
    assert.throws(() => manager.addProduct("", 100), /name cannot be blank/i);
    assert.throws(() => manager.addProduct("   ", 100), /name cannot be blank/i);

    // Invalid / zero / negative price
    assert.throws(() => manager.addProduct("Headphones", 0), /greater than zero/i);
    assert.throws(() => manager.addProduct("Headphones", -10), /greater than zero/i);
    assert.throws(() => manager.addProduct("Headphones", "abc"), /valid number/i);
    assert.throws(() => manager.addProduct("Headphones", ""), /price is required/i);

    // Inventory must remain uncorrupted
    assert.equal(manager.getAll().length, 2);
  });

  // 14. Search and sorting
  test("14. Product search and sorting (Capstone)", () => {
    const manager = new InventoryManager();
    manager.addProduct("Monitor", 150);
    manager.addProduct("Desk Mat", 30);

    // Search
    const searchRes = manager.filterAndSort({ search: "mo" });
    assert.equal(searchRes.length, 2); // Mouse, Monitor

    // Category filter
    const budgetRes = manager.filterAndSort({ category: "Budget" });
    assert.equal(budgetRes.length, 2); // Mouse ($25), Desk Mat ($30)

    // Sort by price asc
    const sortedPriceAsc = manager.filterAndSort({ sortBy: "price-asc" });
    assert.equal(sortedPriceAsc[0].name, "Mouse"); // $25
    assert.equal(sortedPriceAsc[sortedPriceAsc.length - 1].name, "Laptop"); // $800

    // Sort by name desc
    const sortedNameDesc = manager.filterAndSort({ sortBy: "name-desc" });
    assert.equal(sortedNameDesc[0].name, "Mouse");
    assert.equal(sortedNameDesc[sortedNameDesc.length - 1].name, "Desk Mat");
  });

  // 15. Product removal and reset
  test("15. Product removal and reset (Capstone)", () => {
    const manager = new InventoryManager();
    const items = manager.getAll();
    const laptopId = items[0].id;

    // Remove
    const removed = manager.removeProduct(laptopId);
    assert.equal(removed, true);
    assert.equal(manager.getAll().length, 1);
    assert.equal(manager.getAll()[0].name, "Mouse");

    // Reset back to initial
    manager.reset();
    assert.equal(manager.getAll().length, 2);
    assert.equal(manager.getAll()[0].name, "Laptop");
    assert.equal(manager.getAll()[1].name, "Mouse");
  });

  // 16. Tax and discount calculations
  test("16. Tax and discount calculations (Capstone)", () => {
    const subtotal = 1000;
    const calc = calculateFinancialAdjustment(subtotal, { discountPercent: 10, taxPercent: 5 });

    // 10% discount on 1000 = 100 => discounted subtotal 900
    assert.equal(calc.discountAmount, 100);
    assert.equal(calc.discountedSubtotal, 900);

    // 5% tax on 900 = 45 => final total 945
    assert.equal(calc.taxAmount, 45);
    assert.equal(calc.finalTotal, 945);

    // Invalid percentages
    assert.throws(() => calculateFinancialAdjustment(100, { discountPercent: -5 }), /between 0% and 100%/i);
    assert.throws(() => calculateFinancialAdjustment(100, { taxPercent: 120 }), /between 0% and 100%/i);
  });
});
