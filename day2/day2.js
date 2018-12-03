const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

let ids = input.trim().split('\n');

const letterCounts = ids.map(countLetters);

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

// PART 2
let finalMatch = null;
// All the same length, so this is ok
let expectedLen = ids[0].length - 1;
for (let i = 0; i < ids.length; i++) {
  let id = ids[i];
  for (let j = i + 1; j < ids.length; j++) {
    let matching = ids[j]
      .split('')
      .filter((char, idx) => char === id[idx])
      .join('');
    if (matching.length >= expectedLen) {
      finalMatch = matching;
      break;
    }
  }
  if (finalMatch !== null) {
    break;
  }
}

console.log(`matching: ${finalMatch}`);
