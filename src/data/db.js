const fs = require('fs');
const path = require('path');

function readJson(file) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf8') || '[]';
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse JSON for', filePath, e);
    return [];
  }
}

function writeJson(file, data) {
  const filePath = path.join(__dirname, file);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { readJson, writeJson };
