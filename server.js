const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./cards.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT NOT NULL,
    match TEXT NOT NULL,
    category TEXT DEFAULT 'general'
  )`);
});

app.get('/', (req, res) => {
  res.send('Tech Match API is running.');
});

app.get('/api/pairs', (req, res) => {
  const { category } = req.query;
  const sql = category && category !== 'all'
    ? "SELECT term, match FROM pairs WHERE category = ?"
    : "SELECT term, match FROM pairs";
  const params = category && category !== 'all' ? [category] : [];

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/pairs', (req, res) => {
  const { term, match, category } = req.body;
  db.run("INSERT INTO pairs (term, match, category) VALUES (?, ?, ?)",
    [term, match, category],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
