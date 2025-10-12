// ============================================
// ไฟล์: src/pages/Profile.jsx
// ============================================
import { useState, useEffect } from 'react';
import PageHeader from "../../../src/components/PageHeader";
import { User, Check } from 'lucide-react';
import './Profile.css';

function Profile() {
  const [profileData, setProfileData] = useState({
    personalInfo: {},
    workInfo: {},
    salaryInfo: {},
    taxInfo: {},
    benefits: [],
  });

  useEffect(() => {
  const fetchProfile = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://127.0.0.1:3000/api/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-store", // 👈 ปิด cache ฝั่ง client ด้วย
      },
    });
    const data = await res.json();
    console.log("Profile Data:", data);
    setProfileData(data);
  };
  fetchProfile();
}, []);

  return (
    <div className="profile-page">
      <PageHeader title="Profile" icon={<User />} />

      <div className="profile-sections">
        {/* ===== ข้อมูลส่วนตัว ===== */}
        <section className="profile-section">
          <h2 className="section-title">ข้อมูลส่วนตัว</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ชื่อ</label>
              <p>{profileData.personalInfo.firstName || '-'}</p>
            </div>
            <div className="info-item">
              <label>นามสกุล</label>
              <p>{profileData.personalInfo.lastName || '-'}</p>
            </div>
            <div className="info-item">
              <label>รหัสพนักงาน</label>
              <p>{profileData.personalInfo.employeeId || '-'}</p>
            </div>
            <div className="info-item">
              <label>วันเกิด</label>
              <p>{profileData.personalInfo.birthDate || '-'}</p>
            </div>
            <div className="info-item">
              <label>เลขบัตรประชาชน</label>
              <p>{profileData.personalInfo.idCard || '-'}</p>
            </div>
            <div className="info-item">
              <label>เบอร์โทรศัพท์</label>
              <p>{profileData.personalInfo.phone || '-'}</p>
            </div>
            <div className="info-item full-width">
              <label>ที่อยู่</label>
              <p>{profileData.personalInfo.address || '-'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{profileData.personalInfo.email || '-'}</p>
            </div>
            <div className="info-item">
              <label>ตำแหน่ง</label>
              <p>{profileData.personalInfo.position || '-'}</p>
            </div>
          </div>
        </section>

        {/* ===== ข้อมูลการทำงาน ===== */}
        <section className="profile-section">
          <h2 className="section-title">ข้อมูลการทำงาน</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ตำแหน่ง</label>
              <p>{profileData.workInfo.position || '-'}</p>
            </div>
            <div className="info-item">
              <label>แผนก</label>
              <p>{profileData.workInfo.department || '-'}</p>
            </div>
            <div className="info-item">
              <label>อายุงาน</label>
              <p>{profileData.workInfo.workAge || '-'}</p>
            </div>
            <div className="info-item">
              <label>วันที่เริ่มงาน</label>
              <p>{profileData.workInfo.startDate || '-'}</p>
            </div>
          </div>
        </section>

        {/* ===== ข้อมูลเงินเดือน ===== */}
        <section className="profile-section">
          <h2 className="section-title">ข้อมูลเงินเดือน</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>เงินเดือนพื้นฐาน</label>
              <p>{profileData.salaryInfo.baseSalary || '-'} บาท</p>
            </div>
            <div className="info-item">
              <label>ค่าตำแหน่ง/เบี้ยเลี้ยง</label>
              <p>{profileData.salaryInfo.allowance || '-'} บาท</p>
            </div>
            <div className="info-item">
              <label>โบนัส</label>
              <p>{profileData.salaryInfo.bonus || '-'} บาท</p>
            </div>
          </div>
        </section>

        {/* ===== ข้อมูลภาษี ===== */}
        <section className="profile-section">
          <h2 className="section-title">ข้อมูลการหักภาษี</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>ประกันสังคม</label>
              <p>{profileData.taxInfo.socialSecurity || '-'} บาท</p>
            </div>
            <div className="info-item">
              <label>กองทุนสำรองเลี้ยงชีพ</label>
              <p>{profileData.taxInfo.providentFund || '-'} บาท</p>
            </div>
            <div className="info-item">
              <label>ภาษีเงินได้</label>
              <p>{profileData.taxInfo.incomeTax || '-'} บาท</p>
            </div>
            <div className="info-item">
              <label>รวมรายการที่หัก</label>
              <p>{profileData.taxInfo.totalDeduction || '-'} บาท</p>
            </div>
            <div className="info-item highlight">
              <label>เงินได้สุทธิ</label>
              <p className="net-income">
                {profileData.taxInfo.netIncome || '-'} บาท
              </p>
            </div>
          </div>
        </section>

        {/* ===== สวัสดิการ ===== */}
        <section className="profile-section">
          <h2 className="section-title">สวัสดิการที่ได้รับ</h2>
          <div className="benefits-list">
            {profileData.benefits.length > 0 ? (
              profileData.benefits.map((benefit, index) => (
                <div key={index} className="benefit-item">
                  <span className="benefit-icon">
                    <Check size={14} color="white" />
                  </span>
                  <span>{benefit}</span>
                </div>
              ))
            ) : (
              <p className="no-data">ไม่มีข้อมูล</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
