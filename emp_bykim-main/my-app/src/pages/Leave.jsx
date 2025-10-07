import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { Umbrella, Thermometer, ClipboardList } from 'lucide-react';
import './Leave.css';

function Leave() {
  const [leaveData, setLeaveData] = useState({
    vacation: 0,
    sick: 0,
    personal: 0
  });
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    // TODO: Fetch data
  }, []);

  return (
    <div className="leave-page">
      <PageHeader title="สิทธิการลา" icon={<Umbrella />} />

      <div className="leave-balance">
        <div className="leave-card">
          <div className="leave-icon vacation">
            <Umbrella color="white" size={28} />
          </div>
          <div className="leave-info">
            <h3>วันลาพักร้อน</h3>
            <p className="leave-days">{leaveData.vacation} วัน</p>
          </div>
        </div>

        <div className="leave-card">
          <div className="leave-icon sick">
            <Thermometer color="white" size={28} />
          </div>
          <div className="leave-info">
            <h3>ลาป่วย</h3>
            <p className="leave-days">{leaveData.sick} วัน</p>
          </div>
        </div>

        <div className="leave-card">
          <div className="leave-icon personal">
            <ClipboardList color="white" size={28} />
          </div>
          <div className="leave-info">
            <h3>ลากิจ</h3>
            <p className="leave-days">{leaveData.personal} วัน</p>
          </div>
        </div>
      </div>

      <section className="leave-history-section">
        <h2 className="section-title">ประวัติการลา</h2>
        <div className="table-container">
          <table className="leave-table">
            <thead>
              <tr>
                <th>ประเภทวันลา</th>
                <th>วันที่เริ่มต้น</th>
                <th>วันที่สิ้นสุด</th>
                <th>จำนวนวัน</th>
                <th>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {leaveHistory.length > 0 ? (
                leaveHistory.map((leave, index) => (
                  <tr key={index}>
                    <td>{leave.type}</td>
                    <td>{leave.startDate}</td>
                    <td>{leave.endDate}</td>
                    <td>{leave.days}</td>
                    <td>
                      <span className={`status-badge status-${leave.status}`}>
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">ไม่มีข้อมูล</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default Leave;
