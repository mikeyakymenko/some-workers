import {WorkScheduler} from './index.js';

const workers = [
  {
    email: "bob@brickwork.com",
    trades: ["brickwork"],
    cost: 90,
  },
  {
    email: "alice@example.com",
    trades: ["brickwork", "drywall"],
    cost: 100,
  },
  {
    email: "charlie@cement.com",
    trades: ["cement"],
    cost: 80,
  },
  {
    email: "wally@walls.com",
    trades: ["cement", "drywall"],
    cost: 95,
  },
];

let scheduler = new WorkScheduler(workers)

beforeEach(() => {
  scheduler = new WorkScheduler(workers);
});

describe('suitable workers', () => {
  test('can find a suitable worker for a task', () => {
    expect(scheduler.displaySuitableWorkersEmails("cement")).toEqual([
      "charlie@cement.com",
      "wally@walls.com",
    ])
  })
  test('brickwork', () => {
    expect(scheduler.displaySuitableWorkersEmails("brickwork")).toEqual([
      "alice@example.com",
      "bob@brickwork.com",
    ])
  })
  test('drywall', () => {
    expect(scheduler.displaySuitableWorkersEmails("drywall")).toEqual([
      "alice@example.com",
      "wally@walls.com",
    ])
  })
})

describe('can build a simple schedule for one day, using the cheapest labor', () => {
  test('cement', () => {
    expect(scheduler.scheduleOneDay(["cement"])).toEqual(["charlie@cement.com"])
  })
  test('brickwork', () => {
    expect(scheduler.scheduleOneDay(["brickwork"])).toEqual(["bob@brickwork.com",])
  })
  test('cemedrywallnt', () => {
    expect(scheduler.scheduleOneDay(["drywall"])).toEqual(["wally@walls.com"])
  })
  test('cement, drywall', () => {
    expect(scheduler.scheduleOneDay(["cement", "drywall"])).toEqual([
      "charlie@cement.com",
      "wally@walls.com",
    ])
  })
  test('cement, brickwork', () => {
    expect(scheduler.scheduleOneDay(["cement", "brickwork"])).toEqual([
      "charlie@cement.com",
      "bob@brickwork.com",
    ])
  })
  test('drywall, brickwork', () => {
    expect(scheduler.scheduleOneDay(["drywall", "brickwork"])).toEqual([
      "wally@walls.com",
      "bob@brickwork.com",
    ])
  })
  test('cement, brickwork, drywall', () => {
    expect(scheduler.scheduleOneDay(["cement", "brickwork", "drywall"])).toEqual([
      "charlie@cement.com",
      "bob@brickwork.com",
      "wally@walls.com"
    ])
  })
})

describe('does not double book workers', () => {
  // const expected = ['Alice', 'Bob'];
  // it('matches even if received contains additional elements', () => {
  //   expect(['Alice', 'Bob', 'Eve']).toEqual(expect.arrayContaining(expected));
  // });
  test('brickwork 3 days', () => {
    const schedule = scheduler.scheduleAllTasks([
      "brickwork",
      "brickwork",
      "brickwork",
    ])
    expect(schedule[0]).toEqual(expect.arrayContaining(["bob@brickwork.com"]))
    expect(schedule[0]).toEqual(expect.arrayContaining(["alice@example.com"]))
    expect(schedule[1]).toEqual(expect.arrayContaining(["bob@brickwork.com"]))
  })

  test('drywall 3 days', () => {
    const schedule = scheduler.scheduleAllTasks([
      "drywall",
      "drywall",
      "drywall",
    ])
    expect(schedule[0]).toEqual(expect.arrayContaining(["wally@walls.com"]))
    expect(schedule[0]).toEqual(expect.arrayContaining(["alice@example.com"]))
    expect(schedule[1]).toEqual(expect.arrayContaining(["wally@walls.com"]))
  })

  test('cement 3 days', () => {
    const schedule = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "cement",
    ])
    expect(schedule[0]).toEqual(expect.arrayContaining(["charlie@cement.com"]))
    expect(schedule[0]).toEqual(expect.arrayContaining(["wally@walls.com"]))
    expect(schedule[1]).toEqual(expect.arrayContaining(["charlie@cement.com"]))
  })
  test('cement 3 days and cement 1 day', () => {
    const schedule = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "cement",
      "brickwork",
    ])
    expect(schedule[0]).toEqual(expect.arrayContaining(["charlie@cement.com"]))
    expect(schedule[1]).toEqual(expect.arrayContaining(["wally@walls.com"]))
    expect(schedule[2]).toEqual(expect.arrayContaining(["charlie@cement.com"]))
    expect(schedule[3]).toEqual(expect.arrayContaining(["bob@brickwork.com"]))
  })
})