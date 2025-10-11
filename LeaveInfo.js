import React, { useState } from "react";
import {
  FaClipboardList,
  FaUmbrellaBeach,
  FaTemperatureHigh,
  FaUserTie,
} from "react-icons/fa";

function LeaveInfoHR() {
  const [leaveData, setLeaveData] = useState([
    {
      id: 1,
      employeeName: "สมชาย ใจดี",
      leaveType: "ลาพักร้อน",
      startDate: "2025-10-01",
      endDate: "2025-10-03",
      totalDays: 3,
      status: "รออนุมัติ",
    },
    {
      id: 2,
      employeeName: "สมศรี วงษ์ใหญ่",
      leaveType: "ลาป่วย",
      startDate: "2025-09-20",
      endDate: "2025-09-22",
      totalDays: 2,
      status: "อนุมัติแล้ว",
    },
  ]);

  const updateStatus = (id, newStatus) => {
    setLeaveData(
      leaveData.map((leave) =>
        leave.id === id ? { ...leave, status: newStatus } : leave
      )
    );
  };

  return (
    <div className="container-fluid" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อหน้า */}
      <h4 className="fw-bold mb-4 d-flex align-items-center">
        <FaClipboardList className="me-2 text-primary" />
        จัดการข้อมูลการลาของพนักงาน
      </h4>

      {/* 🔹 การ์ดสรุปภาพรวมวันลา */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <FaUmbrellaBeach size={28} className="text-primary mb-2" />
              <h6 className="text-secondary mb-1">รวมวันลาพักร้อน</h6>
              <h4 className="fw-bold text-dark">
                {leaveData.filter((l) => l.leaveType === "ลาพักร้อน").length} รายการ
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <FaTemperatureHigh size={28} className="text-danger mb-2" />
              <h6 className="text-secondary mb-1">รวมวันลาป่วย</h6>
              <h4 className="fw-bold text-dark">
                {leaveData.filter((l) => l.leaveType === "ลาป่วย").length} รายการ
              </h4>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm border-0 rounded-4">
            <div className="card-body">
              <FaUserTie size={28} className="text-info mb-2" />
              <h6 className="text-secondary mb-1">รวมวันลากิจ</h6>
              <h4 className="fw-bold text-dark">
                {leaveData.filter((l) => l.leaveType === "ลากิจ").length} รายการ
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ตารางข้อมูลการลา */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <h6 className="fw-bold text-dark mb-3">ข้อมูลการลาของพนักงาน</h6>

          <table className="table align-middle table-hover">
            <thead
              style={{
                backgroundColor: "#f1f5f9",
                color: "#0b1e39",
              }}
            >
              <tr>
                <th>ชื่อพนักงาน</th>
                <th>ประเภทวันลา</th>
                <th>วันที่เริ่มต้น</th>
                <th>วันที่สิ้นสุด</th>
                <th>จำนวนวัน</th>
                <th>สถานะ</th>
                <th className="text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {leaveData.length > 0 ? (
                leaveData.map((leave) => (
                  <tr key={leave.id}>
                    <td>{leave.employeeName}</td>
                    <td>{leave.leaveType}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.totalDays}</td>
                    <td>
                      <span
                        className={`badge ${
                          leave.status === "อนุมัติแล้ว"
                            ? "bg-success"
                            : leave.status === "ไม่อนุมัติ"
                            ? "bg-danger"
                            : "bg-warning text-dark"
                        }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {/* ✅ เหลือแค่ปุ่มอนุมัติ/ไม่อนุมัติ */}
                      <button
                        className="btn btn-outline-success btn-sm me-2 rounded-pill"
                        onClick={() => updateStatus(leave.id, "อนุมัติแล้ว")}
                      >
                        อนุมัติ
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => updateStatus(leave.id, "ไม่อนุมัติ")}
                      >
                        ไม่อนุมัติ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-secondary py-4">
                    ไม่มีข้อมูลการลา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default LeaveInfoHR;
