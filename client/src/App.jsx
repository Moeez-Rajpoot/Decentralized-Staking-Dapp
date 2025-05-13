import { useState } from 'react';
import './App.css';
import Sidebar from './components/sidebar/sidebar';
import Navbar from './components/navbar/navbar';
import { WalletProvider } from './context/WalletState';
import Dashboard from './components/dashboard/dashboard';
import Stake from './components/stake'; // Import other components
// import Reward from './components/Reward'; // Import if available
// import Admin from './components/Admin'; // Import if available

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
        return <Dashboard />;
      case 'Stake':
        return <Stake />;
      case 'Reward':
        return <Reward />;
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
            initialActive={currentSection}
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
