import { useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Navbar from './components/navbar/navbar';
import { WalletProvider } from './context/WalletState';
import Dashboard from './components/dashboard/dashboard';
import Stake from './components/stake'; 
import Global from './components/global'; 
import Reward from './components/rewards'; 
// import Admin from './components/Admin'; 

function App() {
  const [currentSection, setCurrentSection] = useState('Dashboard');

  // Handle section change from sidebar
  const handleSectionChange = (section) => {
    setCurrentSection(section);
  };

  // Render the appropriate component based on current section
  const renderContent = () => {
    switch (currentSection) {
      case 'Dashboard':
        return <Dashboard comp={<Global/>} onOptionChange={handleSectionChange} />;
      case 'Stake':
        return <Stake comp={<Global/>} />;
      case 'Reward':
        return <Reward comp={<Global/>} />;
      case 'Admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <WalletProvider>
      <div className='bg-gray-900 min-h-screen text-white'>
        <Navbar />
        <div className='flex flex-row'>
          <Sidebar 
            onOptionChange={handleSectionChange}
            activeSection={currentSection}
          />
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </WalletProvider>
  );
}

export default App;
