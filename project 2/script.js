const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const themeSwitcher = document.getElementById("themeSwitcher");

let currentInput = "";
let resultDisplayed = false;

function updateDisplay(value) {
  display.textContent = value;
}

function safeEval(expression) {
  if (/[^0-9+\-*/%.() ]/.test(expression)) {
    throw new Error("Invalid characters");
  }
  return Function(`"use strict"; return (${expression})`)();
}

function addToHistory(expression, result) {
  const li = document.createElement("li");
  li.textContent = `${expression} = ${result}`;
  historyList.prepend(li); // Show latest at the top
}

function clearHistory() {
  historyList.innerHTML = "";
}

function handleInput(value) {
  if (value === "C") {
    currentInput = "";
    updateDisplay("0");
    resultDisplayed = false;
    return;
  }

  if (value === "←") {
    currentInput = currentInput.slice(0, -1);
    updateDisplay(currentInput || "0");
    return;
  }

  if (value === "=") {
    try {
      const expression = currentInput.replace(/÷/g, "/").replace(/×/g, "*");
      const result = parseFloat(safeEval(expression).toFixed(12));
      updateDisplay(result);
      addToHistory(expression, result);
      currentInput = result.toString();
      resultDisplayed = true;
    } catch {
      updateDisplay("Error");
      currentInput = "";
      resultDisplayed = true;
    }
    return;
  }

  if (resultDisplayed && !"+-*/%".includes(value)) {
    currentInput = value;
    resultDisplayed = false;
  } else {
    currentInput += value;
  }
  updateDisplay(currentInput);
}

// Button clicks
buttons.forEach(btn => {
  const val = btn.getAttribute("data-value");
  if (val) {
    btn.addEventListener("click", () => handleInput(val));
  }
});

// Keyboard support
document.addEventListener("keydown", e => {
  const key = e.key;

  if (/^[0-9+\-*/%.()]$/.test(key)) {
    handleInput(key);
  } else if (key === "Enter" || key === "=") {
    e.preventDefault();
    handleInput("=");
  } else if (key === "Backspace") {
    handleInput("←");
  } else if (key.toLowerCase() === "c") {
    handleInput("C");
  }
});

// Clear history
clearHistoryBtn.addEventListener("click", clearHistory);

// Theme toggle
themeSwitcher.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");
});
