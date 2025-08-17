// server.js
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// AI chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, model } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const response = await axios.post(
      'https://reallyopen-ai.onrender.com', // Your backend AI endpoint
      {
        prompt: message,
        model: model
      },
      {
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        }
      }
    );

    // Send AI response back to frontend
    res.json({ response: response.data });
  } catch (err) {
    console.error('Error contacting AI:', err.response?.data || err.message);
    res.status(500).json({ error: 'AI request failed' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
