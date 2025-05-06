const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', async (req, res) => {
  try {
    const response = await axios.post(
      'https://sr.delek.co.il:7443/Web_Sa_Harig_1241/Login',
      new URLSearchParams(req.body).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    res.status(response.status).send(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).send(err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
