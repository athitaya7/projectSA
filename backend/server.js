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
    const decoded = jwt.verify(token, SECRET);
    if(roles.length && !roles.includes(decoded.role))
      return res.status(403).json({message:"Forbidden"});
    req.user = decoded;
    next();
  } catch(err){ res.status(401).json({message:"Invalid token"});}
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

  const token = jwt.sign({ id: user.user_id, role: user.role_id }, SECRET, { expiresIn: "8h" });
  res.json({ token, role: user.role_id });
});

// -------- Employee API ----------
app.get("/api/documents", authMiddleware(["employee","hr"]), async (req,res)=>{
  const conn = await mysql.createConnection(dbConfig);
  const [docs] = await conn.execute("SELECT * FROM documents");
  await conn.end();
  res.json(docs);
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