/**
 * JS PRACTICAL STUDIO - Core Assignment Logic
 * Pure, deterministic, tested JavaScript modules representing Assignments 1-6.
 */

// ==========================================
// ASSIGNMENT 1: VARIABLES AND DATA TYPES
// ==========================================

export function runAssignment1() {
  var name = "Alice";
  let age = 25;
  const isEmployed = true;
  const skills = ["HTML", "CSS", "JavaScript"];

  const nameType = typeof name;
  const ageType = typeof age;
  const isEmployedType = typeof isEmployed;
  const skillsType = typeof skills;
  const skillsFormatted = JSON.stringify(skills);

  const lines = [
    `Name: ${name} (Type: ${nameType})`,
    `Age: ${age} (Type: ${ageType})`,
    `IsEmployed: ${isEmployed} (Type: ${isEmployedType})`,
    `Skills: ${skillsFormatted} (Type: ${skillsType})`
  ];

  return {
    rawOutput: lines.join("\n"),
    data: {
      name,
      age,
      isEmployed,
      skills,
      types: {
        name: nameType,
        age: ageType,
        isEmployed: isEmployedType,
        skills: skillsType
      }
    },
    explanation:
      "In JavaScript, typeof skills returns 'object' because arrays are not a separate primitive type; they are specialized exotic objects that inherit from Array.prototype with numeric indices and an automatic length property."
  };
}

// ==========================================
// ASSIGNMENT 2: OPERATORS AND INPUT HANDLING
// ==========================================

export function calculateBillAndTip(input) {
  if (input === null || input === undefined) {
    throw new Error("Input must be provided.");
  }

  const rawBill = typeof input === "object" ? input.billAmount : input;
  const rawTip = typeof input === "object" ? input.tipPercentage : arguments[1];

  if (rawBill === "" || rawBill === null || rawBill === undefined) {
    throw new Error("Bill amount cannot be empty.");
  }
  if (rawTip === "" || rawTip === null || rawTip === undefined) {
    throw new Error("Tip percentage cannot be empty.");
  }

  const bill = Number(rawBill);
  const tipPercent = Number(rawTip);

  if (Number.isNaN(bill)) {
    throw new Error("Bill amount must be a valid number.");
  }
  if (Number.isNaN(tipPercent)) {
    throw new Error("Tip percentage must be a valid number.");
  }
  if (bill < 0) {
    throw new Error("Bill amount cannot be negative.");
  }
  if (tipPercent < 0 || tipPercent > 100) {
    throw new Error("Tip percentage must be between 0% and 100%.");
  }

  // Prevent floating point formatting errors
  const tipAmount = Math.round(bill * tipPercent) / 100;
  const totalAmount = Math.round((bill + tipAmount) * 100) / 100;

  const formattedSubtotal = Number.isInteger(bill) ? `$${bill}` : `$${bill.toFixed(2)}`;
  const formattedTipPercent = `${tipPercent}%`;
  const formattedTip = Number.isInteger(tipAmount) ? `$${tipAmount}` : `$${tipAmount.toFixed(2)}`;
  const formattedTotal = Number.isInteger(totalAmount) ? `$${totalAmount}` : `$${totalAmount.toFixed(2)}`;

  const lines = [
    `Subtotal: ${formattedSubtotal}`,
    `Tip Percentage: ${formattedTipPercent}`,
    `Calculated Tip: ${formattedTip}`,
    `Total Amount to Pay: ${formattedTotal}`
  ];

  return {
    rawOutput: lines.join("\n"),
    data: {
      subtotal: bill,
      tipPercentage: tipPercent,
      tipAmount,
      totalAmount
    }
  };
}

// ==========================================
// ASSIGNMENT 3: CONDITIONAL LOGIC
// ==========================================

