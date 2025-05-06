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
            'Accept-Language': 'en-US,en;q=0.9,he;q=0.8',
            'Referer': 'https://sr.delek.co.il:7443/Web_Sa_Harig_1241/Login',
            'Origin': 'https://sr.delek.co.il:7443',
            'Cookie': 'ASP.NET_SessionId=2dl2qiwjmjhimdnn5nfx1fbi; TS019c62dd=01fea13720685303fa827e77e0aa50b30d8668354abbdc347097b2fa9f1517febe9a43fc46ac99ed9b9734ed6a5436da66186d4601; TS4243ba67027=08b3e4cc52ab2000e7e9e3e7f21571f211ee06fbcf1ebfe3af56f8dfe7814a54eaa11999681c1d1a084ea1d180113000d23b7813b1d851b0c7c02afa783d9a8ff4f5d9a19d33fec97d558aeeaa99649e731576e71a3a272060127f9234bc95e9'
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
