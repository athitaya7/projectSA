import './Sidebar.css';
import {
  BarChart2,
  User,
  Umbrella,
  Star,
  BookOpen,
  FileText,
  LogOut
} from 'lucide-react';

function Sidebar({ currentPage, setCurrentPage }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart2 size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
    { id: 'leave', label: 'สิทธิการลา', icon: <Umbrella size={20} /> },
    { id: 'evaluation', label: 'ประเมินผล', icon: <Star size={20} /> },
    { id: 'training', label: 'การฝึกอบรม', icon: <BookOpen size={20} /> },
    { id: 'documents', label: 'เอกสาร', icon: <FileText size={20} /> }
  ];

  const handleLogout = () => {
    // TODO: เชื่อมต่อกับ backend logout API
    console.log('Logout clicked');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Employee Portal</h2>
      </div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`menu-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <span className="menu-icon">
          <LogOut size={20} />
        </span>
        <span className="menu-label">Logout</span>
      </button>
    </div>
  );
}

export default Sidebar;