export function evaluateGrade(rawScore, passingThreshold = 60) {
  if (rawScore === "" || rawScore === null || rawScore === undefined) {
    throw new Error("Score cannot be empty.");
  }

  const score = Number(rawScore);

  if (Number.isNaN(score)) {
    throw new Error("Score must be a valid number.");
  }

  // Input validation with if...else
  if (score < 0 || score > 100) {
    throw new Error("Score must be between 0 and 100.");
  }

  // Derived grade key for switch statement
  let gradeKey;
  if (score >= 90) {
    gradeKey = "GRADE_A";
  } else if (score >= 80) {
    gradeKey = "GRADE_B";
  } else if (score >= 70) {
    gradeKey = "GRADE_C";
  } else if (score >= 60) {
    gradeKey = "GRADE_D";
  } else {
    gradeKey = "GRADE_F";
  }

  let grade;
  switch (gradeKey) {
    case "GRADE_A":
      grade = "A";
      break;
    case "GRADE_B":
      grade = "B";
      break;
    case "GRADE_C":
      grade = "C";
      break;
    case "GRADE_D":
      grade = "D";
      break;
    case "GRADE_F":
      grade = "F";
      break;
    default:
      grade = "Unknown";
  }

  // Ternary operator for pass/fail status
  const status = score >= passingThreshold ? "Passed" : "Failed";

  const lines = [
    `Score: ${score}`,
    `Grade: ${grade}`,
    `Status: ${status}`
  ];

  return {
    rawOutput: lines.join("\n"),
    data: {
      score,
      grade,
      status,
      passingThreshold
    }
  };
}

// ==========================================
// ASSIGNMENT 4: LOOP CONTROL
// ==========================================

export function runLoopsDemo() {
  const lines = [];

  // A. For loop: Multiplication Table of 5 from 1 through 5
  lines.push("--- Multiplication Table of 5 ---");
  for (let i = 1; i <= 5; i++) {
    lines.push(`5 x ${i} = ${5 * i}`);
  }

  lines.push("");

  // B. While loop: First integer > 10 divisible by 6 using break
  lines.push("--- First number > 10 divisible by 6 ---");
  let num = 11;
  let found = null;
  const MAX_SEARCH = 1000; // guardrail
  while (num <= MAX_SEARCH) {
    if (num % 6 === 0) {
      found = num;
      break;
    }
    num++;
  }
  lines.push(`Found: ${found}`);

  lines.push("");

  // C. Do...while loop: Iterate over defined range (1 to 6), skip 3 and 5 using continue
  lines.push("--- Do...While Loop (Range 1-6, Skipping 3 & 5) ---");
  let k = 1;
  const processed = [];
  const skipped = [];
  do {
    if (k === 3 || k === 5) {
      skipped.push(k);
      lines.push(`Value ${k}: Skipped (continue)`);
      k++;
      continue;
    }
    processed.push(k);
    lines.push(`Value ${k}: Processed`);
    k++;
  } while (k <= 6);

  return {
    rawOutput: lines.join("\n"),
    coreSnippetOutput: [
      "--- Multiplication Table of 5 ---",
      "5 x 1 = 5",
      "5 x 2 = 10",
      "5 x 3 = 15",
      "5 x 4 = 20",
      "5 x 5 = 25",
      "",
      "--- First number > 10 divisible by 6 ---",
      "Found: 12"
    ].join("\n"),
    data: {
      multiplicationTable: [5, 10, 15, 20, 25],
      foundNumber: found,
      doWhileProcessed: processed,
      doWhileSkipped: skipped
    }
  };
}

// ==========================================
// ASSIGNMENT 5: FUNCTIONS AND SCOPE
// ==========================================

// Standard function with default parameters
export function calculateRectangleAreaStandard(length = 5, width = 4) {
  return length * width;
}

// Arrow function with default parameters
export const calculateRectangleAreaArrow = (length = 5, width = 4) => length * width;

export function runFunctionsAndScope({ length = 5, width = 4, customLength = 10, customWidth = 3 } = {}) {
  const standardArea = calculateRectangleAreaStandard(length, width);
  const arrowArea = calculateRectangleAreaArrow(customLength, customWidth);

  let scopeErrorText = "";
  try {
    {
      const blockVar = "Declared inside isolated block";
      void blockVar;
    }
    // Attempting to access blockVar outside block creates ReferenceError
    // We execute an isolated block access
    /* eslint-disable no-undef */
    const accessBlockVar = () => blockVar;
    accessBlockVar();
  } catch (err) {
    scopeErrorText = `${err.name}: ${err.message}`;
  }

  const lines = [
    `Standard Function Area (Default ${length} x ${width}): ${standardArea}`,
    `Arrow Function Area (Custom ${customLength} x ${customWidth}): ${arrowArea}`,
    `Scope Test Error: ${scopeErrorText}`
  ];

  return {
    rawOutput: lines.join("\n"),
    data: {
      standardArea,
      arrowArea,
      scopeErrorText
    },
    explanation:
      "Variables declared with 'let' and 'const' possess block scope ({...}). They are kept in the lexical environment of that block and cannot be reached outside, provoking a genuine ReferenceError upon out-of-scope evaluation."
  };
}

