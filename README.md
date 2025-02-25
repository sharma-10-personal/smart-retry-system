# smart-retry-system
This is a smart way of retrying an API call with many different kinds of retry mechanism

1️⃣ Auto-Detect Network Errors & Handle Specific Scenarios
✅ Support circuit breaker pattern to stop retries if the system is overloaded.
✅ Retry based on status codes + custom error handling.


3️⃣ Smart Rate-Limiting & Queuing
✅ Rate Limit Handling: Automatically adjust retry strategy based on API rate limits (Retry-After headers).
✅ Queue Requests: When the limit is hit, queue requests and retry when allowed.

4️⃣ Plug & Play Middleware for Popular Libraries
✅ Support Axios, Fetch, GraphQL, and even WebSockets.
✅ Allow seamless integration with express.js or other frameworks.

5️⃣ Custom Retry Policies
✅ Let developers define custom retry rules based on the request/response.
✅ Support dynamic retry intervals based on response time and errors.
