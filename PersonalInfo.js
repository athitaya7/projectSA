import React, { useState } from "react";
import { FaUser, FaSearch, FaFilter, FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

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

  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "สมชาย ใจดี",
      department: "การเงิน",
      position: "เจ้าหน้าที่บัญชี",
      experience: "7 ปี",
      salary: 25000,
    },
    {
      id: 2,
      name: "ศิริพร วงศ์ดี",
      department: "IT",
      position: "เจ้าหน้าที่ IT",
      experience: "5 ปี",
      salary: 30000,
    },
  ]);

  const [search, setSearch] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [newEmp, setNewEmp] = useState({
    name: "",
    department: "",
    position: "",
    experience: "",
    salary: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleSave = () => {
    alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว!");
    console.log(employee);
  };

  const handleAdd = () => {
    if (!newEmp.name || !newEmp.department || !newEmp.position) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนเพิ่ม!");
      return;
    }
    if (editingId) {
      setEmployees(
        employees.map((emp) => (emp.id === editingId ? { ...newEmp, id: emp.id } : emp))
      );
      setEditingId(null);
    } else {
      setEmployees([...employees, { ...newEmp, id: employees.length + 1 }]);
    }
    setNewEmp({ name: "", department: "", position: "", experience: "", salary: "" });
  };

  const handleEdit = (emp) => {
    setNewEmp(emp);
    setEditingId(emp.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("คุณต้องการลบพนักงานคนนี้หรือไม่?")) {
      setEmployees(employees.filter((e) => e.id !== id));
    }
  };

  const filteredEmployees = employees
    .filter(
      (e) =>
        (e.name.toLowerCase().includes(search.toLowerCase()) ||
          e.department.toLowerCase().includes(search.toLowerCase())) &&
        (selectedDept ? e.department === selectedDept : true)
    )
    .sort((a, b) => {
      if (sortOption === "salary") return b.salary - a.salary;
      if (sortOption === "experience") return b.experience.localeCompare(a.experience);
      if (sortOption === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  const clearFilter = () => {
    setSelectedDept("");
    setSortOption("");
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* ---------- 🔹 ส่วนหัว ---------- */}
      <div className="d-flex align-items-center mb-4">
        <FaUser size={20} style={{ color: "#0b1e39", marginRight: "8px" }} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          จัดการข้อมูลพนักงาน
        </h4>
      </div>

      {/* 🔹 ช่องค้นหา */}
      <div className="input-group mb-4" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหาพนักงาน (ชื่อหรือรหัส)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ borderRadius: "10px 0 0 10px" }}
        />
        <button
          className="btn btn-primary"
          style={{ borderRadius: "0" }}
          onClick={() => setFilterModal(true)}
        >
          <FaFilter /> ตัวกรอง
        </button>
        <button className="btn btn-success" style={{ borderRadius: "0 10px 10px 0" }}>
          <FaSearch /> ค้นหา
        </button>
      </div>

      {/* 🔹 Modal ตัวกรอง */}
      <Modal show={filterModal} onHide={() => setFilterModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ตัวกรองข้อมูลพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label className="fw-semibold">แผนก</label>
            <select
              className="form-select"
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
            >
              <option value="">ทั้งหมด</option>
              <option value="IT">IT</option>
              <option value="การเงิน">การเงิน</option>
              <option value="HR">HR</option>
              <option value="ฝ่ายผลิต">ฝ่ายผลิต</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="fw-semibold">เรียงลำดับตาม</label>
            <select
              className="form-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">ไม่เรียงลำดับ</option>
              <option value="name">ชื่อ (A → Z)</option>
              <option value="salary">เงินเดือน (มาก → น้อย)</option>
              <option value="experience">อายุงาน (มาก → น้อย)</option>
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={clearFilter}>
            ล้าง
          </Button>
          <Button variant="primary" onClick={() => setFilterModal(false)}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 ข้อมูลส่วนตัว */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">ข้อมูลส่วนตัว</div>
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
        <div className="p-3 fw-bold text-dark border-bottom bg-light">ข้อมูลการทำงาน</div>
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
        <div className="p-3 fw-bold text-dark border-bottom bg-light">ข้อมูลเงินเดือน</div>
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
        <div className="p-3 fw-bold text-dark border-bottom bg-light">ข้อมูลการหักภาษี</div>
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

      {/* 🔹 ตารางรายชื่อพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4 mb-5">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายชื่อพนักงานทั้งหมด
        </div>
        <div className="p-4 table-responsive">
          <table className="table table-hover text-center align-middle">
            <thead style={{ backgroundColor: "#f1f5f9", color: "#0b1e39" }}>
              <tr>
                <th>ชื่อพนักงาน</th>
                <th>แผนก</th>
                <th>ตำแหน่ง</th>
                <th>อายุงาน</th>
                <th>เงินเดือน</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>{emp.name}</td>
                    <td>{emp.department}</td>
                    <td>{emp.position}</td>
                    <td>{emp.experience}</td>
                    <td>{emp.salary.toLocaleString()} บาท</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleEdit(emp)}
                      >
                        <FaEdit /> แก้ไข
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(emp.id)}
                      >
                        <FaTrashAlt /> ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-secondary py-3">
                    ไม่พบข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ฟอร์มเพิ่ม/แก้ไข */}
        <div className="p-4 border-top">
          <h6 className="fw-bold mb-3">
            {editingId ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
          </h6>
          <div className="row">
            {["name", "department", "position", "experience", "salary"].map((field) => (
              <div className="col-md-3 mb-3" key={field}>
                <label className="fw-semibold">
                  {field === "name"
                    ? "ชื่อพนักงาน"
                    : field === "department"
                    ? "แผนก"
                    : field === "position"
                    ? "ตำแหน่ง"
                    : field === "experience"
                    ? "อายุงาน"
                    : "เงินเดือน"}
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={newEmp[field]}
                  onChange={(e) => setNewEmp({ ...newEmp, [field]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <div className="text-end mt-2">
            <button className="btn btn-success me-2 px-4" onClick={handleAdd}>
              <FaPlus className="me-1" />
              {editingId ? "บันทึกการแก้ไข" : "เพิ่มข้อมูล"}
            </button>
            <button
              className="btn btn-outline-secondary px-4"
              onClick={() => setEditingId(null)}
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 ปุ่มบันทึกข้อมูลทั้งหมด (ล่างสุดของหน้า) */}
      <div className="text-end mb-5 pe-4">
        <button
          className="btn btn-success px-5 py-2 fw-bold shadow-sm"
          onClick={handleSave}
        >
          บันทึกข้อมูล
        </button>
      </div>
    </div>
  );
}

export default EmployeeProfileHR;
