const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use DeepSeek R1 0528 model
    const model = 'deepseek/deepseek-r1-0528';

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      response: aiResponse,
      model: model,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Chat API error:', error.response?.data || error.message);

    const msg = error.response?.data?.error?.message || 'Internal server error';
    res.status(error.response?.status || 500).json({ response: msg });
  }
});

// Serve the main HTML file for all routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your app at: http://localhost:${PORT}`);
});
