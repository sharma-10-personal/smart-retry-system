class RetryHandler {
  constructor({
    strategy = "fixed",
    baseDelay = 1000,
    maxRetries = 5,
    onRetry = () => {},
    onSuccess = () => {},
    onFailure = () => {},
  } = {}) {
    this.strategy = require(`./strategies/${strategy}.js`);
    this.baseDelay = baseDelay;
    this.maxRetries = maxRetries;
    this.onRetry = onRetry;
    this.onSuccess = onSuccess;
    this.onFailure = onFailure;
  }

  async execute(task, attempt = 1) {
    try {
      const result = await task();
      this.onSuccess(result);
      return result;
    } catch (error) {
      if (attempt >= this.maxRetries) {
        this.onFailure(error);
        throw error;
      }

      const delay = this.strategy(attempt, this.baseDelay);
      this.onRetry(attempt, delay);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.execute(task, attempt + 1);
    }
  }
}

module.exports = RetryHandler;
