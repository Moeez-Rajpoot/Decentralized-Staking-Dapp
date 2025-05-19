import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletState';

function Admin() {
  const { Account, StakingTokenContract, StakingToken , RewardContract } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [vaultBalance, setVaultBalance] = useState('0');
  const [contractBalance, setContractBalance] = useState('0');
  const [contractAddress, setContractAddress] = useState('');
  
  const fetchBalances = async () => {
      if (!StakingToken || !StakingTokenContract || !Account || !RewardContract) return;
      
      try {
    
        const balance = await RewardContract.balanceOf(Account);
        console.log(`User's token balance: ${balance}`);
        setVaultBalance(Number(balance) / 1e18);
        
    
        const contractBal = await RewardContract.balanceOf(StakingTokenContract.target);
        setContractBalance(Number(contractBal) / 1e18);
        
        // Store contract address
        setContractAddress(StakingToken.target);
      } catch (error) {
        console.error("Error fetching balances:", error);
      }
    };
  useEffect(() => {
    
    fetchBalances();
  }, [StakingToken, StakingTokenContract, Account , RewardContract]);

  const handleDeposit = async () => {
    if (!depositAmount || isNaN(depositAmount) || depositAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    try {
      setLoading(true);
      
      // 1. First approve the staking contract to spend tokens
      const amountInWei = BigInt(parseFloat(depositAmount) * 1e18);
      console.log(`Approving ${amountInWei} tokens...`);
      
      const approveTx = await RewardContract.approve(
        StakingTokenContract.target,
        amountInWei
      );
      
      console.log("Waiting for approval transaction...");
      await approveTx.wait();
      console.log("Approval successful:", approveTx.hash);
      
      // 2. Now deposit the tokens to the staking contract
      console.log(`Depositing ${depositAmount} tokens...`);
      const depositTx = await StakingTokenContract.DepositRewardToken(amountInWei);
      
      console.log("Waiting for deposit transaction...");
      await depositTx.wait();
      console.log("Deposit successful:", depositTx.hash);
      
      const balance = await RewardContract.balanceOf(Account);
        console.log(`User's token balance: ${balance}`);
        setVaultBalance(Number(balance) / 1e18);
        
    
        const contractBal = await RewardContract.balanceOf(StakingTokenContract.target);
        setContractBalance(Number(contractBal) / 1e18);
      
      setDepositAmount('');
      
    } catch (error) {
      console.error("Error depositing tokens:", error);
      alert(`Error: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Admin Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Manage your staking pool
      </p>
      <h1 className="text-xl font-bold font-mono mt-3">Vault Balances</h1>
      <div className="grid grid-cols-2 gap-4 mt-6 justify-center items-center">
        <div className="bg-[#a2453579] p-6 border-1 border-[#4b4c4ee8] outline-0 rounded-xl">
          <h2 className="text-md font-bold text-start w-full">
            Reward Token in Vault
          </h2>
          <div className="flex flex-col w-full justify-between mt-4">
            <p className="text-2xl text-white font-bold">{vaultBalance} <span>Tokens</span></p>
            <p className="text-sm mt-3 text-gray-400">Vault Address: {Account ? `${Account.substring(0, 6)}...${Account.substring(Account.length - 4)}` : ''}</p>
          </div>
        </div>
        <div className="bg-[#3559a27d] p-6 border-1 border-[#4b4c4ee8] outline-0 rounded-xl">
          <h2 className="text-md font-bold text-start w-full">
            Reward Token in Contract
          </h2>
          <div className="flex flex-col w-full justify-between mt-4">
            <p className="text-2xl text-white font-bold">{contractBalance} <span>Tokens</span></p>
            <p className="text-sm mt-3 text-gray-400">Contract Address: {contractAddress ? `${contractAddress.substring(0, 6)}...${contractAddress.substring(contractAddress.length - 4)}` : ''}</p>
          </div>
        </div>
      </div>

      <h1 className="text-xl font-bold font-mono mt-5">Deposit Reward Token In Contract</h1>
      <div className="flex flex-col w-1/2 mt-4 p-6 border-1 bg-[#1D2331] border-[#4b4c4ee8] outline-0 rounded-xl">
        <div className="flex flex-row justify-between items-center">
          <label className="text-gray-400 font-light text-sm">Amount to Deposit</label>
          <label className="text-gray-400 font-light text-sm">Balance: {vaultBalance}</label>
        </div>
        <div className="flex flex-row w-full justify-between items-center mt-2 h-12 bg-[#4b4c4e60] rounded-md">
          <input
            type="text"
            className="text-white w-full pl-2 outline-0 border-0 bg-transparent"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.0"
          />
          <button
            onClick={() => setDepositAmount(vaultBalance.toString())}
            className="flex flex-row justify-center text-sm items-center bg-[#1447E6] ml-1 rounded-md mr-1.5 h-fit px-3 py-1.5 hover:cursor-pointer hover:bg-[#1449e692]"
          >
            MAX
          </button>
        </div>
        <button
          onClick={handleDeposit}
          disabled={loading}
          className={`w-full h-10 mt-6 py-2 bg-[#1447E6] rounded-md hover:bg-[#1449e692] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
        >
          {loading ? 'Processing...' : 'Deposit Tokens'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          Note: This operation requires two transactions - first to approve token spending, then to deposit tokens.
        </p>
      </div>
    </div>
  );
}

export default Admin;
