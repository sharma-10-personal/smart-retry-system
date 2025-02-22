module.exports = function jitter(attempt, baseDelay = 1000) {
  const randomFactor = Math.random() * baseDelay;
  return baseDelay + randomFactor; // Adds randomness
};
