import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaFileContract } from "react-icons/fa";

function ContractAlert() {
  // ✅ ใช้ state เฉพาะที่จำเป็น
  const [contracts] = useState([
    {
      id: 1,
      employeeName: "สมชาย ใจดี",
      position: "เจ้าหน้าที่ฝ่ายบุคคล",
      department: "HR",
      startDate: "2024-01-01",
      endDate: "2025-11-10",
      daysLeft: 27,
    },
    {
      id: 2,
      employeeName: "สมศรี วงษ์ใหญ่",
      position: "นักบัญชี",
      department: "Finance",
      startDate: "2023-12-01",
      endDate: "2025-12-15",
      daysLeft: 63,
    },
    {
      id: 3,
      employeeName: "ณัฐพล ขยันดี",
      position: "เจ้าหน้าที่ไอที",
      department: "IT",
      startDate: "2024-05-10",
      endDate: "2025-10-20",
      daysLeft: 7,
    },
  ]);

  // ✅ ฟังก์ชันกรองเฉพาะคนที่เหลือไม่เกิน 30 วัน
  const expiringSoon = contracts.filter((c) => c.daysLeft <= 30);

  useEffect(() => {
    document.title = "แจ้งเตือนสัญญาใกล้หมด - HR Portal";
  }, []);

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <FaExclamationTriangle className="text-warning me-2" size={20} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          แจ้งเตือนสัญญาจ้างใกล้หมดอายุ
        </h4>
      </div>

      {/* 🔹 การ์ดสรุป */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายการสัญญาที่ใกล้หมดอายุ
        </div>

        <div className="p-4 table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead
              style={{
                backgroundColor: "#f1f5f9",
                color: "#0b1e39",
              }}
            >
              <tr>
                <th>ชื่อพนักงาน</th>
                <th>ตำแหน่ง</th>
                <th>แผนก</th>
                <th>วันเริ่มต้น</th>
                <th>วันสิ้นสุด</th>
                <th>จำนวนวันคงเหลือ</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {expiringSoon.length > 0 ? (
                expiringSoon.map((c) => (
                  <tr key={c.id}>
                    <td>{c.employeeName}</td>
                    <td>{c.position}</td>
                    <td>{c.department}</td>
                    <td>{c.startDate}</td>
                    <td>{c.endDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          c.daysLeft <= 7
                            ? "bg-danger"
                            : c.daysLeft <= 15
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        เหลือ {c.daysLeft} วัน
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm me-2">
                        ต่อสัญญา
                      </button>
                      <button className="btn btn-outline-secondary btn-sm">
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-secondary py-4">
                    ✅ ขณะนี้ไม่มีสัญญาที่ใกล้หมดอายุ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 การ์ดสรุปภาพรวม */}
      <div className="alert alert-info rounded-4 shadow-sm d-flex align-items-center">
        <FaFileContract className="me-2 text-primary" />
        รวมทั้งหมด {expiringSoon.length} สัญญาที่ใกล้หมดอายุภายใน 30 วัน
      </div>

      {/* ✅ CSS */}
      <style>
        {`
          .badge {
            font-size: 0.9rem;
            padding: 0.5em 0.8em;
          }
          .table th {
            font-weight: 600;
          }
        `}
      </style>
    </div>
  );
}

export default ContractAlert;
