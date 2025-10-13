import "./Evaluation.css";
import { useEffect, useState } from "react";

function Evaluation() {
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [evaluationDetails, setEvaluationDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token"); // เอา JWT ที่ได้ตอน login มาใช้

    if (!token) {
      alert("กรุณาเข้าสู่ระบบก่อนเข้าหน้านี้");
      return;
    }

    const fetchData = async () => {
      try {
        // ✅ ดึงข้อมูลรวมจาก /api/evaluation
        const evalRes = await fetch("http://localhost:3000/api/evaluation", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const evalData = await evalRes.json();

        // ✅ รวมข้อมูลเข้า state
        setEmployeeInfo({
          name: `${evalData.employee.first_name} ${evalData.employee.last_name}`,
          employeeId: evalData.employee.employee_code,
          position: evalData.employee.position,
          department: evalData.employee.department,
          overallScore: evalData.evaluation.total_score,
          feedback: "ยังไม่มีข้อเสนอแนะจากหัวหน้างาน", // ถ้ามีใน DB ค่อยเพิ่ม
        });

        setEvaluationDetails([
        { title: "คุณภาพงาน", desc: "วัดคุณภาพของผลงานและความละเอียดรอบคอบ", score: evalData.evaluation.quality_score },
        { title: "ความรับผิดชอบ", desc: "ความรับผิดชอบต่อหน้าที่และความตรงต่อเวลา", score: evalData.evaluation.responsibility_score },
        { title: "การทำงานเป็นทีม", desc: "ความร่วมมือและการสื่อสารกับเพื่อนร่วมงาน", score: evalData.evaluation.teamwork_score },
        { title: "ความคิดสร้างสรรค์", desc: "การเสนอแนวคิดใหม่ๆ ในการทำงาน", score: evalData.evaluation.creativity_score },
        { title: "ความตรงต่อเวลา", desc: "การมาทำงานและส่งงานตรงตามเวลา", score: evalData.evaluation.punctuality_score },
        { title: "การสื่อสาร", desc: "การสื่อสารอย่างมีประสิทธิภาพกับทีมและลูกค้า", score: evalData.evaluation.communication_score },
      ]);
      
      } catch (error) {
        console.error("Error fetching evaluation data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;
  if (!employeeInfo) return <p>ไม่พบข้อมูลการประเมิน</p>;

  return (
    <div className="evaluation-page">
      {/* ส่วนหัวพื้นน้ำเงิน */}
      <div className="evaluation-header">
        <div className="header-left">
          <h1>ผลการประเมินประจำปี 2024</h1>
          <div className="employee-info">
            <p><strong>ชื่อ:</strong> {employeeInfo.name}</p>
            <p><strong>รหัสพนักงาน:</strong> {employeeInfo.employeeId}</p>
            <p><strong>ตำแหน่ง:</strong> {employeeInfo.position}</p>
            <p><strong>แผนก:</strong> {employeeInfo.department}</p>
          </div>
        </div>
        <div className="header-right">
          <div className="score-box">
            <p className="score-title">คะแนนรวม</p>
            <p className="score-value">{employeeInfo.overallScore}/100</p>
            <p className="score-label">ผลงานเยี่ยม</p>
            {employeeInfo.overallScore >= 90
                ? "ผลงานเยี่ยม"
                : employeeInfo.overallScore >= 75
                ? "ดีมาก"
                : "ควรปรับปรุง"}
          </div>
        </div>
      </div>

      {/* รายละเอียดแต่ละด้าน */}
      <div className="evaluation-section">
        <h2>รายละเอียดการประเมินแต่ละด้าน</h2>
        <div className="evaluation-grid">
          {evaluationDetails.map((item, idx) => (
            <div key={idx} className="evaluation-card">
              <h3>{item.title}</h3>
              <p className="desc">{item.desc}</p>
              <div className="score">{item.score}/100</div>
                <div className="progress-bar" style={{ "--progress": `${Math.min(item.score ?? 0, 100)}%` }}>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ข้อเสนอแนะ */}
      <div className="feedback-section">
        <h2>ข้อเสนอแนะจากหัวหน้างาน</h2>
        <p>{employeeInfo.feedback}</p>
      </div>
    </div>
  );
}

export default Evaluation;