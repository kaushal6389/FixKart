const fs = require('fs');
const path = require('path');

// In-memory storage for deployment (Vercel is read-only)
let inMemoryStorage = {};

function readJson(file) {
  const filePath = path.join(__dirname, file);
  
  // Try to read from file first (works locally)
  if (fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, 'utf8') || '[]';
      const data = JSON.parse(raw);
      
      // Store in memory for Vercel deployment
      inMemoryStorage[file] = data;
      return data;
    } catch (e) {
      console.error('Failed to parse JSON for', filePath, e);
    }
  }
  
  // Return from memory if file doesn't exist or can't be read
  return inMemoryStorage[file] || [];
}

function writeJson(file, data) {
  // Always update in-memory storage
  inMemoryStorage[file] = data;
  
  // Try to write to file (works locally, fails on Vercel but won't crash)
  try {
    const filePath = path.join(__dirname, file);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.log('Write to file skipped (read-only filesystem):', file);
    // Silently fail on Vercel - data is stored in memory
  }
}

module.exports = { readJson, writeJson };
