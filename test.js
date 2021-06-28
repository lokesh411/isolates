const axios = require('axios')
const uuid = require('uuid')
const hostName = process.env.HOST_NAME || "52.140.112.99"

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const botList = [
  "botXmppUsername",
  "123456vvv",
  "x1579767731210",
  "x1579767763092",
  "x1579767801627",
  "x1579768180706",
  "x1579772116907",
  "x1579772746497",
  "x1580060263487",
  "x1580093616453",
  "x1580094095453",
  "x1580094368148",
  "x1580094763263",
  "x1580095114866",
  "x1580095673748",
  "x1580095739591",
  "x1580096283928",
  "x1580096673537",
];

const length = botList.length;

(async () => {
  let totalTime = 0, totalBatches = 100, totalCallsInABatch = 20
  for (let i = 0; i < totalBatches; i++) {
    const startTime = Date.now()
    const axiosCalls = Array(totalCallsInABatch).fill(1).map((_, index) => {
      const workerId = uuid.v4()
      const randomBotId = Math.ceil(Math.random() * 100) % length;
      const params = { id: workerId, botId: randomBotId };
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