import React, { useState, useEffect, useCallback } from "react";
import {
  FaUniversity,
  FaPiggyBank,
  FaBuilding,
  FaCalendarAlt,
} from "react-icons/fa";

function FinanceInfoHR() {
  const [financeData, setFinanceData] = useState({
    bankName: "ธนาคารไทยพาณิชย์ (SCB)",
    bankBranch: "สาขานครปฐม",
    accountNo: "123-456789-0",
    providentFundNo: "PF-9988",
    deptNo: "DPT-105",
    revenueDeptNo: "TX-3011",
    baseSalary: 30000,
    positionAllowance: 5000,
    bonus: 10000,
    tax: 1500,
    socialSecurity: 750,
    providentFund: 900,
    netIncome: 0,
    lastUpdated: "2025-10-01",
  });

  const {
    baseSalary,
    positionAllowance,
    bonus,
    tax,
    socialSecurity,
    providentFund,
  } = financeData;

  // ✅ ใช้ useCallback เพื่อให้คำนวณรายได้สุทธิใหม่ทุกครั้งที่ข้อมูลเปลี่ยน
  const calculateNetIncome = useCallback(() => {
    return (
      Number(baseSalary) +
      Number(positionAllowance) +
      Number(bonus) -
      (Number(tax) + Number(socialSecurity) + Number(providentFund))
    );
  }, [baseSalary, positionAllowance, bonus, tax, socialSecurity, providentFund]);

  // ✅ อัปเดตค่า netIncome อัตโนมัติเมื่อข้อมูลเปลี่ยน
  useEffect(() => {
    setFinanceData((prev) => ({
      ...prev,
      netIncome: calculateNetIncome(),
    }));
  }, [calculateNetIncome]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData({ ...financeData, [name]: value });
  };

  const handleSave = () => {
    if (window.confirm("คุณต้องการบันทึกข้อมูลหรือไม่?")) {
      alert("✅ บันทึกข้อมูลทางการเงินเรียบร้อยแล้ว!");
      console.log(financeData);
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      {/* 🔹 หัวข้อ */}
      <div className="d-flex align-items-center mb-4">
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          ข้อมูลทางการเงินของพนักงาน
        </h4>
      </div>

      {/* 🔹 ข้อมูลบัญชีธนาคาร */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          ข้อมูลบัญชีธนาคาร
        </div>
        <div className="p-4 row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">ชื่อธนาคาร</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaUniversity />
              </span>
              <input
                type="text"
                name="bankName"
                value={financeData.bankName}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">สาขาธนาคาร</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaBuilding />
              </span>
              <input
                type="text"
                name="bankBranch"
                value={financeData.bankBranch}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">หมายเลขบัญชีธนาคาร</label>
            <input
              type="text"
              name="accountNo"
              value={financeData.accountNo}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* 🔹 หมายเลขอ้างอิง */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          หมายเลขอ้างอิงภายในองค์กร
        </div>
        <div className="p-4 row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">หมายเลขกองทุนสำรองเลี้ยงชีพ</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaPiggyBank />
              </span>
              <input
                type="text"
                name="providentFundNo"
                value={financeData.providentFundNo}
                onChange={handleChange}
                className="form-control"
              />
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">หมายเลขแผนกต้นสังกัด</label>
            <input
              type="text"
              name="deptNo"
              value={financeData.deptNo}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">หมายเลขกรมสรรพากร</label>
            <input
              type="text"
              name="revenueDeptNo"
              value={financeData.revenueDeptNo}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>
      </div>

      {/* 🔹 รายได้และรายการหัก */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          รายได้และรายการหัก
        </div>
        <div className="p-4 row">
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">เงินเดือนพื้นฐาน</label>
            <input
              type="number"
              name="baseSalary"
              value={financeData.baseSalary}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">ค่าตำแหน่ง / เบี้ยเลี้ยง</label>
            <input
              type="number"
              name="positionAllowance"
              value={financeData.positionAllowance}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">โบนัส</label>
            <input
              type="number"
              name="bonus"
              value={financeData.bonus}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-semibold">ภาษีเงินได้</label>
            <input
              type="number"
              name="tax"
              value={financeData.tax}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">ประกันสังคม</label>
            <input
              type="number"
              name="socialSecurity"
              value={financeData.socialSecurity}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="fw-semibold">กองทุนสำรองเลี้ยงชีพ</label>
            <input
              type="number"
              name="providentFund"
              value={financeData.providentFund}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-12 mt-3 text-center">
            <div
              className="p-3 fw-bold text-white rounded-4 mx-auto"
              style={{
                width: "260px",
                background: "linear-gradient(135deg, #1f3a64, #0b1e39)",
              }}
            >
              รายได้สุทธิ: {financeData.netIncome.toLocaleString()} บาท
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 วันที่ปรับปรุง */}
      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="p-3 fw-bold text-dark border-bottom bg-light">
          📅 วันที่ปรับปรุงข้อมูลล่าสุด
        </div>
        <div className="p-4 d-flex align-items-center">
          <FaCalendarAlt className="me-2 text-secondary" />
          <input
            type="date"
            name="lastUpdated"
            value={financeData.lastUpdated}
            onChange={handleChange}
            className="form-control"
            style={{ maxWidth: "250px" }}
          />
        </div>
      </div>

      {/* 🔹 ปุ่มบันทึก */}
      <div className="text-end mb-5">
        <button className="btn btn-success px-4 me-2" onClick={handleSave}>
          บันทึกข้อมูล
        </button>
        <button
          className="btn btn-outline-secondary px-4"
          onClick={() => window.location.reload()}
        >
          ยกเลิก
        </button>
      </div>
    </div>
  );
}

export default FinanceInfoHR;
