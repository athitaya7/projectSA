import { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";

export default function EmployeeLayout({ children }) {
  const [currentPage, setCurrentPage] = useState("dashboard"); // กำหนด default
  const userRole = localStorage.getItem("role"); // "1" = Employee

  // ความกว้าง sidebar
  const sidebarWidth = 250;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div style={{ width: sidebarWidth, flexShrink: 0 }}>
        <Sidebar
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          role={userRole}
        />
      </div>

      {/* Main content */}
      <div
        style={{flex: 1, padding: "20px", overflowY: "auto", backgroundColor: "#f4f4f4",}}>
        {children}
      </div>
    </div>
  );
}
