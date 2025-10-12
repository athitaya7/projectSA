// src/components/Sidebar.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaHome, FaUser, FaChevronDown, FaChevronRight, FaFileAlt, FaCalendarAlt,
  FaChartLine, FaGraduationCap, FaFolder, FaUsers 
} from "react-icons/fa";
import { BarChart2, User, Umbrella, Star, BookOpen, FileText, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ role, currentPage, setCurrentPage }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => setOpenMenu(openMenu === menu ? null : menu);
  const handleNavigate = (page, path) => {
    setCurrentPage(page);
    if (path) navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("empToken");
    window.location.href = "/dashboard/logout";
  };

  const personalMenuRef = useRef(null);
  const employeeMenuRef = useRef(null);

  // ===== HR Sidebar =====
  if (role === "2") {
    return (
      <div className="sidebar hr">
        <div className="sidebar-header">
          <h2>HR Portal</h2>
        </div>

        {/* Dashboard */}
        <div
          className={`menu-item ${currentPage === "dashboard" ? "active" : ""}`}
          onClick={() => handleNavigate("dashboard", "/dashboard/hr")}
        >
          <FaHome className="menu-icon" /> <span className="menu-label">Dashboard</span>
        </div>

        {/* ข้อมูลประจำตัว (HR) */}
        <div className="menu-item" onClick={() => toggleMenu("personal")}>
          <div className="d-flex justify-content-between align-items-center">
            <div><FaUser className="menu-icon" /> ข้อมูลประจำตัว</div>
            {openMenu === "personal" ? <FaChevronDown /> : <FaChevronRight />}
          </div>
        </div>

        <div
          className="submenu"
          ref={personalMenuRef}
          style={{
            maxHeight:
              openMenu === "personal"
                ? `${personalMenuRef.current?.scrollHeight}px`
                : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          {/* ✅ ข้อมูลส่วนตัว -> /dashboard/hr/history */}
          <div
            onClick={() => handleNavigate("history", "/dashboard/hr/history")}
            className="submenu-item"
          >
            <FaUser className="menu-icon" /> ข้อมูลส่วนตัว
          </div>

          <div
            onClick={() => handleNavigate("leave", "/dashboard/hr/leave")}
            className="submenu-item"
          >
            <FaCalendarAlt className="menu-icon" /> สิทธิการลา
          </div>

          <div
            onClick={() => handleNavigate("evaluation", "/dashboard/hr/evaluation")}
            className="submenu-item"
          >
            <FaChartLine className="menu-icon" /> การประเมินผล
          </div>

          <div
            onClick={() => handleNavigate("training", "/dashboard/hr/training")}
            className="submenu-item"
          >
            <FaGraduationCap className="menu-icon" /> การฝึกอบรม
          </div>

          <div
            onClick={() => handleNavigate("documents", "/dashboard/hr/documents")}
            className="submenu-item"
          >
            <FaFolder className="menu-icon" /> เอกสาร
          </div>
        </div>

        {/* ข้อมูลพนักงาน */}
        <div className="menu-item" onClick={() => toggleMenu("employee")}>
          <div className="d-flex justify-content-between align-items-center">
            <div><FaUsers className="menu-icon" /> ข้อมูลพนักงาน</div>
            {openMenu === "employee" ? <FaChevronDown /> : <FaChevronRight />}
          </div>
        </div>

        <div
          className="submenu"
          ref={employeeMenuRef}
          style={{
            maxHeight:
              openMenu === "employee"
                ? `${employeeMenuRef.current?.scrollHeight}px`
                : "0px",
            overflow: "hidden",
            transition: "max-height 0.3s ease",
          }}
        >
          {/* ✅ ข้อมูลประจำตัวพนักงาน -> /dashboard/hr/personal-info */}
          <div
            onClick={() =>
              handleNavigate("personal-info", "/dashboard/hr/personal-info")
            }
            className="submenu-item"
          >
            <FaUser className="menu-icon" /> ข้อมูลประจำตัวพนักงาน
          </div>

          <div
            onClick={() => handleNavigate("employees", "/dashboard/hr/employees")}
            className="submenu-item"
          >
            <FaUsers className="menu-icon" /> ข้อมูลการทำงาน
          </div>

          <div
            onClick={() => handleNavigate("financial", "/dashboard/hr/financial")}
            className="submenu-item"
          >
            <FaFileAlt className="menu-icon" /> ข้อมูลทางการเงิน
          </div>
        </div>

        {/* Logout */}
        <button className="logout-btn" onClick={handleLogout}>
          <span className="menu-icon"><LogOut size={20} /></span>
          <span className="menu-label">Logout</span>
        </button>
      </div>
    );
  }

  // ===== Employee Sidebar =====
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={20} />, path: "/dashboard/employee" },
    { id: "profile", label: "Profile", icon: <User size={20} />, path: "/profile" },
    { id: "leave", label: "สิทธิการลา", icon: <Umbrella size={20} />, path: "/leave" },
    { id: "evaluation", label: "ประเมินผล", icon: <Star size={20} />, path: "/evaluation" },
    { id: "training", label: "การฝึกอบรม", icon: <BookOpen size={20} />, path: "/training" },
    { id: "documents", label: "เอกสาร", icon: <FileText size={20} />, path: "/documents" },
  ];

  return (
    <div className="sidebar employee">
      <div className="sidebar-header">
        <h2>Employee Portal</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${currentPage === item.id ? "active" : ""}`}
            onClick={() => handleNavigate(item.id, item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span className="menu-icon"><LogOut size={20} /></span>
        <span className="menu-label">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
