import { createContext, useContext, useState } from 'react';

// Create the context
const WalletContext = createContext();

// Custom hook to access the context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider = ({ children }) => {
  // Initialize state with default values
  const [walletState, setWalletState] = useState({
    Provider: null,
    Account: null,
    StakingToken: null,
    StakingTokenContract: null,
    ChainId: null,
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to update wallet state
  const updateWalletState = (newState) => {
    setWalletState(newState);
  };
  
  // Function to set loading state
  const updateLoadingState = (loading) => {
    setIsLoading(loading);
  };
  
  // Value to be provided to consuming components
  const contextValue = {
    ...walletState,
    isLoading,
    updateWalletState,
    updateLoadingState
  };
  
  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};