const axios = require('axios')
const uuid = require('uuid')
const hostName = process.env.HOST_NAME || "52.140.112.99"

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

(async () => {
  let totalTime = 0, totalBatches = 100, totalCallsInABatch = 20
  for (let i = 0; i < totalBatches; i++) {
    const startTime = Date.now()
    const axiosCalls = Array(totalCallsInABatch).fill(1).map((_, index) => {
      const workerId = uuid.v4()
      const params = { id: workerId };
      if (index % 2 === 0) {
        params.even = true
      }
      return axios.get(`http://${hostName}:5000/piscina`, { params, timeout: 4000 }).then(({ data: response }) => {
        console.log(`Worker id :: ${workerId} is done in batch ${i} and call ${index}`)
        if (response.error) {
          throw new Error('Error occured in the server')
        }
        return true;
      })
    })
    try {
      await axios.all(axiosCalls)
      const batchTime = Date.now() - startTime
      totalTime += batchTime
      console.log(`Batch ${i} done`)
    } catch (error) {
      console.log(`Batch ${i} failed :: `, error.stack)
    }
    await sleep(10)
  }
  console.log('Total time taken to run the test :: ', totalTime, "mseconds")
  console.log('Total time taken for a call on an average is :: ', totalTime / (totalBatches * totalCallsInABatch), "mSeconds")
})()