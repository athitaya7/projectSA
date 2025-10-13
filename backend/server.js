import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: "127.0.0.1",
  user: "devuser",
  password: "DevPass123!",
  database: "hrms"
};

// ✅ สร้าง connection pool สำหรับ MySQL
const db = await mysql.createPool(dbConfig);

// Secret key สำหรับ JWT
const SECRET = "supersecretkey";
// -------- Middleware ตรวจสอบ JWT ----------
const authMiddleware = (roles=[]) => async (req,res,next)=>{
   const token = req.headers["authorization"]?.split(" ")[1];
  if(!token) return res.status(401).json({message:"Token required"});
  try{
    const decoded = jwt.verify(token, SECRET); // ✅ ใช้ SECRET เดียวกับตอนสร้าง token
    if(roles.length && !roles.includes(decoded.role))
      return res.status(403).json({message:"Forbidden"});
    req.user = decoded;
    next();
  } catch(err){
    res.status(401).json({message:"Invalid token"});
  }
}

// -------- Login ----------
app.post("/api/login", async (req, res) => {
  console.log("Login request body:", req.body); // debug input

  const { username, password } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  const [rows] = await conn.execute("SELECT * FROM users WHERE username=?", [username]);
  await conn.end();

  if (rows.length === 0) return res.status(400).json({ message: "User not found" });

  const user = rows[0];
  console.log("User from DB:", user);

  // ใช้ plain text ตรวจสอบรหัส
  if (password !== user.password) 
    return res.status(400).json({ message: "Wrong password" });

  let roleName = user.role_id === 2 ? "hr" : "employee";
  const token = jwt.sign({ id: user.user_id, role: roleName }, SECRET, { expiresIn: "8h" });
  res.json({ token, role: user.role_id });
});

