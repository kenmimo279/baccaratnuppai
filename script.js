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

  // Check if both strings identical -> skip
  if (main.every(v => v === main[0]) && sub.every(v => v === sub[0])) {
    history.push({ predict: "✕", actual: "✕", result: "✕" });
    updateView();
    document.getElementById("input").value = "";
    return;
  }

  // Choose reference
  const reference = (main.every(v => v === main[0])) ? sub : main;
  const refOther  = (reference === main) ? sub : main;

  // Find minority
  const count = {};
  reference.forEach(c => count[c] = (count[c] || 0) + 1);
  const minority = Object.keys(count).sort((a,b) => count[a]-count[b])[0];
  const idx = reference.indexOf(minority);

  const predict = (refOther[idx] === minority) ? 'p' : 'b';

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