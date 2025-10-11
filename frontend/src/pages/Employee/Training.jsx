import { useState, useEffect } from 'react';
import PageHeader from "../../../src/components/PageHeader";
import { BookOpen, FileDown } from 'lucide-react';
import './Training.css';

function Training() {
  const [trainingHistory, setTrainingHistory] = useState([]);

  const handleDownload = (certId) => {
    console.log('Download certificate:', certId);
  };

  return (
    <div className="training-page">
      <PageHeader title="การฝึกอบรม" icon={<BookOpen />} />

      <section className="training-section">
        <h2 className="section-title">ประวัติการฝึกอบรม</h2>
        <div className="table-container">
          <table className="training-table">
            <thead>
              <tr>
                <th>ชื่อหลักสูตร</th>
                <th>วันเริ่มอบรม</th>
                <th>วันสิ้นสุดการอบรม</th>
                <th>คะแนน</th>
                <th>สถานะ</th>
                <th>ใบอนุมัติ</th>
              </tr>
            </thead>
            <tbody>
              {trainingHistory.length > 0 ? (
                trainingHistory.map((training, index) => (
                  <tr key={index}>
                    <td>{training.courseName}</td>
                    <td>{training.startDate}</td>
                    <td>{training.endDate}</td>
                    <td>
                      <span className="score-badge">{training.score}</span>
                    </td>
                    <td>
                      <span className={`status-badge status-${training.status}`}>
                        {training.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="download-btn"
                        onClick={() => handleDownload(training.certId)}
                      >
                        <FileDown size={16} /> ดาวน์โหลด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Training;
