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

// Model mapping
const modelMap = {
  'OpenAI': 'gpt-oss-20b',                 // free
  'Meta': 'llama-3.3-70b-instruct',        // free
};

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required' });

    const apiModel = modelMap[model] || 'gpt-oss-20b';

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: apiModel,
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
    res.status(500).json({
      error: 'Internal server error',
      details: error.response?.data || error.message,
    });
  }
});

// Serve main HTML file (SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
