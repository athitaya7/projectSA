import { useState, useEffect } from 'react';
import PageHeader from '../../../../emp_bykim-main/my-app/src/components/PageHeader';
import { FileText, Eye, FileDown, User } from 'lucide-react';
import './Documents.css';

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [contacts, setContacts] = useState([]);

  const handleViewDocument = (docId) => console.log('View document:', docId);
  const handleDownloadDocument = (docId) => console.log('Download document:', docId);

  return (
    <div className="documents-page">
      <PageHeader title="เอกสาร" icon={<FileText />} />

      <section className="documents-section">
        <h2 className="section-title">สัญญาการจ้างงานและข้อตกลง</h2>
        <div className="documents-grid">
          {documents.length > 0 ? (
            documents.map((doc, index) => (
              <div key={index} className="document-card">
                <div className="document-icon">
                  <FileText size={40} />
                </div>
                <div className="document-info">
                  <h3>{doc.title}</h3>
                  <p className="document-date">{doc.date}</p>
                </div>
                <div className="document-actions">
                  <button className="action-btn view-btn" onClick={() => handleViewDocument(doc.id)}>
                    <Eye size={16} /> เปิดอ่าน
                  </button>
                  <button className="action-btn download-btn" onClick={() => handleDownloadDocument(doc.id)}>
                    <FileDown size={16} /> ดาวน์โหลด
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">ไม่มีข้อมูล</p>
          )}
        </div>
      </section>

      <section className="contacts-section">
        <h2 className="section-title">ข้อมูลการติดต่อแผนกต่างๆ และหัวหน้างาน</h2>
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
                    <span className="contact-label">อีเมลล์:</span>
                    <span className="contact-value">{contact.email}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-data">ไม่มีข้อมูล</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Documents;
