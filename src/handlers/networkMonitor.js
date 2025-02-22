const dns = require("dns");

class NetworkMonitor {
  static async isOnline() {
    return new Promise((resolve) => {
      dns.lookup("google.com", (err) => {
        resolve(!err); // If no error, internet is available
      });
    });
  }

  static async waitForOnline() {
    console.log("🌐 Waiting for network to reconnect...");
    while (!(await this.isOnline())) {
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Check every 3 sec
    }
    console.log("✅ Network reconnected!");
  }
}

module.exports = NetworkMonitor;
