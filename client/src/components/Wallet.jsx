/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { ConnectWallet } from "../utils/WalletConnection";
import { WalletProvider } from "../context/WalletState";

const Wallet = () => {
  const [state, setstate] = useState({
    Provider: null,
    Account: null,
    StakingToken: null,
    StakingTokenContract: null,
    ChainId: null,
  });

  const [isloading, setisloading] = useState(false);

  const handlewallet = async () => {
    try {
      setisloading(true);
      const { Provider, Account, StakingToken, StakingTokenContract, ChainId } =
        await ConnectWallet();

      setstate({
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
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
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = async (accounts) => {
    
      if (accounts.length > 0) {
        const {
          Provider,
          StakingToken,
          StakingTokenContract,
          ChainId,
        } = await ConnectWallet();

        setstate({
          Provider,
          Account: accounts[0],
          StakingToken,
          StakingTokenContract,
          ChainId,
        });

        console.log("Account changed:", accounts[0]);
      } else {
        setstate((prevState) => ({
          ...prevState,
          Account: null,
        }));
      }
    };

    const handleChainChanged = async (chainId) => {
      const {
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
      } = await ConnectWallet();

      setstate((prevState) => ({
        ...prevState,
        ChainId: Number(chainId),
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
      }));

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
      <WalletProvider value={state}>
      </WalletProvider>

      <button onClick={handlewallet} disabled={isloading}>
        {isloading ? "Connected" : "Connect Wallet"}
      </button>
    </div>
  );
};

export default Wallet;
