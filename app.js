import { passphrase, password, crackTime } from './lib.js';
import words from './words.js';
import { $, $$, copy } from './ui.js';

let mode = 'phrase';
let current = '';

function gen() {
  const err = $('#err');
  let r;
  try {
    r = mode === 'phrase'
      ? passphrase(words, { count: +$('#count').value, sep: $('#sep').value, capitalize: $('#cap').checked, digit: $('#digit').checked })
      : password({ length: +$('#len').value, lower: $('#lower').checked, upper: $('#upper').checked, digits: $('#digits').checked, symbols: $('#symbols').checked, noAmbiguous: $('#noAmb').checked });
    err.textContent = '';
  } catch (e) {
    err.textContent = e.message;
    return;
  }
  current = r.text;
  $('#out').textContent = r.text;
  $('#bits').textContent = Math.round(r.bits);
  $('#time').textContent = crackTime(r.bits);
  $('#countLabel').textContent = $('#count').value;
  $('#lenLabel').textContent = $('#len').value;
}

function setMode(m) {
  mode = m;
  $('#tabPhrase').setAttribute('aria-selected', m === 'phrase');
  $('#tabPass').setAttribute('aria-selected', m === 'pass');
  $('#phraseOpts').hidden = m !== 'phrase';
  $('#passOpts').hidden = m !== 'pass';
  gen();
}

$('#tabPhrase').onclick = () => setMode('phrase');
$('#tabPass').onclick = () => setMode('pass');
for (const el of $$('input, select')) el.addEventListener('input', gen);
$('#again').onclick = gen;
$('#copy').onclick = () => current && copy(current, 'Copied. Paste it somewhere safe.');
gen();
