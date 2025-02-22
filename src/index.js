const RetryManager = require("./core/retryManager");
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();

module.exports = function smartRetry(requestFn, options) {
  const retryManager = new RetryManager({ ...options, eventEmitter });

  // Expose events for users
  return retryManager.executeRequest(requestFn);
};

module.exports.onRetry = (callback) => eventEmitter.on("onRetry", callback);
module.exports.onSuccess = (callback) => eventEmitter.on("onSuccess", callback);
module.exports.onFailure = (callback) => eventEmitter.on("onFailure", callback);
