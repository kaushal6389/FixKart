const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/db');

router.get('/', (_req, res) => {
  const requests = readJson('requests.json');
  res.json(requests);
});

router.post('/', (req, res) => {
  console.log('=== New Request Received ===');
  console.log('Request body:', req.body);
  
  const { title, description, location, category, budget, email } = req.body;

  // Validation
  if (!category || !description || !location || !email) {
    console.log('Validation failed - missing fields');
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields',
      message: 'Please fill in all required fields'
    });
  }

  try {
    const requests = readJson('requests.json');
    
    const newRequest = {
      id: Date.now(),
      title: title || `${category} Service Required`,
      description,
      location,
      category,
      budget: budget || 'Not specified',
      email,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('New request created:', newRequest);
    
    requests.push(newRequest);
    writeJson('requests.json', requests);
    
    console.log('Request saved successfully');
    
    res.status(201).json({ 
      success: true, 
      message: 'Request posted successfully',
      request: newRequest
    });
  } catch (error) {
    console.error('Error saving request:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: 'Failed to save request: ' + error.message
    });
  }
});

module.exports = router;
