const fs = require('fs');

const input = fs.readFileSync(`${__dirname}/input`, 'utf8');

interface Claim {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

type Board = Array<Array<number>>;

function parseInput(input: string): Array<Claim> {
  let lines = input.trim().split('\n');
  return lines.map(line => {
    // #1 @ 1,3: 4x4
    // console.log(line);
    // Seems TS doesn't support named groups yet, so just go with ordered
    let match = line.match(/\#(\d+) \@ (\d+),(\d+): (\d+)x(\d+)/);
    // console.log(match);
    return {
      id: parseInt(match[1]),
      x: parseInt(match[2]),
      y: parseInt(match[3]),
      w: parseInt(match[4]),
      h: parseInt(match[5])
    };
  });
}

function part1(input: Array<Claim>) {
  let board: Board = [[]];
  input.forEach(claim => {
    board = growBoard(board, claim);
    for (let y = claim.y; y < claim.y + claim.h; y++) {
      for (let x = claim.x; x < claim.x + claim.w; x++) {
        board[y][x] = board[y][x] + 1;
      }
    }
  });
  let overlap = board.reduce((overlap, row) => {
    overlap += row.filter(x => x > 1).length;
    return overlap;
  }, 0);
  console.log(`overlap: ${overlap}`);
}

function growBoard(board: Board, claim: Claim): Board {
  let newY = claim.y + claim.h;
  let newX = claim.x + claim.w;
  if (board.length < newY) {
    for (let i = board.length; i < newY; i++) {
      board[i] = [];
    }
  }
  for (let y = 0; y < newY; y++) {
    for (let x = 0; x < newX; x++) {
      board[y][x] = board[y][x] || 0;
    }
  }
  return board;
}

function part2(input: Array<Claim>) {
  for (let i = 0; i < input.length; i++) {
    let overlaps = false;
    for (let j = 0; j < input.length; j++) {
      if (j === i) {
        continue;
      }
      overlaps = doesOverlap(input[i], input[j]);
      if (overlaps) {
        break;
      }
    }
    if (!overlaps) {
      console.log(`doesn't overlap id: ${input[i].id}`);
      break;
    }
  }
}

function doesOverlap(a: Claim, b: Claim): boolean {
  return (
    Math.max(0, Math.min(a.x + a.w - b.x, b.x + b.w - a.x)) > 0 &&
    Math.max(0, Math.min(a.y + a.h - b.y, b.y + b.h - a.y)) > 0
  );
}

let parsedInput = parseInput(input);
part1(parsedInput);
part2(parsedInput);