app.get("/api/profile", authMiddleware(["employee", "hr"]), async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET);
    console.log("Decoded token:", decoded);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // ✅ ดึง employee_code จาก user_id
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ error: "Employee not found for this user" });
    }

    const employeeCode = empRows[0].employee_code;
    console.log("Employee code found:", employeeCode);

    // ✅ ใช้ employeeCode ในทุก query ด้านล่าง
    const [personalRows] = await conn.execute(
      "SELECT employee_code, first_name, last_name, birth_date, national_id, phone, address, email, position FROM employees WHERE employee_code = ?",
      [employeeCode]
    );

    const [workRows] = await conn.execute(
      "SELECT position, department, hire_date, TIMESTAMPDIFF(YEAR, hire_date, CURDATE()) AS workAge FROM employees WHERE employee_code = ?",
      [employeeCode]
    );

    const [salaryRows] = await conn.execute(
      "SELECT base_salary, allowance, bonus FROM payroll WHERE employee_code = ?",
      [employeeCode]
    );

    const [taxRows] = await conn.execute(
      "SELECT t.social_security, t.provident_fund, t.income_tax, (t.social_security + t.provident_fund + t.income_tax) AS total_deduction, p.total_salary - (t.social_security + t.provident_fund + t.income_tax) AS net_income FROM tax_deductions AS t JOIN payroll AS p ON t.employee_code = p.employee_code WHERE t.employee_code = ?",
      [employeeCode]
    );

    const [benefitRows] = await conn.execute(
      `SELECT 
        bt.name AS benefit_name,
        be.period_start,
        be.period_end,
        be.allocation,
        IFNULL(SUM(bc.amount), 0) AS used_amount,
        (be.allocation - IFNULL(SUM(bc.amount), 0)) AS remaining_amount
      FROM benefit_entitlements AS be
      JOIN benefit_types AS bt ON be.benefit_type_id = bt.benefit_type_id
      LEFT JOIN benefit_claims AS bc ON be.entitlement_id = bc.entitlement_id
      WHERE be.employee_code = ?
      GROUP BY bt.name, be.period_start, be.period_end, be.allocation
      ORDER BY bt.name;`,
      [employeeCode]
    );

    await conn.end();

    console.log({ personalRows, workRows, salaryRows, taxRows, benefitRows });

    const profileData = {
      personalInfo: {
        firstName: personalRows[0]?.first_name || "",
        lastName: personalRows[0]?.last_name || "",
        employeeId: personalRows[0]?.employee_code || "",
        birthDate: personalRows[0]?.birth_date || "",
        idCard: personalRows[0]?.national_id || "",
        phone: personalRows[0]?.phone || "",
        address: personalRows[0]?.address || "",
        email: personalRows[0]?.email || "",
        position: personalRows[0]?.position || "",
      },
      workInfo: {
        position: workRows[0]?.position || "",
        department: workRows[0]?.department || "",
        workAge: workRows[0]?.workAge || "",
        startDate: workRows[0]?.hire_date || "",
      },
      salaryInfo: {
        baseSalary: salaryRows[0]?.base_salary || "",
        allowance: salaryRows[0]?.allowance || "",
        bonus: salaryRows[0]?.bonus || "",
      },
      taxInfo: {
        socialSecurity: taxRows[0]?.social_security || "",
        providentFund: taxRows[0]?.provident_fund || "",
        incomeTax: taxRows[0]?.income_tax || "",
        totalDeduction: taxRows[0]?.total_deduction || "",
        netIncome: taxRows[0]?.net_income || "",
      },
      benefits: benefitRows.map(b => b.benefit_name),
    };

    res.json(profileData);
  } catch (err) {
    console.error("Profile error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/leave", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // ✅ ดึง employee_code จาก user_id
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );
    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ error: "Employee not found" });
    }
    const employeeCode = empRows[0].employee_code;

    // ✅ ดึงประวัติการลา
    const [leaveRows] = await conn.execute(
      `SELECT 
         leave_type AS type,
         start_date AS startDate,
         end_date AS endDate,
         DATEDIFF(end_date, start_date) + 1 AS days,
         status,
         reason
       FROM leave_records
       WHERE employee_code = ?
       ORDER BY start_date DESC`,
      [employeeCode]
    );

    // ✅ รวมวันลาแต่ละประเภท (เฉพาะที่สถานะ = "อนุมัติ")
    const [summaryRows] = await conn.execute(
      `SELECT 
         leave_type,
         SUM(DATEDIFF(end_date, start_date) + 1) AS total_days
       FROM leave_records
       WHERE employee_code = ? AND status = 'อนุมัติ'
       GROUP BY leave_type`,
      [employeeCode]
    );

    await conn.end();

    // ✅ จัดรูปแบบ summary ให้ React ใช้ง่าย
    const summary = {
      vacation: 0,
      sick: 0,
      personal: 0
    };

    summaryRows.forEach(row => {
      if (row.leave_type === 'ลาพักร้อน') summary.vacation = row.total_days;
      if (row.leave_type === 'ลาป่วย') summary.sick = row.total_days;
      if (row.leave_type === 'ลากิจ') summary.personal = row.total_days;
    });

    res.json({
      balance: summary,
      history: leaveRows
    });

  } catch (err) {
    console.error("Leave API error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/employee/summary", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    const [empRows] = await conn.execute(
      `SELECT employee_code, first_name, last_name, position, department
       FROM employees
       WHERE user_id = ?`,
      [userId]
    );

    await conn.end();

    if (empRows.length === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const emp = empRows[0];
    res.json({
      employee_code: emp.employee_code,
      name: `${emp.first_name} ${emp.last_name}`,
      position: emp.position,
      department: emp.department,
    });
  } catch (err) {
    console.error("Employee summary error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/api/evaluation", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // หารหัสพนักงานก่อน
    const [empRows] = await conn.execute(
      "SELECT employee_code, first_name, last_name, position, department FROM employees WHERE user_id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ message: "Employee not found" });
    }

    const employee = empRows[0];

    // ดึงข้อมูลการประเมิน
    const [evalRows] = await conn.execute(
      `SELECT 
         total_score,
         quality_score,
         responsibility_score,
         teamwork_score,
         creativity_score,
         punctuality_score,
         communication_score
       FROM PerformanceSummary
       WHERE employee_code = ?`,
      [employee.employee_code]
    );

    await conn.end();

    if (evalRows.length === 0) {
      return res.json({ message: "no data" });
    }

    res.json({
      employee,
      evaluation: evalRows[0],
    });
  } catch (err) {
    console.error("Evaluation fetch error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/evaluation/details", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // หา employee_code จาก user_id
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );
    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ message: "ไม่พบข้อมูลพนักงาน" });
    }

    const employeeCode = empRows[0].employee_code;

    // ดึงคะแนนการประเมินแต่ละด้าน
    const [rows] = await conn.execute(
      `SELECT 
         category AS title,
         description AS detail_desc,
         score
       FROM evaluation_details
       WHERE employee_code = ?
       ORDER BY id ASC`,
      [employeeCode]
    );

    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error("Evaluation details fetch error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล" });
  }
});

