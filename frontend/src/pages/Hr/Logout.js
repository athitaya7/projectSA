import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🧹 เคลียร์ token ทั้งหมดของ HR และ Employee
    localStorage.removeItem("adminToken");
    localStorage.removeItem("empToken");

    // ⏳ รอ 2 วินาทีแล้วกลับไปหน้า Login
    const timer = setTimeout(() => {
      navigate("/"); // ✅ หน้า Login ของระบบ
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: "100vh",
        background: "linear-gradient(180deg, #0b1e39, #1f3a64)",
        fontFamily: "'Kanit', sans-serif",
      }}
    >
      <div
        className="card shadow-lg text-center p-5"
        style={{
          borderRadius: "20px",
          width: "380px",
          backgroundColor: "#ffffff",
          border: "1px solid #0b1e39",
        }}
      >
        <FaSignOutAlt size={50} color="#0b1e39" className="mb-3" />
        <h3 className="fw-bold mb-2" style={{ color: "#0b1e39" }}>
          ออกจากระบบสำเร็จ
        </h3>
        <p className="text-secondary">
          ระบบจะพาคุณกลับไปยังหน้าเข้าสู่ระบบภายใน 2 วินาที...
        </p>
      </div>
    </div>
  );
}

export default Logout;
