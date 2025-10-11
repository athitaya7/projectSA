import React, { useState } from "react";
import { FaFileAlt, FaPlus, FaDownload, FaLockOpen } from "react-icons/fa";

function DocumentHR() {
  const [documents, setDocuments] = useState([
    {
      id: 1,
      title: "สัญญาจ้างงานพนักงานประจำ",
      category: "สัญญาจ้างและข้อตกลง",
      fileType: "PDF",
      uploadDate: "2025-01-01",
      fileUrl: "#",
      status: "พร้อมให้เข้าถึง",
    },
    {
      id: 2,
      title: "นโยบายความปลอดภัยในสถานที่ทำงาน",
      category: "นโยบายบริษัทและคู่มือพนักงาน",
      fileType: "PDF",
      uploadDate: "2025-02-10",
      fileUrl: "#",
      status: "พร้อมให้เข้าถึง",
    },
    {
      id: 3,
      title: "แบบฟอร์มขอลา",
      category: "แบบฟอร์มทั่วไป",
      fileType: "DOCX",
      uploadDate: "2025-03-15",
      fileUrl: "#",
      status: "พร้อมให้เข้าถึง",
    },
  ]);

  const [newDoc, setNewDoc] = useState({
    title: "",
    category: "",
    fileType: "PDF",
    uploadDate: "",
    fileUrl: "",
  });

  // ✅ เพิ่มเอกสารใหม่
  const handleAdd = () => {
    if (!newDoc.title || !newDoc.category) {
      alert("กรุณากรอกชื่อเอกสารและหมวดหมู่");
      return;
    }

    setDocuments([
      ...documents,
      { ...newDoc, id: documents.length + 1, status: "พร้อมให้เข้าถึง" },
    ]);
    setNewDoc({
      title: "",
      category: "",
      fileType: "PDF",
      uploadDate: "",
      fileUrl: "",
    });
  };

  // ✅ ขอสิทธิ์เข้าถึงเอกสาร
  const handleRequestAccess = (id) => {
    if (window.confirm("คุณต้องการขอสิทธิ์เข้าถึงเอกสารนี้หรือไม่?")) {
      setDocuments(
        documents.map((doc) =>
          doc.id === id ? { ...doc, status: "รอการอนุมัติสิทธิ์" } : doc
        )
      );
      alert("ส่งคำขอเข้าถึงเอกสารเรียบร้อยแล้ว ✅");
    }
  };

  return (
    <div
      className="container mt-4"
      style={{ fontFamily: "'Kanit', sans-serif" }}
    >
      {/* 🔹 หัวข้อหน้า */}
      <div className="d-flex align-items-center mb-4">
        <FaFileAlt className="text-primary me-2" size={20} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          ขอสิทธิ์เข้าถึงเอกสารของบริษัท
        </h4>
      </div>

      {/* 🔹 ฟอร์มเพิ่มเอกสาร (เฉพาะ HR) */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          เพิ่มเอกสารใหม่ (เฉพาะ HR)
        </div>
        <div className="p-4 row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">ชื่อเอกสาร</label>
            <input
              type="text"
              className="form-control"
              value={newDoc.title}
              onChange={(e) =>
                setNewDoc({ ...newDoc, title: e.target.value })
              }
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">หมวดหมู่</label>
            <select
              className="form-select"
              value={newDoc.category}
              onChange={(e) =>
                setNewDoc({ ...newDoc, category: e.target.value })
              }
            >
              <option value="">-- เลือกหมวดหมู่ --</option>
              <option>สัญญาจ้างและข้อตกลง</option>
              <option>นโยบายบริษัทและคู่มือพนักงาน</option>
              <option>แบบฟอร์มทั่วไป</option>
              <option>เอกสารสวัสดิการและภาษี</option>
              <option>เอกสารฝึกอบรมและพัฒนา</option>
              <option>ข้อมูลการติดต่อภายในองค์กร</option>
              <option>เอกสารภายในฝ่าย HR</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">วันที่อัปโหลด</label>
            <input
              type="date"
              className="form-control"
              value={newDoc.uploadDate}
              onChange={(e) =>
                setNewDoc({ ...newDoc, uploadDate: e.target.value })
              }
            />
          </div>

          <div className="text-end">
            <button
              className="btn btn-success px-4 rounded-pill"
              onClick={handleAdd}
            >
              <FaPlus className="me-1" /> เพิ่มเอกสาร
            </button>
          </div>
        </div>
      </div>

      {/* 🔹 ตารางรายการเอกสาร */}
      <div className="card shadow-sm border-0 rounded-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายการเอกสารทั้งหมด
        </div>
        <div className="p-4 table-responsive">
          <table className="table table-hover align-middle text-center">
            <thead style={{ backgroundColor: "#f1f5f9", color: "#0b1e39" }}>
              <tr>
                <th>ชื่อเอกสาร</th>
                <th>หมวดหมู่</th>
                <th>ประเภทไฟล์</th>
                <th>วันที่อัปโหลด</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.title}</td>
                    <td>{doc.category}</td>
                    <td>{doc.fileType}</td>
                    <td>{doc.uploadDate}</td>
                    <td>
                      <span
                        className={`badge ${
                          doc.status === "รอการอนุมัติสิทธิ์"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td>
                      {doc.status === "รอการอนุมัติสิทธิ์" ? (
                        <button
                          className="btn btn-secondary btn-sm rounded-pill"
                          disabled
                        >
                          รอดำเนินการ
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm rounded-pill"
                          onClick={() => handleRequestAccess(doc.id)}
                        >
                          <FaLockOpen className="me-1" /> ขอสิทธิ์เข้าถึง
                        </button>
                      )}
                      <a
                        href={doc.fileUrl}
                        className="btn btn-outline-secondary btn-sm ms-2 rounded-pill"
                      >
                        <FaDownload /> ดาวน์โหลด
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-secondary py-4">
                    ไม่มีเอกสารในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSS */}
      <style>
        {`
          .card {
            border-radius: 18px;
            background-color: #fff;
          }
          th {
            font-weight: 600;
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

export default DocumentHR;