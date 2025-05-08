const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./cards.db');

// Initialize DB schema + seed data if needed
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    term TEXT NOT NULL,
    match TEXT NOT NULL,
    category TEXT DEFAULT 'general'
  )`);

  db.get("SELECT COUNT(*) AS count FROM pairs", (err, row) => {
    if (row.count === 0) {
      console.log("Seeding database...");

      const seedData = [
        // .NET
        ['Blazor', 'WebAssembly', 'dotnet'],
        ['Entity Framework', 'ORM', 'dotnet'],
        ['ASP.NET', 'Web Development', 'dotnet'],
        ['TFS', 'Azure DevOps', 'dotnet'],

        // Java
        ['Spring Boot', 'Java', 'java'],
        ['Hibernate', 'ORM', 'java'],
        ['Maven', 'Build Tool', 'java'],
        ['JVM', 'Java Runtime', 'java'],

        // Cloud
        ['Lambda', 'AWS', 'cloud'],
        ['S3', 'Object Storage', 'cloud'],
        ['Azure Functions', 'Serverless', 'cloud'],
        ['CloudFormation', 'AWS Infrastructure as Code', 'cloud'],
        ['Bicep', 'Azure Infrastructure as Code', 'cloud'],

        // API
        ['GraphQL', 'Query Language', 'api'],
        ['REST', 'Architectural Style', 'api'],
        ['SOAP', 'Protocol', 'api'],
        ['OpenAPI', 'Specification', 'api'],
      ];

      const insertStmt = db.prepare("INSERT INTO pairs (term, match, category) VALUES (?, ?, ?)");
      seedData.forEach(([term, match, category]) => {
        insertStmt.run(term, match, category);
      });
      insertStmt.finalize();
    } else {
      console.log("Database already seeded.");
    }
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Tech Match API is running.');
});

// Get flashcard pairs
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

// Add a new flashcard pair
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
