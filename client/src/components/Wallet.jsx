/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { ConnectWallet } from "../utils/WalletConnection";
import { WalletProvider } from "../context/WalletState";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEarth, faNetworkWired } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "../context/WalletState";

const Wallet = () => {
  // Local state for component-specific needs
  const [state, setstate] = useState({
    Provider: null,
    Account: null,
    StakingToken: null,
    StakingTokenContract: null,
    RewardContract: null,
    ChainId: null,
  });

  const [isloading, setisloading] = useState(false);
  
  // Get context functions
  const { updateWalletState, updateLoadingState } = useWallet();

  const handlewallet = async () => {
    try {
      // Update local state
      setisloading(true);
      // Update global context loading state
      updateLoadingState(true);
      
      const { Provider, Account, StakingToken, StakingTokenContract, RewardContract , ChainId } =
        await ConnectWallet();

      // Update local state
      setstate({
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
        RewardContract,
        ChainId,
      });
      
      // Also update context state
      updateWalletState({
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
        RewardContract,
        ChainId,
      });

      console.log("Wallet connected successfully", {
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
        ChainId,
      });
    } catch (error) {
      console.error("Error connecting to wallet:", error.message);
    } finally {
      setisloading(false);
      updateLoadingState(false);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length > 0) {
        const { Provider, StakingToken, StakingTokenContract,RewardContract, ChainId } =
          await ConnectWallet();

        const newState = {
          Provider,
          Account: accounts[0],
          StakingToken,
          StakingTokenContract,
          RewardContract,
          ChainId,
        };

        // Update local state
        setstate(newState);
        
        // Also update context state - THIS IS THE MISSING PART
        updateWalletState(newState);

        console.log("Account changed:", accounts[0]);
      } else {
        const newState = {
          ...state,
          Account: null,
        };
        
        // Update both states when disconnected
        setstate(newState);
        updateWalletState(newState);
      }
    };

    const handleChainChanged = async (chainId) => {
      const { Provider, Account, StakingToken, StakingTokenContract , RewardContract } =
        await ConnectWallet();

      const newState = {
        ...state,
        ChainId: Number(chainId),
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
        RewardContract,
      };

      // Update local state
      setstate(newState);
      
      // Also update context state - THIS IS THE MISSING PART
      updateWalletState(newState);

      console.log("Chain changed:", Number(chainId));
    };

    // Add event listeners
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // Cleanup on unmount
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  return (
    <div>
      <WalletProvider value={state}></WalletProvider>

      <div className="flex flex-row">
        <div className={`flex flex-row justify-between items-center mr-2 border-[#0f468a] border-2 p-4 rounded-4xl shadow-md ${state.ChainId === null ? "hidden" : "block"}`}>
          {state.ChainId === 11155111 ? (
            <>
              <FontAwesomeIcon
                icon={faNetworkWired}
                className="mr-2 text-lg text-green-500"
              />
              <p>Network Connected : Sepolia</p>
            </>
          ) : (
            <>
              <FontAwesomeIcon
                icon={faNetworkWired}
                className="mr-2 text-lg text-red-500"
              />
              <p>Network Not Supported</p>
            </>
          )}
        </div>

        <div className="flex flex-row justify-between items-center bg-[#1447E6] p-4 rounded-4xl shadow-md">
          <FontAwesomeIcon icon={faEarth} className="mr-2 text-xl" />
          <button className="hover:cursor-pointer" onClick={handlewallet}>
            {isloading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : state.Account ? (
              <span className="text-white font-mono">
                {state.Account.slice(0, 5) +
                  "..." +
                  state.Account.slice(state.Account.length - 4)}
              </span>
            ) : (
              <span className="text-white font-mono">Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
