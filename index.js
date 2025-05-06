const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');

const app = express();

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Create HTTPS agent to ignore certificate issues
const agent = new https.Agent({ rejectUnauthorized: false });

// Health check route
app.get('/', (req, res) => {
  res.send('Proxy is alive');
});

// Login route
app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(
      'https://sr.delek.co.il:7443/Web_Sa_Harig_1241/Login',
      new URLSearchParams(req.body).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://sr.delek.co.il:7443/Web_Sa_Harig_1241/Login'
        },
        httpsAgent: agent
      }
    );

    res.status(response.status).send(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data || err.message;
    res.status(status).send(message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
