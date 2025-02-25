const axios = require("axios");
const ErrorCodes = require("../config/httpStatusCodes");

class RequestHandler {
  async sendRequest({
    url,
    method = "GET",
    data = null,
    headers = {},
    maxRetries = 3,
    retryStrategy = "exponential",
  }) {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios({ url, method, data, headers });
        return response.data; // Return success response
      } catch (error) {
        attempt++;

        if (!this.shouldRetry(error) || attempt >= maxRetries) {
          throw error;
        }

        const delay = this.getRetryDelay(retryStrategy, attempt);
        await this.sleep(delay);
      }
    }
  }

  shouldRetry(error) {
    if (!error.response) return true; // Network issues or timeouts
    return ErrorCodes.SERVER_ERRORS.includes(error.response.status); // Retry only on server errors
  }

  fibonacci(n) {
    let a = 1,
      b = 1;
    for (let i = 2; i < n; i++) {
      [a, b] = [b, a + b];
    }
    return b;
  }

  getRetryDelay(strategy, attempt, baseDelay = 1000, maxDelay = 30000) {
    console.log(strategy);
    switch (strategy) {
      case "exponential":
        return Math.min(baseDelay * 2 ** attempt, maxDelay);

      case "fibonacci":
        return Math.min(this.fibonacci(attempt) * baseDelay, maxDelay);

      case "fixed-delay":
        return Math.min(baseDelay, maxDelay);

      case "jitter":
        let jitter = Math.random() * baseDelay; // Full Jitter
        return Math.min(baseDelay / 2 + jitter, maxDelay);

      default:
        throw new Error(`Invalid retry strategy: ${strategy}`);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

module.exports = RequestHandler;
