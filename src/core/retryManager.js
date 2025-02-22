const NetworkMonitor = require("../handlers/networkMonitor");
const CircuitBreaker = require("./circuitBreaker");
const AdaptiveBackoff = require("./adaptiveBackoff");
const HttpStatusHandler = require("../handlers/httpStatusHandler");

class RetryManager {
  constructor(options = {}) {
    this.maxRetries = options.maxRetries || 5;
    this.backoffStrategy = options.backoffStrategy || "exponential"; // Default to exponential
    this.circuitBreaker = new CircuitBreaker(options.breakerConfig || {});
    this.eventEmitter = options.eventEmitter;
  }

  async executeRequest(requestFn) {
    let attempts = 0;

    while (attempts < this.maxRetries) {
      try {
        // If Circuit Breaker is Open, stop retrying
        if (this.circuitBreaker.isOpen()) {
          throw new Error("Circuit breaker is open, stopping retries.");
        }

        // Detect offline mode
        if (!NetworkMonitor.isOnline()) {
          console.warn("⚠️ Network offline! Waiting to retry...");
          await NetworkMonitor.waitForOnline();
        }

        const response = await requestFn();
        this.eventEmitter.emit("onSuccess", response);
        return response; // Success, return response
      } catch (error) {
        attempts++;

        // If the circuit breaker decides to stop, break the loop
        if (this.circuitBreaker.shouldStop(error)) {
          console.error("🛑 Circuit breaker activated! Stopping retries.");
          break;
        }

        // Check if we should retry based on status codes
        if (!HttpStatusHandler.shouldRetry(error)) {
          console.warn("🚨 Non-retryable error:", error.message);
          throw error;
        }

        // Apply backoff before retrying
        const delay = AdaptiveBackoff.getDelay(attempts, this.backoffStrategy);
        console.log(`🔄 Retrying request in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));

        this.eventEmitter.emit("onRetry", { attempt: attempts, error });
      }
    }

    // If all retries fail
    this.eventEmitter.emit("onFailure", { attempts });
    throw new Error("Max retries reached. Request failed.");
  }
}

module.exports = RetryManager;
