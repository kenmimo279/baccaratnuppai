let history = [];

function analyze() {
  const input = document.getElementById("input").value.toLowerCase().trim();
  if (input.length !== 7 || !/^[pb]{6}[pb|t]$/.test(input)) {
    alert("กรุณากรอกให้ครบ 7 ตัว เช่น ppbpbbp");
    return;
  }

  const main = input.slice(0, 3).split("");
  const sub = input.slice(3, 6).split("");
  const actual = input[6];

  let predict = "-";

  // Step 1: Check if main has 3 identical → use sub instead
  let reference = null;
  if (main.every(v => v === main[0])) {
    if (sub.every(v => v === sub[0])) {
      history.push({ predict: "✕", actual, result: "✕" });
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
  if (main[idx] === sub[idx]) {
    predict = "p";
  } else {
    predict = "b";
  }

  let result = "✕";
  if (actual === "t") result = "🟢";
  else if (predict === actual) result = "⚪️";
  else result = "🔴";

  history.push({ predict, actual, result });
  updateView();
}

function updateView() {
  const resultDiv = document.getElementById("result");
  const dnaDiv = document.getElementById("dna");

  if (history.length === 0) {
    resultDiv.innerText = "";
    dnaDiv.innerText = "";
    return;
  }

  const last = history[history.length - 1];
  resultDiv.innerHTML = `ทำนาย: <b>${last.predict.toUpperCase()}</b> | ผลจริง: <b>${last.actual.toUpperCase()}</b>`;
  dnaDiv.innerHTML = "DNA: " + history.map(h => h.result).join(" ");
}

function resetAll() {
  history = [];
  updateView();
  document.getElementById("input").value = "";
}