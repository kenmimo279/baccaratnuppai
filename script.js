let history = [];
let currentPrediction = null;

function analyze() {
  const input = document.getElementById("input").value.toLowerCase().trim();
  if (input.length !== 6 || !/^[pb]{6}$/.test(input)) {
    alert("กรุณากรอกเค้าไพ่ 6 ตัว เช่น ppbpbb");
    return;
  }

  const main = input.slice(0, 3).split("");
  const sub = input.slice(3, 6).split("");

  // Step 1: Check if main has 3 identical → use sub instead
  let reference = null;
  if (main.every(v => v === main[0])) {
    if (sub.every(v => v === sub[0])) {
      currentPrediction = { predict: "✕", actual: "-", result: "✕" };
      updateView();
      return;
    } else {
      reference = sub;
    }
  } else {
    reference = main;
  }

  // Step 2: Find the minority
  let count = {};
  for (let i = 0; i < 3; i++) {
    count[reference[i]] = (count[reference[i]] || 0) + 1;
  }
  let minority = Object.entries(count).sort((a,b)=>a[1]-b[1])[0][0];
  let idx = reference.indexOf(minority);

  // Step 3: Compare same index value
  let predict = main[idx] === sub[idx] ? "p" : "b";

  currentPrediction = { predict, actual: "-", result: "รอผล" };
  updateView();
}

function setResult(actualChar) {
  if (!currentPrediction) {
    alert("กรุณาคำนวณก่อน");
    return;
  }
  const actual = actualChar.toLowerCase();
  let result = "✕";
  if (actual === "t") result = "🟢";
  else if (currentPrediction.predict === actual) result = "⚪️";
  else result = "🔴";

  history.push({ ...currentPrediction, actual, result });
  currentPrediction = null;
  updateView();
  document.getElementById("input").value = "";
}

function updateView() {
  const resultDiv = document.getElementById("result");
  const dnaDiv = document.getElementById("dna");

  if (currentPrediction) {
    resultDiv.innerHTML = `ทำนายตาถัดไป: <b>${currentPrediction.predict.toUpperCase()}</b>`;
  } else if (history.length > 0) {
    const last = history[history.length - 1];
    resultDiv.innerHTML = `ทำนาย: <b>${last.predict.toUpperCase()}</b> | ผลจริง: <b>${last.actual.toUpperCase()}</b>`;
  } else {
    resultDiv.innerHTML = "";
  }

  dnaDiv.innerHTML = "DNA: " + history.map(h => h.result).join(" ");
}

function resetAll() {
  history = [];
  currentPrediction = null;
  updateView();
  document.getElementById("input").value = "";
}