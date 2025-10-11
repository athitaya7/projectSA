import React, { useState } from "react";
import {
  FaUserTie,
  FaCalendarAlt,
  FaBuilding,
  FaBriefcase,
  FaPlus,
  FaTrashAlt,
} from "react-icons/fa";

function EmployeeWorkInfoHRFull() {
  const [workInfo, setWorkInfo] = useState({
    position: "เจ้าหน้าที่บัญชี",
    department: "การเงิน",
    workStart: "2018-03-01",
    workEnd: "",
    workStatus: "ปฏิบัติงานอยู่",
    supervisor: "นางสาวศิริมา วงศ์ใหญ่",
    employeeType: "พนักงานประจำ",
    workLocation: "สำนักงานใหญ่ กรุงเทพฯ",
    probation: "ผ่านการทดลองงาน",
    experience: "7 ปี",
  });

  const [transferHistory, setTransferHistory] = useState([
    {
      date: "2021-06-01",
      oldPosition: "เจ้าหน้าที่บัญชี",
      newPosition: "หัวหน้าฝ่ายบัญชี",
      note: "เลื่อนตำแหน่งจากผลการประเมินดีเด่น",
    },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWorkInfo({ ...workInfo, [name]: value });
  };

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

  const handleSave = () => {
    alert("✅ บันทึกข้อมูลการทำงานเรียบร้อยแล้ว!");
    console.log({ workInfo, transferHistory });
  };

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

      {/* 🔹 ข้อมูลหลัก */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายละเอียดการทำงาน
        </div>
        <div className="p-4">
          <div className="row">
            {/* ตำแหน่ง */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">ตำแหน่ง</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaBriefcase className="text-secondary" />
                </span>
                <input
                  type="text"
                  name="position"
                  value={workInfo.position}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* แผนก */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">แผนก</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaBuilding className="text-secondary" />
                </span>
                <input
                  type="text"
                  name="department"
                  value={workInfo.department}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* วันที่เริ่มงาน */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">วันที่เริ่มงาน</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaCalendarAlt className="text-secondary" />
                </span>
                <input
                  type="date"
                  name="workStart"
                  value={workInfo.workStart}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* วันที่สิ้นสุดการทำงาน */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">วันที่สิ้นสุดการทำงาน (ถ้ามี)</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <FaCalendarAlt className="text-secondary" />
                </span>
                <input
                  type="date"
                  name="workEnd"
                  value={workInfo.workEnd}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            </div>

            {/* อายุงาน */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">อายุงาน</label>
              <input
                type="text"
                name="experience"
                value={workInfo.experience}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* สถานะการทำงาน */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">สถานะการทำงาน</label>
              <select
                name="workStatus"
                value={workInfo.workStatus}
                onChange={handleChange}
                className="form-select"
              >
                <option>ปฏิบัติงานอยู่</option>
                <option>ลาออกแล้ว</option>
                <option>ลาพักงานชั่วคราว</option>
              </select>
            </div>

            {/* ประเภทพนักงาน */}
            <div className="col-md-4 mb-3">
              <label className="fw-semibold">ประเภทพนักงาน</label>
              <select
                name="employeeType"
                value={workInfo.employeeType}
                onChange={handleChange}
                className="form-select"
              >
                <option>พนักงานประจำ</option>
                <option>พนักงานสัญญาจ้าง</option>
                <option>พนักงานชั่วคราว</option>
                <option>ฝึกงาน / Internship</option>
              </select>
            </div>

            {/* ผู้บังคับบัญชา */}
            <div className="col-md-6 mb-3">
              <label className="fw-semibold">หัวหน้างาน / ผู้บังคับบัญชา</label>
              <input
                type="text"
                name="supervisor"
                value={workInfo.supervisor}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* สถานที่ทำงาน */}
            <div className="col-md-6 mb-3">
              <label className="fw-semibold">สถานที่ทำงาน</label>
              <input
                type="text"
                name="workLocation"
                value={workInfo.workLocation}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            {/* สถานะทดลองงาน */}
            <div className="col-md-6 mb-3">
              <label className="fw-semibold">สถานะทดลองงาน</label>
              <select
                name="probation"
                value={workInfo.probation}
                onChange={handleChange}
                className="form-select"
              >
                <option>กำลังทดลองงาน</option>
                <option>ผ่านการทดลองงาน</option>
                <option>ไม่ผ่านการทดลองงาน</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ตารางประวัติการโยกย้าย / เลื่อนตำแหน่ง */}
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
                      value={t.date}
                      onChange={(e) =>
                        handleTransferChange(index, "date", e.target.value)
                      }
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={t.oldPosition}
                      onChange={(e) =>
                        handleTransferChange(index, "oldPosition", e.target.value)
                      }
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={t.newPosition}
                      onChange={(e) =>
                        handleTransferChange(index, "newPosition", e.target.value)
                      }
                      className="form-control"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={t.note}
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

      {/* 🔹 ปุ่มบันทึก */}
      <div className="text-end mt-3 mb-5">
        <button className="btn btn-success me-2 px-4" onClick={handleSave}>
           บันทึกข้อมูล
        </button>
        <button className="btn btn-outline-secondary px-4">ยกเลิก</button>
      </div>
    </div>
  );
}

export default EmployeeWorkInfoHRFull;
