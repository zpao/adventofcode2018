const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8').trim();
export {};

interface Node {
  children: Node[];
  metadata: number[];
}

let parsedInput: number[] = input.split(' ').map(num => parseInt(num));

let allMetadata = [];
let { node: rootNode } = parseNode(parsedInput);
let metadataSum = allMetadata.reduce((sum, num) => sum + num, 0);

console.log(`metadata sum: ${metadataSum}`);
console.log(`root node value ${nodeValue(rootNode)}`);

function parseNode(data: number[]): { node: Node; data: number[] } {
  let [numChildren, numMetadata] = data.splice(0, 2);
  let children = [];
  for (let i = 0; i < numChildren; i++) {
    let rv = parseNode(data);
    children.push(rv.node);
    data = rv.data;
  }
  let metadata = data.splice(0, numMetadata);
  // Cheat and collect all metadata here while we're building the tree.
  allMetadata = allMetadata.concat(metadata);

  let node = { children, metadata };

  return { node, data };
}

function nodeValue(node: Node): number {
  if (node.children.length === 0) {
    return node.metadata.reduce((sum, num) => sum + num, 0);
  }
  return node.metadata.reduce((sum, num) => {
    let child = node.children[num - 1];
    return sum + (child === undefined ? 0 : nodeValue(child));
  }, 0);
}
