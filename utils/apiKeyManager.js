require('dotenv').config();

class APIKeyManager {
  constructor() {
    // Load all API keys from environment
    this.apiKeys = [
      process.env.NEWS_API_KEY_1,
      process.env.NEWS_API_KEY_2,
      process.env.NEWS_API_KEY_3,
      process.env.NEWS_API_KEY_4,
    ].filter(key => key); // Filter out undefined keys

    this.currentKeyIndex = 0;
    this.failedKeys = new Set(); // Track failed keys

    console.log(`Loaded ${this.apiKeys.length} API keys`);
  }

  /**
   * Get the current API key
   */
  getCurrentKey() {
    return this.apiKeys[this.currentKeyIndex];
  }

  /**
   * Get current key index (for logging)
   */
  getCurrentKeyIndex() {
    return this.currentKeyIndex + 1; // 1-based for user-friendly logging
  }

  /**
   * Mark current key as failed and rotate to next
   */
  rotateKey() {
    const failedKey = this.apiKeys[this.currentKeyIndex];
    this.failedKeys.add(failedKey);

    console.warn(
      `API Key ${this.getCurrentKeyIndex()} failed. Marking as failed and rotating...`
    );

    // Find next available key
    let rotated = false;
    for (let i = 0; i < this.apiKeys.length; i++) {
      this.currentKeyIndex = (this.currentKeyIndex + 1) % this.apiKeys.length;
      const nextKey = this.apiKeys[this.currentKeyIndex];

      if (!this.failedKeys.has(nextKey)) {
        console.log(`Rotated to API Key ${this.getCurrentKeyIndex()}`);
        rotated = true;
        break;
      }
    }

    if (!rotated) {
      console.error('All API keys have failed!');
      // Reset failed keys and restart from first key
      this.failedKeys.clear();
      this.currentKeyIndex = 0;
      console.log('Reset all keys. Starting fresh from Key 1');
    }

    return this.apiKeys[this.currentKeyIndex];
  }

  /**
   * Check if response indicates API key limit reached
   */
  isKeyLimitError(error, status) {
    const limitErrors = [401, 429, 403];
    return limitErrors.includes(status) || error.includes('apiKey') || error.includes('limit');
  }

  /**
   * Get status of all keys
   */
  getStatus() {
    return {
      currentKey: this.getCurrentKeyIndex(),
      totalKeys: this.apiKeys.length,
      failedKeys: Array.from(this.failedKeys).length,
      availableKeys: this.apiKeys.length - this.failedKeys.size,
    };
  }
}

module.exports = new APIKeyManager();
