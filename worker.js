const { StaticPool } = require('node-worker-threads-pool')
const staticPool = new StaticPool({
  size: parseInt(process.env.THREAD_POOL_COUNT) || 10,
  task: './spawn.js'
})

const code = `
  return new Promise((resolve, reject) => {
    let i=0;
    while(i<1000000) {
      i++
    }
    app.print("Done in the while loop inside the script :: ", workerId)
    return resolve(5)
  })
`
const evenCode = `
  return new Promise((resolve, reject) => {
    let i=0;
    while(i<10) {
      i++
    }
    app.print("Done in the while loop inside the script :: ", workerId)
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

module.exports = {
  startWorker
}