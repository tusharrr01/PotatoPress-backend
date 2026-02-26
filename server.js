const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
let FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ensure URL includes protocol
if (FRONTEND_URL && !/^https?:\/\//i.test(FRONTEND_URL)) {
  console.warn(`FRONTEND_URL missing protocol, prepending https://: ${FRONTEND_URL}`);
  FRONTEND_URL = `https://${FRONTEND_URL}`;
}

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/news', require('./routes/news'));

// Basic health check
app.get('/', (req, res) => {
  res.json({ message: 'PotatoPress Backend API is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
