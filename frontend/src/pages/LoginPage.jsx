import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaLock, FaUsers } from "react-icons/fa";

function LoginPage() {
  const [userType, setUserType] = useState("employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log("login attempt:", { username, password });

      const res = await axios.post(
        `${API_URL || "http://127.0.0.1:3000"}/api/login`,
        { username, password }
      );

      console.log("Backend response:", res.data);

      const { token, role } = res.data; // backend ส่ง token + role
      localStorage.setItem("token", token);
      localStorage.setItem("role", String(role)); // ต้องเป็น string

      // เพิ่ม debug
      console.log("Saved in localStorage:", {
        token: localStorage.getItem("token"),
        role: localStorage.getItem("role")
      });
      const roleMapping = { employee: "1", admin: "2" };
      if(roleMapping[userType] !== String(role)) {
          alert("User role mismatch");
          return;
      }

      if (String(role) === "2") navigate("/dashboard/hr");
      else if (String(role) === "1") navigate("/dashboard/employee");
      else alert("Unknown role");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{
        minHeight: "100svh", // ใช้ svh/dvh ให้เต็มหน้าจอบนอุปกรณ์มือถือด้วย
        width: "100vw",
        background: "linear-gradient(180deg, #0b1e39, #1f3a64)",
        fontFamily: "'Kanit', sans-serif",
      }}
    >
      <div
        className="p-5 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
          border: "1px solid #0b1e39",
        }}
      >
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

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold text-dark">เข้าสู่ระบบในฐานะ</label>
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
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

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
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

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
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.background = "#143056")}
            onMouseOut={(e) => (e.target.style.background = "#0b1e39")}
          >
            เข้าสู่ระบบ
          </button>
        </form>

        <p className="text-center text-secondary mt-4 mb-0 small">
          © 2025 Personnel Information System | Silpakorn IT
        </p>
      </div>
    </div>
  );
}

export default LoginPage;