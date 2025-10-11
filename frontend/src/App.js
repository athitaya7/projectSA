import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// HRDashboard
import HRDashboard from "./pages/Hr/Dashboard.js";
import "./pages/Hr/Dashboard.css"

// EmployeeDashboard
import EmployeeDashboard from "./pages/Employee/Dashboard.js"; 
import "./pages/Employee/Dashboard.css"; // CSS ของ EmployeeDashboard

// ProtectedRoute ตรวจสอบ token + role
const ProtectedRoute = ({ element, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "1" = Employee, "2" = HR

  console.log("ProtectedRoute check:", { token, userRole, role });

  if (!token) {
    console.log("No token, redirect to login");
    return <Navigate to="/" replace />;
  }

  if (role && role !== userRole) {
    console.log("Role mismatch, redirect to login");
    return <Navigate to="/" replace />;
  }

  return element;
};

export default function App() {
  return (
    <Routes>
      {/* หน้า Login */}
      <Route path="/" element={<LoginPage />} />

      {/* HR Dashboard */}
      <Route
        path="/dashboard/hr"
        element={<ProtectedRoute element={<HRDashboard />} role="2" />}
      />

      {/* Employee Dashboard */}
      <Route
        path="/dashboard/employee"
        element={<ProtectedRoute element={<EmployeeDashboard />} role="1" />}
      />

      {/* Redirect path ที่ไม่รู้จักไปหน้า Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
