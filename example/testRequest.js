const RequestHandler = require("../src/index");
const requestHandler = new RequestHandler();

(async () => {
  try {
    const response = await requestHandler.sendRequest({
      url: "https://httpstat.us/500",
      method: "POST",
      data: {}, // body data needs to be passed
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_ACCESS_TOKEN",
      },
      maxRetries: 3,
      retryStrategy: "fibonacci",
    });
    console.log("Response received:", response);
  } catch (error) {
    console.error("Request permanently failed:", error.message);
  }
})();
