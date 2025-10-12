import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBookOpen, FaTrash } from "react-icons/fa";

function TrainingHR() {
  const [trainingData, setTrainingData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTraining, setNewTraining] = useState({
    employee_code: "",
    course_name: "",
    start_date: "",
    end_date: "",
    score: "",
    result: "",
  });

  // ✅ โหลดข้อมูลฝึกอบรมจาก backend
  useEffect(() => {
  fetchTraining();
}, []);

  const fetchTraining = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/api/training", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📦 Training data:", res.data);
      setTrainingData(res.data);
    } catch (err) {
      console.error("❌ Error fetching training:", err);
      alert("โหลดข้อมูลไม่สำเร็จ (อาจยังไม่ได้เข้าสู่ระบบ)");
    }
  };

  // ✅ เพิ่มข้อมูลใหม่
  const handleAddTraining = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/api/training", newTraining, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ เพิ่มข้อมูลการอบรมสำเร็จ!");
      setShowForm(false);
      setNewTraining({
        employee_code: "",
        course_name: "",
        start_date: "",
        end_date: "",
        score: "",
        result: "",
      });
      fetchTraining();
    } catch (err) {
      console.error("❌ Error adding training:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก (อาจยังไม่ได้เข้าสู่ระบบ)");
    }
  };

  // ✅ ลบข้อมูล
  const deleteTraining = async (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลการอบรมนี้หรือไม่?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:3000/api/training/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchTraining();
      } catch (err) {
        console.error("❌ Error deleting training:", err);
        alert("ลบข้อมูลไม่สำเร็จ (อาจยังไม่ได้เข้าสู่ระบบ)");
      }
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <div className="d-flex align-items-center mb-4">
        <FaBookOpen size={20} className="me-2 text-primary" />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          การฝึกอบรมของพนักงาน
        </h4>
      </div>

      <div className="text-end mb-3">
        <button className="btn btn-primary px-4 rounded-pill fw-semibold" onClick={() => setShowForm(true)}>
          + เพิ่มข้อมูลการอบรม
        </button>
      </div>

      <div className="card shadow-sm border-0 rounded-4">
        <div className="p-3 fw-bold text-dark border-bottom" style={{ backgroundColor: "#ffffff", fontSize: "16px" }}>
          ข้อมูลการฝึกอบรมของพนักงาน
        </div>
        <div className="p-4">
          <div className="table-responsive">
            <table className="table align-middle text-center table-hover">
              <thead style={{ backgroundColor: "#f8f9fa", fontWeight: "600", color: "#0b1e39" }}>
                <tr>
                  <th>รหัสพนักงาน</th>
                  <th>ชื่อพนักงาน</th>
                  <th>ชื่อหลักสูตร</th>
                  <th>วันเริ่มอบรม</th>
                  <th>วันสิ้นสุดการอบรม</th>
                  <th>คะแนน</th>
                  <th>ผลการอบรม</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {trainingData.map((t, index) => (
                  <tr key={t.training_id || index}>
                    <td>{t.employee_code}</td>
                    <td>{t.employee_name}</td>
                    <td>{t.course_name}</td>
                    <td>{t.start_date}</td>
                    <td>{t.end_date}</td>
                    <td>{t.score}</td>
                    <td>{t.result}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm rounded-pill"
                        onClick={() => deleteTraining(t.training_id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">เพิ่มข้อมูลการอบรม</h5>
                <button className="btn-close btn-close-white" onClick={() => setShowForm(false)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="รหัสพนักงาน เช่น EMP001"
                  value={newTraining.employee_code}
                  onChange={(e) => setNewTraining({ ...newTraining, employee_code: e.target.value })}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="ชื่อหลักสูตร"
                  value={newTraining.course_name}
                  onChange={(e) => setNewTraining({ ...newTraining, course_name: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newTraining.start_date}
                  onChange={(e) => setNewTraining({ ...newTraining, start_date: e.target.value })}
                />
                <input
                  type="date"
                  className="form-control mb-2"
                  value={newTraining.end_date}
                  onChange={(e) => setNewTraining({ ...newTraining, end_date: e.target.value })}
                />
                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="คะแนน"
                  value={newTraining.score}
                  onChange={(e) => setNewTraining({ ...newTraining, score: e.target.value })}
                />
                <select
                  className="form-select"
                  value={newTraining.result}
                  onChange={(e) => setNewTraining({ ...newTraining, result: e.target.value })}
                >
                  <option value="">-- เลือกผลการอบรม --</option>
                  <option value="ผ่าน">ผ่าน</option>
                  <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                  <option value="รอดำเนินการ">รอดำเนินการ</option>
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary rounded-pill" onClick={() => setShowForm(false)}>
                  ยกเลิก
                </button>
                <button className="btn btn-success rounded-pill" onClick={handleAddTraining}>
                  บันทึกข้อมูล
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TrainingHR;
