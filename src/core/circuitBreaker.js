class CircuitBreaker {
  constructor({ failureThreshold = 3, resetTimeout = 10000 } = {}) {
    this.failureCount = 0;
    this.failureThreshold = failureThreshold;
    this.resetTimeout = resetTimeout;
    this.isOpenState = false;
  }

  shouldStop(error) {
    if (this.isOpenState) return true;

    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.isOpenState = true;
      console.warn("🚧 Circuit breaker activated! Blocking further retries.");
      setTimeout(() => this.reset(), this.resetTimeout);
      return true;
    }

    return false;
  }

  isOpen() {
    return this.isOpenState;
  }

  reset() {
    console.log("✅ Circuit breaker reset.");
    this.isOpenState = false;
    this.failureCount = 0;
  }
}

module.exports = CircuitBreaker;
