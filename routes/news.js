const express = require('express');
const router = express.Router();
const apiKeyManager = require('../utils/apiKeyManager');

// GET /api/news/top-headlines
router.get('/top-headlines', async (req, res) => {
  try {
    const { country = 'us', category = 'general', pageSize = 3, page = 1 } = req.query;

    // Try with different keys if one fails
    let data;
    let error;
    let attemptsLeft = apiKeyManager.apiKeys.length;

    while (attemptsLeft > 0) {
      try {
        const apiKey = apiKeyManager.getCurrentKey();
        const keyIndex = apiKeyManager.getCurrentKeyIndex();

        console.log(
          `Fetching news with API Key ${keyIndex}/${apiKeyManager.apiKeys.length}`
        );

        const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&page=${page}&apiKey=${apiKey}`;

        const response = await fetch(url);
        data = await response.json();

        // Check if the response indicates an API key error
        if (!response.ok || data.status === 'error') {
          throw {
            status: response.status,
            message: data.message || 'API request failed',
          };
        }

        // Success! Return the data
        console.log(`Successfully fetched news with API Key ${keyIndex}`);
        return res.json(data);
      } catch (err) {
        error = err;
        console.error(`Error with current API key:`, error);

        // Rotate to next key and try again
        apiKeyManager.rotateKey();
        attemptsLeft--;

        if (attemptsLeft > 0) {
          console.log(`Retrying with next API key...`);
        }
      }
    }

    // All keys failed
    console.error('All API keys exhausted or failed');
    return res.status(500).json({
      error: 'All API keys have been exhausted',
      details: error?.message || 'Unknown error',
      status: apiKeyManager.getStatus(),
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Unexpected server error' });
  }
});

// Optional: Get API key rotation status
router.get('/status', (req, res) => {
  res.json({
    message: 'API Key Rotation Status',
    ...apiKeyManager.getStatus(),
  });
});

module.exports = router;
