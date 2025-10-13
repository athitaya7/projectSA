import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCheck, FaChartBar, FaSearch, FaArrowLeft, FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function EvaluationHR() {
  const [search, setSearch] = useState("");
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ โหลดรายชื่อพนักงานทั้งหมดเมื่อเปิดหน้า
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ ดึง token จาก localStorage
        const res = await axios.get("http://localhost:3000/api/employees", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ แนบ token
        });
        setEmployees(res.data);
      } catch (err) {
        console.error("❌ Error fetching employees:", err);
        alert("ไม่สามารถโหลดข้อมูลพนักงานได้ (อาจยังไม่ได้เข้าสู่ระบบ)");
      }
    };
    fetchEmployees();
  }, []);

  // ✅ โหลดข้อมูลการประเมินเมื่อเลือกพนักงาน
  useEffect(() => {
    if (!selectedEmp) return; // ถ้ายังไม่เลือกพนักงาน ให้ข้าม
    const fetchEvaluations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:3000/api/evaluation/${selectedEmp}`
        );
        console.log("📦 Evaluation data:", res.data);
        setEvaluations(res.data);
      } catch (err) {
        console.error("❌ Error fetching evaluation:", err);
        alert("ไม่สามารถโหลดข้อมูลการประเมินได้");
      } finally {
        setLoading(false);
      }
    };
    fetchEvaluations();
  }, [selectedEmp]);

  const navigate = useNavigate();
  const goToReport = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // 🔹 เรียก API ดึงข้อมูลรายงาน (แก้ URL ให้ตรงกับของคุณ)
      const res = await axios.get("http://localhost:3000/api/ReportSummary", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // ✅ เปลี่ยนหน้าไปยังหน้ารายงาน
      navigate("/ReportSummary");
    } catch (err) {
      console.error("❌ Error fetching report summary:", err);
      alert("ไม่สามารถโหลดข้อมูลรายงานได้ (อาจยังไม่ได้เข้าสู่ระบบ)");
    } finally {
      setLoading(false);
    }
  };


  // ✅ เริ่มประเมิน
  const handleEvaluate = async (employee_code) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token"); // 🔹 ดึง token จาก localStorage
      const res = await axios.get(
        `http://localhost:3000/api/evaluation/${employee_code}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // 🔹 แนบ token
        }
      );
      setSelectedEmp(employee_code);
      setEvaluations(res.data);
    } catch (err) {
      console.error("❌ Error fetching evaluation:", err);
      alert("ไม่สามารถโหลดข้อมูลการประเมินได้ (อาจยังไม่ได้เข้าสู่ระบบ)");
    } finally {
      setLoading(false);
    }
  };

  // ✅ กลับไปหน้ารายชื่อพนักงาน
  const handleBack = () => {
    setSelectedEmp(null);
    setEvaluations([]);
  };

  // ✅ บันทึกผล
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:3000/api/evaluation/${selectedEmp}`,
        { evaluations },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("✅ บันทึกผลการประเมินเรียบร้อยแล้ว!");
    } catch (err) {
      console.error("❌ Error saving evaluation:", err);
      alert("เกิดข้อผิดพลาดในการบันทึก (อาจหมดอายุการเข้าสู่ระบบ)");
    }
  };

  // ✅ เปลี่ยนคะแนน
  const handleScoreChange = (index, newScore) => {
    const updated = [...evaluations];
    updated[index].score = newScore;
    setEvaluations(updated);
  };

  // ✅ ฟิลเตอร์ค้นหาชื่อ
  const filtered = employees.filter((e) =>
    `${e.first_name} ${e.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------- 🔹 Loading
  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3">กำลังโหลดข้อมูล...</p>
      </div>
    );

  // --------------------------- 🔹 หน้าประเมินพนักงาน
  if (selectedEmp) {
    return (
      <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
        <button className="btn btn-outline-secondary mb-3" onClick={handleBack}>
          <FaArrowLeft className="me-2" /> กลับ
        </button>

        <h4 className="fw-bold text-primary mb-4">
          🧾 การประเมินพนักงาน {selectedEmp}
        </h4>

        <div className="card shadow-sm border-0 rounded-4">
          <div className="card-body">
            <table className="table align-middle">
              <thead style={{ backgroundColor: "#f1f5f9" }}>
                <tr>
                  <th>หมวดการประเมิน</th>
                  <th>รายละเอียด</th>
                  <th>คะแนน</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((ev, index) => (
                  <tr key={ev.id || index}>
                    <td>{ev.category}</td>
                    <td>{ev.description}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={ev.score}
                        className="form-control"
                        style={{ width: "100px" }}
                        onChange={(e) =>
                          handleScoreChange(index, parseInt(e.target.value) || 0)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end">
              <button className="btn btn-primary" onClick={handleSave}>
                <FaSave className="me-2" /> บันทึกผลการประเมิน
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------- 🔹 หน้ารายชื่อพนักงาน
  return (
    <div className="container-fluid" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <h4 className="fw-bold mb-4 d-flex align-items-center">
        <FaUserCheck className="me-2 text-primary" /> การประเมินพนักงาน
      </h4>

      {/* ช่องค้นหา */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <FaSearch className="text-secondary me-2" />
          <input
            type="text"
            placeholder="ค้นหาพนักงาน..."
            className="form-control"
            style={{ width: "250px", borderRadius: "10px" }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button className="btn btn-outline-primary" onClick={goToReport}>
          <FaChartBar className="me-2" /> รายงานผลรวม
            
        </button>
      </div>

      {/* ตารางพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="card-body">
          <table className="table table-hover align-middle">
            <thead style={{ backgroundColor: "#f1f5f9", color: "#0b1e39" }}>
              <tr>
                <th>รหัสพนักงาน</th>
                <th>ชื่อพนักงาน</th>
                <th>แผนก</th>
                <th>ตำแหน่ง</th>
                <th className="text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp) => (
                <tr key={emp.employee_code}>
                  <td>{emp.employee_code}</td>
                  <td>{emp.first_name + " " + emp.last_name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.position}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEvaluate(emp.employee_code)}
                    >
                      📝 ประเมิน
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-secondary py-3">
                    ไม่พบข้อมูลพนักงาน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default EvaluationHR;
