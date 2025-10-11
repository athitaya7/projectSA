import React, { useState } from "react";
import { FaUserTie, FaEnvelope, FaPhone, FaHome} from "react-icons/fa";

function HistoryHR() {
  const [hrInfo, setHrInfo] = useState({
    hrId: "-",
    name: "-",
    position: "-",
    department: "-",
    startDate: "-",
    phone: "-",
    email: "-",
    address: "-",
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHrInfo({ ...hrInfo, [name]: value });
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("✅ บันทึกข้อมูล HR สำเร็จแล้ว!");
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <FaUserTie size={20} className="me-2 text-primary" />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          ประวัติ
        </h4>
      </div>

      {/* 🔹 การ์ดข้อมูล */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลส่วนตัวของ
        </div>

        <div className="p-4">
          <div className="row">
            <div className="col-md-4 mb-3">
              <strong>รหัสพนักงาน</strong>
              <div>{hrInfo.hrId}</div>
            </div>
            <div className="col-md-4 mb-3">
              <strong>ชื่อ-นามสกุล</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={hrInfo.name}
                  onChange={handleChange}
                />
              ) : (
                <div>{hrInfo.name}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <strong>ตำแหน่ง</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="position"
                  className="form-control"
                  value={hrInfo.position}
                  onChange={handleChange}
                />
              ) : (
                <div>{hrInfo.position}</div>
              )}
            </div>

            <div className="col-md-4 mb-3">
              <strong>แผนก</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  value={hrInfo.department}
                  onChange={handleChange}
                />
              ) : (
                <div>{hrInfo.department}</div>
              )}
            </div>
            <div className="col-md-4 mb-3">
              <strong>วันที่เริ่มงาน</strong>
              <div>{hrInfo.startDate}</div>
            </div>

            <div className="col-md-4 mb-3">
              <strong>เบอร์โทรศัพท์</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={hrInfo.phone}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaPhone className="me-1 text-secondary" />
                  {hrInfo.phone}
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
                  value={hrInfo.email}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaEnvelope className="me-1 text-secondary" />
                  {hrInfo.email}
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
                  value={hrInfo.address}
                  onChange={handleChange}
                />
              ) : (
                <div>
                  <FaHome className="me-1 text-secondary" />
                  {hrInfo.address}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 ปุ่มบันทึก / แก้ไข */}
      <div className="text-end">
        {isEditing ? (
          <button
            className="btn btn-success px-4 rounded-pill"
            onClick={handleSave}
          >
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

      {/* ✅ CSS */}
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
