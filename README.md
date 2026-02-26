# PotatoPress Backend

Express.js backend for PotatoPress news application with automatic API key rotation.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env` file:**
   ```env
   PORT=5000
   FRONTEND_URL=http://localhost:3000  # include protocol (http:// or https://)
   NEWS_API_KEY_1=your_api_key
   NEWS_API_KEY_2=your_api_key
   NEWS_API_KEY_3=your_api_key
   NEWS_API_KEY_4=your_api_key
   ```
   Get free keys at [newsapi.org](https://newsapi.org)

3. **Start server:**
   ```bash
   npm start          # production
   npm run dev        # development
   ```

4. **Verify:** http://localhost:5000

## API Endpoints

### Get Top Headlines
```
GET /api/news/top-headlines?country=us&category=general&pageSize=10&page=1
```

**Parameters:**
- `country` - Country code (default: 'us')
- `category` - News category (default: 'general')
- `pageSize` - Articles per page (default: 3)
- `page` - Page number (default: 1)

**Response:**
```json
{
  "status": "ok",
  "totalResults": 100,
  "articles": [...]
}
```

### API Key Status
```
GET /api/news/status
```

**Response:**
```json
{
  "message": "API Key Rotation Status",
  "currentKey": 1,
  "totalKeys": 4,
  "failedKeys": 0,
  "availableKeys": 4
}
```

## Features

- Automatic API key rotation on failure
- CORS enabled for frontend
- Pagination support
- Category filtering
- API key status endpoint