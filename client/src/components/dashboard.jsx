import { faChartSimple, faClock, faClockFour, faClockRotateLeft, faMoneyBill, faSackDollar, faStar, faTimeline, faTimes, faTimesCircle, faWandMagicSparkles, faWarehouse } from "@fortawesome/free-solid-svg-icons";
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
    }
  ]

  return (
    <div className="flex flex-col w-full h-full p-5">
      <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>
      <h1 className="text-xl font-bold font-mono mt-3">Your Staking Overview</h1>

      <div className="mt-4 flex flex-col w-full">
        <div className="grid grid-cols-4 gap-4 w-full">
          {data1.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl p-3 flex flex-row flex-1 "
            >
              <div className="w-3/4">
                <h2 className="text-md ml-3   text-gray-500 ">
                  {item.title}
                </h2>
                <p className="text-lg ml-3 font-bold text-white mt-2">
                  999{" "}
                  <span className=" font-thin text-sm text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-center items-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={item.color}
                />
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
                <h2 className="text-md ml-3   text-gray-500 ">
                  {item.title}
                </h2>
                <p className="text-lg ml-3 font-bold text-white mt-2">
                  999{" "}
                  <span className=" font-thin text-sm text-gray-400">
                    {item.sign}
                  </span>
                </p>
              </div>
              <div className="w-1/4 flex justify-end pr-6 items-center">
                <FontAwesomeIcon
                  icon={item.icon}
                  className={item.color}
                />
              </div>
            </div>
          ))}

        </div>
        <h1 className="text-xl font-bold font-mono mt-3">Quick Actions</h1>
      </div>
    </div>
  );
}

export default dashboard;
