import React, { useState } from "react";
import { FaUserCheck, FaChartBar, FaSearch } from "react-icons/fa";

function EvaluationHR() {
  const [search, setSearch] = useState("");
  const employees = [
    { id: 1, name: "-", dept: "-", status: "-" },
    { id: 2, name: "-", dept: "-", status: "-" },
  ];

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-fluid" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <h4 className="fw-bold mb-4 d-flex align-items-center">
        <FaUserCheck className="me-2 text-primary" /> การประเมินพนักงาน
      </h4>

      {/* 🔹 ช่องค้นหา */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <FaSearch className="text-secondary me-2" />
          <input
            type="text"
            placeholder="ค้นหาพนักงาน..."
            className="form-control"
            style={{ width: "250px", borderRadius: "10px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-outline-primary">
          <FaChartBar className="me-2" /> รายงานผลรวม
        </button>
      </div>

      {/* 🔹 ตารางพนักงาน */}
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#f1f5f9", color: "#0b1e39" }}>
              <tr>
                <th>ชื่อพนักงาน</th>
                <th>แผนก</th>
                <th>สถานะ</th>
                <th className="text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.dept}</td>
                  <td>{emp.status}</td>
                  <td className="text-center">
                    <button className="btn btn-primary btn-sm">
                      📝 ประเมิน
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EvaluationHR;
