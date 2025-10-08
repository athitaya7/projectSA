import React, { useState } from "react";
import { FaUser, FaSearch } from "react-icons/fa";

function EmployeeProfileHR() {
  const [employee, setEmployee] = useState({
    firstName: "สมชาย",
    lastName: "ใจดี",
    employeeId: "EMP001",
    birthDate: "1985-01-15",
    citizenId: "1234567890123",
    phone: "0812345678",
    address: "123/45 แขวงคลองสาน เขตธนบุรี กรุงเทพฯ",
    email: "somchai@company.com",
    position: "เจ้าหน้าที่บัญชี",
    department: "การเงิน",
    workStart: "2018-03-01",
    experience: "7 ปี",
    salary: "25000",
    allowance: "3000",
    bonus: "10000",
    social: "750",
    provident: "1000",
    tax: "1500",
    totalDeduct: "3250",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSave = () => {
    alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว!");
    console.log(employee);
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อหน้า */}
      <div className="d-flex align-items-center mb-4">
        <FaUser size={20} style={{ color: "#0b1e39", marginRight: "8px" }} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          จัดการข้อมูลพนักงาน
        </h4>
      </div>

      {/* 🔹 ช่องค้นหาพนักงาน */}
      <div className="input-group mb-4" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหาพนักงาน (ชื่อหรือรหัส)"
          style={{ borderRadius: "10px 0 0 10px" }}
        />
        <button className="btn btn-primary" style={{ borderRadius: "0 10px 10px 0" }}>
          <FaSearch /> ค้นหา
        </button>
      </div>

      {/* 🔹 การ์ดข้อมูลส่วนตัว */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลส่วนตัว
        </div>
        <div className="p-4">
          <div className="row">
            {[
              ["ชื่อ", "firstName"],
              ["นามสกุล", "lastName"],
              ["รหัสพนักงาน", "employeeId"],
              ["วันเกิด", "birthDate"],
              ["เลขบัตรประชาชน", "citizenId"],
              ["เบอร์โทรศัพท์", "phone"],
              ["ที่อยู่", "address"],
              ["Email", "email"],
              ["ตำแหน่ง", "position"],
            ].map(([label, field]) => (
              <div key={field} className="col-md-4 mb-3">
                <strong>{label}</strong>
                <input
                  name={field}
                  type="text"
                  value={employee[field]}
                  onChange={handleChange}
                  className="form-control mt-1"
                  style={{ background: "#f8fafc" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔹 ข้อมูลการทำงาน */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลการทำงาน
        </div>
        <div className="p-4 row">
          <div className="col-md-3 mb-3">
            <strong>ตำแหน่ง</strong>
            <input
              name="position"
              value={employee.position}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>แผนก</strong>
            <input
              name="department"
              value={employee.department}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>วันที่เริ่มงาน</strong>
            <input
              name="workStart"
              value={employee.workStart}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>อายุงาน</strong>
            <input
              name="experience"
              value={employee.experience}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
        </div>
      </div>

      {/* 🔹 ข้อมูลเงินเดือน */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลเงินเดือน
        </div>
        <div className="p-4 row">
          <div className="col-md-4 mb-3">
            <strong>เงินเดือนพื้นฐาน</strong>
            <input
              name="salary"
              value={employee.salary}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-4 mb-3">
            <strong>ค่าตำแหน่ง/เบี้ยเลี้ยง</strong>
            <input
              name="allowance"
              value={employee.allowance}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-4 mb-3">
            <strong>โบนัส</strong>
            <input
              name="bonus"
              value={employee.bonus}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
        </div>
      </div>

      {/* 🔹 ข้อมูลการหักภาษี */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลการหักภาษี
        </div>
        <div className="p-4 row">
          <div className="col-md-3 mb-3">
            <strong>ประกันสังคม</strong>
            <input
              name="social"
              value={employee.social}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>กองทุนสำรองเลี้ยงชีพ</strong>
            <input
              name="provident"
              value={employee.provident}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>ภาษีเงินได้</strong>
            <input
              name="tax"
              value={employee.tax}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
          <div className="col-md-3 mb-3">
            <strong>รวมรายการหัก</strong>
            <input
              name="totalDeduct"
              value={employee.totalDeduct}
              onChange={handleChange}
              className="form-control mt-1"
            />
          </div>
        </div>
      </div>

      {/* 🔹 ปุ่มบันทึก */}
      <div className="text-end mt-4 mb-5">
        <button className="btn btn-success me-2 px-4" onClick={handleSave}>
          บันทึกข้อมูล
        </button>
        <button className="btn btn-outline-secondary px-4">
          ยกเลิก
        </button>
      </div>
    </div>
  );
}

export default EmployeeProfileHR;
