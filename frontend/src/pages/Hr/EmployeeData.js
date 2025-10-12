import React, { useState, useEffect } from "react";
import {
  FaUserTie,
  FaCalendarAlt,
  FaBuilding,
  FaBriefcase,
  FaPlus,
  FaTrashAlt,
  FaSearch,
} from "react-icons/fa";

function EmployeeData() {
  const [workInfo, setWorkInfo] = useState(null);
  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ เพิ่มสำหรับ HR: รายชื่อพนักงาน + ตัวกรอง
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 โหลดรายชื่อพนักงานทั้งหมด (เฉพาะเพิ่มใหม่)
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("❌ Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // 🔹 โหลดข้อมูลการทำงาน (ของพนักงานที่เลือก)
  useEffect(() => {
    if (!selectedEmp) {
      setWorkInfo(null);
      setLoading(false);
      return;
    }

    const fetchWorkInfo = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/workinfo/${selectedEmp}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        console.log("✅ WorkInfo:", data);
        setWorkInfo(data);
        
        setTransferHistory(data.transfer_history || []);
        console.log("🧾 transferHistory:", data.transfer_history);
      } catch (err) {
        console.error("❌ Fetch Work Info Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkInfo();
  }, [selectedEmp]);

  // 🔹 แก้ไขค่าฟอร์ม
  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkInfo({ ...workInfo, [name]: value });
  };

  // 🔹 จัดการตารางโยกย้าย (ของเดิม)
  const handleAddTransfer = () => {
    setTransferHistory([
      ...transferHistory,
      { date: "", oldPosition: "", newPosition: "", note: "" },
    ]);
  };
  const handleTransferChange = (index, field, value) => {
    const updated = [...transferHistory];
    updated[index][field] = value;
    setTransferHistory(updated);
  };
  const handleDeleteTransfer = (index) => {
    const updated = [...transferHistory];
    updated.splice(index, 1);
    setTransferHistory(updated);
  };

  // 🔹 บันทึกข้อมูล (ของเดิม)
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `http://localhost:3000/api/workinfo/${workInfo.employee_code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(workInfo),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("✅ " + data.message);
      } else {
        alert("❌ ไม่สามารถบันทึกข้อมูลได้: " + data.message);
      }
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  };

  // ✅ ฟิลเตอร์รายชื่อพนักงาน (เฉพาะเพิ่มใหม่)
  const filteredEmployees = employees.filter(
    (e) =>
      e.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${e.first_name} ${e.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // 🧩 ส่วน UI
  return (
    <div
      className="container mt-4"
      style={{ fontFamily: "'Kanit', sans-serif", color: "#0b1e39" }}
    >
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <FaUserTie size={20} className="me-2 text-primary" />
        <h4 className="fw-bold mb-0">ข้อมูลการทำงานของพนักงาน</h4>
      </div>

      {/* 🟩 ส่วนที่ "เพิ่มใหม่" */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 p-3">
        <div className="row align-items-center">
          <div className="col-md-6 mb-2">
            <label className="fw-semibold">🔍 ค้นหาพนักงาน</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaSearch className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="พิมพ์ชื่อหรือรหัสพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 mb-2">
            <label className="fw-semibold">เลือกพนักงาน</label>
            <select
              className="form-select"
              value={selectedEmp}
              onChange={(e) => setSelectedEmp(e.target.value)}
            >
              <option value="">-- เลือกพนักงาน --</option>
              {filteredEmployees.map((emp) => (
                <option key={emp.employee_code} value={emp.employee_code}>
                  {emp.employee_code} - {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 ส่วนเดิมทั้งหมดอยู่ตรงนี้ */}
      {loading ? (
        <div className="text-center mt-5 text-secondary">
          กำลังโหลดข้อมูลการทำงาน...
        </div>
      ) : !workInfo ? (
        <div className="alert alert-warning mt-4 mx-4">
          ❗ กรุณาเลือกพนักงานเพื่อดูข้อมูล
        </div>
      ) : (
        <>
          {/* 🔸 รายละเอียดการทำงาน */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="p-3 fw-bold text-dark border-bottom bg-light">
              รายละเอียดการทำงาน
            </div>
            <div className="p-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">ตำแหน่ง</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaBriefcase className="text-secondary" />
                    </span>
                    <input
                      type="text"
                      name="position"
                      value={workInfo.position || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">แผนก</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaBuilding className="text-secondary" />
                    </span>
                    <input
                      type="text"
                      name="department"
                      value={workInfo.department || ""}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">วันที่เริ่มงาน</label>
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      <FaCalendarAlt className="text-secondary" />
                    </span>
                    <input
                      type="date"
                      name="hire_date"
                      value={
                        workInfo.hire_date
                          ? workInfo.hire_date.split("T")[0]
                          : ""
                      }
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">อายุงาน</label>
                  <input
                    type="text"
                    name="work_years"
                    value={`${workInfo.work_years || 0} ปี`}
                    className="form-control"
                    readOnly
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">เงินเดือน</label>
                  <input
                    type="text"
                    name="salary"
                    value={
                      workInfo.total_salary ? workInfo.total_salary.toLocaleString() : ""
                    }
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-4 mb-3">
                  <label className="fw-semibold">โบนัส</label>
                  <input
                    type="text"
                    name="bonus"
                    value={
                      workInfo.bonus ? workInfo.bonus.toLocaleString() : ""
                    }
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 🔸 ตารางโยกย้าย */}
          <div className="card shadow-sm border-0 rounded-4 mb-4">
            <div className="p-3 fw-bold text-dark border-bottom bg-light d-flex justify-content-between align-items-center">
              <span>ประวัติการโยกย้าย / การเลื่อนตำแหน่ง</span>
              <button
                className="btn btn-sm btn-primary d-flex align-items-center"
                onClick={handleAddTransfer}
              >
                <FaPlus className="me-1" /> เพิ่มรายการ
              </button>
            </div>
            <div className="p-4">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: "15%" }}>วันที่</th>
                    <th style={{ width: "20%" }}>ตำแหน่งเดิม</th>
                    <th style={{ width: "20%" }}>ตำแหน่งใหม่</th>
                    <th>หมายเหตุ</th>
                    <th style={{ width: "8%" }}>ลบ</th>
                  </tr>
                </thead>
                <tbody>
                  {transferHistory.map((t, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="date"
                          value={t.date ? t.date.split("T")[0] : ""}
                          onChange={(e) =>
                            handleTransferChange(index, "date", e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={t.oldPosition || t.old_position || ""}
                          onChange={(e) =>
                            handleTransferChange(
                              index,
                              "oldPosition",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={t.newPosition || t.new_position || ""}
                          onChange={(e) =>
                            handleTransferChange(
                              index,
                              "newPosition",
                              e.target.value
                            )
                          }
                          className="form-control"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={t.note || t.remark || ""}
                          onChange={(e) =>
                            handleTransferChange(index, "note", e.target.value)
                          }
                          className="form-control"
                        />
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteTransfer(index)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 🔸 ปุ่มบันทึก */}
          <div className="text-end mt-3 mb-5">
            <button className="btn btn-success me-2 px-4" onClick={handleSave}>
              บันทึกข้อมูล
            </button>
            <button className="btn btn-outline-secondary px-4">ยกเลิก</button>
          </div>
        </>
      )}
    </div>
  );
}

export default EmployeeData;
