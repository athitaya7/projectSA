import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";

// HR
// HR
import Dashboard from "./pages/Hr/Dashboard.js";
import EmployeeData from "./pages/Hr/EmployeeData.js"; // แทน EmployeePage
import DocumentHR from "./pages/Hr/DocumentHR.js";
import Evaluation from "./pages/Hr/Evaluation.js";
import FinancialInfo from "./pages/Hr/FinancialInfo.js";
import HistoryHR from "./pages/Hr/HistoryHR.js";
import LeaveInfo from "./pages/Hr/LeaveInfo.js";
import PersonalInfo from './pages/Hr/PersonalInfo.js';
import Training from "./pages/Hr/Training.js";
import HRLayout from './layouts/HRLayout.jsx';
import "./pages/Hr/Dashboard.css";

// Employee
import EmployeeDashboard from "./pages/Employee/Dashboard.js"; 
import "./pages/Employee/Dashboard.css";
import ProfilePage from './pages/Employee/Profile.jsx';
import LeavePage from './pages/Employee/Leave.jsx';
import EvaluationPage from './pages/Employee/Evaluation.jsx';
import TrainingPage from './pages/Employee/Training.jsx';
import DocumentsPage from './pages/Employee/Documents.jsx';
import EmployeeLayout from './layouts/EmployeeLayout.jsx';

// ProtectedRoute ตรวจสอบ token + role
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

      {/* HR Dashboard */}
      <Route path="/dashboard/hr"element=
        {<ProtectedRoute role="2" element={<HRLayout><Dashboard /></HRLayout>} />}
      />
      
      {/* HR Employee Data */}
      <Route path="/dashboard/hr/employees" element={
        <ProtectedRoute role="2" element={<HRLayout><EmployeeData /></HRLayout>} />}
      />

      {/* HR Documents */}
      <Route path="/dashboard/hr/documents" element=
        {<ProtectedRoute role="2" element={<HRLayout><DocumentHR /></HRLayout>} />}
      />

      {/* HR Evaluation */}
      <Route path="/dashboard/hr/evaluation" element=
        {<ProtectedRoute role="2" element={<HRLayout><Evaluation /></HRLayout>} />}
      />

      {/* HR Financial Info */}
      <Route path="/dashboard/hr/financial" element={
        <ProtectedRoute role="2" element={<HRLayout> <FinancialInfo /></HRLayout>} />
      }/>

      {/* HR History */}
      <Route path="/dashboard/hr/history" element={
        <ProtectedRoute role="2" element={<HRLayout><HistoryHR /></HRLayout>} />
      }/>

      {/* HR Leave Info */}
      <Route path="/dashboard/hr/leave" element={
        <ProtectedRoute role="2" element={<HRLayout><LeaveInfo /></HRLayout>} />
      }/>

      {/* HR PersonalInfo */}
      <Route path="/dashboard/hr/personal-info" element={
      <ProtectedRoute role="2" element={<HRLayout><PersonalInfo /></HRLayout>} />
      }/>

      {/* HR Training */}
      <Route path="/dashboard/hr/training" element={
        <ProtectedRoute role="2" element={<HRLayout><Training /></HRLayout>} />
      }/>

      {/* Employee Dashboard */}
      <Route path="/dashboard/employee"element={
          <ProtectedRoute role="1" element={<EmployeeLayout><EmployeeDashboard /></EmployeeLayout>} />
      }/>

      {/* Employee Pages */}
      <Route path="/profile" element={
        <ProtectedRoute role="1" element={<EmployeeLayout>  <ProfilePage /></EmployeeLayout>} />
      } />
      <Route path="/leave" element={
        <ProtectedRoute role="1" element={<EmployeeLayout><LeavePage /></EmployeeLayout>} />
      } />
      <Route path="/evaluation" element={
        <ProtectedRoute role="1" element={<EmployeeLayout><EvaluationPage /></EmployeeLayout>} />
      } />
      <Route path="/training" element={
        <ProtectedRoute role="1" element={<EmployeeLayout><TrainingPage /></EmployeeLayout>} />
      } />
      <Route path="/documents" element={
        <ProtectedRoute role="1" element={<EmployeeLayout><DocumentsPage /></EmployeeLayout>} />
      } />

      {/* Redirect path ที่ไม่รู้จักไปหน้า Login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
