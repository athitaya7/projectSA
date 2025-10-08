import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaFileContract,
  FaChartLine,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi"; // ไอคอนแท่งกราฟ 3 แท่ง

function Dashboard() {
  // 🔹 ข้อมูลจำลองจากชีท HR
  const data = {
    totalEmployees: 120,
    newEmployees: 6,
    resignedEmployees: 4,
    expiringContracts: 3,
    trainingCourses: 8,
    avgEvaluation: 85,
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ Dashboard */}
      <div className="d-flex align-items-center mb-3">
        <BiBarChartAlt2
          size={18}
          style={{
            color: "#0b1e39",
            marginRight: "6px",
            marginTop: "-2px",
          }}
        />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          Dashboard
        </h4>
      </div>

      {/* 🔹 การ์ดสรุปข้อมูล */}
      <div className="row g-4">
        {[
          {
            title: "พนักงานทั้งหมด",
            value: `${data.totalEmployees} คน`,
            icon: <FaUsers size={22} color="white" />,
            color: "linear-gradient(135deg, #36D1DC, #5B86E5)",
          },
          {
            title: "พนักงานเข้าใหม่เดือนนี้",
            value: `${data.newEmployees} คน`,
            icon: <FaUserPlus size={22} color="white" />,
            color: "linear-gradient(135deg, #43E97B, #38F9D7)",
          },
          {
            title: "พนักงานลาออกเดือนนี้",
            value: `${data.resignedEmployees} คน`,
            icon: <FaUserMinus size={22} color="white" />,
            color: "linear-gradient(135deg, #FF6A88, #FF99AC)",
          },
          {
            title: "สัญญาจ้างใกล้หมดอายุ",
            value: `${data.expiringContracts} ฉบับ`,
            icon: <FaFileContract size={22} color="white" />,
            color: "linear-gradient(135deg, #F7971E, #FFD200)",
          },
          {
            title: "หลักสูตรอบรมปีนี้",
            value: `${data.trainingCourses} หลักสูตร`,
            icon: <FaChalkboardTeacher size={22} color="white" />,
            color: "linear-gradient(135deg, #00C6FF, #0072FF)",
          },
          {
            title: "คะแนนประเมินเฉลี่ย",
            value: `${data.avgEvaluation} คะแนน`,
            icon: <FaChartLine size={22} color="white" />,
            color: "linear-gradient(135deg, #9b59b6, #8e44ad)",
          },
        ].map((card, index) => (
          <div className="col-md-4" key={index}>
            <div className="card shadow-sm border-0 p-3 text-center dashboard-card">
              <div
                className="icon-box mb-3"
                style={{
                  background: card.color,
                }}
              >
                {card.icon}
              </div>
              <h6 className="text-secondary">{card.title}</h6>
              <h3 className="fw-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 CSS */}
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
