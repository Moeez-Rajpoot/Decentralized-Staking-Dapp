import {
  faArrowRightArrowLeft,
  faLock,
  faPlus,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Global from "../global";
import React, { useState, useEffect, Children } from "react";
import { useWallet } from "../../context/WalletState";
import { ethers } from "ethers";




function Dashboard({comp}) {
  const { Account,StakingTokenContract, StakingToken  } = useWallet();
  const [walletData, setWalletData] = useState({
    balance: 0,
    stakedAmount: 0
  });

  // Call async function inside useEffect
  useEffect(() => {
    // Can't make useEffect itself async, so create a separate async function
    const fetchData = async () => {
      if (!StakingToken || !Account) {
        console.log("StakingToken or Account is not available yet");
        return;
      }

      // Set loading state
      setWalletData(prev => ({ ...prev, loading: true }));

      try {
        // Fetch wallet balance
        let balance = await StakingToken.balanceOf(Account);
        balance = Number(balance)/ 1e18;
        console.log("Balance:", balance);
        
        // You could fetch other data here too
        let stakedAmount = await StakingTokenContract.StakedBalance(Account);
        stakedAmount = Number(stakedAmount);
        console.log("Staked Amount:", stakedAmount);

        // Update state with all fetched values
        setWalletData({
          balance: balance,
          stakedAmount: stakedAmount, // Replace with actual fetched value
        });
      } catch (error) {
        console.error("Error fetching balance:", error);
        setWalletData(prev => ({ ...prev, loading: false }));
      }
    };

    // Call the async function
    fetchData();

    // Set up an interval to refresh data (optional)
    const intervalId = setInterval(fetchData, 30000); // Refresh every 30 seconds

    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(intervalId);

  }, [Account, StakingToken]); // Re-run when these dependencies change

  const cards = [
    {
      icon: faPlus,
      title: "Stake Tokens",
      description: "Lock your tokens to earn rewards overtime.",
      btncolor: "bg-green-700",
      btnvalue: "Stake",
    },
    {
      icon: faWallet,
      title: "Claim Rewards",
      description: "Harvest earned reward from your stake tokens",
      btncolor: "bg-blue-700",
      btnvalue: "Claim",
    },
    {
      icon: faArrowRightArrowLeft,
      title: "Unstake Tokens",
      description: "Withdraw your staked tokens back to your wallet.",
      btncolor: "bg-red-700",
      btnvalue: "Unstake",
    },
  ];

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>

      {/* Your Staking Overview */}
      {comp}  {/* Render the Global component */}
      
        <h1 className="text-xl font-bold font-mono mt-5">Quick Actions</h1>

      {/* CARDS SECTION */}
      <div className="grid grid-cols-3 gap-4 mt-6 w-full">
        {cards.map((item, index) => (
          <div
            key={index}
            className="flex-1 p-8 flex flex-col justify-center items-center bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl "
          >
            <div className="rounded-full  ">
              <FontAwesomeIcon
                icon={item.icon}
                className={`text-white ${item.btncolor} text-lg p-4 rounded-full`}
              />
            </div>

            <h2 className="text-white font-bold font-mono mt-2">
              {" "}
              {item.title}
            </h2>
            <h4 className="text-gray-400 font-light text-md w-2/3 text-center">
              {item.description}
            </h4>

            <button
              className={`mt-4 mb-3 text-white font-bold text-md rounded-xl w-full px-4 py-2 ${item.btncolor} hover:cursor-pointer`}
              onClick={() => {
                alert(item.btnvalue);
              }}
            >
              {item.btnvalue}
            </button>
          </div>
        ))}
      </div>


      {/* Wallet Summary */}
      <h1 className="text-xl font-bold font-mono mt-5">Wallet Summary</h1>
      <div className="flex flex-row bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0  mt-6 rounded-xl w-full p-14">
         <div className="flex flex-col w-1/2 p-4">
          <div className="font-bold font-mono">Total Balance</div>
          <div className="flex flex-row items-center mt-2">
            <div className="rounded-full bg-[#3c445667] h-14 w-14 mr-3 flex justify-center items-center">
              <FontAwesomeIcon icon={faWallet} className="text-blue-600 text-2xl " />
            </div>
            <div>
              {walletData.loading ? (
                <div className="animate-pulse h-8 w-32 bg-gray-300 rounded"></div>
              ) : (
                <>
                  <h2 className="text-3xl font-bold text-white">
                    {walletData.balance} <span className="text-sm"> Tokens</span>
                  </h2>
                  <p className="text-sm text-gray-400">Available For Staking</p>
                </>
              )}
            </div>
          </div>
         </div>
         <div className="flex flex-col w-1/2 p-4">
          <div className="font-bold font-mono">Staked Balance</div>
          <div className="flex flex-row items-center mt-2">
            <div className="rounded-full bg-[#3c445667] h-14 w-14 mr-3 flex justify-center items-center">
              <FontAwesomeIcon icon={faLock} className="text-blue-600 text-2xl " />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{walletData.stakedAmount}</h2>
              <p className="text-sm text-gray-400">Currently Staked</p>
            </div>
          </div>
         </div>          
      </div>
    </div>
  );
}

export default Dashboard;
