// ============================================
// ไฟล์: src/pages/Evaluation.jsx
// ============================================
import { useState, useEffect } from 'react';
import PageHeader from "../../../src/components/PageHeader";
import { Star } from 'lucide-react';
import './Evaluation.css';

function Evaluation() {
  const [evaluationData, setEvaluationData] = useState({
    employeeInfo: {},
    scores: []
  });

  useEffect(() => {
    // TODO: Fetch data from backend
    // fetch('/api/evaluation')
    //   .then(res => res.json())
    //   .then(data => setEvaluationData(data));
  }, []);

  return (
    <div className="evaluation-page">
      <PageHeader title="ผลการประเมิน" icon={<Star />} />

      <section className="employee-info-section">
        <div className="info-row">
          <div className="info-field">
            <label>ชื่อ-สกุล</label>
            <p>{evaluationData.employeeInfo.fullName || '-'}</p>
          </div>
          <div className="info-field">
            <label>รหัสพนักงาน</label>
            <p>{evaluationData.employeeInfo.employeeId || '-'}</p>
          </div>
          <div className="info-field">
            <label>ตำแหน่ง</label>
            <p>{evaluationData.employeeInfo.position || '-'}</p>
          </div>
          <div className="info-field">
            <label>แผนก</label>
            <p>{evaluationData.employeeInfo.department || '-'}</p>
          </div>
        </div>
      </section>

      <section className="evaluation-details-section">
        <h2 className="section-title">รายละเอียดการประเมินแต่ละด้าน</h2>
        <div className="evaluation-grid">
          {evaluationData.scores.length > 0 ? (
            evaluationData.scores.map((item, index) => (
              <div key={index} className="evaluation-item">
                <div className="evaluation-header">
                  <h3>{item.criteria}</h3>
                  <span className="score">{item.score}/5</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(item.score / 5) * 100}%` }}
                  ></div>
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

export default Evaluation;
