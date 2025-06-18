
let prediction = '';
let dna = [];

function analyze(main, askb) {
  const count = str => [...str].reduce((acc, c) => {
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});

  let source = (main[0] === main[1] && main[1] === main[2]) ? askb : main;
  let ref = (source === main) ? askb : main;
  let freq = count(source);
  let minChar = Object.keys(freq).reduce((a,b) => freq[a] <= freq[b] ? a : b);
  let pos = source.indexOf(minChar);

  if (source[0] === source[1] && source[1] === source[2] &&
      ref[0] === ref[1] && ref[1] === ref[2]) {
    return { pred: '✕', note: 'ข้าม (เหมือนกันหมด)' };
  }

  let compare = ref[pos];
  return {
    pred: compare === minChar ? 'P' : 'B',
    note: `เทียบ ${minChar} ที่ตำแหน่ง ${pos+1} กับอีกฝั่ง (${compare})`
  };
}

document.getElementById('form').addEventListener('submit', function(e){
  e.preventDefault();
  const main = document.getElementById('main').value.toLowerCase();
  const askb = document.getElementById('askb').value.toLowerCase();
  const res = analyze(main, askb);
  prediction = res.pred;
  document.getElementById('result').innerHTML = `
    <strong>ทำนาย:</strong> ${res.pred} <br/>
    <small>${res.note}</small>
  `;
});

function submitActual() {
  const actual = document.getElementById('actual').value.toUpperCase();
  let symbol = '✕';
  if (prediction === '✕') {
    symbol = '✕';
  } else if (actual === 'T') {
    symbol = '🟢';
  } else if (actual === prediction) {
    symbol = '⚪️';
  } else {
    symbol = '🔴';
  }
  dna.push(symbol);
  document.getElementById('dna').innerText = dna.join(' ');
  document.getElementById('actual').value = '';
}
