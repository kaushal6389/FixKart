const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/db');

router.get('/', (_req, res) => {
  const experts = readJson('experts.json');
  res.json(experts);
});

// POST route to register new expert
router.post('/register', (req, res) => {
  try {
    console.log('=== Expert Registration Request ===');
    console.log('Request body:', req.body);
    
    const experts = readJson('experts.json');
    console.log('Current experts count:', experts.length);
    
    // Generate new ID
    const newId = experts.length > 0 ? Math.max(...experts.map(e => e.id)) + 1 : 1;
    console.log('Generated new ID:', newId);
    
    // Create new expert object
    const newExpert = {
      id: newId,
      name: req.body.name,
      category: req.body.category,
      city: req.body.city,
      rating: 0, // New experts start with 0 rating
      rate: `₹${req.body.rate}/hr`,
      email: req.body.email,
      phone: req.body.phone,
      experience: req.body.experience,
      bio: req.body.bio || req.body.description,
      registeredAt: new Date().toISOString()
    };
    
    console.log('New expert object:', newExpert);
    
    // Add to experts array
    experts.push(newExpert);
    console.log('Total experts after adding:', experts.length);
    
    // Save to file
    writeJson('experts.json', experts);
    console.log('Saved to experts.json successfully');
    
    const response = { 
      success: true, 
      message: 'Expert registered successfully!',
      expert: newExpert 
    };
    
    console.log('Sending response:', response);
    res.json(response);
    
  } catch (error) {
    console.error('=== Expert Registration Error ===');
    console.error('Error details:', error);
    console.error('Stack trace:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to register expert: ' + error.message 
    });
  }
});

module.exports = router;
