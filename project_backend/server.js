import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',   // ชื่อ host ของ MySQL
  user: 'root',        // ชื่อผู้ใช้
  password: '',    // รหัสผ่าน
  database: 'dba_project', // ชื่อฐานข้อมูล
  port: 3306
});

// ตรวจสอบการเชื่อมต่อ
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// ✅ ดึงข้อมูลทั้งหมดจากตาราง employees
app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ เพิ่มข้อมูลใหม่
app.post('/employees', (req, res) => {
  const { name, position, salary } = req.body;
  const sql = 'INSERT INTO employees (name, position, salary) VALUES (?, ?, ?)';
  db.query(sql, [name, position, salary], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee added!', id: result.insertId });
  });
});

// ✅ ดึงข้อมูลตาม id
app.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM employees WHERE id = ?';
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(results[0]);
  });
});

// ✅ อัปเดตข้อมูลพนักงาน
app.put('/employees/:id', (req, res) => {
  const { id } = req.params;
  const { name, position, salary } = req.body;
  const sql = 'UPDATE employees SET name=?, position=?, salary=? WHERE id=?';
  db.query(sql, [name, position, salary, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee updated!' });
  });
});

// ✅ ลบข้อมูลพนักงาน
app.delete('/employees/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM employees WHERE id=?';
  db.query(sql, [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '🗑️ Employee deleted!' });
  });
});

// ✅ เริ่มรัน Server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});