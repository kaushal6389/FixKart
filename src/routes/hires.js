const express = require('express');
const router = express.Router();
const { readJson, writeJson } = require('../data/db');

router.post('/', (req, res) => {
  const { expert, name, phone, location, requirement } = req.body;

  if (!expert || !name || !phone || !location) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hires = readJson('hires.json');
  const record = {
    id: Date.now(),
    expert,
    name,
    phone,
    location,
    requirement: requirement || '',
    createdAt: new Date().toISOString(),
  };

  hires.push(record);
  writeJson('hires.json', hires);

  res.status(201).json(record);
});

router.get('/', (_req, res) => {
  const hires = readJson('hires.json');
  res.json(hires);
});

module.exports = router;
