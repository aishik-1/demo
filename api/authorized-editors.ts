// Vercel Serverless Function for /api/authorized-editors
export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  let authorized_editors = [
    'ziyadparkar01@gmail.com',
    'aishik.roy1234@gmail.com',
    'propriyansh71@gmail.com',
  ];

  try {
    const fs = require('fs');
    const path = require('path');
    const dbPath = path.join(process.cwd(), 'data', 'database.json');
    if (fs.existsSync(dbPath)) {
      const raw = fs.readFileSync(dbPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.authorized_editors) && parsed.authorized_editors.length > 0) {
        authorized_editors = parsed.authorized_editors;
      }
    }
  } catch {}

  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ success: true, authorized_editors }));
}
