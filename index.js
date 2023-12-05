// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Create a table for departments
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS departments (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)');
});

// Get all departments
app.get('/departments', (req, res) => {
  db.all('SELECT * FROM departments', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(rows);
    }
  });
});

// Create a new department
app.post('/departments', (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Department name is required' });
    return;
  }

  db.run('INSERT INTO departments (name) VALUES (?)', [name], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ id: this.lastID, name });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
