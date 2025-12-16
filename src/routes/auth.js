const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/db');

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const users = readJson('users.json');
  let user = users.find((u) => u.username === username || u.email === username);

  if (!user) {
    // For backwards compatibility - create basic user
    user = { id: Date.now(), username };
    users.push(user);
    writeJson('users.json', users);
  }

  res.json({ token: `mock-${user.id}`, user });
});

router.post('/signup', (req, res) => {
  const { fullName, username, email, phone, password, city } = req.body;
  
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const users = readJson('users.json');
  
  // Check if username or email already exists
  const existingUser = users.find((u) => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'Username or email already exists' });
  }

  // Create new user
  const newUser = {
    id: Date.now(),
    fullName,
    username,
    email,
    phone,
    password, // In production, hash this password!
    city,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeJson('users.json', users);

  res.status(201).json({ 
    message: 'Account created successfully',
    user: { id: newUser.id, fullName: newUser.fullName, username: newUser.username, email: newUser.email }
  });
});

router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out' });
});

module.exports = router;
