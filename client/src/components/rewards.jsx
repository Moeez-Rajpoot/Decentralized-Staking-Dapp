import React from "react";

function rewards({ comp }) {
  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Stake & Unstake</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>
      {comp}
      <h1 className="text-xl font-bold font-mono mt-4">Claim Your Rewards</h1>
      <div className="flex flex-col gap-3 mt-6 w-full p-4  bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl">
        <h2 className="font-bold text-md">Claim Rewards</h2>
        <div className="flex flex-col justify-center items-center gap-2 mt-4 p-4 bg-[#4b4c4e2c] border-1 border-[#4b4c4ee8] outline-0 rounded-xl">
          <h3>Your Pending Rewards</h3>
          <h1 className="font-bold text-3xl">0</h1>
          <h3 className="text-gray-500 text-sm">Tokens</h3>
        </div>
        <button className="w-full h-11 mt-6 py-2 bg-blue-600 hover:bg-blue-500 hover:cursor-pointer rounded-xl  ">
          Claim Reward
        </button>
        <p className="text-center text-gray-500 text-sm">You don't have any rewards to claim yet. stake tokens to get reward.</p>
        <p className="text-center text-gray-500 text-sm">Rewards are automatically calculated by your staked amount of tokens and the time elapsed. You can claim your reward any time with affecting your staked tokens.</p>
      </div>
    </div>
  );
}

export default rewards;
