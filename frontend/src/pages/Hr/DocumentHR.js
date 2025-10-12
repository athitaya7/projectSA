import React, { useEffect, useState } from "react";
import axios from "axios";

function DocumentHR() {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [employeeCode, setEmployeeCode] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ โหลดเอกสารทั้งหมด
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

  // ✅ ฟังก์ชันอัปโหลดเอกสาร
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
      console.error("❌ Error uploading file:", err);
      alert("เกิดข้อผิดพลาดในการอัปโหลดไฟล์");
    } finally {
      setUploading(false);
    }
  };

  // ✅ กรองข้อมูลตามคำค้นหา
  const filteredDocs = documents.filter(
    (doc) =>
      doc.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.doc_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📁 จัดการเอกสารพนักงาน</h2>

      {/* 🔍 ส่วนค้นหา */}
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="ค้นหาพนักงานหรือชื่อเอกสาร..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button style={styles.refreshBtn} onClick={fetchDocuments}>
          🔄 โหลดใหม่
        </button>
      </div>

      {/* 📤 ส่วนอัปโหลดเอกสาร */}
      <form onSubmit={handleUpload} style={styles.uploadBox}>
        <h4>เพิ่มเอกสารใหม่</h4>
        <input
          type="text"
          placeholder="รหัสพนักงาน (เช่น EMP001)"
          value={employeeCode}
          onChange={(e) => setEmployeeCode(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={styles.fileInput}
        />
        <button type="submit" style={styles.uploadBtn} disabled={uploading}>
          {uploading ? "กำลังอัปโหลด..." : "อัปโหลดเอกสาร"}
        </button>
      </form>

      {/* 📋 ตารางแสดงเอกสาร */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>รหัสพนักงาน</th>
            <th>ชื่อพนักงาน</th>
            <th>ชื่อเอกสาร</th>
            <th>วันที่อัปโหลด</th>
            <th>ไฟล์</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.employee_code}</td>
                <td>{doc.employee_name}</td>
                <td>{doc.doc_name}</td>
                <td>{new Date(doc.upload_date).toLocaleDateString()}</td>
                <td>
                  <a
                    href={`http://localhost:3000${doc.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    เปิดดู
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#888" }}>
                ไม่พบข้อมูลเอกสาร
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "sans-serif",
    backgroundColor: "#f9f9f9",
    minHeight: "100vh",
  },
  title: {
    marginBottom: "15px",
    color: "#333",
  },
  searchContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  refreshBtn: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  uploadBox: {
    backgroundColor: "white",
    padding: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "25px",
  },
  input: {
    display: "block",
    marginBottom: "10px",
    padding: "8px",
    width: "100%",
    border: "1px solid #ccc",
    borderRadius: "5px",
  },
  fileInput: {
    marginBottom: "10px",
  },
  uploadBtn: {
    padding: "8px 14px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  },
  th: {
    backgroundColor: "#eee",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

export default DocumentHR;
