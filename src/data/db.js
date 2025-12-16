const fs = require('fs');
const path = require('path');

// Default data for Vercel deployment
const defaultExperts = [
  {"id":1,"name":"Rajesh Kumar","category":"Electrical","city":"Mumbai, Maharashtra","rating":4.9,"rate":"₹500–800/hr","experience":"15+ years","bio":"Expert electrician specializing in residential and commercial wiring, switchboard installation, and lighting solutions."},
  {"id":2,"name":"Amit Singh","category":"Mechanical","city":"Delhi, NCR","rating":4.8,"rate":"₹600–900/hr","experience":"12+ years","bio":"Skilled mechanical engineer with expertise in HVAC systems, machinery repair, and industrial equipment maintenance."},
  {"id":3,"name":"Suresh Reddy","category":"Civil","city":"Bangalore, Karnataka","rating":4.9,"rate":"₹550–850/hr","experience":"18+ years","bio":"Experienced civil contractor specializing in construction, renovation, waterproofing, and structural repairs."},
  {"id":4,"name":"Priya Sharma","category":"Electrical","city":"Pune, Maharashtra","rating":4.7,"rate":"₹700–1000/hr","experience":"10+ years","bio":"Certified electrical engineer focusing on smart home automation, solar installations, and energy-efficient solutions."},
  {"id":5,"name":"Vikram Patel","category":"Electronics","city":"Ahmedabad, Gujarat","rating":4.8,"rate":"₹800–1200/hr","experience":"14+ years","bio":"Electronics repair specialist with expertise in laptops, smartphones, tablets, and computer hardware troubleshooting."},
  {"id":6,"name":"Arjun Mehta","category":"Plumbing","city":"Chennai, Tamil Nadu","rating":4.9,"rate":"₹650–950/hr","experience":"16+ years","bio":"Licensed plumber with comprehensive knowledge of pipe fitting, leak detection, drainage systems, and bathroom fixtures."},
  {"id":7,"name":"Deepak Yadav","category":"Plumbing","city":"Hyderabad, Telangana","rating":4.6,"rate":"₹500–750/hr","experience":"8+ years","bio":"Professional plumber specializing in kitchen and bathroom installations, water heater repairs, and pipeline maintenance."},
  {"id":8,"name":"Kavita Desai","category":"Appliance","city":"Jaipur, Rajasthan","rating":4.8,"rate":"₹600–900/hr","experience":"11+ years","bio":"Home appliance repair expert for AC, refrigerators, washing machines, microwave ovens, and kitchen appliances."},
  {"id":9,"name":"Anita Reddy","category":"Appliance","city":"Kochi, Kerala","rating":4.7,"rate":"₹550–800/hr","experience":"9+ years","bio":"Appliance technician with expertise in air conditioner servicing, refrigerator repair, and home appliance maintenance."},
  {"id":10,"name":"Rahul Verma","category":"Civil","city":"Lucknow, Uttar Pradesh","rating":4.9,"rate":"₹700–1100/hr","experience":"20+ years","bio":"Senior civil engineer specializing in building construction, interior design, flooring, and complete home renovation projects."},
  {"id":11,"name":"Manish Joshi","category":"Mechanical","city":"Indore, Madhya Pradesh","rating":4.6,"rate":"₹550–850/hr","experience":"13+ years","bio":"Mechanical expert for car servicing, bike repairs, automotive diagnostics, and vehicle maintenance solutions."},
  {"id":12,"name":"Sunita Nair","category":"Electronics","city":"Coimbatore, Tamil Nadu","rating":4.8,"rate":"₹650–950/hr","experience":"12+ years","bio":"Electronics technician specializing in TV repairs, home theatre systems, gaming consoles, and electronic gadget servicing."}
];

const defaultRequests = [
  {"id":1734691442277,"title":"Electrical Service Required","description":"Need urgent electrical wiring work for new 3BHK flat. Complete rewiring needed including switchboard installation and lighting fixtures.","location":"Andheri West, Mumbai","category":"Electrical","budget":"₹25,000","email":"raj.patel@email.com","status":"pending","createdAt":"2025-12-10T10:30:00.000Z"},
  {"id":1734737888519,"title":"Plumbing Service Required","description":"Kitchen sink and bathroom pipes need repair. Water leakage issue in main pipeline. Need experienced plumber.","location":"Sector 18, Noida","category":"Plumbing","budget":"₹8,000","email":"amit.sharma@email.com","status":"pending","createdAt":"2025-12-11T14:20:00.000Z"},
  {"id":1734800000000,"title":"AC Repair Service Required","description":"Split AC not cooling properly. Compressor making noise. Need technician for inspection and repair.","location":"Koramangala, Bangalore","category":"Appliance","budget":"₹5,000","email":"priya.reddy@email.com","status":"pending","createdAt":"2025-12-12T09:15:00.000Z"}
];

const defaultHires = [
  {"id":1734897579657,"expertId":1,"expertName":"Rajesh Kumar","customerName":"Amit Verma","phone":"9876543210","location":"Andheri West, Mumbai","requirement":"Complete electrical wiring for 3BHK flat including switchboard and lighting fixtures installation.","serviceType":"Electrical","status":"completed","createdAt":"2025-12-10T12:30:00.000Z"},
  {"id":1734897680000,"expertId":3,"expertName":"Suresh Reddy","customerName":"Neha Sharma","phone":"9988776655","location":"Koramangala, Bangalore","requirement":"Bathroom waterproofing and wall tile repair work needed urgently.","serviceType":"Civil","status":"in-progress","createdAt":"2025-12-12T14:00:00.000Z"}
];

// In-memory storage for deployment (Vercel is read-only)
let inMemoryStorage = {
  'experts.json': defaultExperts,
  'requests.json': defaultRequests,
  'hires.json': defaultHires,
  'users.json': []
};

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
