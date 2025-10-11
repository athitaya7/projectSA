import React from "react";
import {
  FaUsers,
  FaUserPlus,
  FaUserMinus,
  FaFileContract,
  FaChartLine,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { BiBarChartAlt2 } from "react-icons/bi";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { Pie, Bar, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

function Dashboard() {
  const data = {
    totalEmployees: 120,
    newEmployees: 6,
    resignedEmployees: 4,
    expiringContracts: 3,
    trainingCourses: 8,
    avgEvaluation: 85,
  };

  // 🔹 กราฟวงกลม: สัดส่วนเพศ
  const genderData = {
    labels: ["ชาย", "หญิง", "อื่น ๆ"],
    datasets: [
      {
        data: [60, 50, 10],
        backgroundColor: ["#36A2EB", "#FF6384", "#FFCE56"],
        borderWidth: 0,
      },
    ],
  };

  // 🔹 กราฟแท่ง: เงินเดือนเฉลี่ยตามตำแหน่ง
  const salaryData = {
    labels: ["HR", "บัญชี", "IT", "ฝ่ายผลิต", "ขาย"],
    datasets: [
      {
        label: "เงินเดือนเฉลี่ย (บาท)",
        data: [25000, 28000, 35000, 22000, 30000],
        backgroundColor: "#5B86E5",
      },
    ],
  };

  // 🔹 กราฟแท่งแนวนอน: จำนวนพนักงานในแต่ละแผนก
  const deptData = {
    labels: ["HR", "บัญชี", "IT", "ฝ่ายผลิต", "ขาย"],
    datasets: [
      {
        label: "จำนวนพนักงาน",
        data: [10, 15, 25, 30, 20],
        backgroundColor: "#43E97B",
      },
    ],
  };

  // 🔹 กราฟเส้น: จำนวนพนักงานที่ลาออกแต่ละปี
  const resignedByYear = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "จำนวนพนักงานที่ลาออก",
        data: [5, 8, 6, 10, 7],
        borderColor: "#FF6384",
        backgroundColor: "rgba(255,99,132,0.3)",
        tension: 0.3,
        fill: true,
        pointBackgroundColor: "#FF6384",
      },
    ],
  };

  // 🔹 กราฟแท่ง: เงินเดือนเฉลี่ยต่อปี
  const avgSalaryYear = {
    labels: ["2020", "2021", "2022", "2023", "2024"],
    datasets: [
      {
        label: "เงินเดือนเฉลี่ย (บาท)",
        data: [25000, 26500, 28000, 29500, 31000],
        backgroundColor: "rgba(91,134,229,0.8)",
      },
    ],
  };

  // 🔹 Options สำหรับกราฟ
  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { display: false }, ticks: { stepSize: 5 } },
    },
  };

  const horizontalBarOptions = { ...barOptions, indexAxis: "y" };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* ---------- หัวข้อ Dashboard ---------- */}
      <div className="d-flex align-items-center mb-3">
        <BiBarChartAlt2
          size={18}
          style={{ color: "#0b1e39", marginRight: "6px", marginTop: "-2px" }}
        />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          HR Dashboard
        </h4>
      </div>

      {/* ---------- การ์ด KPI ---------- */}
      <div className="row g-4 mb-4">
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
              <div className="icon-box mb-3" style={{ background: card.color }}>
                {card.icon}
              </div>
              <h6 className="text-secondary">{card.title}</h6>
              <h3 className="fw-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- กราฟส่วนล่าง ---------- */}
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">สัดส่วนเพศพนักงาน</h6>
            <Pie data={genderData} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">เงินเดือนเฉลี่ยตามตำแหน่ง</h6>
            <Bar data={salaryData} options={barOptions} />
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">จำนวนพนักงานในแต่ละแผนก</h6>
            <Bar data={deptData} options={horizontalBarOptions} />
          </div>
        </div>
      </div>

      {/* ---------- กราฟวิเคราะห์เพิ่มเติม ---------- */}
      <div className="row g-4 mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">พนักงานที่ลาออกแต่ละปี</h6>
            <Line data={resignedByYear} />
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-3 rounded-4">
            <h6 className="fw-bold mb-3 text-center">เงินเดือนเฉลี่ยต่อปี</h6>
            <Bar data={avgSalaryYear} options={barOptions} />
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
