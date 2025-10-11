import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// ดึงข้อมูลพนักงานทั้งหมด
router.get('/employees', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT e.*, u.username, r.role_name
      FROM employees e
      JOIN users u ON e.user_id = u.user_id
      JOIN roles r ON u.role_id = r.role_id
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

export default router;
