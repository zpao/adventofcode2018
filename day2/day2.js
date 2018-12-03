const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const letterCounts = input
  .trim()
  .split('\n')
  .map(countLetters);

let [twoCount, threeCount] = letterCounts.reduce(
  ([twos, threes], counts) => {
    let [hasTwo, hasThree] = [...counts.values()].reduce(
      ([hasTwo, hasThree], count) => {
        return [hasTwo || count === 2, hasThree || count === 3];
      },
      [false, false]
    );
    return [twos + +hasTwo, threes + +hasThree];
  },
  [0, 0]
);
let checksum = twoCount * threeCount;
console.log(`checksum: ${checksum}`);

function countLetters(id) {
  let counts = new Map();
  id.split('').forEach(char => {
    counts.set(char, (counts.get(char) || 0) + 1);
  });
  return counts;
}
