
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Placeholder AI response - easily replaceable with real AI API
    const responses = {
      'GPT-3': `GPT-3 response: "${message}" - This is a simulated response from GPT-3 model.`,
      'GPT-OSS-20B': `GPT-OSS-20B response: "${message}" - This is a simulated response from the open-source 20B model.`,
      'Claude': `Claude response: "${message}" - This is a simulated response from Claude model.`
    };
    
    const aiResponse = responses[model] || `You said: "${message}" using ${model} model.`;
    
    res.json({ 
      response: aiResponse,
      model: model,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Placeholder AI response - easily replaceable with real AI API
    const responses = {
      'GPT-3': `GPT-3 response: "${message}" - This is a simulated response from GPT-3 model.`,
      'GPT-OSS-20B': `GPT-OSS-20B response: "${message}" - This is a simulated response from the open-source 20B model.`,
      'Claude': `Claude response: "${message}" - This is a simulated response from Claude model.`
    };
    
    const aiResponse = responses[model] || `You said: "${message}" using ${model} model.`;
    
    res.json({ 
      response: aiResponse,
      model: model,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ error: 'Internal server error' });
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
