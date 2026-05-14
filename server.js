const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // serves index.html

// Connect to SQLite (creates file if it doesn't exist)
const db = new sqlite3.Database('./database.db');

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS user_inputs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/api/submit', (req, res) => {
  const { name, email, message } = req.body;

  db.run(`INSERT INTO user_inputs (name, email, message) VALUES (?, ?, ?)`,
    [name, email, message],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ success: true, id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`Open your browser → http://localhost:${PORT}`);
});