const app = require('express')();
const worker = require('./worker')

app.use('/health', (req, res) => {
  worker.startWorker(req, res)
})

app.use('/health-check', (_req, res) => {
  res.json({ working: true })
})

app.use('/piscina', (req, res) => {
  worker.startPiscinaWorker(req, res)
})

app.listen(5000, () => console.log('Started the server'))