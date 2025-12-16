const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/db');

router.get('/', (_req, res) => {
  const requests = readJson('requests.json');
  res.json(requests);
});

router.post('/', (req, res) => {
  const { title, description, location, date, category, photos } = req.body;

  if (!title || !description || !location || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const requests = readJson('requests.json');
  const newReq = {
    id: Date.now(),
    title,
    description,
    location,
    date: date || null,
    category,
    photos: photos || [],
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  requests.push(newReq);
  writeJson('requests.json', requests);
  res.status(201).json(newReq);
});

module.exports = router;
