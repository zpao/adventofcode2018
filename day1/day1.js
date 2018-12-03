const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const deltas = input
  .trim()
  .split('\n')
  .map(line => parseInt(line));

const frequency = deltas.reduce((acc, freq) => acc + freq, 0);

console.log(`final frequency = ${frequency}`);

let seen = new Set();
let freq = 0;
while (true) {
  for (let delta of deltas) {
    freq += delta;
    if (seen.has(freq)) {
      console.log(`repeating frequency = ${freq}`);
      process.exit();
    }
    seen.add(freq);
  }
}
