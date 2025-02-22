class HttpStatusHandler {
  /**
   * Determines if a request should be retried based on HTTP status code.
   * @param {Error} error - The error object from the failed request.
   * @returns {boolean} - Returns true if the request should be retried.
   */
  static shouldRetry(error) {
    if (!error || !error.message) return false;

    // Extract HTTP status code from the error message
    const statusCode = HttpStatusHandler.extractStatusCode(error.message);

    // List of status codes that are safe to retry
    const retryableStatusCodes = [408, 429, 500, 502, 503, 504];

    return retryableStatusCodes.includes(statusCode);
  }

  /**
   * Extracts the HTTP status code from an error message (if available).
   * @param {string} errorMessage - The error message string.
   * @returns {number} - The extracted HTTP status code or -1 if not found.
   */
  static extractStatusCode(errorMessage) {
    const match = errorMessage.match(/\d{3}/); // Find a 3-digit HTTP status
    return match ? parseInt(match[0], 10) : -1;
  }
}

module.exports = HttpStatusHandler;
