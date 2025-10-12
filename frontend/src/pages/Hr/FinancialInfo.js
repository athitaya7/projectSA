import React, { useState, useEffect, useMemo } from "react";
import {
  FaUniversity,
  FaPiggyBank,
  FaBuilding,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

function FinanceInfoHR() {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ สำหรับค้นหาและเลือกพนักงาน
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 โหลดรายชื่อพนักงานทั้งหมด
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/employees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        console.error("❌ Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, []);

  // 🔹 โหลดข้อมูลการเงินของพนักงานที่เลือก
  useEffect(() => {
    if (!selectedEmp) {
      setFinanceData(null);
      return;
    }

    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/finance/${selectedEmp}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const data = await res.json();

        // ✅ คำนวณ netIncome ทันทีหลังโหลด
        const netIncome =
          Number(data.baseSalary || 0) +
          Number(data.positionAllowance || 0) +
          Number(data.bonus || 0) -
          (Number(data.tax || 0) +
            Number(data.socialSecurity || 0) +
            Number(data.providentFund || 0));

        setFinanceData({ ...data, netIncome });
        console.log("✅ Finance Data:", data);
      } catch (err) {
        console.error("❌ Fetch Finance Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [selectedEmp]);

  // ✅ ฟิลเตอร์รายชื่อพนักงาน
  const filteredEmployees = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.employee_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          `${e.first_name} ${e.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      ),
    [employees, searchTerm]
  );

  // ✅ อัปเดตข้อมูลใน state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFinanceData((prev) => {
      const updated = { ...prev, [name]: value };
      // ✅ คำนวณ netIncome ใหม่แบบ onChange
      updated.netIncome =
        Number(updated.baseSalary || 0) +
        Number(updated.positionAllowance || 0) +
        Number(updated.bonus || 0) -
        (Number(updated.tax || 0) +
          Number(updated.socialSecurity || 0) +
          Number(updated.providentFund || 0));
      return updated;
    });
  };

  // ✅ ฟังก์ชันบันทึก
  const handleSave = async () => {
    if (!financeData) return;
    if (window.confirm("คุณต้องการบันทึกข้อมูลหรือไม่?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:3000/api/finance/${selectedEmp}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(financeData),
          }
        );
        const data = await res.json();
        if (res.ok) {
          alert("✅ บันทึกข้อมูลทางการเงินเรียบร้อยแล้ว!");
        } else {
          alert("❌ ไม่สามารถบันทึกข้อมูลได้: " + data.message);
        }
      } catch (err) {
        console.error("❌ Save Error:", err);
      }
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: "'Kanit', sans-serif" }}>
      <div className="d-flex align-items-center mb-4">
        <h4 className="fw-bold mb-0" style={{ color: "#0b1e39" }}>
          ข้อมูลทางการเงินของพนักงาน
        </h4>
      </div>

      {/* 🔍 ช่องค้นหาและเลือกพนักงาน */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 p-3">
        <div className="row align-items-center">
          <div className="col-md-6 mb-2">
            <label className="fw-semibold">🔍 ค้นหาพนักงาน</label>
            <div className="input-group">
              <span className="input-group-text bg-light">
                <FaSearch className="text-secondary" />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="พิมพ์ชื่อหรือรหัสพนักงาน..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-6 mb-2">
            <label className="fw-semibold">เลือกพนักงาน</label>
            <select
              className="form-select"
              value={selectedEmp}
              onChange={(e) => setSelectedEmp(e.target.value)}
            >
              <option value="">-- เลือกพนักงาน --</option>
              {filteredEmployees.map((emp) => (
                <option key={emp.employee_code} value={emp.employee_code}>
                  {emp.employee_code} - {emp.first_name} {emp.last_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 🔹 แสดงข้อมูล */}
      {loading ? (
        <div className="text-center text-secondary mt-5">
          กำลังโหลดข้อมูลทางการเงิน...
        </div>
      ) : !financeData ? (
        <div className="alert alert-warning mt-4 mx-4">
          ❗ กรุณาเลือกพนักงานเพื่อดูข้อมูลทางการเงิน
        </div>
      ) : (
        <>
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
                    value={financeData.bankName || ""}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-semibold">สาขาธนาคาร</label>
                <input
                  type="text"
                  name="bankBranch"
                  value={financeData.bankBranch || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="fw-semibold">หมายเลขบัญชีธนาคาร</label>
                <input
                  type="text"
                  name="accountNo"
                  value={financeData.accountNo || ""}
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
              {[
                { label: "เงินเดือนพื้นฐาน", name: "baseSalary" },
                { label: "ค่าตำแหน่ง / เบี้ยเลี้ยง", name: "positionAllowance" },
                { label: "โบนัส", name: "bonus" },
                { label: "ภาษีเงินได้", name: "tax" },
                { label: "ประกันสังคม", name: "socialSecurity" },
                { label: "กองทุนสำรองเลี้ยงชีพ", name: "providentFund" },
              ].map((item, idx) => (
                <div className="col-md-4 mb-3" key={idx}>
                  <label className="fw-semibold">{item.label}</label>
                  <input
                    type="number"
                    name={item.name}
                    value={financeData[item.name] || 0}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
              ))}
              <div className="col-md-12 mt-3 text-center">
                <div
                  className="p-3 fw-bold text-white rounded-4 mx-auto"
                  style={{
                    width: "260px",
                    background: "linear-gradient(135deg, #1f3a64, #0b1e39)",
                  }}
                >
                  รายได้สุทธิ: {financeData.netIncome?.toLocaleString() || 0} บาท
                </div>
              </div>
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
        </>
      )}
    </div>
  );
}

export default FinanceInfoHR;