// ✅ HR ดูได้ทั้งหมด, employee ดูของตัวเอง
app.get("/api/training", authMiddleware(["hr", "employee"]), async (req, res) => {
  try {
    const user = req.user;

    let query = `
      SELECT 
        t.training_id,
        t.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        t.course_name,
        t.start_date,
        t.end_date,
        t.score,
        t.result
      FROM training t
      JOIN employees e ON t.employee_code = e.employee_code
    `;

    let params = [];

    // ถ้าเป็น employee ให้ดูเฉพาะของตัวเอง
    if (user.role === "employee") {
      query += " WHERE e.user_id = ?";
      params.push(user.id); // ✅ เปลี่ยนจาก user.userId → user.id
    }

    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching training data:", err);
    res.status(500).json({ error: err.message });
  }
});


// -------- Employee API ----------
app.get("/api/documents", authMiddleware(["employee", "hr"]), async (req, res) => {
  let conn;
  try {
    // ✅ ดึงข้อมูลจาก token
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;
    const userRole = decoded.role; // ต้องแน่ใจว่า token เก็บ role มาด้วย เช่น "hr" หรือ "employee"

    conn = await mysql.createConnection(dbConfig);

    // ✅ ถ้า role เป็น HR → ดึงเอกสารพนักงานทั้งหมด
    if (userRole === "hr") {
      const [rows] = await conn.execute(`
        SELECT 
          d.doc_id AS id,
          d.doc_name,
          d.file_path,
          d.upload_date,
          e.employee_code,
          CONCAT(e.first_name, ' ', e.last_name) AS employee_name
        FROM documents d
        JOIN employees e ON e.employee_code = d.employee_code
        ORDER BY d.upload_date DESC
      `);
      await conn.end();
      return res.json(rows);
    }

    // ✅ ถ้า role เป็น Employee → ดึงเฉพาะของตัวเอง
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeCode = empRows[0].employee_code;

    const [docs] = await conn.execute(
      `SELECT 
        doc_id AS id, 
        doc_name, 
        file_path, 
        upload_date,
        employee_code
       FROM documents
       WHERE employee_code = ?
       ORDER BY upload_date DESC`,
      [employeeCode]
    );

    await conn.end();
    res.json(docs);

  } catch (err) {
    console.error("❌ Documents fetch error:", err);
    if (conn) await conn.end();
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    if (conn) await conn.end();
  }
});

app.get("/api/contacts", authMiddleware(["employee", "hr"]), async (req, res) => {
  const conn = await mysql.createConnection(dbConfig);
  try {
    const [rows] = await conn.execute(
      `SELECT 
          c.id,
          c.contact_person_name,
          c.department_name,
          c.phone,
          c.email
        FROM contact_departments c
        ORDER BY c.id`
    );

    res.json(rows);
  } catch (err) {
    console.error("Contacts fetch error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลติดต่อ" });
  }
});

// -------- HR API ----------
app.get("/api/employees", authMiddleware(["hr"]), async (req,res)=>{
  const conn = await mysql.createConnection(dbConfig);
  const [emps] = await conn.execute("SELECT * FROM employees");
  await conn.end();
  res.json(emps);
});

app.post("/api/employees", authMiddleware(["hr"]), async (req,res)=>{
  const { first_name, last_name, department } = req.body;
  const conn = await mysql.createConnection(dbConfig);
  await conn.execute("INSERT INTO employees (first_name,last_name,department) VALUES (?,?,?)", [first_name,last_name,department]);
  await conn.end();
  res.json({message:"Employee added"});
});

