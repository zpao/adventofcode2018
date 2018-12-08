const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8').trim();
export {};

interface Node {
  name: string;
  inboundEdges: Edge[];
  outboundEdges: Edge[];
  timeToComplete: number;
}

interface Edge {
  from: Node;
  to: Node;
  completed: boolean;
}

let nodes: Map<string, Node> = new Map();
let edges: Edge[] = [];

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
    if (isNodeReady(edge.to)) {
      pendingQueue.add(edge.to);
    }
  }
  nodeQueue = sortQueue([...pendingQueue]);
}

console.log(`step order: ${strfNodes(orderedNodes)}`);

interface Work {
  node: Node;
  startTick: number;
}

interface Worker {
  work: null | Work;
}
// Part 2
let availableWorkers: Worker[] = new Array(5);
for (let i = 0; i < availableWorkers.length; i++) {
  availableWorkers[i] = { work: null };
}
let busyWorkers: Worker[] = [];

// Reset global state (oops)
edges.forEach(edge => (edge.completed = false));

let tick = 0;
nodeQueue = orderedNodes.slice();
while (nodeQueue.length !== 0 || busyWorkers.length !== 0) {
  // Update busy workers, free up completed
  for (let i = 0; i < busyWorkers.length; i++) {
    let worker = busyWorkers[i];
    let node = worker.work.node;
    if (tick - worker.work.startTick === node.timeToComplete) {
      node.outboundEdges.forEach(edge => (edge.completed = true));
      busyWorkers.splice(i, 1);
      i--;
      worker.work = null;
      availableWorkers.push(worker);
    }
  }

  // This is brute force parallelism. It's not very smart but it works well enough for small data.
  for (let i = 0; i < nodeQueue.length; i++) {
    if (availableWorkers.length === 0) {
      break;
    }

    let node = nodeQueue[i];
    if (isNodeReady(node)) {
      let worker = availableWorkers.shift();
      worker.work = {
        node,
        startTick: tick
      };
      busyWorkers.push(worker);
      nodeQueue.splice(i, 1);
      i--;
    }
  }

  tick++;
}

// Off by one because we increment before checking the terminal condition
console.log(`time taken: ${tick - 1}`);

function isNodeReady(node: Node): boolean {
  return node.inboundEdges.reduce((acc, inboundEdge) => {
    return acc && inboundEdge.completed;
  }, true);
}

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
      outboundEdges: [],
      // Convert to ascii. A = 65. We need to map that to 1, and add 60.
      timeToComplete: name.charCodeAt(0) - 4
    };
    nodes.set(name, node);
  }
  return node;
}
