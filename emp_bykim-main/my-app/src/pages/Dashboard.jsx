import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { BarChart2, Umbrella, CalendarDays, Star } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    remainingLeave: 0,
    absences: 0,
    yearlyScore: 0
  });

  useEffect(() => {
    // TODO: Fetch data from backend
  }, []);

  return (
    <div className="dashboard-page">
      <PageHeader title="Dashboard" icon={<BarChart2 />} />

      <div className="dashboard-cards">
        <div className="dashboard-card card-blue">
          <div className="card-icon">
            <Umbrella color="white" size={32} />
          </div>
          <div className="card-content">
            <h3>วันลาคงเหลือ</h3>
            <p className="card-value">{dashboardData.remainingLeave} วัน</p>
          </div>
        </div>

        <div className="dashboard-card card-red">
          <div className="card-icon">
            <CalendarDays color="white" size={32} />
          </div>
          <div className="card-content">
            <h3>จำนวนการขาดงาน</h3>
            <p className="card-value">{dashboardData.absences} วัน</p>
          </div>
        </div>

        <div className="dashboard-card card-green">
          <div className="card-icon">
            <Star color="white" size={32} />
          </div>
          <div className="card-content">
            <h3>คะแนนประเมินประจำปี</h3>
            <p className="card-value">{dashboardData.yearlyScore} คะแนน</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
