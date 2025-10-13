import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChartLine,
  FaCalendarCheck,
} from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:3000/api/hr/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("❌ Unauthorized or token missing");
        return res.json();
      })
      .then(setDashboard)
      .catch((err) => console.error("❌ Dashboard fetch error:", err));
  }, []);

  if (!dashboard) return <p className="text-center mt-5">⏳ กำลังโหลดข้อมูล...</p>;

  const {
    totalEmployees,
    departments = [],
    averageSalary,
    averageScore,
    leaveThisMonth = [],
  } = dashboard;

  const deptData = {
    labels: departments.map((d) => d.department),
    datasets: [
      {
        label: "จำนวนพนักงาน",
        data: departments.map((d) => d.count),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const leaveData = {
    labels: leaveThisMonth.map((l) => l.leave_type),
    datasets: [
      {
        data: leaveThisMonth.map((l) => l.count),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { x: { grid: { display: false } }, y: { grid: { display: false } } },
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* ---------- หัวข้อ Dashboard + ปุ่มแจ้งเตือน ---------- */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <BiBarChartAlt2
            size={18}
            style={{ color: "#0b1e39", marginRight: "6px", marginTop: "-2px" }}
          />
          <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
            HR Dashboard
          </h4>
        </div>

        <button
          onClick={() => navigate("/dashboard/hr/contract-alert")}
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

      {/* ---------- การ์ด KPI ---------- */}
      <div className="row g-4 mb-4">
        {[
          {
            title: "พนักงานทั้งหมด",
            value: `${totalEmployees || 0} คน`,
            icon: <FaUsers size={22} color="white" />,
            color: "linear-gradient(135deg, #36D1DC, #5B86E5)",
          },
          {
            title: "เงินเดือนเฉลี่ย",
            value: `${averageSalary || 0} บาท`,
            icon: <FaChartLine size={22} color="white" />,
            color: "linear-gradient(135deg, #9b59b6, #8e44ad)",
          },
          {
            title: "คะแนนประเมินเฉลี่ย",
            value: `${averageScore || 0} คะแนน`,
            icon: <FaCalendarCheck size={22} color="white" />,
            color: "linear-gradient(135deg, #F7971E, #FFD200)",
          },
        ].map((card, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm border-0 p-3 text-center dashboard-card">
              <div className="icon-box mb-3" style={{ background: card.color }}>
                {card.icon}
              </div>
              <h6 className="text-secondary">{card.title}</h6>
              <h3 className="fw-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- กราฟ ---------- */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">จำนวนพนักงานในแต่ละแผนก</h6>
            <Bar data={deptData} options={barOptions} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">สถิติการลาในเดือนนี้</h6>
            {leaveThisMonth.length > 0 ? (
              <Pie data={leaveData} />
            ) : (
              <p className="text-center text-secondary">ไม่มีข้อมูลการลาในเดือนนี้</p>
            )}
          </div>
        </div>
      </div>

      {/* ---------- CSS ---------- */}
      <style>
        {`
          .dashboard-card {
            background-color: #fff;
            border-radius: 20px;
            transition: all 0.3s ease;
          }
          .dashboard-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          }
          .icon-box {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
          }
        `}
      </style>
    </div>
  );
}

export default Dashboard;
