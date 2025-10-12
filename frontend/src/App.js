import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// HR
import Dashboard from "./pages/Hr/Dashboard.js";
import EmployeeData from "./pages/Hr/EmployeeData.js";
import DocumentHR from "./pages/Hr/DocumentHR.js";
import Evaluation from "./pages/Hr/EvaluationHR.js";
import FinancialInfo from "./pages/Hr/FinancialInfo.js";
import HistoryHR from "./pages/Hr/HistoryHR.js";
import LeaveInfo from "./pages/Hr/LeaveInfo.js";
import PersonalInfo from "./pages/Hr/PersonalInfo.js";
import Training from "./pages/Hr/TrainingHR.js";
import HRLayout from "./layouts/HRLayout.jsx";
import "./pages/Hr/Dashboard.css";

// Employee
import EmployeeDashboard from "./pages/Employee/Dashboard.js";
import "./pages/Employee/Dashboard.css";
import ProfilePage from "./pages/Employee/Profile.jsx";
import LeavePage from "./pages/Employee/Leave.jsx";
import EvaluationPage from "./pages/Employee/Evaluation.jsx";
import TrainingPage from "./pages/Employee/Training.jsx";
import DocumentsPage from "./pages/Employee/Documents.jsx";
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";

// 🔒 ตรวจสอบ token และ role
const ProtectedRoute = ({ element, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "1" = Employee, "2" = HR

  if (!token) return <Navigate to="/" replace />;
  if (role && role.toString() !== userRole?.toString()) return <Navigate to="/" replace />;

  return element;
};

export default function App() {
  return (
    <Routes>
      {/* หน้า Login */}
      <Route path="/" element={<LoginPage />} />

      {/* 🔹 HR Routes */}
      <Route
        path="/dashboard/hr"
        element={<ProtectedRoute role="2" element={<HRLayout><Dashboard /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/employees"
        element={<ProtectedRoute role="2" element={<HRLayout><EmployeeData /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/documents"
        element={<ProtectedRoute role="2" element={<HRLayout><DocumentHR /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/evaluation"
        element={<ProtectedRoute role="2" element={<HRLayout><Evaluation /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/financial"
        element={<ProtectedRoute role="2" element={<HRLayout><FinancialInfo /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/leave"
        element={<ProtectedRoute role="2" element={<HRLayout><LeaveInfo /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/training"
        element={<ProtectedRoute role="2" element={<HRLayout><Training /></HRLayout>} />}
      />

      {/* ✅ “ข้อมูลส่วนตัว” ไปหน้า HistoryHR */}
      <Route
        path="/dashboard/hr/history"
        element={<ProtectedRoute role="2" element={<HRLayout><HistoryHR /></HRLayout>} />}
      />

      {/* ✅ “ข้อมูลประจำตัวพนักงาน” ไปหน้า PersonalInfo */}
      <Route
        path="/dashboard/hr/personal-info"
        element={<ProtectedRoute role="2" element={<HRLayout><PersonalInfo /></HRLayout>} />}
      />

      {/* 🔹 Employee Routes */}
      <Route
        path="/dashboard/employee"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><EmployeeDashboard /></EmployeeLayout>} />}
      />
      <Route
        path="/profile"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><ProfilePage /></EmployeeLayout>} />}
      />
      <Route
        path="/leave"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><LeavePage /></EmployeeLayout>} />}
      />
      <Route
        path="/evaluation"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><EvaluationPage /></EmployeeLayout>} />}
      />
      <Route
        path="/training"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><TrainingPage /></EmployeeLayout>} />}
      />
      <Route
        path="/documents"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><DocumentsPage /></EmployeeLayout>} />}
      />

      {/* หน้าอื่นที่ไม่รู้จัก → กลับไป Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
