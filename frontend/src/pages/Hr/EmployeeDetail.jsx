import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

function EmployeeDetail() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const emp = localStorage.getItem("selectedEmployee");
    if (emp) {
      setEmployee(JSON.parse(emp));
    } else {
      navigate("/dashboard/hr/personal-info"); // ถ้าไม่มีข้อมูลให้ย้อนกลับอัตโนมัติ
    }
  }, [navigate]);

  if (!employee) return <div className="text-center mt-5">⏳ กำลังโหลดข้อมูล...</div>;

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔙 ปุ่มย้อนกลับ */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/dashboard/hr/personal-info")}
      >
        <FaArrowLeft className="me-2" />
        ย้อนกลับ
      </button>

      {/* ข้อมูลพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4 p-4">
        <h4 className="fw-bold mb-3" style={{ color: "#0b1e39" }}>
          ข้อมูลพนักงาน: {employee.first_name} {employee.last_name}
        </h4>

        <div className="row">
          <div className="col-md-6 mb-3">
            <strong>รหัสพนักงาน:</strong> {employee.employee_code}
          </div>
          <div className="col-md-6 mb-3">
            <strong>แผนก:</strong> {employee.department_name}
          </div>
          <div className="col-md-6 mb-3">
            <strong>ตำแหน่ง:</strong> {employee.position}
          </div>
          <div className="col-md-6 mb-3">
            <strong>เงินเดือน:</strong> {employee.salary?.toLocaleString()} บาท
          </div>
          <div className="col-md-6 mb-3">
            <strong>อีเมล:</strong> {employee.email}
          </div>
          <div className="col-md-6 mb-3">
            <strong>เบอร์โทร:</strong> {employee.phone}
          </div>
          <div className="col-md-6 mb-3">
            <strong>วันที่เริ่มงาน:</strong>{" "}
            {new Date(employee.hire_date).toLocaleDateString("th-TH")}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDetail;
