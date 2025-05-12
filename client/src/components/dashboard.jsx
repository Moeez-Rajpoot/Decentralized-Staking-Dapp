import { faMoneyBill, faSackDollar } from "@fortawesome/free-solid-svg-icons";
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
      icon: faMoneyBill,
      color: "bg-[#4b4c4e80]",
    },
    {
      title: "Current APY",
      sign: "%",
      icon: faMoneyBill,
      color: "bg-[#4b4c4e80]",
    },
    {
      title: "Total Staked Amount",
      sign: "Tokens",
      icon: faMoneyBill,
      color: "bg-[#4b4c4e80]",
    },
  ];
  return (
    <div className="flex flex-col w-full h-full p-5">
      <h1 className="text-2xl font-bold font-mono">Dashboard</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>

      <div className="mt-4 flex flex-col w-full">
        <div className="grid grid-cols-4 gap-4 w-full">
          {data1.map((item, index) => (
            <div
              key={index}
              className="bg-[#4b4c4e36] border-1 border-white outline-0 rounded-2xl p-3 flex flex-row flex-1 "
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
      </div>
    </div>
  );
}

export default dashboard;
