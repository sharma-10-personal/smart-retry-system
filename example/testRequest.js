const RequestHandler = require("../src/core/requestHandler");

const testRequest = async () => {
  const requestHandler = new RequestHandler({
    maxRetries: 3,
  });

  try {
    const response = await requestHandler.sendRequest({
      url: "https://httpbin.org/status/200", // Test random 500 or 200
      method: "GET",
    });

    console.log("🎉 Final Response:", response);
  } catch (error) {
    console.error("❌ Request Failed:", error.message);
  }
};

// Run the test
testRequest();
