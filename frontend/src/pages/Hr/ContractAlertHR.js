import React, { useState, useEffect } from "react";
import { FaExclamationTriangle, FaFileContract } from "react-icons/fa";

function ContractAlertHR() {
  const [contracts, setContracts] = useState([]); // ✅ เริ่มต้นเป็น array ว่าง
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "แจ้งเตือนสัญญาใกล้หมด - HR Portal";

    const fetchContracts = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ ใช้ token ยืนยันตัวตน
        const res = await fetch("http://127.0.0.1:3000/api/contracts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("ไม่สามารถดึงข้อมูลได้");
        const data = await res.json();
        setContracts(data);
      } catch (error) {
        console.error("❌ Error fetching contracts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  // ✅ กรองเฉพาะสัญญาที่เหลือไม่เกิน 30 วัน
  const expiringSoon = contracts.filter((c) => c.daysLeft <= 30);

  if (loading) {
    return <p className="text-center mt-5">⏳ กำลังโหลดข้อมูล...</p>;
  }

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <FaExclamationTriangle className="text-warning me-2" size={20} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          แจ้งเตือนสัญญาจ้างใกล้หมดอายุ
        </h4>
      </div>

      {/* 🔹 ตาราง */}
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
                expiringSoon.map((c, index) => (
                  <tr key={index}>
                    <td>{c.employeeName}</td>
                    <td>{c.position}</td>
                    <td>{c.department}</td>
                    <td>{new Date(c.start_date).toLocaleDateString("th-TH")}</td>
                    <td>{new Date(c.end_date).toLocaleDateString("th-TH")}</td>
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

      {/* 🔹 สรุป */}
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

export default ContractAlertHR;
