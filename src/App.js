import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import PersonalInfo from "./pages/PersonalInfo";
import EmployeeData from "./pages/EmployeeData";
import LeaveInfo from "./pages/LeaveInfo";
import Evaluation from "./pages/Evaluation";
import Training from "./pages/Training";
import FinancialInfo from "./pages/FinancialInfo";
import HistoryHR from "./pages/HistoryHR";
import DocumentHR from "./pages/DocumentHR"; // ✅ แก้ชื่อ import ให้ถูก
import Logout from "./pages/Logout";
import LoginPage from "./pages/LoginPage";
import "bootstrap/dist/css/bootstrap.min.css";

// 🔒 Protected Route (ป้องกันการเข้าหน้า Dashboard หากยังไม่ Login)
const ProtectedRoute = ({ element }) => {
  const isLoggedIn =
    localStorage.getItem("adminToken") || localStorage.getItem("empToken");
  return isLoggedIn ? element : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🔹 หน้าแรก: Login */}
        <Route path="/" element={<LoginPage />} />

        {/* 🔹 ส่วนของ Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <div style={{ display: "flex" }}>
              <Sidebar />
              <div style={{ flex: 1, padding: "20px" }}>
                <Routes>
                  <Route
                    path=""
                    element={<ProtectedRoute element={<Dashboard />} />}
                  />
                  <Route
                    path="personal"
                    element={<ProtectedRoute element={<PersonalInfo />} />}
                  />
                  <Route
                    path="history"
                    element={<ProtectedRoute element={<HistoryHR />} />}
                  />
                  <Route
                    path="employee"
                    element={<ProtectedRoute element={<EmployeeData />} />}
                  />
                  <Route
                    path="leave"
                    element={<ProtectedRoute element={<LeaveInfo />} />}
                  />
                  <Route
                    path="evaluation"
                    element={<ProtectedRoute element={<Evaluation />} />}
                  />
                  <Route
                    path="training"
                    element={<ProtectedRoute element={<Training />} />}
                  />
                  <Route
                    path="financialinfo"
                    element={<ProtectedRoute element={<FinancialInfo />} />}
                  />
                  {/* ✅ เพิ่ม Route สำหรับเอกสารของ HR */}
                  <Route
                    path="documenthr"
                    element={<ProtectedRoute element={<DocumentHR />} />}
                  />
                  <Route
                    path="logout"
                    element={<ProtectedRoute element={<Logout />} />}
                  />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
