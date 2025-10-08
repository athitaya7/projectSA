import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaUser,
    FaChevronDown,
    FaChevronRight,
    FaFileAlt,
    FaCalendarAlt,
    FaChartLine,
    FaGraduationCap,
    FaFolder,
    FaUsers,
} from "react-icons/fa";

const Sidebar = () => {
    const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();

    // ✅ ฟังก์ชันขยาย/ย่อเมนู
    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    // ✅ ฟังก์ชันออกจากระบบ
    const handleLogout = () => {
        // ลบ token ทั้งหมด (HR และ Employee)
        localStorage.removeItem("adminToken");
        localStorage.removeItem("empToken");

        // ไปหน้า Logout ก่อน แล้วค่อย Redirect ไปหน้า Login ภายใน Logout.js
        navigate("/dashboard/logout");
    };

    return (
        <div
            style={{
                width: "260px",
                backgroundColor: "#0b1e39",
                color: "white",
                minHeight: "100vh",
                padding: "20px",
                position: "relative",
            }}
        >
            <h5 className="fw-bold mb-4 text-center">HR Portal</h5>

            {/* 🔹 หน้าแรก */}
            <div className="mb-3">
                <Link
                    to="/dashboard"
                    className="d-flex align-items-center text-white text-decoration-none"
                >
                    <FaHome className="me-2" /> Dashboard
                </Link>
            </div>

            {/* 🔹 ข้อมูลประจำตัว */}
            <div className="mb-2">
                <div
                    className="d-flex align-items-center justify-content-between text-white text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleMenu("personal")}
                >
                    <div>
                        <FaUser className="me-2" /> ข้อมูลประจำตัว
                    </div>
                    {openMenu === "personal" ? <FaChevronDown /> : <FaChevronRight />}
                </div>

                {openMenu === "personal" && (
                    <div className="ms-4 mt-2">
                        <Link
                            to="/dashboard/history"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            <FaFileAlt className="me-2" /> ประวัติ
                        </Link>
                        <Link
                            to="/dashboard/leave"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            <FaCalendarAlt className="me-2" /> สิทธิการลา
                        </Link>
                        <Link
                            to="/dashboard/evaluation"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            <FaChartLine className="me-2" /> การประเมินผล
                        </Link>
                        <Link
                            to="/dashboard/training"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            <FaGraduationCap className="me-2" /> การฝึกอบรม
                        </Link>
                        <Link
                            to="/dashboard/documenthr"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            <FaFolder className="me-2" /> เอกสาร
                        </Link>

                    </div>
                )}
            </div>

            {/* 🔹 ข้อมูลพนักงาน */}
            <div className="mb-2">
                <div
                    className="d-flex align-items-center justify-content-between text-white text-decoration-none"
                    style={{ cursor: "pointer" }}
                    onClick={() => toggleMenu("employee")}
                >
                    <div>
                        <FaUsers className="me-2" /> ข้อมูลพนักงาน
                    </div>
                    {openMenu === "employee" ? <FaChevronDown /> : <FaChevronRight />}
                </div>

                {openMenu === "employee" && (
                    <div className="ms-4 mt-2">
                        <Link
                            to="/dashboard/personal"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            ข้อมูลประจำตัว
                        </Link>
                        <Link
                            to="/dashboard/employee"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            ข้อมูลการทำงาน
                        </Link>
                        <Link
                            to="/dashboard/financialinfo"
                            className="d-block text-white text-decoration-none mb-2"
                        >
                            ข้อมูลทางการเงิน
                        </Link>


                    </div>
                )}
            </div>

            {/* 🔹 ปุ่ม Log Out */}
            <div
                style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "20px",
                    right: "20px",
                }}
            >
                <button
                    className="btn btn-danger w-100 d-flex align-items-center justify-content-center fw-bold"
                    style={{ borderRadius: "10px" }}
                    onClick={handleLogout}
                >
                    <i className="me-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="currentColor"
                            className="bi bi-box-arrow-right"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 15a1 1 0 0 0 1-1v-2h-1v2H2V2h8v2h1V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3-.708.708L14.293 8l-2.147 2.146.708.708 3-3z"
                            />
                            <path
                                fillRule="evenodd"
                                d="M5 8a.5.5 0 0 1 .5-.5h8v1h-8A.5.5 0 0 1 5 8z"
                            />
                        </svg>
                    </i>
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
