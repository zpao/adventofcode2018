const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8').trim();
export {};

// 10 players; last marble is worth 1618 points
let match = input.match(/(\d+) players; last marble is worth (\d+) points/);
let numPlayers = parseInt(match[1]);
let numMarbles = parseInt(match[2]);

console.log(`high score: ${calculateHighScore(numPlayers, numMarbles)}`);
console.log(`high score: ${calculateHighScore(numPlayers, numMarbles * 100)}`);

interface Node {
  value: number;
  prev: Node;
  next: Node;
}

function calculateHighScore(
  numPlayers: number,
  numMarbles: number,
  debug: boolean = false
): number {
  // Arrays are suuuuuper slow and won't scale (solved part 1 that way),
  // so instead we'll make a circular doubly linked list.
  let turn = 0;
  let scores: number[] = new Array(numPlayers).fill(0);

  // This case is weird because next and prev point to self.
  // We need to initialize differently.
  let list: Node = {
    value: 0,
    prev: null,
    next: null
  };
  list.prev = list;
  list.next = list;
  let rootNode = list;

  while (++turn <= numMarbles) {
    let currentPlayer = ((turn - 1) % numPlayers) + 1;
    if (turn % 23 === 0) {
      scores[currentPlayer - 1] += turn;
      for (let i = 0; i < 7; i++) {
        list = list.prev;
      }
      scores[currentPlayer - 1] += list.value;
      list.prev.next = list.next;
      list.next.prev = list.prev;
      list = list.next;
    } else {
      for (let i = 0; i < 1; i++) {
        list = list.next;
      }
      let newNode = {
        value: turn,
        prev: list,
        next: list.next
      };

      list.next.prev = newNode;
      list.next = newNode;
      list = newNode;
    }
    if (debug) {
      printNode(rootNode);
    }
  }

  // console.log(scores);
  return Math.max(...scores);
}

function printNode(node: Node) {
  let values = [];
  let start = node;
  do {
    values.push(node.value);
    node = node.next;
  } while (node !== start);
  console.log(values);
}
