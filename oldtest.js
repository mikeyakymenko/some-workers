// const Mocha = require("mocha");
// const chai = require("chai");
// const mocha = new Mocha();
// const expect = chai.expect;

describe("simple schedules", function() {
  let scheduler;

  beforeEach(function() {
    scheduler = new WorkScheduler(workers);
  });

  it("can find a suitable worker for a task", function() {
    expect(scheduler.suitableWorkers("cement")).to.eql([
      "charlie@cement.com",
      "wally@walls.com",
    ]);
    expect(scheduler.suitableWorkers("brickwork")).to.eql([
      "alice@example.com",
      "bob@brickwork.com",
    ]);
    expect(scheduler.suitableWorkers("drywall")).to.eql([
      "alice@example.com",
      "wally@walls.com",
    ]);
  });

  it("can build a simple schedule for one day, using the cheapest labor", function() {
    expect(scheduler.scheduleOneDay(["cement"])).to.eql(["charlie@cement.com"]);
    expect(scheduler.scheduleOneDay(["brickwork"])).to.eql([
      "bob@brickwork.com",
    ]);
    expect(scheduler.scheduleOneDay(["drywall"])).to.eql(["wally@walls.com"]);
    expect(scheduler.scheduleOneDay(["cement", "drywall"])).to.eql([
      "charlie@cement.com",
      "wally@walls.com",
    ]);
    expect(scheduler.scheduleOneDay(["cement", "brickwork"])).to.eql([
      "charlie@cement.com",
      "bob@brickwork.com",
    ]);
    expect(scheduler.scheduleOneDay(["drywall", "brickwork"])).to.eql([
      "wally@walls.com",
      "bob@brickwork.com",
    ]);
    expect(
      scheduler.scheduleOneDay(["cement", "brickwork", "drywall"])
    ).to.eql(["charlie@cement.com", "bob@brickwork.com", "wally@walls.com"]);
  });

  it("does not double book workers", function() {
    expect(scheduler.scheduleOneDay(["cement", "cement", "cement"])).to.eql([
      "charlie@cement.com",
      "wally@walls.com",
    ]);
    expect(
      scheduler.scheduleOneDay(["brickwork", "brickwork", "brickwork"])
    ).to.eql(["bob@brickwork.com", "alice@example.com"]);
    expect(scheduler.scheduleOneDay(["drywall", "drywall", "drywall"])).to.eql([
      "wally@walls.com",
      "alice@example.com",
    ]);
  });

  it.only("can schedule multiple units of work for a single trade, in fewest days", function() {
    const schedule1 = scheduler.scheduleAllTasks([
      "brickwork",
      "brickwork",
      "brickwork",
    ]);
    expect(schedule1[0]).to.include("bob@brickwork.com");
    expect(schedule1[0]).to.include("alice@example.com");
    expect(schedule1[1]).to.include("bob@brickwork.com");

    const schedule2 = scheduler.scheduleAllTasks([
      "drywall",
      "drywall",
      "drywall",
    ]);
    expect(schedule2[0]).to.include("wally@walls.com");
    expect(schedule2[0]).to.include("alice@example.com");
    expect(schedule2[1]).to.include("wally@walls.com");

    const schedule3 = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "cement",
    ]);
    expect(schedule3[0]).to.include("charlie@cement.com");
    expect(schedule3[0]).to.include("wally@walls.com");
    expect(schedule3[1]).to.include("charlie@cement.com");
  });

  it("can schedule multiple units of work for many trades, in fewest days", function() {
    const schedule1 = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "cement",
      "brickwork",
    ]);
    expect(schedule1[0]).to.include("charlie@cement.com");
    expect(schedule1[0]).to.include("bob@brickwork.com");
    expect(schedule1[0]).to.include("wally@walls.com"); // mistake? wally can't do brickwork
    expect(schedule1[1]).to.include("charlie@cement.com");

    const schedule2 = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "drywall",
      "drywall",
      "cement",
      "brickwork",
    ]);
    expect(schedule2[0]).to.include("charlie@cement.com");
    expect(schedule2[0]).to.include("bob@brickwork.com");
    expect(schedule2[0]).to.include("alice@example.com");
    expect(schedule2[0]).to.include("wally@walls.com");
    expect(schedule2[1]).to.include("charlie@cement.com");
    expect(schedule2[1]).to.include("wally@walls.com");

    const schedule3 = scheduler.scheduleAllTasks([
      "cement",
      "cement",
      "brickwork",
      "brickwork",
      "cement",
      "brickwork",
    ]);
    expect(schedule3[0]).to.include("charlie@cement.com");
    expect(schedule3[0]).to.include("bob@brickwork.com");
    expect(schedule3[0]).to.include("alice@example.com");
    expect(schedule3[0]).to.include("wally@walls.com");
    expect(schedule3[1]).to.include("charlie@cement.com");
    expect(schedule3[1]).to.include("bob@brickwork.com");
  });
});

mocha.run();