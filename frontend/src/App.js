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
import EmployeeDetail from "./pages/Hr/EmployeeDetail.jsx";
import Training from "./pages/Hr/TrainingHR.js";
import HRLayout from "./layouts/HRLayout.jsx";
import ContractAlertHR from "./pages/Hr/ContractAlertHR.js";
import ReportSummary from "./pages/Hr/ReportSummary.jsx"; // ✅ ใช้ไฟล์ของ HR

// Employee
import EmployeeDashboard from "./pages/Employee/Dashboard.js";
import "./pages/Employee/Dashboard.css";
import ProfilePage from "./pages/Employee/Profile.jsx";
import LeavePage from "./pages/Employee/Leave.jsx";
import EvaluationPage from "./pages/Employee/Evaluation.jsx";
import TrainingPage from "./pages/Employee/Training.jsx";
import DocumentsPage from "./pages/Employee/Documents.jsx";
import EmployeeLayout from "./layouts/EmployeeLayout.jsx";
import ContractAlert from "./pages/Employee/ContractAlert.js"; // ✅ ใช้ไฟล์ของ Employee

// ✅ ตรวจสอบ token และ role
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
      {/* 🟢 หน้า Login */}
      <Route path="/" element={<LoginPage />} />

      {/* 🟣 HR Routes */}
      <Route
        path="/dashboard/hr"
        element={<ProtectedRoute role="2" element={<HRLayout><Dashboard /></HRLayout>} />}
      />
      <Route path="/dashboard/hr/employee-detail" element={<HRLayout><EmployeeDetail /></HRLayout>} />
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
    path="/ReportSummary"
    element={<ProtectedRoute role="2" element={<HRLayout><ReportSummary /></HRLayout>} />}
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
      <Route
        path="/dashboard/hr/history"
        element={<ProtectedRoute role="2" element={<HRLayout><HistoryHR /></HRLayout>} />}
      />
      <Route
        path="/dashboard/hr/personal-info"
        element={<ProtectedRoute role="2" element={<HRLayout><PersonalInfo /></HRLayout>} />}
      />
      {/* ✅ หน้าแจ้งเตือนสัญญาของ HR */}
      <Route
        path="/dashboard/hr/contract-alert"
        element={<ProtectedRoute role="2" element={<HRLayout><ContractAlertHR /></HRLayout>} />}
      />

      {/* 🔵 Employee Routes */}
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
      {/* ✅ หน้าแจ้งเตือนสัญญาของพนักงาน */}
      <Route
        path="/employee/contract-alert"
        element={<ProtectedRoute role="1" element={<EmployeeLayout><ContractAlert /></EmployeeLayout>} />}
      />

      {/* ❌ หน้าอื่น → กลับไป Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