// Analytics endpoint (กราฟ)
app.get("/api/analytics", authMiddleware(["hr"]), async (req,res)=>{
  const conn = await mysql.createConnection(dbConfig);
  const [emps] = await conn.execute("SELECT department, gender, hire_date FROM employees");
  const [pay] = await conn.execute("SELECT employee_code, total_salary FROM payroll");
  const [perf] = await conn.execute("SELECT employee_code, score FROM performance_reviews");
  await conn.end();
  res.json({ employees: emps, payroll: pay, performance: perf });
});

console.log("✅ Connected DB:", dbConfig.database);

// ✅ เพิ่ม 2 บรรทัดนี้ก่อนใช้ conn
const conn = await mysql.createConnection(dbConfig);
const [tables] = await conn.execute("SHOW TABLES");

console.log("📋 Tables in DB:", tables);
await conn.end();

// -------- HR Dashboard Summary ----------
app.get("/api/hr/dashboard", authMiddleware(["hr"]), async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);

    // 1️⃣ จำนวนพนักงานทั้งหมด
    const [[totalEmp]] = await conn.execute(`SELECT COUNT(*) AS total FROM employees`);

    // 2️⃣ จำนวนพนักงานแยกตามแผนก
    const [deptCounts] = await conn.execute(`
      SELECT department, COUNT(*) AS count
      FROM employees
      GROUP BY department
    `);

    // 3️⃣ เงินเดือนเฉลี่ยทั้งหมด
    const [[avgSalary]] = await conn.execute(`
      SELECT AVG(total_salary) AS average_salary
      FROM payroll
    `);

    // 4️⃣ คะแนนประเมินเฉลี่ย
    const [[avgScore]] = await conn.execute(`
      SELECT AVG(total_score) AS average_score
      FROM PerformanceSummary
    `);

    // 5️⃣ การลาในเดือนล่าสุด
    const [leaveStats] = await conn.execute(`
      SELECT leave_type, COUNT(*) AS count
      FROM leave_records
      WHERE MONTH(start_date) = MONTH(CURDATE())
        AND YEAR(start_date) = YEAR(CURDATE())
      GROUP BY leave_type
    `);

    await conn.end();

    // ✅ แปลงเป็นตัวเลขก่อนใช้ toFixed()
    const avgSalaryNum = parseFloat(avgSalary?.average_salary) || 0;
    const avgScoreNum = parseFloat(avgScore?.average_score) || 0;

    // ✅ ส่งกลับ
    res.json({
      totalEmployees: totalEmp.total,
      departments: deptCounts,
      averageSalary: avgSalaryNum.toFixed(2),
      averageScore: avgScoreNum.toFixed(2),
      leaveThisMonth: leaveStats
    });

  } catch (err) {
    console.error("HR Dashboard error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
});

