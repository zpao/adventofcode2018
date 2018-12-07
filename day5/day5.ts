const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8').trim();

part1(input);
part2(input);

function part1(input: string) {
  let polymer = react(input);
  console.log(`remaining units: ${polymer.length}`);
}

function part2(input: string) {
  // iterate over input and for each unique letter, replace input and react
  let shortest = Infinity;
  let visited: Set<string> = new Set();
  for (let i = 0; i < input.length; i++) {
    let lcChar = input[i].toLowerCase();
    if (visited.has(lcChar)) {
      continue;
    }
    visited.add(lcChar);

    let re = new RegExp(lcChar, 'ig');
    let units = input.replace(re, '');
    let polymer = react(units);
    if (polymer.length < shortest) {
      shortest = polymer.length;
    }
  }
  console.log(`shortest polymer: ${shortest}`);
}

function react(polymer: string): string {
  let i = 0;
  while (i < polymer.length - 1) {
    // Look forward one char.
    // if !== but downcase ===
    //  remove the pair
    //   i--
    // else
    //   i++
    let self = polymer[i];
    let next = polymer[i + 1];
    if (self !== next && self.toLowerCase() === next.toLowerCase()) {
      polymer = polymer.substring(0, i) + polymer.substring(i + 2);
      i = Math.max(0, i - 1);
    } else {
      i++;
    }
  }
  return polymer;
}

// wtf typescript https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
