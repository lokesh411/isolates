class RunState {
  #tasksRunning;
  constructor() {
    this.#tasksRunning = {}
  }
  getRunningTasksForBot(botId) {
    return this.#tasksRunning[botId] || 0;
  }
  incrementRunningTasksForBot(botId) {
    if (!this.#tasksRunning[botId]) {
      this.#tasksRunning[botId] = 1
    } else {
      this.#tasksRunning[botId]++;
    }
  }
  decrementRunningTasksForBot(botId) {
    if (this.#tasksRunning[botId]) {
      this.#tasksRunning[botId]--;
    }
  }
  totalRunningTasks() {
    return Object.keys(this.#tasksRunning).length
  }
}

module.exports = RunState;