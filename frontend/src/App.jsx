import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Hr/LoginPage";
import EmployeeDashboard from "./pages/EmployeeDashboard"; // สำหรับพนักงาน
import HRDashboard from "./pages/HRDashboard"; // สำหรับ HR

const ProtectedRoute = ({ element, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // "1" = Employee, "2" = HR

  if (!token) return <Navigate to="/" replace />;

  if (role && role !== userRole) return <Navigate to="/" replace />;

  return element;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้า Login */}
        <Route path="/" element={<LoginPage />} />

        {/* Dashboard Employee */}
        <Route
          path="/dashboard/employee"
          element={
            <ProtectedRoute element={<EmployeeDashboard />} role="1" />
          }
        />

        {/* Dashboard HR */}
        <Route
          path="/dashboard/hr"
          element={<ProtectedRoute element={<HRDashboard />} role="2" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
