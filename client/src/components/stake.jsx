import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletState";
import Global from "./global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


function Stake({updatehandle , updatestate}) {
  const { Account, StakingTokenContract, StakingToken } = useWallet();
  
  
  const [stakeValues, setStakeValues] = useState({
    Value1: "",
    Value2: "",
  });

  const box = [
    {
      text: "1",
      title: "Stake Your Tokens",
      description:
        "Lock your tokens into staking pool to start earning reward.The More You Stake, The More You Earn",
    },
    {
      text: "2",
      title: "Accumulate Rewards",
      description:
        "Rewards are calculated based on the amount of tokens you have staked and the current APY.",
    },
    {
      text: "3",
      title: "Claim or Compound",
      description:
        "Claim your rewards anytime or compound them to increase your staked amount.",
    },
  ];
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [loading, setLoading] = useState({
    stake: false,
    unstake: false,
    fetch: true
  });
  
  // Fetch user balances on component mount and account change
  useEffect(() => {
    const fetchBalances = async () => {
      if (!StakingToken || !StakingTokenContract || !Account) return;
      
      try {
        setLoading(prev => ({ ...prev, fetch: true }));
        
        // Get wallet balance
        const balance = await StakingToken.balanceOf(Account);
        const formattedBalance = Number(balance) / 1e18;
        setWalletBalance(formattedBalance);
        
        // Get staked balance
        const staked = await StakingTokenContract.StakedBalance(Account);
        const formattedStaked = Number(staked) / 1e18;
        setStakedBalance(formattedStaked);
        
        console.log(`Wallet balance: ${formattedBalance}, Staked: ${formattedStaked}`);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(prev => ({ ...prev, fetch: false }));
      }
    };
    
    fetchBalances();
    // Set up interval to refresh balances
    const interval = setInterval(fetchBalances, 30000); // every 30 seconds
    
    return () => clearInterval(interval);
  }, [Account, StakingToken, StakingTokenContract]);
  
  const cards = [
    {
      heading: "Stake Tokens",
      label: "Amount to Stake",
      label2: "Balance",
      balancevalue: loading.fetch ? "Loading..." : walletBalance.toFixed(3),
      fieldvalue1: stakeValues.Value1,
      btncolor: "bg-[#1447E6]",
      discription:
        "By staking your tokens you will start earning rewards based on current APY. You can unstake your tokens any time.",
    },
    {
      heading: "Unstake Tokens",
      label: "Amount to Unstake",
      label2: "Staked",
      balancevalue: loading.fetch ? "Loading..." : stakedBalance.toFixed(3),
      fieldvalue1: stakeValues.Value2,
      btncolor: "bg-transparent",
      discription:
        "Unstaking will withdraw your tokens from staking pool. You will continue to earn rewards until you unstake your tokens.",
    },
  ];

  const handleInputChange = (key, value) => {
    if (value <= 0) {
      value = "";
    }
    if (key === 0) {
      setStakeValues({
        ...stakeValues,
        Value1: value,
      });
    }
    if (key === 1) {
      setStakeValues({
        ...stakeValues,
        Value2: value,
      });
    }
  };
  
  // Set max value for input fields
  const handleMaxClick = (index) => {
    if (index === 0) {
      setStakeValues({
        ...stakeValues,
        Value1: walletBalance.toString()
      });
    } else {
      setStakeValues({
        ...stakeValues,
        Value2: stakedBalance.toString()
      });
    }
  };
  
  // Handle staking tokens
  const handleStake = async () => {
    if (!stakeValues.Value1 || parseFloat(stakeValues.Value1) <= 0) {
      alert("Please enter an amount to stake");
      return;
    }
    
    if (parseFloat(stakeValues.Value1) > walletBalance) {
      alert("You cannot stake more than your balance");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, stake: true }));
      
      // Convert to wei (with 18 decimals)
      const amountInWei = BigInt(parseFloat(stakeValues.Value1) * 1e18);
      console.log(`Approving ${stakeValues.Value1} tokens (${amountInWei} wei)...`);
      
      // First approve the staking contract to spend tokens
      const approveTx = await StakingToken.approve(
        StakingTokenContract.target, // or .address in some versions
        amountInWei
      );
      
      console.log("Waiting for approval transaction...");
      await approveTx.wait();
      console.log("Approval successful:", approveTx.hash);
      
      // Now stake the tokens - use StakeTokens as defined in your contract
      console.log(`Staking ${stakeValues.Value1} tokens (${amountInWei} wei)...`);
      const stakeTx = await StakingTokenContract.StakeTokens(amountInWei);
      
      console.log("Waiting for stake transaction...");
      await stakeTx.wait();
      console.log("Stake successful:", stakeTx.hash);
      updatehandle();
      
      // Reset input field
      setStakeValues({
        ...stakeValues,
        Value1: ""
      });
      
      // Refresh balances
      const newWalletBalance = await StakingToken.balanceOf(Account);
      setWalletBalance(Number(newWalletBalance) / 1e18);
      
      const newStakedBalance = await StakingTokenContract.StakedBalance(Account);
      setStakedBalance(Number(newStakedBalance) / 1e18);
      
    } catch (error) {
      console.error("Error staking tokens:", error);
      alert(`Failed to stake tokens: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, stake: false }));
    }
  };
  
  // Handle unstaking tokens
  const handleUnstake = async () => {
    if (!stakeValues.Value2 || parseFloat(stakeValues.Value2) <= 0) {
      alert("Please enter an amount to unstake");
      return;
    }
    
    if (parseFloat(stakeValues.Value2) > stakedBalance) {
      alert("You cannot unstake more than your staked balance");
      return;
    }
    
    try {
      setLoading(prev => ({ ...prev, unstake: true }));
      
      // Convert to wei (with 18 decimals)
      const amountInWei = BigInt(parseFloat(stakeValues.Value2) * 1e18);
      console.log(`Unstaking ${stakeValues.Value2} tokens (${amountInWei} wei)...`);
      
      // Call the WithDrawTokens function - use the exact function name from your contract
      const withdrawTx = await StakingTokenContract.WithDrawTokens(amountInWei);
      
      console.log("Waiting for unstake transaction...");
      await withdrawTx.wait();
      console.log("Unstake successful:", withdrawTx.hash);
      updatehandle();
      
      // Reset input field
      setStakeValues({
        ...stakeValues,
        Value2: ""
      });
      
      // Refresh balances
      const newWalletBalance = await StakingToken.balanceOf(Account);
      setWalletBalance(Number(newWalletBalance) / 1e18);
      
      const newStakedBalance = await StakingTokenContract.StakedBalance(Account);
      setStakedBalance(Number(newStakedBalance) / 1e18);
      
    } catch (error) {
      console.error("Error unstaking tokens:", error);
      alert(`Failed to unstake tokens: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, unstake: false }));
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Stake & Unstake</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>
      <Global updateglobal={updatestate}/>
      <h1 className="text-xl font-bold font-mono mt-4">Staking Actions</h1>
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        {cards.map((item, index) => (
          <div
            key={index}
            className="flex-1 p-6 flex flex-col justify-center items-center bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl"
          >
            <h2 className="text-md font-bold text-start w-full">
              {item.heading}
            </h2>
            <div className="flex flex-row w-full justify-between mt-4">
              <h4 className="text-gray-100 font-light text-sm w-2/3 text-start">
                {item.label}
              </h4>
              <h4 className="text-gray-500 font-light text-sm w-2/3 text-end">
                {item.label2}: {item.balancevalue} STK
              </h4>
            </div>
            <div className="flex flex-row w-full justify-between items-center mt-2 h-12 bg-[#4b4c4e60] rounded-md">
              <input
                type="number"
                className="text-white w-full pl-2 outline-0 border-0 bg-transparent"
                placeholder="0"
                value={index === 0 ? stakeValues.Value1 : stakeValues.Value2}
                onChange={(e) => handleInputChange(index, e.target.value)}
                disabled={loading.stake || loading.unstake}
              />
              <div 
                className="flex flex-row justify-center text-sm items-center bg-[#1447E6] ml-1 rounded-md mr-1.5 h-fit px-3 py-1.5 hover:cursor-pointer hover:bg-[#1449e692]"
                onClick={() => handleMaxClick(index)}
              >
                MAX
              </div>
            </div>

            <button
              className={`w-full h-10 mt-6 py-2 ${item.btncolor} ${
                index === 1 ? "border-[1px] border-blue-400" : "border-0"
              } rounded-md hover:cursor-pointer ${
                index === 0 ? "hover:bg-[#1449e692]" : "hover:bg-[#4b4c4e9d]"
              } ${(loading.stake && index === 0) || (loading.unstake && index === 1) ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={index === 0 ? handleStake : handleUnstake}
              disabled={(loading.stake && index === 0) || (loading.unstake && index === 1)}
            >
              {index === 0 
                ? loading.stake ? "Staking..." : "Stake STK Tokens"
                : loading.unstake ? "Unstaking..." : "Unstake STK Tokens"
              }
            </button>
            <p className="text-gray-400 font-light text-sm w-full mt-4 text-start">
              {item.discription}
            </p>
          </div>
        ))}
      </div>
      <h1 className="text-xl font-bold font-mono mt-5">How Staking Works</h1>
      <div className="grid grid-cols-3 gap-4 mt-6 w-full  bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl ">
        {box.map((item, index) => (
          <div
            key={index}
            className="flex-1 p-8 flex flex-col justify-center items-center"
          >
            <div className="rounded-full bg-blue-500 w-12 h-12 flex justify-center items-center">
              {item.text}
            </div>

            <h2 className="text-white font-bold font-mono mt-3">
              {" "}
              {item.title}
            </h2>
            <h4 className="text-gray-400 font-light text-md mt-2 w-10/12 text-center">
              {item.description}
            </h4>
          </div>
        ))}
      </div>

      {/* Frequents asked Questions*/}
      <h1 className="text-xl font-bold font-mono mt-5">Frequently Asked Questions</h1>
      <div className="flex flex-col gap-3 mt-6 w-full p-4  bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
            
            <h2 className="font-bold text-md">How are Rewards calculated ?</h2>
            <p className="text-sm text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia assumenda quasi architecto alias, illo laboriosam explicabo cum repudiandae vero quas dignissimos dolor, vel esse voluptatibus in reiciendis deleniti, vitae deserunt!</p>

      </div>
      <div className="flex flex-col gap-3 mt-6 w-full p-4  bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
            
            <h2 className="font-bold text-md">Can i unstake anytime ?</h2>
            <p className="text-sm text-gray-400">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quia assumenda quasi architecto alias, illo laboriosam explicabo cum repudiandae vero quas dignissimos dolor.!</p>

      </div>
      <div className="flex flex-col gap-3 mt-6 w-full p-4  bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
            
            <h2 className="font-bold text-md">Are there any fees ?</h2>
            <p className="text-sm text-gray-400">No there arn't any fee. Quia assumenda quasi architecto alias, illo laboriosam explicabo cum repudiandae vero quas dignissimos dolor, vel esse voluptatibus in reiciendis deleniti, vitae deserunt!</p>

      </div>


    </div>
  );
}

export default Stake; // Fixed component name to follow React conventions
