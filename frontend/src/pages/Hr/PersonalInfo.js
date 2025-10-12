import React, { useEffect, useState } from "react";
import { FaUser, FaSearch, FaFilter, FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

function EmployeeProfileHR() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [filterModal, setFilterModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState({});
  const [addModal, setAddModal] = useState(false); // ✅ modal เพิ่มพนักงานใหม่
  const [newEmployee, setNewEmployee] = useState({
    first_name: "",
    last_name: "",
    department_name: "",
    position: "",
    salary: "",
    hire_date: "",
    email: "",
    phone: "",
  });

  const token = localStorage.getItem("token");

  // ✅ ดึงข้อมูลพนักงานทั้งหมด
  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/hr/employees", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEmployees(data);
        setFilteredEmployees(data);
      })
      .catch((err) => console.error("Fetch employees error:", err));
  }, [token]);

  // ✅ ค้นหา
  useEffect(() => {
    const filtered = employees.filter((e) =>
      (e.first_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.last_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (e.employee_code?.toLowerCase() || "").includes(search.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [search, employees]);

  const handleSelectEmployee = (emp) => setSelectedEmployee(emp);

  const handleEditEmployee = (emp) => {
    setEditData(emp);
    setEditModal(true);
  };

  // ✅ บันทึกการแก้ไข
  const handleSaveEdit = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/hr/employees/${editData.employee_code}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editData),
        }
      );
      if (!res.ok) throw new Error("ไม่สามารถอัปเดตข้อมูลได้");
      alert("✅ แก้ไขข้อมูลสำเร็จ");
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employee_code === editData.employee_code ? editData : emp
        )
      );
      setEditModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ ลบพนักงาน
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/api/hr/employees/${selectedEmployee.employee_code}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("ไม่สามารถลบข้อมูลพนักงานได้");
      alert("🗑️ ลบข้อมูลพนักงานเรียบร้อยแล้ว");
      setEmployees((prev) =>
        prev.filter((e) => e.employee_code !== selectedEmployee.employee_code)
      );
      setSelectedEmployee(null);
      setDeleteModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ ตัวกรอง
  const applyFilterSort = () => {
    let result = [...employees];
    if (selectedDept) result = result.filter((e) => e.department_name === selectedDept);
    if (sortOption === "name") {
      result.sort((a, b) => a.first_name.localeCompare(b.first_name));
    } else if (sortOption === "salary") {
      result.sort((a, b) => b.salary - a.salary);
    }
    setFilteredEmployees(result);
    setFilterModal(false);
  };

  // ✅ เพิ่มพนักงานใหม่
  const handleSaveAdd = async () => {
    try {
      const res = await fetch("http://127.0.0.1:3000/api/hr/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newEmployee,
          username: newEmployee.first_name,
          password: "password123",
        }),
      });

      if (!res.ok) throw new Error("ไม่สามารถเพิ่มพนักงานได้");
      const data = await res.json();
      alert("✅ เพิ่มพนักงานใหม่สำเร็จ");

      setEmployees((prev) => [...prev, data]);
      setAddModal(false);
      setNewEmployee({
        first_name: "",
        last_name: "",
        department_name: "",
        position: "",
        salary: "",
        hire_date: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* ---------- 🔹 ส่วนหัว ---------- */}
      <div className="d-flex align-items-center mb-4">
        <FaUser size={20} style={{ color: "#0b1e39", marginRight: "8px" }} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>จัดการข้อมูลพนักงาน</h4>
        <button
          className="btn btn-success ms-auto"
          onClick={() => setAddModal(true)}
        >
          <FaPlus /> เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* 🔹 ช่องค้นหา */}
      <div className="input-group mb-4" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหาพนักงาน (ชื่อ, รหัส)"
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
              {[...new Set(employees.map((e) => e.department_name))].map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
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
            </select>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setFilterModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={applyFilterSort}>
            ตกลง
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 ตารางพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4 mb-5">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">รายชื่อพนักงาน</div>
        <div className="p-4 table-responsive">
          <table className="table table-hover text-center align-middle">
            <thead style={{ backgroundColor: "#f1f5f9", color: "#0b1e39" }}>
              <tr>
                <th>รหัสพนักงาน</th>
                <th>ชื่อ</th>
                <th>นามสกุล</th>
                <th>แผนก</th>
                <th>ตำแหน่ง</th>
                <th>เงินเดือน</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp.employee_code}>
                    <td>{emp.employee_code}</td>
                    <td>{emp.first_name}</td>
                    <td>{emp.last_name}</td>
                    <td>{emp.department_name}</td>
                    <td>{emp.position}</td>
                    <td>{emp.salary?.toLocaleString()} บาท</td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleSelectEmployee(emp)}
                      >
                        <FaEdit /> ดูข้อมูล
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm me-2"
                        onClick={() => handleEditEmployee(emp)}
                      >
                        🖊️ แก้ไข
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => {
                          setSelectedEmployee(emp);
                          setDeleteModal(true);
                        }}
                      >
                        <FaTrashAlt /> ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="7" className="text-secondary py-3">ไม่พบข้อมูลพนักงาน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal เพิ่มพนักงานใหม่ */}
      <Modal show={addModal} onHide={() => setAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มพนักงานใหม่</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(newEmployee).map((key) => (
            <div className="mb-3" key={key}>
              <label className="form-label fw-semibold">{key}</label>
              <input
                type={key === "salary" ? "number" : "text"}
                className="form-control"
                value={newEmployee[key]}
                onChange={(e) => setNewEmployee({ ...newEmployee, [key]: e.target.value })}
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModal(false)}>ยกเลิก</Button>
          <Button variant="success" onClick={handleSaveAdd}>💾 บันทึก</Button>
        </Modal.Footer>
      </Modal>

      {/* 🔹 Modal ดู / แก้ไข / ลบ — คงเดิม */}
      {/* (ไม่เปลี่ยนจากของเดิมเลย) */}
    </div>
  );
}

export default EmployeeProfileHR;
