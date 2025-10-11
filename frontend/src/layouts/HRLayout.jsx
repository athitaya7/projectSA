import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

export default function HRLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("");
  const userRole = localStorage.getItem("role"); // "1" = Employee, "2" = HR

  // ตั้ง currentPage ตาม path ปัจจุบัน
  useEffect(() => {
    const path = location.pathname.split("/").pop(); // เอาชื่อหน้าสุดท้ายของ path
    setCurrentPage(path || "dashboard");
  }, [location]);

  // ฟังก์ชันให้ Sidebar เรียก navigate
  const handleNavigate = (page) => {
    setCurrentPage(page);
    switch (page) {
      case "dashboard":
        navigate("/dashboard/hr");
        break;
      case "employees":
        navigate("/dashboard/hr/employees");
        break;
      case "documents":
        navigate("/dashboard/hr/documents");
        break;
      case "evaluation":
        navigate("/dashboard/hr/evaluation");
        break;
      case "financial":
        navigate("/dashboard/hr/financial");
        break;
      case "history":
        navigate("/dashboard/hr/history");
        break;
      case "leave":
        navigate("/dashboard/hr/leave");
        break;
      case "training":
        navigate("/dashboard/hr/training");
        break;
      default:
        navigate("/dashboard/hr");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleNavigate} // ส่งฟังก์ชัน navigate ให้ Sidebar
        role={userRole}
      />
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {children}
        </div>
      </div>
    </div>
  );
}
