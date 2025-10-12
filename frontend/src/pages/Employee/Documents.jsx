import { useState, useEffect } from "react";
import PageHeader from "../../../src/components/PageHeader";
import { FileText, Eye, FileDown, User } from "lucide-react";
import "./Documents.css";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ ดึงข้อมูลเอกสาร
    fetch("http://localhost:3000/api/documents", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setDocuments(data))
      .catch((err) => console.error("Documents fetch error:", err));

    // ✅ ดึงข้อมูลติดต่อ
    fetch("http://localhost:3000/api/contacts", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setContacts(data))
      .catch((err) => console.error("Contacts fetch error:", err));
  }, []);

  const handleViewDocument = (url) => {
    window.open(url, "_blank"); // ✅ เปิดเอกสารในแท็บใหม่
  };

  const handleDownloadDocument = (url) => {
    window.open(url, "_blank"); // ✅ โหลดไฟล์ (หรือจะใช้ a.download ก็ได้)
  };

  return (
    <div className="documents-page">
      <PageHeader title="เอกสาร" icon={<FileText />} />

      {/* ---------- ส่วนแสดงเอกสาร ---------- */}
      <section className="documents-section">
        <h2 className="section-title">📄 สัญญาการจ้างงานและข้อตกลง</h2>
        <div className="documents-grid">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <div key={index} className="document-card">
                <div className="document-icon">
                  <FileText size={40} color="#6366f1" />
                </div>
                <div className="document-info">
                  <h3>{doc.title}</h3>
                  <p className="document-date">
                    วันที่อัปโหลด: {new Date(doc.upload_date).toLocaleDateString("th-TH")}
                  </p>
                </div>
                <div className="document-actions">
                  <button
                    className="action-btn view-btn"
                    onClick={() => handleViewDocument(doc.file_url)}
                  >
                    <Eye size={16} /> เปิดอ่าน
                  </button>
                  <button
                    className="action-btn download-btn"
                    onClick={() => handleDownloadDocument(doc.file_url)}
                  >
                    <FileDown size={16} /> ดาวน์โหลด
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">ไม่มีเอกสารในระบบ</p>
          )}
        </div>
      </section>

      {/* ---------- ส่วนแสดงข้อมูลติดต่อ ---------- */}
      <section className="contacts-section">
        <h2 className="section-title">👥 ข้อมูลการติดต่อแผนกต่าง ๆ และหัวหน้างาน</h2>
        <div className="contacts-grid">
          {contacts.length > 0 ? (
            contacts.map((contact, index) => (
              <div key={index} className="contact-card">
                <div className="contact-header">
                  <span className="contact-icon">
                    <User color="white" size={20} />
                  </span>
                  <h3>{contact.position}</h3>
                </div>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">ชื่อหัวหน้า:</span>
                    <span className="contact-value">{contact.name}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">โทรศัพท์:</span>
                    <span className="contact-value">{contact.phone}</span>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">อีเมล:</span>
                    <span className="contact-value">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">ไม่มีข้อมูลการติดต่อ</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Documents;
