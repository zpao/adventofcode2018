const fs = require('fs');

const input: string = fs.readFileSync(`${__dirname}/input`, 'utf8');

interface Entry {
  jsDate: Date;
  date: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  };
  guard: number;
  action: string;
}

interface GuardData {
  entries: Set<Entry>;
  totalSleepTime: number;
  sleepChart: number[];
}
type GuardDataMap = Map<number, GuardData>;

function parseInput(input: string): Array<Entry> {
  let lines = input
    .trim()
    .split('\n')
    .sort();
  let lastGuard;
  return lines.map(line => {
    let match = line.match(
      /^\[((\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}))\] (Guard \#(\d+) )?(.+)$/
    );
    let guard = parseInt(match[8]);
    if (!isNaN(guard)) {
      lastGuard = guard;
    }
    return {
      jsDate: new Date(match[1]),
      date: {
        year: parseInt(match[2]),
        month: parseInt(match[3]),
        day: parseInt(match[4]),
        hour: parseInt(match[5]),
        minute: parseInt(match[6])
      },
      guard: lastGuard,
      action: match[9]
    };
  });
}

function solve(input: Entry[]) {
  let guardDataMap: GuardDataMap = new Map();
  input.forEach((entry, idx) => {
    let guardData = guardDataMap.get(entry.guard);
    if (guardData === undefined) {
      guardData = {
        entries: new Set(),
        totalSleepTime: 0,
        sleepChart: new Array(60).fill(0)
      };
    }
    guardData.entries.add(entry);
    if (entry.action === 'wakes up') {
      // prevEntry must be 'falls asleep'
      let prevEntry = input[idx - 1];
      guardData.totalSleepTime += entry.date.minute - prevEntry.date.minute;
      for (let i = prevEntry.date.minute; i < entry.date.minute; i++) {
        guardData.sleepChart[i] += 1;
      }
    }
    guardDataMap.set(entry.guard, guardData);
  });

  let sleepyGuardData = null;
  let sleepyGuard = null;
  for (let [guard, guardData] of guardDataMap.entries()) {
    if (
      sleepyGuardData === null ||
      guardData.totalSleepTime > sleepyGuardData.totalSleepTime
    ) {
      sleepyGuard = guard;
      sleepyGuardData = guardData;
    }
  }

  let sleepMinute = sleepyGuardData.sleepChart.reduce(
    (maxIdx, time, idx, arr) => {
      if (time > arr[maxIdx]) {
        return idx;
      }
      return maxIdx;
    },
    0
  );

  console.log(
    `Strategy 1: sleepy guard #${sleepyGuard} * ${sleepMinute} minutes = ${sleepMinute *
      sleepyGuard}`
  );

  // Part 2

  let maxMinute = 0;
  let maxTime = 0;
  let maxGuard = 0;
  for (let [guard, guardData] of guardDataMap.entries()) {
    guardData.sleepChart.forEach((time, idx) => {
      if (time > maxTime) {
        maxTime = time;
        maxMinute = idx;
        maxGuard = guard;
      }
    });
  }

  console.log(
    `Strategy 2: sleepy guard #${maxGuard} * ${maxMinute} minute = ${maxGuard *
      maxMinute}`
  );
}

let parsedInput = parseInput(input);
solve(parsedInput);
// console.log(parsedInput);

// wtf typescript https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export {};