// ✅ จัดการพนักงาน (HR Only)
// ✅ เหลือตัวนี้ตัวเดียว
app.get("/api/hr/employees", authMiddleware(["hr"]), async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);

    const [rows] = await conn.execute(`
      SELECT 
        e.employee_code,
        e.first_name,
        e.last_name,
        e.position,
        e.department AS department_name,
        e.hire_date,
        e.email,
        e.phone,
        p.total_salary AS salary
      FROM employees e
      LEFT JOIN payroll p ON e.employee_code = p.employee_code
      ORDER BY e.employee_code ASC
    `);

    await conn.end();
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching employees:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ เพิ่มพนักงานใหม่ (เพิ่มแค่ใน employees, เงินเดือนไปจัดการที่ payroll)
app.post("/api/hr/employees", authMiddleware(["hr"]), async (req, res) => {
  try {
    const {
      employee_code,
      first_name,
      last_name,
      gender,
      birth_date,
      national_id,
      email,
      phone,
      address,
      position,
      department,
      hire_date,
      salary, // <-- จะใช้เพิ่ม payroll ทีหลัง
    } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    // เพิ่มใน employees
    await conn.execute(
      `
      INSERT INTO employees (
        employee_code, first_name, last_name, gender, birth_date, national_id, 
        email, phone, address, position, department, hire_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        employee_code,
        first_name,
        last_name,
        gender,
        birth_date,
        national_id,
        email,
        phone,
        address,
        position,
        department,
        hire_date,
      ]
    );

    // เพิ่มใน payroll ด้วย (ถ้ามีค่า salary)
    if (salary) {
      await conn.execute(
        `INSERT INTO payroll (employee_code, total_salary) VALUES (?, ?)`,
        [employee_code, salary]
      );
    }

    await conn.commit();
    await conn.end();
    res.json({ message: "✅ เพิ่มพนักงานใหม่เรียบร้อย" });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ แก้ไขข้อมูลพนักงาน
// ✅ แก้ไขข้อมูลพนักงาน (HR Only)
app.put("/api/hr/employees/:employee_code", authMiddleware(["hr"]), async (req, res) => {
  try {
    const { employee_code } = req.params;
    const {
      first_name,
      last_name,
      gender,
      birth_date,
      national_id,
      email,
      phone,
      address,
      position,
      department,
      hire_date,
      salary,
    } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    // ✅ ตรวจว่ามีพนักงานนี้อยู่จริงก่อน
    const [exist] = await conn.execute(
      "SELECT employee_code FROM employees WHERE employee_code = ?",
      [employee_code]
    );
    if (exist.length === 0) {
      await conn.rollback();
      await conn.end();
      return res.status(404).json({ message: "❌ ไม่พบรหัสพนักงานนี้" });
    }

    // ✅ อัปเดตตาราง employees
    const [result] = await conn.execute(
      `
      UPDATE employees
      SET 
        first_name = ?, 
        last_name = ?, 
        gender = ?, 
        birth_date = ?, 
        national_id = ?, 
        email = ?, 
        phone = ?, 
        address = ?, 
        position = ?, 
        department = ?, 
        hire_date = ?
      WHERE employee_code = ?
      `,
      [
        first_name,
        last_name,
        gender,
        birth_date,
        national_id,
        email,
        phone,
        address,
        position,
        department,
        hire_date,
        employee_code,
      ]
    );

    // ✅ อัปเดต payroll (ถ้ามี salary ส่งมา)
    if (salary !== undefined && salary !== null) {
      await conn.execute(
        `
        INSERT INTO payroll (employee_code, total_salary)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE total_salary = VALUES(total_salary)
        `,
        [employee_code, salary]
      );
    }

    await conn.commit();
    await conn.end();

    res.json({ message: "✅ แก้ไขข้อมูลพนักงานเรียบร้อย" });
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// ✅ ลบพนักงาน
app.delete("/api/hr/employees/:employee_code", authMiddleware(["hr"]), async (req, res) => {
  try {
    const { employee_code } = req.params;
    const conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    // ลบ payroll ก่อน (กัน foreign key error)
    await conn.execute(`DELETE FROM payroll WHERE employee_code = ?`, [employee_code]);

    // ลบ employees
    const [result] = await conn.execute(
      `DELETE FROM employees WHERE employee_code = ?`,
      [employee_code]
    );

    await conn.commit();
    await conn.end();

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "ไม่พบพนักงานที่ต้องการลบ" });

    res.json({ message: "🗑️ ลบพนักงานเรียบร้อย" });
  } catch (err) {
    console.error("❌ Error deleting employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ เพิ่มพนักงานใหม่ (HR เท่านั้น)
app.post("/api/hr/employees", authMiddleware(["hr"]), async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      department_name,
      position,
      salary,
      hire_date,
      email,
      phone,
      username,
      password,
    } = req.body;

    const conn = await mysql.createConnection(dbConfig);
    await conn.beginTransaction();

    // INSERT employee
    const [empResult] = await conn.execute(
      `INSERT INTO employees (first_name, last_name, department, position, hire_date, email, phone)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, department_name, position, hire_date, email, phone]
    );

    const employee_code = empResult.insertId;

    // INSERT payroll
    await conn.execute(
      `INSERT INTO payroll (employee_code, total_salary) VALUES (?, ?)`,
      [employee_code, salary]
    );

    // INSERT users
    await conn.execute(
      `INSERT INTO users (username, password_hash, role_id)
       VALUES (?, SHA2(?, 256), 1)`,
      [username, password]
    );

    await conn.commit();
    conn.end();

    res.json({ employee_code, first_name, last_name, department_name, position, salary });
  } catch (err) {
    console.error("❌ Error adding employee:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ ดึงข้อมูล HR ตาม employee_code
app.get("/api/hr/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(
      `SELECT employee_code, first_name, last_name, national_id, birth_date, gender,
              phone, email, address, department, position, hire_date, status
       FROM employees
       WHERE employee_code = ?`,
      [id]
    );
    await conn.end();

    if (rows.length === 0) {
      return res.status(404).json({ message: "❌ ไม่พบข้อมูล HR" });
    }

    console.log("✅ HR Data Found:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching HR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ อัปเดตข้อมูล HR
app.put("/api/hr/:employee_code", async (req, res) => {
  const { employee_code } = req.params;
  const { first_name, last_name, email, phone, address, department } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE employees 
       SET first_name = ?, last_name = ?, email = ?, phone = ?, address = ?, department = ?
       WHERE employee_code = ?`,
      [first_name, last_name, email, phone, address, department, employee_code]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "HR info updated successfully" });
  } catch (err) {
    console.error("❌ Error updating HR info:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// ✅ ดึงข้อมูลการลาทั้งหมด
app.get("/api/leaves", async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    const [rows] = await conn.execute(`
      SELECT 
        l.leave_id AS id,
        CONCAT(e.first_name, ' ', e.last_name) AS employeeName,
        l.leave_type AS leaveType,
        l.start_date AS startDate,
        l.end_date AS endDate,
        DATEDIFF(l.end_date, l.start_date) + 1 AS totalDays,
        l.status AS status
      FROM leave_records l
      JOIN employees e ON l.employee_code = e.employee_code
      ORDER BY l.start_date DESC
    `);
    await conn.end();

    console.log("✅ ดึงข้อมูลการลาสำเร็จ:", rows.length, "รายการ");
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching leave records:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ อัปเดตสถานะการลา
app.put("/api/leaves/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const conn = await mysql.createConnection(dbConfig);
    const [result] = await conn.execute(
      `UPDATE leave_records SET status = ? WHERE leave_id = ?`,
      [status, id]
    );
    await conn.end();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการลา" });
    }

    console.log(`✅ อัปเดตสถานะใบลา ID ${id} เป็น ${status}`);
    res.json({ message: "อัปเดตสถานะใบลาสำเร็จ" });
  } catch (err) {
    console.error("❌ Error updating leave:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ดึงข้อมูลการฝึกอบรมทั้งหมด
app.get("/api/training", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        t.training_id,
        t.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
        t.course_name,
        t.start_date,
        t.end_date,
        t.score,
        t.result
      FROM training t
      JOIN employees e ON t.employee_code = e.employee_code
      ORDER BY t.start_date DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching training data:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ เพิ่มข้อมูลการฝึกอบรมใหม่
app.post("/api/training", async (req, res) => {
  const { employee_code, course_name, start_date, end_date, score, result } = req.body;
  try {
    await db.query(
      `INSERT INTO training (employee_code, course_name, start_date, end_date, score, result)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [employee_code, course_name, start_date, end_date, score, result]
    );
    res.json({ message: "เพิ่มข้อมูลการฝึกอบรมสำเร็จ ✅" });
  } catch (err) {
    console.error("❌ Error adding training:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ ลบข้อมูลการฝึกอบรม
app.delete("/api/training/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(`DELETE FROM training WHERE training_id = ?`, [id]);
    res.json({ message: "ลบข้อมูลการฝึกอบรมเรียบร้อย ✅" });
  } catch (err) {
    console.error("❌ Error deleting training:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ HR เห็นเอกสารของพนักงานทุกคน
app.get("/api/hr/documents", authMiddleware(["hr"]), async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        d.id,
        d.doc_name AS title,
        d.file_path AS file_url,
        d.upload_date,
        e.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) AS employee_name
      FROM documents d
      JOIN employees e ON e.employee_code = d.employee_code
      ORDER BY d.upload_date DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("Error fetching documents:", err);
    res.status(500).json({ message: "Database error" });
  }
});

app.get("/api/workinfo/:employee_code", async (req, res) => {
  const { employee_code } = req.params;

  try {
    // 🔹 ดึงข้อมูลพื้นฐานพนักงาน + เงินเดือน โบนัส จาก payroll + work_info
    const [rows] = await db.execute(
      `SELECT 
        e.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        e.position,
        e.department,
        e.hire_date,
        w.start_date,
        w.experience_years,
        p.total_salary,
        p.bonus
      FROM employees e
      LEFT JOIN work_info w ON e.employee_code = w.employee_code
      LEFT JOIN payroll p ON e.employee_code = p.employee_code
      WHERE e.employee_code = ?`,
      [employee_code]
    );

    // 🔸 ถ้าไม่เจอพนักงาน
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const workInfo = rows[0];

    // 🔹 ดึงข้อมูลการเลื่อนตำแหน่งจาก promotions
    const [promotions] = await db.execute(
      `SELECT old_position, new_position, promotion_date, remark, approved_by
      FROM promotions
      WHERE TRIM(UPPER(employee_code)) = TRIM(UPPER('${employee_code}'))
      ORDER BY promotion_date ASC`
    );

    // 🔹 รวมข้อมูลทั้งหมด
    const result = {
      employee_code: workInfo.employee_code,
      full_name: workInfo.full_name,
      position: workInfo.position,
      department: workInfo.department,
      hire_date: workInfo.hire_date,
      work_years: workInfo.experience_years,
      total_salary: workInfo.total_salary,
      bonus: workInfo.bonus,
      transfer_history: promotions && promotions.length > 0
      ? promotions.map(p => ({
          date: p.promotion_date,
          old_position: p.old_position,
          new_position: p.new_position,
          note: p.remark,
          approved_by: p.approved_by
        }))
    : []
    };

    console.log("✅ WorkInfo:", result);
    res.json(result);
  } catch (err) {
    console.error("❌ Error fetching work info:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// ✅ ดึงข้อมูลการเงินของพนักงานรายคน (เชื่อม payroll + tax_deductions)
app.get("/api/finance/:employee_code", async (req, res) => {
  const { employee_code } = req.params;
  try {
    const [rows] = await db.execute(
      `
      SELECT 
        e.employee_code,
        e.first_name,
        e.last_name,
        p.base_salary AS baseSalary,
        p.allowance AS allowance,
        p.bonus AS bonus,
        p.total_salary AS totalSalary,
        p.bank_name AS bankName,
        p.bank_branch AS bankBranch,
        p.account_no AS accountNo,
        COALESCE(t.income_tax, 0) AS incomeTax,
        COALESCE(t.social_security, 0) AS socialSecurity,
        COALESCE(t.provident_fund, 0) AS providentFund
      FROM employees e
      LEFT JOIN payroll p ON e.employee_code = p.employee_code
      LEFT JOIN tax_deductions t ON e.employee_code = t.employee_code
      WHERE e.employee_code = ?
      `,
      [employee_code]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลพนักงาน" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("❌ Error fetching finance data:", err);
    res.status(500).json({ message: "Error fetching finance data" });
  }
});

// ✅ แจ้งเตือนสัญญาใกล้หมดอายุ (ภายใน 30 วัน)
app.get("/api/contracts/:employee_code", async (req, res) => {
  const { employee_code } = req.params;
  try {
    const [rows] = await db.query(`
      SELECT 
        e.employee_code,
        CONCAT(e.first_name, ' ', e.last_name) AS employeeName,
        e.department,
        e.position,
        w.start_date,
        w.end_date,
        DATEDIFF(w.end_date, CURDATE()) AS daysLeft
      FROM employees e
      JOIN work_info w ON e.employee_code = w.employee_code
      WHERE e.employee_code = ?
      ORDER BY w.start_date DESC
    `, [employee_code]);

    if (rows.length === 0)
      return res.status(404).json({ message: "ไม่พบสัญญาของพนักงานนี้" });

    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching contract by employee:", error);
    res.status(500).json({ message: "Error fetching contract data" });
  }
});


app.listen(3000, ()=>console.log("Server running on http://localhost:3000"));