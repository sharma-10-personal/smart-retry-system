const axios = require("axios");

class RequestHandler {
  async sendRequest({
    url,
    method = "GET",
    data = null,
    headers = {},
    maxRetries = 3,
    retryStrategy = "exponential",
    type = "REST",
  }) {
    let attempt = 0;

    // Modify request for GraphQL outside the loop
    if (type.toUpperCase() === "GRAPHQL") {
      method = "POST";
      headers["Content-Type"] = "application/json";
      data = { query: data };
    }

    while (attempt < maxRetries) {
      try {
        console.log(
          `🔄 [Attempt ${
            attempt + 1
          }] Sending ${method} request to ${url} (Type: ${type})`
        );

        const response = await axios({ url, method, data, headers });
        return response.data; // ✅ Return success response
      } catch (error) {
        attempt++;

        if (!this.shouldRetry(error) || attempt >= maxRetries) {
          console.error(
            `❌ [Attempt ${attempt}] Request failed. Status: ${
              error.response?.status || "Network Error"
            }, Message: ${error.message}`
          );
          throw error;
        }

        const delay = this.getRetryDelay(retryStrategy, attempt);
        console.warn(`⏳ [Retry in ${delay}ms] (Strategy: ${retryStrategy})`);
        await this.sleep(delay);
      }
    }
  }

  shouldRetry(error) {
    if (!error.response) return true; // Network issues or timeouts
    return [500, 502, 503, 504].includes(error.response.status); // Retry only on server errors
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
