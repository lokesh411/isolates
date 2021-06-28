const { threadId } = require('worker_threads')
const app = require('./utils')

const runCode = async ({ code, workerId }) => {
  // console.log('code , worker id :: ', code, workerId)
  const wrapper = new Function("app", "workerId", code)
  const result = await wrapper(app, workerId)
  console.log('result :: ', result, workerId, threadId)
  return { result, workerId, threadId }
  // process.exit()
}

const functions = {}
functions.runCode = runCode;

module.exports = functions