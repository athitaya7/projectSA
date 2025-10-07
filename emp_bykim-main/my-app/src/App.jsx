import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Leave from './pages/Leave';
import Evaluation from './pages/Evaluation';
import Training from './pages/Training';
import Documents from './pages/Documents';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'profile': return <Profile />;
      case 'leave': return <Leave />;
      case 'evaluation': return <Evaluation />;
      case 'training': return <Training />;
      case 'documents': return <Documents />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
