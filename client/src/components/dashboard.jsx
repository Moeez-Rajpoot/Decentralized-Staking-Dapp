import {
  faArrowRightArrowLeft,
  faChartSimple,
  faClock,
  faClockFour,
  faClockRotateLeft,
  faMoneyBill,
  faPlus,
  faSackDollar,
  faStar,
  faTimeline,
  faTimes,
  faTimesCircle,
  faWallet,
  faWandMagicSparkles,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function dashboard() {
  const data1 = [
    {
      title: "Your Staked Amount",
      sign: "Tokens",
      icon: faSackDollar,
      color: "text-yellow-500",
    },
    {
      title: "Pending Reward",
      sign: "Tokens",
      icon: faWandMagicSparkles,
      color: "text-blue-600",
    },
    {
      title: "Current APY",
      sign: "%",
      icon: faChartSimple,
      color: "text-green-600",
    },
    {
      title: "Total Staked Amount",
      sign: "Tokens",
      icon: faWarehouse,
      color: "text-red-600",
    },
  ];

  const data2 = [
    {
      title: "Last Staked Time",
      sign: "",
      icon: faClock,
      color: "text-white",
    },
    {
      title: "Reward Rate",
      sign: "Tokens/sec",
      icon: faClockRotateLeft,
      color: "text-white",
    },
  ];

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
    <div className="flex flex-col w-full h-full p-5">
      <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>
      <h1 className="text-xl font-bold font-mono mt-3">
        Your Staking Overview
      </h1>

      <div className="mt-4 flex flex-col w-full">
        <div className="grid grid-cols-4 gap-4 w-full">
          {data1.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl p-3 flex flex-row flex-1 "
            >
              <div className="w-3/4">
                <h2 className="text-md ml-3   text-gray-500 ">{item.title}</h2>
                <p className="text-lg ml-3 font-bold text-white mt-2">
                  999{" "}
                  <span className=" font-thin text-sm text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <FontAwesomeIcon icon={item.icon} className={item.color} />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
          {data2.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl p-3 flex flex-row flex-1 "
            >
              <div className="w-3/4">
                <h2 className="text-md ml-3   text-gray-500 ">{item.title}</h2>
                <p className="text-lg ml-3 font-bold text-white mt-2">
                  999{" "}
                  <span className=" font-thin text-sm text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-end pr-6 items-center">
                <FontAwesomeIcon icon={item.icon} className={item.color} />
              </div>
            </div>
          ))}
        </div>
        <h1 className="text-xl font-bold font-mono mt-3">Quick Actions</h1>
      </div>

      {/* CARDS SECTION */}
      <div className="grid grid-cols-3 gap-4 mt-3 w-full">
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
    </div>
  );
}

export default dashboard;
