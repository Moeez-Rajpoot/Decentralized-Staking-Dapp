import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletState";
import Global from "./global";
function Rewards({ updatehandle, updatestate }) {
  const { Account, StakingTokenContract } = useWallet();
  const [pendingReward, setPendingReward] = useState(0);
  const [loading, setLoading] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [lastClaimed, setLastClaimed] = useState(null);

  // Fetch pending rewards
  const fetchRewards = async () => {
    if (!StakingTokenContract || !Account) return;

    try {
      setLoading(true);
      const rewards = await StakingTokenContract.Earned(Account);
      setPendingReward(Number(rewards) / 1e18);

      console.log(`Pending rewards: ${Number(rewards) / 1e18}`);
    } catch (error) {
      console.error("Error fetching rewards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and periodic updates
  useEffect(() => {
    fetchRewards();

    
  }, [Account, StakingTokenContract]);

  // Handle claiming rewards
  const handleClaimRewards = async () => {
    if (!StakingTokenContract || !Account || pendingReward <= 0) return;

    try {
      setClaiming(true);
      console.log("Claiming rewards...");

      // Call the GetReward function on the smart contract
      const tx = await StakingTokenContract.ClaimRewards();

      console.log("Claiming transaction sent:", tx.hash);
      await tx.wait();
      console.log("Rewards claimed successfully!");

      // Update rewards after claiming
      fetchRewards();
      updatehandle();

      // Record time of claim
      setLastClaimed(new Date().toLocaleString());
    } catch (error) {
      console.error("Error claiming rewards:", error);
      alert(`Failed to claim rewards: ${error.message || error}`);
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Rewards</h1>
      <p className="text-sm text-gray-600 mt-2">
        View and claim your staking rewards
      </p>
      <Global updateglobal={updatestate} />
      <h1 className="text-xl font-bold font-mono mt-4">Claim Your Rewards</h1>
      <div className="flex flex-col gap-3 mt-6 w-full p-4 bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
        <h2 className="font-bold text-md">Claim Rewards</h2>
        <div className="flex flex-col justify-center items-center gap-2 mt-4 p-4 bg-[#4b4c4e2c] border-1 border-[#4b4c4ee8] outline-0 rounded-xl">
          <h3>Your Pending Rewards</h3>
          {loading ? (
            <div className="animate-pulse bg-gray-700 h-10 w-24 rounded-md"></div>
          ) : (
            <h1 className="font-bold text-3xl">
              {pendingReward.toFixed(3)}
            </h1>
          )}
          <h3 className="text-gray-500 text-sm">Tokens</h3>
        </div>

        <button
          className={`w-full h-11 mt-6 py-2 rounded-xl 
            ${pendingReward > 0
              ? "bg-blue-600 hover:bg-blue-500 hover:cursor-pointer"
              : "bg-gray-600 cursor-not-allowed"} 
            ${claiming ? "opacity-75" : ""}`}
          onClick={handleClaimRewards}
          disabled={claiming || pendingReward <= 0}
        >
          {claiming
            ? "Claiming..."
            : pendingReward > 0
              ? "Claim Reward"
              : "No Rewards Available"
          }
        </button>

        {lastClaimed && (
          <p className="text-center text-green-400 text-sm mt-2">
            Last claimed: {lastClaimed}
          </p>
        )}

        {pendingReward <= 0 ? (
          <p className="text-center text-gray-500 text-sm">
            You don't have any rewards to claim yet. Stake tokens to earn rewards.
          </p>
        ) : (
          <p className="text-center text-gray-500 text-sm">
            You have {pendingReward.toFixed(3)} tokens available to claim. Claiming won't affect your staked amount.
          </p>
        )}

        <p className="text-center text-gray-500 text-sm">
          Rewards are automatically calculated based on your staked amount of tokens and the time elapsed.
          You can claim your rewards any time without affecting your staked tokens.
        </p>
      </div>

      <div className="flex flex-col gap-3 mt-6 w-full p-4 bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
        <h2 className="font-bold text-md">How Rewards Work</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-4 bg-[#4b4c4e20] rounded-lg">
            <div className="rounded-full bg-blue-600 w-10 h-10 flex justify-center items-center mb-2">1</div>
            <h3 className="font-semibold text-center">Stake Tokens</h3>
            <p className="text-xs text-gray-400 text-center mt-2">
              The more tokens you stake, the more rewards you earn
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-[#4b4c4e20] rounded-lg">
            <div className="rounded-full bg-blue-600 w-10 h-10 flex justify-center items-center mb-2">2</div>
            <h3 className="font-semibold text-center">Earn Rewards</h3>
            <p className="text-xs text-gray-400 text-center mt-2">
              Rewards accumulate every second based on the current APY
            </p>
          </div>
          <div className="flex flex-col items-center p-4 bg-[#4b4c4e20] rounded-lg">
            <div className="rounded-full bg-blue-600 w-10 h-10 flex justify-center items-center mb-2">3</div>
            <h3 className="font-semibold text-center">Claim Anytime</h3>
            <p className="text-xs text-gray-400 text-center mt-2">
              Claim your rewards whenever you want without unstaking
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Correct the component name to start with capital letter (React convention)
export default Rewards;
