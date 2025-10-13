// src/pages/Employee/Dashboard.jsx
import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import { BarChart2, Umbrella, CalendarDays, Star } from "lucide-react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    remainingLeave: 0,
    absences: 0,
    yearlyScore: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="main-content" style={{ flexGrow: 1, padding: "20px" }}>
      <h1>Employee Dashboard</h1>
      <p>ยินดีต้อนรับเข้าสู่ระบบพนักงาน</p>

      <div className="dashboard-page">
        <PageHeader title="Dashboard" icon={<BarChart2 />} />
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <button
            onClick={() => navigate("/employee/contract-alert")}
            className="btn btn-warning fw-bold shadow-sm"
            style={{
              borderRadius: "10px",
              color: "#0b1e39",
              fontSize: "0.9rem",
            }}
          >
            🔔 แจ้งเตือนสัญญา
          </button>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card card-blue">
            <div className="card-icon">
              <Umbrella color="white" size={32} />
            </div>
            <div className="card-content">
              <h3>วันลาคงเหลือ</h3>
              <p className="card-value">{dashboardData.remainingLeave} วัน</p>
            </div>
          </div>

          <div className="dashboard-card card-red">
            <div className="card-icon">
              <CalendarDays color="white" size={32} />
            </div>
            <div className="card-content">
              <h3>จำนวนการขาดงาน</h3>
              <p className="card-value">{dashboardData.absences} วัน</p>
            </div>
          </div>

          <div className="dashboard-card card-green">
            <div className="card-icon">
              <Star color="white" size={32} />
            </div>
            <div className="card-content">
              <h3>คะแนนประเมินประจำปี</h3>
              <p className="card-value">{dashboardData.yearlyScore} คะแนน</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;