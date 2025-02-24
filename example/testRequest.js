const RequestHandler = require("../src/core/requestHandler");
const requestHandler = new RequestHandler();

(async () => {
  try {
    const response = await requestHandler.sendRequest({
      url: "https://httpbin.org/status/500",
      method: "GET",
      maxRetries: 5,
      retryStrategy: "fibonacci",
      type: "REST", // Specify REST API
    });
    console.log("🎉 Response received:", response);
  } catch (error) {
    console.error("❌ Request permanently failed:", error.message);
  }
})();
