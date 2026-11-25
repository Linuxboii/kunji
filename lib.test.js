import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randInt, passphrase, password, bits, crackTime, SETS } from './lib.js';
import words from './words.js';

test('randInt stays in range and covers it', () => {
  const seen = new Set();
  for (let i = 0; i < 2000; i++) {
    const n = randInt(6);
    assert.ok(n >= 0 && n < 6 && Number.isInteger(n));
    seen.add(n);
  }
  assert.equal(seen.size, 6);
});

test('passphrase has the requested number of words from the list', () => {
  const p = passphrase(words, { count: 6, sep: '-' });
  const parts = p.text.split('-');
  assert.equal(parts.length, 6);
  for (const w of parts) assert.ok(words.includes(w));
  assert.ok(Math.abs(p.bits - 6 * Math.log2(7776)) < 0.01);
});

test('passphrase options add a digit and capitals', () => {
  const p = passphrase(words, { count: 4, sep: ' ', capitalize: true, digit: true });
  assert.match(p.text, /\d/);
  assert.match(p.text, /^[A-Z]/);
  assert.ok(p.bits > 4 * Math.log2(7776));
});

test('password contains every chosen character set', () => {
  for (let i = 0; i < 200; i++) {
    const p = password({ length: 12, lower: true, upper: true, digits: true, symbols: true });
    assert.equal(p.text.length, 12);
    assert.match(p.text, /[a-z]/);
    assert.match(p.text, /[A-Z]/);
    assert.match(p.text, /[0-9]/);
    assert.ok([...p.text].some((c) => SETS.symbols.includes(c)));
  }
});

test('password can avoid look-alike characters', () => {
  for (let i = 0; i < 100; i++) {
    const p = password({ length: 32, lower: true, upper: true, digits: true, symbols: false, noAmbiguous: true });
    assert.doesNotMatch(p.text, /[Il1O0o]/);
  }
});

test('password with no sets throws', () => {
  assert.throws(() => password({ length: 10 }));
});

test('bits and crack time', () => {
  assert.equal(bits(26, 10).toFixed(1), '47.0');
  assert.match(crackTime(40), /second|minute|hour|day/);
  assert.match(crackTime(128), /centur|longer/);
});
