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

app.get("/api/training", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // ✅ ดึง employee_code ของ user นี้
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ error: "Employee not found" });
    }

    const employeeCode = empRows[0].employee_code;

    // ✅ ดึงประวัติการฝึกอบรมของพนักงานคนนั้น
    const [rows] = await conn.execute(
      `SELECT 
         training_id,
         course_name,
         start_date,
         end_date,
         score,
         result
       FROM training
       WHERE employee_code = ?
       ORDER BY start_date DESC`,
      [employeeCode]
    );

    await conn.end();

    // ✅ จัดรูปข้อมูลให้หน้า React ใช้ง่าย
    const formatted = rows.map(r => ({
      certId: r.training_id,
      courseName: r.course_name,
      startDate: r.start_date ? r.start_date.toISOString().split('T')[0] : '',
      endDate: r.end_date ? r.end_date.toISOString().split('T')[0] : '',
      score: r.score || '-',
      status: r.result,
      certFile: r.certificate_file
    }));

    res.json(formatted);
  } catch (err) {
    console.error("Training fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// -------- Employee API ----------
app.get("/api/documents", authMiddleware(["employee", "hr"]), async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, SECRET);
    const userId = decoded.id;

    const conn = await mysql.createConnection(dbConfig);

    // หารหัส employee_code จาก user_id
    const [empRows] = await conn.execute(
      "SELECT employee_code FROM employees WHERE user_id = ?",
      [userId]
    );

    if (empRows.length === 0) {
      await conn.end();
      return res.status(404).json({ message: "Employee not found" });
    }

    const employeeCode = empRows[0].employee_code;

    // ดึงเอกสารของพนักงาน
    const [docs] = await conn.execute(
      `SELECT doc_id AS id, doc_name, file_path, upload_date
       FROM documents
       WHERE employee_code = ?
       ORDER BY upload_date DESC`,
      [employeeCode]
    );

    await conn.end();
    res.json(docs);
  } catch (err) {
    console.error("Documents fetch error:", err);
    res.status(500).json({ error: "Internal Server Error" });
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

app.listen(3000, ()=>console.log("Server running on port 3000"));