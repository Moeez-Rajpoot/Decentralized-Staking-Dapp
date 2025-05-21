import React, { useState, useEffect } from "react";
import {
  faChartSimple,
  faClock,
  faClockRotateLeft,
  faSackDollar,
  faSpinner,
  faWandMagicSparkles,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useWallet } from "../context/WalletState";


// Rename component to follow React conventions (capital first letter)
function Global({ updateglobal, onDataUpdated }) {
  // Access wallet context
  const { Account, StakingTokenContract } = useWallet();

  const [loading, setLoading] = useState(false);

  // State to store contract data
  const [stakingData, setStakingData] = useState({
    stakedAmount: 0,
    pendingReward: 0,
    RewardPool: 0,
    totalStaked: 0,
    lastStakedTime: 0,
    rewardRate: 0,
  });

  const data1 = [
    {
      title: "Your Staked Amount",
      value: stakingData.stakedAmount,
      sign: "Tokens",
      icon: faSackDollar,
      color: "text-yellow-500",
    },
    {
      title: "Pending Reward",
      value: stakingData.pendingReward,
      sign: "Tokens",
      icon: faWandMagicSparkles,
      color: "text-blue-600",
    },
    {
      title: "Reward Pool Balance",
      value: stakingData.RewardPool,
      sign: "Tokens",
      icon: faChartSimple,
      color: "text-green-600",
    },
    {
      title: "Total Staked Amount",
      value: stakingData.totalStaked,
      sign: "Tokens",
      icon: faWarehouse,
      color: "text-red-600",
    },
  ];

  const data2 = [
    {
      title: "Last Staked Time",
      value: stakingData.lastStakedTime,
      isTimestamp: true,
      sign: "",
      icon: faClock,
      color: "text-white",
    },
    {
      title: "Reward Rate",
      value: stakingData.rewardRate,
      sign: "Tokens/sec",
      icon: faClockRotateLeft,
      color: "text-white",
    },
  ];

  // Function to fetch data from contract
  const fetchContractData = async () => {
    
    if (!StakingTokenContract || !Account) {
      console.log("StakingTokenContract or Account is not available yet");
      return;
    }

    console.log("Fetching contract data... is being called from Global.jsx");

    try {
      setLoading(true);
      let userStaked,pendingRewards, rewardRate, totalStaked, lastStakedTime , rewardpool;

      try {
        console.log("Fetching StakedBalance...");
        userStaked = await StakingTokenContract.StakedBalance(Account);
        userStaked = Number(userStaked)/1e18;
        console.log("User staked fetched:", userStaked);
      } catch (e) {
        console.error("Error fetching StakedBalance:", e.message);
        userStaked = 0;
      }
      try {
        console.log("Fetching Pending Reward...");
        pendingRewards = await StakingTokenContract.Earned(Account);
        pendingRewards = Number(pendingRewards)/1e18;
        console.log("pendingRewards fetched:", pendingRewards);
      } catch (e) {
        console.error("Error fetching StakedBalance:", e.message);
        pendingRewards = 0;
      }
        
      try {
        console.log("Fetching Total Staked Amount...");
        totalStaked = await StakingTokenContract.TotalStakedToken();
        totalStaked = Number(totalStaked)/1e18;
        console.log("totalStaked fetched:", totalStaked);
      } catch (e) {
        console.error("Error fetching StakedBalance:", e.message);
        totalStaked = 0;
      }

      try {
        console.log("Fetching Reward Rate...");
        rewardRate = await StakingTokenContract.RewardRate();
        rewardRate = Number(rewardRate)/1e18;
        console.log("totalStaked fetched:", rewardRate);
      } catch (e) {
        console.error("Error fetching StakedBalance:", e.message);
        rewardRate = 0;
      }

      try {
        console.log("Fetching Last Staked Time...");
        lastStakedTime = await StakingTokenContract.LastTimeUserStaked(Account);
        lastStakedTime = Number(lastStakedTime);
        if (lastStakedTime <= 0) {
            lastStakedTime = "Never Staked";
        } else {
          const date = new Date(lastStakedTime * 1000);
          lastStakedTime = date.toLocaleString();
            
        }
        
        console.log("totalStaked fetched:", lastStakedTime);
      } catch (e) {
        console.error("Error fetching StakedBalance:", e.message);
        rewardRate = 0;
      }

      try {
        rewardpool = await StakingTokenContract.RewardPoolBalance();
        rewardpool = Number(rewardpool)/1e18;
        console.log("RewardPool fetched:", rewardpool);
      } catch (error) {
        console.error("Error Fetching RewardPool", error);
        rewardpool = 0;
      }


      // Update state with formatted values - handle both BigNumber and regular number cases
      try {
        setStakingData({
          stakedAmount: userStaked,
          pendingReward: pendingRewards,
            RewardPool: rewardpool,
            totalStaked: totalStaked,
            lastStakedTime: lastStakedTime,
            rewardRate: rewardRate
        });
        setLoading(false);
        console.log("State updated successfully");
        console.log("Staking data:", {
          stakedAmount: userStaked,
            pendingReward: pendingRewards,
            RewardPool: rewardpool,
            totalStaked: totalStaked,
            lastStakedTime: lastStakedTime,
            rewardRate: rewardRate

        });
      } catch (e) {
        setLoading(false);
        console.error("Error formatting values:", e.message);

        // Fallback to setting default values if formatting fails
        setStakingData({
          stakedAmount: "0",
          pendingReward: "0",
          RewardPool: "0",
          totalStaked: "0",
          lastStakedTime: 0,
          rewardRate: "0",
        });
      }
    } catch (error) {
      setLoading(false);
      console.error("Error in fetchContractData:", error);

      // Set default values on error
      setStakingData({
        stakedAmount: "0",
        pendingReward: "0",
        RewardPool: "0",
        totalStaked: "0",
        lastStakedTime: 0,
        rewardRate: "0",
      });
    }

    // If onDataUpdated callback was provided, call it when data is refreshed
    if (onDataUpdated) {
      onDataUpdated();
    }
  };
  
  // Make the function available to parent
  useEffect(() => {
    if (onDataUpdated) {
      onDataUpdated(fetchContractData);
    }
  }, []);

  useEffect(() => {
    fetchContractData();



 
    // const intervalId = setInterval( fetchContractData, 15000);

    // return () => clearInterval(intervalId);
  }, [updateglobal,Account, StakingTokenContract]);

  return (
    <>
      <h1 className="text-xl font-bold font-mono mt-3">
        Your Staking Overview 
        {loading && (
          // 
          <FontAwesomeIcon className="ml-3 animate-spin" icon={faSpinner} />
        )}
      </h1>

      <div className="mt-4 flex flex-col w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {data1.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl p-3 flex flex-row flex-1"
            >
              <div className="w-3/4">
                <h2 className="text-md ml-3 text-gray-500">{item.title}</h2>
                <p className="text-lg ml-3 font-bold text-white mt-2">
                  {Account
                    ? index === 0 || index === 2
                      ? item.value
                      : parseFloat(item.value).toFixed(3)
                    : "--"}{" "}
                  <span className="font-thin text-sm text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={item.color}
                  size="lg"
                />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 w-full">
          {data2.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl p-3 flex flex-row flex-1"
            >
              <div className="w-3/4">
                <h2 className="text-md ml-3 text-gray-500">{item.title}</h2>
                <p className="text-lg ml-3 font-bold text-white mt-2 ">
                  {item.value}

                  <span className="font-thin text-sm ml-2 text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-end pr-6 items-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={item.color}
                  size="lg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Global;
