import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaUser,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaArrowLeft,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";

function PersonalInfo() {
  const navigate = useNavigate();
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
  const [addModal, setAddModal] = useState(false);
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

  // ✅ โหลดข้อมูลพนักงาน
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:3000/api/hr/employees", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
      setFilteredEmployees(res.data);
    } catch (err) {
      console.error("❌ Error fetching employees:", err);
    }
  };

  // ✅ ค้นหา
  useEffect(() => {
    const filtered = employees.filter(
      (e) =>
        (e.first_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (e.last_name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (e.employee_code?.toLowerCase() || "").includes(search.toLowerCase())
    );
    setFilteredEmployees(filtered);
  }, [search, employees]);

  // ✅ เปิด modal แก้ไข
  const handleEditEmployee = (emp) => {
    setEditData({ ...emp });
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

  // ✅ เปิด modal ยืนยันลบ
  const confirmDelete = (emp) => {
    setSelectedEmployee(emp);
    setDeleteModal(true);
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
      setDeleteModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // ✅ ตัวกรองข้อมูล
  const applyFilterSort = () => {
    let result = [...employees];
    if (selectedDept)
      result = result.filter((e) => e.department_name === selectedDept);
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
      if (!newEmployee.first_name || !newEmployee.last_name) {
        alert("⚠️ กรุณากรอกชื่อ-นามสกุล");
        return;
      }

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

  // ✅ ไปหน้ารายละเอียดพนักงาน
  const handleSelectEmployee = (emp) => {
    localStorage.setItem("selectedEmployee", JSON.stringify(emp));
    navigate(`/dashboard/hr/employee-detail`);
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* ปุ่มย้อนกลับ */}
      <Button variant="secondary" onClick={() => navigate(-1)} className="mb-3">
        <FaArrowLeft /> กลับ
      </Button>

      <div className="d-flex align-items-center mb-4">
        <FaUser size={20} style={{ color: "#0b1e39", marginRight: "8px" }} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          จัดการข้อมูลพนักงาน
        </h4>
        <button className="btn btn-success ms-auto" onClick={() => setAddModal(true)}>
          <FaPlus /> เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* ช่องค้นหา */}
      <div className="input-group mb-4" style={{ maxWidth: "500px" }}>
        <input
          type="text"
          className="form-control"
          placeholder="ค้นหาพนักงาน (ชื่อ, รหัส)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setFilterModal(true)}>
          <FaFilter /> ตัวกรอง
        </button>
      </div>

      {/* ตารางพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4 mb-5">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายชื่อพนักงาน
        </div>
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
                        <FaSearch /> ดูข้อมูล
                      </button>
                      <button
                        className="btn btn-outline-warning btn-sm me-2"
                        onClick={() => handleEditEmployee(emp)}
                      >
                        <FaEdit /> แก้ไข
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => confirmDelete(emp)}
                      >
                        <FaTrashAlt /> ลบ
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-secondary py-3">
                    ไม่พบข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ Modal แก้ไข */}
      <Modal show={editModal} onHide={() => setEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>แก้ไขข้อมูลพนักงาน</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {Object.keys(editData).map((key) =>
            ["employee_code"].includes(key) ? null : (
              <div className="mb-3" key={key}>
                <label className="form-label fw-semibold">{key}</label>
                <input
                  type={key === "salary" ? "number" : "text"}
                  className="form-control"
                  value={editData[key] || ""}
                  onChange={(e) =>
                    setEditData({ ...editData, [key]: e.target.value })
                  }
                />
              </div>
            )
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            ยกเลิก
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            💾 บันทึก
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Modal ยืนยันลบ */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>ยืนยันการลบ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <p>
              คุณต้องการลบพนักงาน{" "}
              <strong>
                {selectedEmployee.first_name} {selectedEmployee.last_name}
              </strong>{" "}
              ใช่หรือไม่?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>
            ❌ ยกเลิก
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            🗑️ ลบข้อมูล
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Modal เพิ่มพนักงาน */}
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
                value={newEmployee[key] || ""}
                onChange={(e) =>
                  setNewEmployee({ ...newEmployee, [key]: e.target.value })
                }
              />
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModal(false)}>
            ❌ ยกเลิก
          </Button>
          <Button variant="success" onClick={handleSaveAdd}>
            💾 บันทึกข้อมูล
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PersonalInfo;
