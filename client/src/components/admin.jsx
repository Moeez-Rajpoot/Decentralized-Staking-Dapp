import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletState';

function Admin() {
  const { Account, StakingTokenContract, StakingToken, RewardContract } = useWallet();
  const [depositAmount, setDepositAmount] = useState('');
  const [rewardRate, setRewardRate] = useState('');
  const [currentRewardRate, setCurrentRewardRate] = useState('0');
  const [loading, setLoading] = useState(false);
  const [rateLoading, setRateLoading] = useState(false);
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
      
      // Fetch current reward rate
      const rate = await StakingTokenContract.RewardRate();
      setCurrentRewardRate(Number(rate) / 1e18);
      console.log(`Current reward rate: ${Number(rate) / 1e18} tokens per second`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  useEffect(() => {
    fetchBalances();
  }, [StakingToken, StakingTokenContract, Account, RewardContract]);

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
  
  const handleUpdateRewardRate = async () => {
    if (!rewardRate || isNaN(rewardRate) || rewardRate <= 0) {
      alert("Please enter a valid reward rate");
      return;
    }
    
    try {
      setRateLoading(true);
      
      // Convert to wei (with 18 decimals)
      const rateInWei = BigInt(parseFloat(rewardRate) * 1e18);
      console.log(`Updating reward rate to ${rewardRate} tokens per second (${rateInWei} wei)...`);
      
      const updateTx = await StakingTokenContract.UpdateRewardRate(rateInWei);
      
      console.log("Waiting for reward rate update transaction...");
      await updateTx.wait();
      console.log("Reward rate update successful:", updateTx.hash);
      
      // Refresh reward rate
      const newRate = await StakingTokenContract.RewardRate();
      setCurrentRewardRate(Number(newRate) / 1e18);
      
      setRewardRate(''); // Clear input
      
    } catch (error) {
      console.error("Error updating reward rate:", error);
      alert(`Error: ${error.message || error}`);
    } finally {
      setRateLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Admin Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Manage your staking pool
      </p>
      
      {/* Existing vault balances section */}
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

      {/* Deposit section */}
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

      {/* New section for reward rate */}
      <h1 className="text-xl font-bold font-mono mt-5">Update Reward Rate</h1>
      <div className="flex flex-col w-1/2 mt-4 p-6 border-1 bg-[#1D2331] border-[#4b4c4ee8] outline-0 rounded-xl">
        <div className="flex flex-row justify-between items-center">
          <label className="text-gray-400 font-light text-sm">New Reward Rate (tokens/second)</label>
          <label className="text-gray-400 font-light text-sm">Current Rate: {currentRewardRate} Token/Sec</label>
        </div>
        <div className="flex flex-col w-full">
          <div className="flex flex-row w-full justify-between items-center mt-2 h-12 bg-[#4b4c4e60] rounded-md">
            <input
              type="text"
              className="text-white w-full pl-2 outline-0 border-0 bg-transparent"
              value={rewardRate}
              onChange={(e) => setRewardRate(e.target.value)}
              placeholder="0.0"
            />
          </div>
          <div className="flex flex-row text-xs text-gray-500 mt-1 justify-between">
            <span>Daily: {rewardRate ? (parseFloat(rewardRate) * 86400).toFixed(6) : '0'} tokens</span>
            <span>Yearly: {rewardRate ? (parseFloat(rewardRate) * 31536000).toFixed(2) : '0'} tokens</span>
          </div>
        </div>
        <button
          onClick={handleUpdateRewardRate}
          disabled={rateLoading}
          className={`w-full h-10 mt-6 py-2 bg-[#1447E6] rounded-md hover:bg-[#1449e692] ${rateLoading ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
        >
          {rateLoading ? 'Processing...' : 'Update Reward Rate'}
        </button>
        <p className="text-xs text-gray-500 mt-2">
          The reward rate determines how many tokens are distributed per second to all stakers based on their share of the staking pool.
        </p>
        <div className="flex flex-col mt-4 bg-[#ffffff0f] p-3 rounded-md">
          <h3 className="text-xs font-semibold text-gray-300">Reward Rate Guide</h3>
          <p className="text-xs text-gray-400 mt-1">
            • 0.0001 tokens/sec ≈ 3.15 tokens/year<br />
            • 0.001 tokens/sec ≈ 31.5 tokens/year<br />
            • 0.01 tokens/sec ≈ 315 tokens/year
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Ensure you have deposited enough tokens to cover the expected rewards over your desired time period.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Admin;
