import React, { useState, useEffect } from "react";
import { FaUserTie, FaEnvelope, FaPhone, FaHome } from "react-icons/fa";
import axios from "axios";

function HistoryHR() {
  const [hrInfo, setHrInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const hrId = "HR001"; // 🔹 รหัสพนักงาน HR จริง (อาจดึงจาก localStorage)

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/hr/${hrId}`)
      .then((res) => setHrInfo(res.data))
      .catch((err) => console.error("❌ Error fetching HR info:", err));
  }, [hrId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHrInfo({ ...hrInfo, [name]: value });
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:3000/api/hr/${hrId}`, hrInfo)
      .then(() => {
        setIsEditing(false);
        alert("✅ บันทึกข้อมูล HR สำเร็จแล้ว!");
      })
      .catch((err) => console.error("❌ Error updating HR info:", err));
  };

  if (!hrInfo) return <div className="text-center mt-5">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <div className="d-flex align-items-center mb-4">
        <FaUserTie size={20} className="me-2 text-primary" />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          ประวัติ
        </h4>
      </div>

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลส่วนตัวของ {hrInfo.first_name} {hrInfo.last_name}
        </div>

        <div className="p-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <strong>รหัสพนักงาน</strong>
              <div>{hrInfo.employee_code}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>ชื่อ</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  className="form-control"
                  value={hrInfo.first_name || ""}
                  onChange={handleChange}
                />
              ) : (
                <div>{hrInfo.first_name}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <strong>นามสกุล</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  className="form-control"
                  value={hrInfo.last_name || ""}
                  onChange={handleChange}
                />
              ) : (
                <div>{hrInfo.last_name}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <strong>แผนก</strong>
              <div>{hrInfo.department || "-"}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>วันที่เริ่มงาน</strong>
              <div>
                {hrInfo.hire_date
                  ? new Date(hrInfo.hire_date).toLocaleDateString("th-TH")
                  : "-"}
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>เบอร์โทรศัพท์</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={hrInfo.phone || ""}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaPhone className="me-1 text-secondary" />
                  {hrInfo.phone || "-"}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <strong>Email</strong>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={hrInfo.email || ""}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaEnvelope className="me-1 text-secondary" />
                  {hrInfo.email || "-"}
                </div>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <strong>ที่อยู่</strong>
              {isEditing ? (
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={hrInfo.address || ""}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaHome className="me-1 text-secondary" />
                  {hrInfo.address || "-"}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-end">
        {isEditing ? (
          <button className="btn btn-success px-4 rounded-pill" onClick={handleSave}>
            บันทึก
          </button>
        ) : (
          <button
            className="btn btn-outline-primary px-4 rounded-pill"
            onClick={() => setIsEditing(true)}
          >
            แก้ไขข้อมูล
          </button>
        )}
      </div>

      <style>
        {`
          .card {
            border-radius: 18px;
            background-color: #fff;
          }
          strong {
            color: #0b1e39;
          }
          .btn-outline-primary:hover {
            background-color: #0b1e39;
            color: white;
          }
        `}
      </style>
    </div>
  );
}

export default HistoryHR;
