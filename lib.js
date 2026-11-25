// Password and passphrase generation with the Web Crypto CSPRNG. Pure functions.

export const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/~',
};
const AMBIGUOUS = /[Il1O0o]/g;

/** Uniform integer in [0, n) via rejection sampling, no modulo bias. */
export function randInt(n) {
  if (!(n > 0 && n <= 2 ** 32)) throw new RangeError('n out of range');
  const limit = Math.floor(2 ** 32 / n) * n;
  const buf = new Uint32Array(1);
  let x;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % n;
}

const pick = (arr) => arr[randInt(arr.length)];

export const bits = (poolSize, length) => length * Math.log2(poolSize);

export function passphrase(words, { count = 6, sep = '-', capitalize = false, digit = false } = {}) {
  let list = Array.from({ length: count }, () => pick(words));
  if (capitalize) list = list.map((w) => w[0].toUpperCase() + w.slice(1));
  let b = bits(words.length, count);
  if (digit) {
    const i = randInt(count);
    list[i] += randInt(10);
    b += Math.log2(10) + Math.log2(count);
  }
  return { text: list.join(sep), bits: b };
}

export function password({ length = 16, lower, upper, digits, symbols, noAmbiguous = false } = {}) {
  const chosen = Object.entries({ lower, upper, digits, symbols })
    .filter(([, on]) => on)
    .map(([k]) => (noAmbiguous ? SETS[k].replace(AMBIGUOUS, '') : SETS[k]));
  if (!chosen.length) throw new Error('Pick at least one character set.');
  const pool = chosen.join('');
  length = Math.max(length, chosen.length);
  // Draw until every chosen set is present; rejection keeps the output uniform over valid passwords.
  for (;;) {
    const chars = Array.from({ length }, () => pool[randInt(pool.length)]);
    if (chosen.every((set) => chars.some((c) => set.includes(c)))) return { text: chars.join(''), bits: bits(pool.length, length) };
  }
}

/** Plain-language time to guess at `rate` guesses per second, on average half the space. */
export function crackTime(b, rate = 1e10) {
  const sec = 2 ** (b - 1) / rate;
  const units = [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['year', 31557600], ['century', 3155760000]];
  if (sec < 1) return 'less than a second';
  if (sec > 3155760000 * 1e6) return 'longer than the age of the universe';
  let [name, size] = units[0];
  for (const u of units) if (sec >= u[1]) [name, size] = u;
  const n = sec / size;
  const shown = n >= 1000 ? new Intl.NumberFormat('en', { notation: 'compact' }).format(n) : Math.round(n).toString();
  const plural = name === 'century' ? 'centuries' : name + 's';
  return `about ${shown} ${Math.round(n) === 1 ? name : plural}`;
}
