const { StaticPool } = require('node-worker-threads-pool')
const Piscina = require('piscina')
const path = require('path')
const RunningState = require('./state')
const staticPool = new StaticPool({
  size: parseInt(process.env.THREAD_POOL_COUNT) || 1,
  task: './spawn.js'
})

// TODO: we can integrate this in the library itself to have more control of things
const runningState = new RunningState();

const code = `
  return new Promise((resolve, reject) => {
    let i=0;
    while(i<1000000) {
      i++
    }
    // app.print("Done in the while loop inside the script :: ", workerId)
    return resolve(5)
  })
`
const evenCode = `
  return new Promise((resolve, reject) => {
    let i=0;
    while(i<10) {
      i++
    }
    // app.print("Done in the while loop inside the script :: ", workerId)
    return resolve(6)
  })
`
const startWorker = async (req, res) => {
  try {
    console.info(`Initializing worker for workerId :: ${req.query.id} even:: ${req.query.even || false}`)
    const result = await staticPool.createExecutor().setTimeout(3000).exec({ code: req.query.even ? evenCode : code, workerId: req.query.id })
    console.log('Fetched the result :: ', result)
    res.json({ done: true })
  } catch (error) {
    console.error(`Error in the worker :: ${req.query.id} :: `, error)
    res.json({ error: true })
  }
}

const pool = new Piscina({
  filename: path.join(__dirname, 'piscina-spawn.js'),
  minThreads: 10,
  maxThreads: 100,
  concurrentTasksPerWorker: 20,
})

const startPiscinaWorker = async (req, res) => {
  const botId = req.query.botId; // having botId to make more relavancy
  if (!botId) {
    return res.json({ error: "botId is missing" })
  }
  console.log(`Running tasks for botId :: `, runningState.getRunningTasksForBot(botId))
  if (runningState.getRunningTasksForBot(botId) > 5) {
    console.log(`Number of tasks exceeded for botId :: ${botId}`)
    return res.json({ error: true })
  }
  try {
    // console.info(`Initializing worker for workerId :: ${req.query.id} even:: ${req.query.even || false} total number of tasks running :: ${runningState.totalRunningTasks()}`)
    console.log("stats :: ", pool.completed, pool.runTime)
    runningState.incrementRunningTasksForBot(botId)
    const result = await pool.run({ code: req.query.even ? evenCode : code, workerId: req.query.id }, { name: "runCode" })
    console.log('Fetched the result :: ', result)
    res.json({ done: true })
  } catch (error) {
    console.error(`Error in the worker :: ${req.query.id} :: `, error)
    res.json({ error: true })
  } finally {
    runningState.decrementRunningTasksForBot(botId)
  }
}

module.exports = {
  startWorker,
  startPiscinaWorker
}