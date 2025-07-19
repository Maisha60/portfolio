import express from 'express';
import mysql from 'mysql2';
import cors from 'cors'; // ✅ CORS import

const app = express();
const PORT = 3000;

// ✅ Enable CORS for all origins
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',  // ⚠️ make sure this is correct
  database: 'portfolio_db',
  port: 3307          
});


db.connect(err => {
  if (err) {
    console.error('DB connection error:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

// ✅ POST API
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  const sql = 'INSERT INTO contacts (name, email, message, created_at) VALUES (?, ?, ?, NOW())';
  db.query(sql, [name, email, message], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Sign Up API
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Email may already exist.' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// Login API
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }
  const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, error: 'Database error' });
    }
    if (results.length > 0) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  });
});