// ==========================================
// ASSIGNMENT 6: ARRAYS AND OBJECTS
// ==========================================

export const defaultProductsA6 = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 45 }
];

export function runArrayMethods(products = defaultProductsA6) {
  const lines = [];

  // 1. forEach() to display each product
  lines.push("--- All Products (forEach) ---");
  products.forEach((product) => {
    lines.push(`Item: ${product.name} - Price: $${product.price}`);
  });

  lines.push("");

  // 2. filter() to select products under $50
  lines.push("--- Filtered Products (Price < $50) ---");
  const filtered = products.filter((product) => product.price < 50);
  filtered.forEach((product) => {
    lines.push(`${product.name}: $${product.price}`);
  });

  lines.push("");

  // 3. map() to produce uppercase product report strings
  lines.push("--- Mapped Product Tags (map) ---");
  const mapped = products.map((product) => `${product.name.toUpperCase()} costs $${product.price}`);
  mapped.forEach((tag) => {
    lines.push(tag);
  });

  return {
    rawOutput: lines.join("\n"),
    data: {
      all: products,
      filtered,
      mapped
    }
  };
}

// ==========================================
// ASSIGNMENT REGISTRY DEFINITION
// ==========================================

export const assignmentsData = [
  {
    id: "assignment-1",
    badge: "A1",
    title: "Variables and Data Types",
    objective: "Understand declarations (var, let, const), primitive data types, arrays, and typeof.",
    concepts: ["var / let / const", "Data Types", "typeof Operator", "JSON.stringify()", "Array-as-Object"],
    description:
      "Declare variables using var, let, and const. Demonstrate string, number, boolean, and array types. Determine types using typeof and explain why JavaScript returns 'object' for arrays.",
    demoInput: "Alice (25), Employed: true, Skills: ['HTML', 'CSS', 'JavaScript']",
    codeSample: `// Variable declarations & types
var name = "Alice";
let age = 25;
const isEmployed = true;
const skills = ["HTML", "CSS", "JavaScript"];

console.log(\`Name: \${name} (Type: \${typeof name})\`);
console.log(\`Age: \${age} (Type: \${typeof age})\`);
console.log(\`IsEmployed: \${isEmployed} (Type: \${typeof isEmployed})\`);
console.log(\`Skills: \${JSON.stringify(skills)} (Type: \${typeof skills})\`);`,
    expectedOutput: `Name: Alice (Type: string)
Age: 25 (Type: number)
IsEmployed: true (Type: boolean)
Skills: ["HTML","CSS","JavaScript"] (Type: object)`,
    validationRules: [
      "Must determine each type with typeof",
      "Must format skills array with JSON.stringify()",
      "Must keep execution deterministic",
      "Must explain why typeof array yields 'object'"
    ],
    hasCustomInputs: false,
    execute: () => runAssignment1()
  },
  {
    id: "assignment-2",
    badge: "A2",
    title: "Operators and Input Handling",
    objective: "Understand user input, explicit type conversion with Number(), arithmetic, and assignment operators.",
    concepts: ["Explicit Conversion", "Number()", "Arithmetic Operators", "Input Validation", "Currency Rounding"],
    description:
      "Interactive bill and tip calculator. Accepts bill amount and tip percentage, validates inputs against negative or non-numeric values, calculates tip and total, and formats currency cleanly.",
    demoInput: "Subtotal: $100, Tip Percentage: 15%",
    codeSample: `// Input handling and bill/tip calculation
function calculateBillAndTip(billAmount, tipPercentage) {
  const bill = Number(billAmount);
  const tipPercent = Number(tipPercentage);

  if (Number.isNaN(bill) || bill < 0) throw new Error("Invalid bill amount");
  if (Number.isNaN(tipPercent) || tipPercent < 0 || tipPercent > 100) {
    throw new Error("Invalid tip percentage");
  }

  const tip = Math.round(bill * tipPercent) / 100;
  const total = Math.round((bill + tip) * 100) / 100;
  return { bill, tip, total };
}`,
    expectedOutput: `Subtotal: $100
Tip Percentage: 15%
Calculated Tip: $15
Total Amount to Pay: $115`,
    validationRules: [
      "Reject empty or non-numeric input",
      "Reject negative bill amounts",
      "Reject tip percentages outside [0, 100]",
      "Format currency without floating-point precision glitches"
    ],
    hasCustomInputs: true,
    inputConfig: [
      { id: "billAmount", label: "Bill Amount ($)", type: "number", default: 100, min: 0, step: 0.01 },
      { id: "tipPercentage", label: "Tip Percentage (%)", type: "number", default: 15, min: 0, max: 100, step: 1 }
    ],
    execute: (inputs = { billAmount: 100, tipPercentage: 15 }) => calculateBillAndTip(inputs)
  },
  {
    id: "assignment-3",
    badge: "A3",
    title: "Conditional Logic",
    objective: "Apply if...else for validation, switch for grade branch selection, and ternary operators for status.",
    concepts: ["if...else", "switch statement", "Ternary operator ? :", "Boundary Testing", "Score Range Evaluation"],
    description:
      "Evaluate student scores from 0-100 into letter grades (A, B, C, D, F) using a derived switch key, and determine pass/fail status with an explicit configurable threshold (default 60).",
    demoInput: "Score: 85 (Passing threshold: 60)",
    codeSample: `// Score evaluation with switch & ternary
function evaluateGrade(score, passingThreshold = 60) {
  if (score < 0 || score > 100 || isNaN(score)) throw new Error("Invalid score");

  let grade;
  switch (true) {
    case score >= 90: grade = "A"; break;
    case score >= 80: grade = "B"; break;
    case score >= 70: grade = "C"; break;
    case score >= 60: grade = "D"; break;
    default: grade = "F"; break;
  }

  const status = score >= passingThreshold ? "Passed" : "Failed";
  return { score, grade, status };
}`,
    expectedOutput: `Score: 85
Grade: B
Status: Passed`,
    validationRules: [
      "Validate score range between 0 and 100",
      "Use if...else for initial boundaries",
      "Use switch with derived grade key",
      "Use ternary operator for Passed / Failed",
      "Passing threshold configurable (default 60)"
    ],
    hasCustomInputs: true,
    inputConfig: [
      { id: "score", label: "Exam Score (0-100)", type: "number", default: 85, min: 0, max: 100, step: 1 },
      { id: "passingThreshold", label: "Passing Threshold", type: "number", default: 60, min: 0, max: 100, step: 1 }
    ],
    execute: (inputs = { score: 85, passingThreshold: 60 }) =>
      evaluateGrade(inputs.score ?? 85, inputs.passingThreshold ?? 60)
  },
  {
    id: "assignment-4",
    badge: "A4",
    title: "Loop Control",
    objective: "Understand iteration, termination conditions, break statements, and continue keywords.",
    concepts: ["for loop", "while loop", "do...while loop", "break statement", "continue keyword"],
    description:
      "Demonstrate three loop variants: A for-loop printing 5's multiplication table, a while-loop searching for the first integer > 10 divisible by 6 using break, and a do...while loop skipping numbers 3 and 5 using continue.",
    demoInput: "Range 1-5 for table; search > 10 step; do-while range 1-6",
    codeSample: `// Multiplication Table (for loop)
for (let i = 1; i <= 5; i++) {
  console.log(\`5 x \${i} = \${5 * i}\`);
}

// First number > 10 divisible by 6 (while loop with break)
let num = 11;
while (true) {
  if (num % 6 === 0) {
    console.log(\`Found: \${num}\`);
    break;
  }
  num++;
}

// Do...While with continue
let k = 1;
do {
  if (k === 3 || k === 5) { k++; continue; }
  console.log(\`Processed: \${k}\`);
  k++;
} while (k <= 6);`,
    expectedOutput: `--- Multiplication Table of 5 ---
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25

--- First number > 10 divisible by 6 ---
Found: 12

--- Do...While Loop (Range 1-6, Skipping 3 & 5) ---
Value 1: Processed
Value 2: Processed
Value 3: Skipped (continue)
Value 4: Processed
Value 5: Skipped (continue)
Value 6: Processed`,
    validationRules: [
      "Every loop must have a definite termination condition",
      "While loop must employ break to halt immediately upon match",
      "Do...while loop must skip selected values using continue",
      "Guardrails against infinite loops"
    ],
    hasCustomInputs: false,
    execute: () => runLoopsDemo()
  },
  {
    id: "assignment-5",
    badge: "A5",
    title: "Functions and Scope",
    objective: "Master function declarations, arrow functions, default parameters, and lexical block scope.",
    concepts: ["Function Declarations", "Arrow Functions", "Default Parameters", "Block Scope", "ReferenceError"],
    description:
      "Calculate rectangle areas using both a standard function with default parameters (5 x 4 = 20) and an arrow function with custom parameters (10 x 3 = 30). Trigger a genuine, safely caught ReferenceError for an out-of-scope block variable.",
    demoInput: "Default: 5 x 4; Custom: 10 x 3",
    codeSample: `// Standard function with default parameters
function calculateRectangleAreaStandard(length = 5, width = 4) {
  return length * width;
}

// Arrow function with default parameters
const calculateRectangleAreaArrow = (length = 5, width = 4) => length * width;

// Block scope isolation & controlled ReferenceError
try {
  {
    let blockVar = "scoped";
  }
  console.log(blockVar); // Throws ReferenceError
} catch (err) {
  console.log(\`Scope Test Error: \${err.name}: \${err.message}\`);
}`,
    expectedOutput: `Standard Function Area (Default 5 x 4): 20
Arrow Function Area (Custom 10 x 3): 30
Scope Test Error: ReferenceError: blockVar is not defined`,
    validationRules: [
      "Standard function must support default parameters",
      "Arrow function must execute cleanly with custom arguments",
      "Scope demonstration must provoke and catch a genuine ReferenceError",
      "Execution must continue smoothly after error interception"
    ],
    hasCustomInputs: true,
    inputConfig: [
      { id: "customLength", label: "Arrow Function Length", type: "number", default: 10, min: 1, step: 1 },
      { id: "customWidth", label: "Arrow Function Width", type: "number", default: 3, min: 1, step: 1 }
    ],
    execute: (inputs = { customLength: 10, customWidth: 3 }) =>
      runFunctionsAndScope({
        length: 5,
        width: 4,
        customLength: inputs.customLength ?? 10,
        customWidth: inputs.customWidth ?? 3
      })
  },
  {
    id: "assignment-6",
    badge: "A6",
    title: "Arrays and Objects",
    objective: "Work with collections of objects using modern array methods: forEach(), filter(), and map().",
    concepts: ["Array of Objects", "forEach()", "filter()", "map()", "Immutability"],
    description:
      "Process a dataset of products (Laptop $800, Mouse $25, Keyboard $45). Use forEach() to list every item, filter() to extract items under $50, and map() to generate formatted uppercase report tags.",
    demoInput: "Laptop: $800, Mouse: $25, Keyboard: $45",
    codeSample: `const products = [
  { name: "Laptop", price: 800 },
  { name: "Mouse", price: 25 },
  { name: "Keyboard", price: 45 }
];

// forEach()
products.forEach(p => console.log(\`Item: \${p.name} - Price: $\${p.price}\`));

// filter()
const under50 = products.filter(p => p.price < 50);

// map()
const tags = products.map(p => \`\${p.name.toUpperCase()} costs $\${p.price}\`);`,
    expectedOutput: `--- All Products (forEach) ---
Item: Laptop - Price: $800
Item: Mouse - Price: $25
Item: Keyboard - Price: $45

--- Filtered Products (Price < $50) ---
Mouse: $25
Keyboard: $45

--- Mapped Product Tags (map) ---
LAPTOP costs $800
MOUSE costs $25
KEYBOARD costs $45`,
    validationRules: [
      "Operate on actual array of objects",
      "Demonstrate forEach() for side-effect iteration",
      "Demonstrate filter() for non-destructive subset extraction",
      "Demonstrate map() for transformation into uppercase strings"
    ],
    hasCustomInputs: false,
    execute: () => runArrayMethods()
  }
];
