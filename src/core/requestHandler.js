const RetryManager = require("../core/retryManager");

class RequestHandler {
  constructor(options = {}) {
    this.retryManager = new RetryManager(options);
  }

  async sendRequest({ url, method = "GET", body = null, headers = {} }) {
    if (!url) throw new Error("❌ URL is required for making requests.");

    return this.retryManager.executeRequest(async () => {
      console.log(`🚀 Sending ${method} request to: ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      return response.json(); // Return JSON response if successful
    });
  }
}

module.exports = RequestHandler;
