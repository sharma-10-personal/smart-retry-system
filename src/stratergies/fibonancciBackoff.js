function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

module.exports = function fibonacciBackoff(attempt, baseDelay = 1000) {
  return baseDelay * fibonacci(attempt); // Fibonacci sequence for delay
};
