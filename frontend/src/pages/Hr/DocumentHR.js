import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaFileAlt, FaPlus, FaDownload, FaLockOpen } from "react-icons/fa";

function DocumentHR() {
  const [documents, setDocuments] = useState([]);
  const [employeeCode, setEmployeeCode] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // ✅ โหลดข้อมูลจาก backend
  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/documents", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDocuments(res.data);
    } catch (err) {
      console.error("❌ Error fetching documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // ✅ อัปโหลดไฟล์ใหม่
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!employeeCode || !selectedFile) {
      alert("กรุณากรอกรหัสพนักงานและเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("employee_code", employeeCode);
    formData.append("file", selectedFile);

    try {
      setUploading(true);
      await axios.post("http://localhost:3000/api/documents/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ อัปโหลดสำเร็จ");
      setEmployeeCode("");
      setSelectedFile(null);
      fetchDocuments();
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setUploading(false);
    }
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
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <FaFileAlt className="text-primary me-2" size={22} />
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          จัดการเอกสารพนักงาน
        </h4>
      </div>

      {/* 🔹 ส่วนอัปโหลด */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          เพิ่มเอกสารใหม่ (เฉพาะ HR)
        </div>
        <form className="p-4 row" onSubmit={handleUpload}>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">รหัสพนักงาน</label>
            <input
              type="text"
              className="form-control"
              placeholder="เช่น EMP001"
              value={employeeCode}
              onChange={(e) => setEmployeeCode(e.target.value)}
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">เลือกไฟล์</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>
          <div className="col-md-4 mb-3 text-end">
            <button
              type="submit"
              className="btn btn-success px-4 rounded-pill"
              disabled={uploading}
            >
              <FaPlus className="me-1" />
              {uploading ? "กำลังอัปโหลด..." : "อัปโหลดเอกสาร"}
            </button>
          </div>
        </form>
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
                <th>รหัสพนักงาน</th>
                <th>ชื่อพนักงาน</th>
                <th>ชื่อเอกสาร</th>
                <th>วันที่อัปโหลด</th>
                <th>สถานะ</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc) => (
                  <tr key={doc.id}>
                    <td>{doc.employee_code}</td>
                    <td>{doc.employee_name}</td>
                    <td>{doc.doc_name}</td>
                    <td>{new Date(doc.upload_date).toLocaleDateString("th-TH")}</td>
                    <td>
                      <span
                        className={`badge ${
                          doc.status === "รอการอนุมัติสิทธิ์"
                            ? "bg-warning text-dark"
                            : "bg-success"
                        }`}
                      >
                        {doc.status || "พร้อมให้เข้าถึง"}
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
                        href={`http://localhost:3000${doc.file_path}`}
                        className="btn btn-outline-secondary btn-sm ms-2 rounded-pill"
                        target="_blank"
                        rel="noopener noreferrer"
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
