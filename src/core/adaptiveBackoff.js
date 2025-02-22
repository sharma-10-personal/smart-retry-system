class AdaptiveBackoff {
  static getDelay(attempt, strategy) {
    switch (strategy) {
      case "exponential":
        return Math.pow(2, attempt) * 100;
      case "fibonacci":
        return AdaptiveBackoff.fibonacci(attempt) * 100;
      case "jitter":
        return Math.random() * (Math.pow(2, attempt) * 100);
      default:
        return 1000; // Default to 1 second
    }
  }

  static fibonacci(n) {
    return n <= 1
      ? n
      : AdaptiveBackoff.fibonacci(n - 1) + AdaptiveBackoff.fibonacci(n - 2);
  }
}

module.exports = AdaptiveBackoff;
