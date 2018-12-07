import { start } from 'repl';

const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8').trim();
export {};

interface Node {
  name: string;
  inboundEdges: Edge[];
  outboundEdges: Edge[];
}

interface Edge {
  from: Node;
  to: Node;
  completed: boolean;
}

let nodes: Map<string, Node> = new Map();
let edges = [];

input.split('\n').forEach(line => {
  // Step C must be finished before step A can begin.
  let match = line.match(/Step ([A-Z]) .+ step ([A-Z]) .+/);
  let from = getNode(match[1]);
  let to = getNode(match[2]);
  let edge = {
    from,
    to,
    completed: false
  };
  to.inboundEdges.push(edge);
  from.outboundEdges.push(edge);
  edges.push(edge);
});

// start = node with no inbound edges
// end = node with no outbound edges
// everything in the middle ???
let nodeQueue: Node[] = [];
nodes.forEach(node => {
  if (node.inboundEdges.length === 0) {
    console.log(node.name);
    nodeQueue.push(node);
  }
});
nodeQueue = sortQueue(nodeQueue);

let orderedNodes = [];
while (nodeQueue.length !== 0) {
  let node = nodeQueue.shift();
  // O(1) lookups. we'll convert to array and sort later
  let pendingQueue: Set<Node> = new Set(nodeQueue);
  orderedNodes.push(node);
  for (let edge of node.outboundEdges) {
    // Nodes are identity equal, so this will ensure we don't dupe nor add incomplete nodes
    edge.completed = true;
    let nextNode = edge.to;
    let prereqsComplete = nextNode.inboundEdges.reduce((acc, inboundEdge) => {
      return acc && inboundEdge.completed;
    }, true);
    if (prereqsComplete) {
      pendingQueue.add(edge.to);
    }
  }
  nodeQueue = sortQueue([...pendingQueue]);
}

console.log(`step order: ${strfNodes(orderedNodes)}`);

function strfNodes(nodes: Node[]): string {
  return nodes.map(node => node.name).join('');
}

function sortQueue(nodes: Node[]): Node[] {
  return nodes.sort((a, b) => a.name.localeCompare(b.name));
}

function getNode(name: string): Node {
  let node = nodes.get(name);
  if (node === undefined) {
    node = {
      name: name,
      inboundEdges: [],
      outboundEdges: []
    };
    nodes.set(name, node);
  }
  return node;
}
