const { parentPort, threadId } = require('worker_threads')
const app = require('./utils')

const runCode = async (code, workerId) => {
  const wrapper = new Function("app", "workerId", code)
  const result = await wrapper(app, workerId)
  console.log('result :: ', result, workerId, threadId)
  parentPort.postMessage({ result, workerId, threadId })
  // process.exit()
}

parentPort.on('message', (event) => {
  if (event.code && event.workerId) {
    runCode(event.code, event.workerId)
  }
})