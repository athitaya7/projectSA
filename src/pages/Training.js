import React, { useState } from "react";
import { FaBookOpen, FaTrash } from "react-icons/fa";

function TrainingHR() {
  const [trainingData, setTrainingData] = useState([
    {
      id: 1,
      employeeName: "-",
      courseName: "-",
      startDate: "-",
      endDate: "-",
      score: "-",
      status:   "-",
      certificate:  "-",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newTraining, setNewTraining] = useState({
    employeeName: "",
    courseName: "",
    startDate: "",
    endDate: "",
    score: "",
    status: "",
    certificate: "",
  });

  // ✅ ฟังก์ชันเพิ่มข้อมูล
  const handleAddTraining = () => {
    if (
      !newTraining.employeeName ||
      !newTraining.courseName ||
      !newTraining.startDate ||
      !newTraining.endDate
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const newData = {
      id: trainingData.length + 1,
      ...newTraining,
    };

    setTrainingData([...trainingData, newData]);
    setShowForm(false);
    setNewTraining({
      employeeName: "",
      courseName: "",
      startDate: "",
      endDate: "",
      score: "",
      status: "",
      certificate: "",
    });
    alert("✅ เพิ่มข้อมูลการอบรมสำเร็จ!");
  };

  // ✅ ฟังก์ชันลบ
  const deleteTraining = (id) => {
    if (window.confirm("คุณต้องการลบข้อมูลการอบรมนี้หรือไม่?")) {
      setTrainingData(trainingData.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อหน้า */}
      <div className="d-flex align-items-center mb-4">
        <FaBookOpen
          size={20}
          className="me-2 text-primary"
          style={{ marginTop: "-2px" }}
        />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          การฝึกอบรมของพนักงาน
        </h4>
      </div>

      {/* 🔹 ปุ่มเพิ่มข้อมูล */}
      <div className="text-end mb-3">
        <button
          className="btn btn-primary px-4 rounded-pill fw-semibold"
          onClick={() => setShowForm(true)}
        >
          + เพิ่มข้อมูลการอบรม
        </button>
      </div>

      {/* 🔹 ตารางข้อมูลการอบรม */}
      <div className="card shadow-sm border-0 rounded-4">
        <div
          className="p-3 fw-bold text-dark border-bottom"
          style={{
            backgroundColor: "#ffffff",
            fontSize: "16px",
          }}
        >
          ข้อมูลการฝึกอบรมของพนักงาน
        </div>

        <div className="p-4">
          <div className="table-responsive">
            <table className="table align-middle text-center table-hover">
              <thead
                style={{
                  backgroundColor: "#f8f9fa",
                  fontWeight: "600",
                  color: "#0b1e39",
                }}
              >
                <tr>
                  <th>ชื่อพนักงาน</th>
                  <th>ชื่อหลักสูตร</th>
                  <th>วันเริ่มอบรม</th>
                  <th>วันสิ้นสุดการอบรม</th>
                  <th>คะแนน</th>
                  <th>สถานะ</th>
                  <th>ใบอนุมัติ / ใบรับรอง</th>
                  <th>การจัดการ</th>
                </tr>
              </thead>
              <tbody>
                {trainingData.length > 0 ? (
                  trainingData.map((t) => (
                    <tr key={t.id}>
                      <td>{t.employeeName}</td>
                      <td className="text-start">{t.courseName}</td>
                      <td>{t.startDate}</td>
                      <td>{t.endDate}</td>
                      <td>{t.score || "-"}</td>
                      <td>
                        <span
                          className={`badge ${
                            t.status === "ผ่านการอบรม"
                              ? "bg-success"
                              : t.status === "ไม่ผ่านการอบรม"
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {t.status || "ยังไม่ระบุ"}
                        </span>
                      </td>
                      <td>{t.certificate || "-"}</td>
                      <td>
                        <button
                          className="btn btn-outline-secondary btn-sm rounded-pill"
                          onClick={() => deleteTraining(t.id)}
                        >
                          <FaTrash /> ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-secondary py-3">
                      ไม่มีข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🔹 Modal เพิ่มข้อมูล */}
      {showForm && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">เพิ่มข้อมูลการอบรม</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowForm(false)}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    ชื่อพนักงาน
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="employeeName"
                    value={newTraining.employeeName}
                    onChange={(e) =>
                      setNewTraining({
                        ...newTraining,
                        employeeName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">ชื่อหลักสูตร</label>
                  <input
                    type="text"
                    className="form-control"
                    name="courseName"
                    value={newTraining.courseName}
                    onChange={(e) =>
                      setNewTraining({
                        ...newTraining,
                        courseName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">วันเริ่มอบรม</label>
                    <input
                      type="date"
                      className="form-control"
                      name="startDate"
                      value={newTraining.startDate}
                      onChange={(e) =>
                        setNewTraining({
                          ...newTraining,
                          startDate: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      วันสิ้นสุดการอบรม
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      name="endDate"
                      value={newTraining.endDate}
                      onChange={(e) =>
                        setNewTraining({
                          ...newTraining,
                          endDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">คะแนน</label>
                    <input
                      type="number"
                      className="form-control"
                      name="score"
                      value={newTraining.score}
                      onChange={(e) =>
                        setNewTraining({
                          ...newTraining,
                          score: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">สถานะ</label>
                    <select
                      className="form-select"
                      name="status"
                      value={newTraining.status}
                      onChange={(e) =>
                        setNewTraining({
                          ...newTraining,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="">-- เลือกสถานะ --</option>
                      <option value="ผ่านการอบรม">ผ่านการอบรม</option>
                      <option value="ไม่ผ่านการอบรม">ไม่ผ่านการอบรม</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">ใบรับรอง</label>
                  <input
                    type="text"
                    className="form-control"
                    name="certificate"
                    value={newTraining.certificate}
                    onChange={(e) =>
                      setNewTraining({
                        ...newTraining,
                        certificate: e.target.value,
                      })
                    }
                    placeholder="เช่น มีใบรับรอง / -"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary rounded-pill"
                  onClick={() => setShowForm(false)}
                >
                  ยกเลิก
                </button>
                <button
                  className="btn btn-success rounded-pill"
                  onClick={handleAddTraining}
                >
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
