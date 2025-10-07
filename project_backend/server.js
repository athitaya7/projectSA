import express from 'express';
import mysql from 'mysql2';

const app = express();
app.use(express.json());

const db = mysql.createConnection({
  host: '127.0.0.1',   // ชื่อ host ของ MySQL
  user: 'project_user',        // ชื่อผู้ใช้
  password: 'yourpassword',    // รหัสผ่าน
  database: 'hrms', // ชื่อฐานข้อมูล 
});

// ตรวจสอบการเชื่อมต่อ
db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    return;
  }
  console.log('✅ Connected to MySQL');
});

// ดึงข้อมูลทั้งหมด
app.get('/employees', (req, res) => {
  const sql = 'SELECT * FROM employees';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ดึงข้อมูลตาม employee_code
app.get('/employees/:employee_code', (req, res) => {
  const { employee_code } = req.params;
  const sql = 'SELECT * FROM employees WHERE employee_code = ?';
  db.query(sql, [employee_code], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(results[0]);
  });
});

// เพิ่มพนักงานใหม่
app.post('/employees', (req, res) => {
  const { employee_code, user_id, first_name, last_name, position, department, hire_date } = req.body;
  const sql = `INSERT INTO employees 
    (employee_code, user_id, first_name, last_name, position, department, hire_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [employee_code, user_id, first_name, last_name, position, department, hire_date], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee added!', employee_code });
  });
});

// ✅ อัปเดตข้อมูลพนักงาน
app.put('/employees/:employee_code', (req, res) => {
  const { employee_code } = req.params;
  const { first_name, last_name, position, department } = req.body;
  const sql = `UPDATE employees 
               SET first_name=?, last_name=?, position=?, department=? 
               WHERE employee_code=?`;
  db.query(sql, [first_name, last_name, position, department, employee_code], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Employee updated!' });
  });
});

// ✅ ลบข้อมูลพนักงาน
app.delete('/employees/:employee_code', (req, res) => {
  const { employee_code } = req.params;
  const sql = 'DELETE FROM employees WHERE employee_code=?';
  db.query(sql, [employee_code], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '🗑️ Employee deleted!' });
  });
});

// ✅ เริ่มรัน Server
app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});