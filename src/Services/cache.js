// src/Services/cache.js
const cache = {
  homeData: null,
  timestamp: null,
  expiry: 5 * 60 * 1000, // 5 minutes

  get() {
    if (this.timestamp && Date.now() - this.timestamp < this.expiry) {
      return this.homeData;
    }
    return null;
  },

  set(data) {
    this.homeData = data;
    this.timestamp = Date.now();
  }
};

export default cache;