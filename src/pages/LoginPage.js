import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaLock, FaUsers } from "react-icons/fa";

function Login() {
  const [userType, setUserType] = useState("employee"); // ค่าเริ่มต้นคือพนักงาน
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบสิทธิ์การเข้าสู่ระบบ
    if (userType === "admin") {
      if (userId === "hr" && password === "1234") {
        localStorage.setItem("adminToken", "auth_success");
        navigate("/dashboard"); // ไปหน้า Dashboard ของ HR
      } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    } else if (userType === "employee") {
      if (userId === "emp" && password === "1234") {
        localStorage.setItem("empToken", "auth_success");
        navigate("/dashboard"); // ไปหน้า Dashboard ของพนักงาน
      } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(180deg, #0b1e39, #1f3a64)",
        fontFamily: "'Kanit', sans-serif",
        color: "#fff",
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          border: "1px solid #0b1e39",
        }}
      >
        {/* 🔹 หัวข้อระบบ */}
        <div className="text-center mb-4">
          <h1
            style={{
              fontSize: "64px",
              fontWeight: "800",
              color: "#0b1e39",
              marginBottom: "10px",
              letterSpacing: "2px",
            }}
          >
            LOGIN
          </h1>
          <p className="text-secondary mb-0 small">
            ระบบสารสนเทศบุคลากร | Silpakorn IT
          </p>
        </div>

        {/* 🔹 ฟอร์มล็อกอิน */}
        <form onSubmit={handleLogin}>
          {/* ประเภทผู้ใช้ */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">
              เข้าสู่ระบบในฐานะ
            </label>
            <select
              className="form-select"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
              style={{
                borderRadius: "10px",
                border: "1px solid #dce3ed",
                background: "#f8fafc",
              }}
            >
              <option value="employee">Employee</option>
              <option value="admin">HR</option>
            </select>
          </div>

          {/* ชื่อผู้ใช้ */}
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">ชื่อผู้ใช้</label>
            <div
              className="d-flex align-items-center px-3 py-2"
              style={{
                background: "#f8fafc",
                border: "1px solid #dce3ed",
                borderRadius: "10px",
              }}
            >
              {userType === "admin" ? (
                <FaUserTie className="text-secondary me-2" />
              ) : (
                <FaUsers className="text-secondary me-2" />
              )}
              <input
                type="text"
                className="form-control border-0 bg-transparent"
                placeholder={
                  userType === "admin"
              
                }
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
          </div>

          {/* รหัสผ่าน */}
          <div className="mb-4">
            <label className="form-label fw-semibold text-dark">รหัสผ่าน</label>
            <div
              className="d-flex align-items-center px-3 py-2"
              style={{
                background: "#f8fafc",
                border: "1px solid #dce3ed",
                borderRadius: "10px",
              }}
            >
              <FaLock className="text-secondary me-2" />
              <input
                type="password"
                className="form-control border-0 bg-transparent"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* ปุ่มเข้าสู่ระบบ */}
          <button
            type="submit"
            className="btn w-100 fw-bold shadow-sm"
            style={{
              background: "#0b1e39",
              border: "none",
              color: "#fff",
              borderRadius: "10px",
              padding: "10px 0",
              fontSize: "16px",
              transition: "0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#143056")}
            onMouseOut={(e) => (e.target.style.background = "#0b1e39")}
          >
            เข้าสู่ระบบ
          </button>
        </form>

        {/* 🔹 Footer */}
        <p className="text-center text-secondary mt-4 mb-0 small">
          © 2025 Personnel Information System | Silpakorn IT
        </p>
      </div>
    </div>
  );
}

export default Login;
