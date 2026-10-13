# JS PRACTICAL STUDIO
### *Learn. Execute. Verify. Build.*

A modern developer workspace for learning core JavaScript concepts and running an inventory intelligence platform. Includes interactive practical assignments (A1 through A6), automated Node.js and in-browser testing, deterministic execution verification, and a complete capstone project.

---

## 🚀 Features & Architecture

### 1. Four Primary Workspace Areas
- **Assignment Navigator**: Collapsible sidebar displaying Assignments 1–6 and the Capstone with live completion status indicators.
- **Learning Panel**: Contextual learning cards with objectives, required concepts, task descriptions, interactive parameter controls, validation rules, and syntax-highlighted code.
- **Execution Console**: Terminal emulator displaying real output lines, execution timestamps, error handling, and a line-by-line **Diff Inspector** comparing actual output against curriculum expected output.
- **Progress Panel**: Real-time progress bar tracking completed exercises and an automated test matrix reporting on all 16 test suites.

### 2. Six Core Practical Assignments
1. **Assignment 1 — Variables and Data Types (`A1`)**: Declarations (`var`, `let`, `const`), data types (`string`, `number`, `boolean`, `object`), `typeof` evaluations, `JSON.stringify()`, and why `typeof [] === 'object'`.
2. **Assignment 2 — Operators and Input Handling (`A2`)**: Interactive bill and tip calculator, explicit numeric conversion with `Number()`, rejection of invalid/negative inputs, and precision rounding.
3. **Assignment 3 — Conditional Logic (`A3`)**: Grade evaluation (0–100 -> A/B/C/D/F) using `switch` on derived keys, input validation with `if...else`, and pass/fail ternary operator with configurable threshold.
4. **Assignment 4 — Loop Control (`A4`)**: `for` loop multiplication table of 5 (1..5), `while` loop search for the first number > 10 divisible by 6 using `break` (found: 12), and `do...while` loop skipping values 3 and 5 using `continue`.
5. **Assignment 5 — Functions and Scope (`A5`)**: Standard function with default parameters (5 x 4 = 20), arrow function (10 x 3 = 30), block scope isolation, and a controlled, safely intercepted `ReferenceError`.
6. **Assignment 6 — Arrays and Objects (`A6`)**: Array iteration methods on product objects: `forEach()` for roster listing, `filter()` for prices < $50, and `map()` for formatted uppercase report tags.

### 3. Capstone Project — Inventory Intelligence Platform (`CP`)
- **Initial Inventory**: Laptop ($800), Mouse ($25).
- **Product Registration**: Accessible form input and browser `prompt()` entry with validation (rejects blank names, zero/negative prices, and non-numeric values).
- **Product Classification**:
  - `Budget`: Price < $50
  - `Standard`: $50 &le; Price < $200
  - `Premium`: Price &ge; $200
- **Inventory Workspace**: Live name search, category filtering, multi-field sorting, product removal with confirmation dialog, and reset to demo data.
- **Analytics Engine**: Real-time calculations using `reduce()`, `filter()`, `map()`, and `forEach()`: Total Products, Total Inventory Value, Average Price, Price Extremes, Affordable Items (< $200), and Premium Items count.
- **Financial Calculator**: Non-mutating discount and tax percentage calculator displaying Subtotal, Discount, Discounted Subtotal, Tax, and Final Total.
- **Deterministic Capstone Demonstration**: Automatically adds Monitor ($150) and verifies exact inventory value: **`800 + 25 + 150 = $975`**.

---

## 🛠️ Project Structure

```text
js-practical-studio/
├── index.html                   # Semantic HTML5 4-panel developer studio UI
├── styles/
│   └── main.css                 # Design system tokens, dark theme, responsive grid
├── scripts/
│   ├── assignments.js           # Core pure functions for Assignments 1-6 & registry
│   ├── console.js               # Terminal emulator & side-by-side diff inspector
│   ├── inventory.js             # Capstone InventoryManager, classification, analytics
│   ├── dashboard.js             # Capstone DOM controller, forms, filters, KPIs
│   └── main.js                  # App bootstrap, navigation, in-browser test suite
├── tests/
│   └── assignments.test.js      # 16 automated tests using node:test and node:assert
├── package.json                 # ES module definition, test and start scripts
└── README.md                    # Documentation
```

---

## 🧪 Testing & Verification

### Run CLI Automated Tests (Node.js Native Test Runner)
```bash
npm test
```
Or directly:
```bash
node --test tests/assignments.test.js
```

### Test Coverage (16 Test Suites)
1. Variable values and types (Alice, 25, true, array `typeof` object)
2. Tip and total calculations ($100 at 15% -> $15 tip, $115 total)
3. Invalid numeric input handling (negative bill, non-numeric, tip > 100%)
4. Grade selection and pass/fail status (90-100 A, 80-89 B, 70-79 C, 60-69 D, 0-59 F)
5. Loop results and termination (table of 5, while search 12, do-while skipping 3 & 5)
6. Rectangle area calculations (standard default 20, arrow custom 30)
7. Block scope error handling (catches `ReferenceError: blockVar is not defined`)
8. Array filtering and mapping (`forEach`, `filter < 50`, `map` uppercase tags)
9. Product insertion into inventory (name, price, dynamic category assignment)
10. Inventory totals and analytics (verifies demo total of **$975**)
11. Category boundaries at 49.99, 50, 199.99, and 200
12. Empty inventory handling (0 count, $0 total, null extremes)
13. Invalid product submission handling (blank names, zero/negative prices)
14. Product search and sorting (case-insensitive name match, asc/desc price sorting)
15. Product removal and reset (item deletion by ID, reset back to initial items)
16. Tax and discount calculations (discount and tax computation, non-mutating)

---

## 🌐 Running Locally in Browser

### Option 1: Direct File Access
Simply open `index.html` in any modern web browser:
```bash
# Windows
start index.html
```

### Option 2: Local HTTP Server
```bash
npm start
```
Then navigate to: `http://localhost:3000`
