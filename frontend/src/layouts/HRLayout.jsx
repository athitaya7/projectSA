import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.jsx";

export default function HRLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState("dashboard");
  const userRole = localStorage.getItem("role"); // "1" = Employee, "2" = HR

  // Effect นี้จะทำงานเมื่อ URL path เปลี่ยนแปลง
  // เพื่ออัปเดตเมนูที่ active ใน Sidebar ให้ถูกต้องเสมอ
  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // แปลง path กลับเป็น key ของเมนู
    // เช่น /dashboard/hr/personal-info -> personal-info
    // ถ้าเป็น /dashboard/hr -> hr (จะถูกตั้งเป็น dashboard ด้านล่าง)
    if (lastSegment === 'hr' || lastSegment === '') {
      setCurrentPage("dashboard");
    } else {
      setCurrentPage(lastSegment);
    }
  }, [location.pathname]);

  // ฟังก์ชันนี้จะถูกส่งไปให้ Sidebar เพื่อใช้ในการนำทาง (navigate)
  const handleNavigate = (pageKey, path) => {
    // pageKey คือ key ที่เราตั้งใน Sidebar เช่น "dashboard", "employees", "employee_personal"
    // path คือ URL ที่จะให้ไป เช่น "/dashboard/hr/employees"
    setCurrentPage(pageKey);
    navigate(path);
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={handleNavigate} // ส่งฟังก์ชัน navigate ให้ Sidebar
        role={userRole}
      />
      <main 
        style={{ 
          flex: 1, 
          padding: "2rem", // เพิ่ม padding ให้สวยงาม
          overflowY: "auto", 
          backgroundColor: "#f8fafc" // เพิ่มสีพื้นหลัง
        }}
      >
        {children}
      </main>
    </div>
  );
}