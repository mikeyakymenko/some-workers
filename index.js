// Scheduling work on a jobsite is one of the most difficult tasks in
// construction management. Different contractors work on different
// trades and can only do so much work in a single day. We need to
// make sure that we have the right people on the job site every day
// and anticipate how many days it will take to complete a set of tasks.

// *Requirements:*

// * Your solution should prefer to finish the work as fast as possible

export class WorkScheduler {
  workers;

  constructor(workers) {
    this.workers = workers;
  }

  getSuitableWorkers(trade) {
    return this.workers.filter((worker) => worker.trades.includes(trade))
  }
  // Given a suitable trade, returns a list of emails of workers who work the
  // specified trade.
  //
  // `trade`: Specific trade desired
  // Returns list of worker emails, sorted alphabetically
  displaySuitableWorkersEmails(trade) {
    return this.getSuitableWorkers(trade).map(item => item.email).sort()
  }

  // Given a list of trades, return a list of worker emails that can work that
  // day.  A worker cannot work multiple trades in one day, and if there are
  // multiple workers available to work on a particular trade, the worker with
  // the cheapest cost should be chosen.
  //
  // `trades`: A list of trades.  Each trade represents 1 unit of work that needs
  // to be completed
  //Returns a list of worker emails that are scheduled for the day, in the order
  //that they were scheduled (i.e. in the same order that the trades were
  //provided).
  scheduleOneDay(trades) {
    return trades.reduce((result, currentTrade) => {
      const suitableWorkers = this.getSuitableWorkers(currentTrade)
      const pickedWorker = suitableWorkers.sort((a, b) => a.cost - b.cost)[0]

      if (pickedWorker && !result.includes(pickedWorker.email)) {
        result.push(pickedWorker.email)
      }

      return result
    }, [])
  }

  // Given a list of trades, schedules work for each day, until all the trades
  // are scheduled. A worker cannot work multiple trades in one day, and if
  // there are multiple workers available to work on a particular trade, the
  // worker with the cheapest cost should be chosen.
  //
  // `trades`: A list of trades.  Each trade represents 1 unit of work that
  // needs to be completed
  // Returns a list of scheduled days.  Each day is a list of worker emails for
  // work scheduled for that day.
  scheduleAllTasks(trades) {
    return trades.reduce((result, currentTrade) => {
      let taskWorkers = []
      const suitableWorkers = this.getSuitableWorkers(currentTrade)
      const sortedWorkers = suitableWorkers.sort((a, b) => a.cost - b.cost)
      for (let worker of sortedWorkers) {
        if (!taskWorkers.includes(worker.email)) {
          taskWorkers.push(worker.email)
        }
      }
      result.push(taskWorkers)
      return result
    }, [])
  }
}

const sched = new WorkScheduler([
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
])

const boo = sched.scheduleAllTasks([
  "brickwork",
  "brickwork",
  "brickwork",
])

console.log(boo)
