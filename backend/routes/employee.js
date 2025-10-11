import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// ดึงข้อมูล profile ของตัวเอง
router.get('/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT e.*, u.username, r.role_name
      FROM employees e
      JOIN users u ON e.user_id = u.user_id
      JOIN roles r ON u.role_id = r.role_id
      WHERE e.user_id = ?
    `, [userId]);
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// เพิ่ม route สำหรับ payroll, leave, training, documents ตามต้องการ
export default router;
