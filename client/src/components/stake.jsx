import React, { useState } from "react";
import Global from "./global";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Stake({ comp }) {
  const [stakeValues, setStakeValues] = useState({
    Value1: "",
    Value2: "",
  });

  const cards = [
    {
      heading: "Stake Tokens",
      label: "Amount to Stake",
      label2: "Balance",
      balancevalue: "0",
      fieldvalue1: stakeValues.Value1,
      btncolor: "bg-[#1447E6]",
      discription:
        "By staking your token you will start earning rewards based on currect APY.You can unstake your tokens any time.",
    },
    {
      heading: "Unstake Tokens",
      label: "Amount to Unstake",
      label2: "Staked",
      balancevalue: "0",
      fieldvalue1: stakeValues.Value2,
      btncolor: "bg-transparent",
      discription:
        "Unstaking will withdraw your token from staking Pool.you will continue to earn rewards until you unstake your tokens.",
    },
  ];

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

  return (
    <div className="flex flex-col w-full h-fit p-5">
      <h1 className="text-2xl font-bold font-mono">Stake & Unstake</h1>
      <p className="text-sm text-gray-600 mt-2">
        Overview of your staking activity
      </p>
      {comp}
      <h1 className="text-xl font-bold font-mono mt-4">Staking Actions</h1>
      <div className="grid grid-cols-2 gap-4 mt-6 w-full">
        {cards.map((item, index) => (
          <div
            key={index}
            className="flex-1 p-6 flex flex-col justify-center items-center bg-[#4b4c4e36] border-1 border-[#4b4c4ee8] outline-0 rounded-2xl "
          >
            <h2 className="text-md font-bold text-start w-full">
              {item.heading}
            </h2>
            <div className="flex flex-row w-full justify-between mt-4">
              <h4 className="text-gray-100 font-light text-sm w-2/3 text-start">
                {item.label}
              </h4>
              <h4 className="text-gray-500 font-light text-sm w-2/3 text-end">
                {item.label2} : {item.balancevalue}{" "}
              </h4>
            </div>
            <div className="flex flex-row w-full justify-between items-center mt-2 h-12 bg-[#4b4c4e60] rounded-md ">
              <input
                type="number"
                className="text-white w-full pl-2 outline-0 border-0 bg-transparent"
                placeholder="0"
                value={index === 0 ? stakeValues.Value1 : stakeValues.Value2}
                onChange={(e) => handleInputChange(index, e.target.value)}
              />
              <div className="flex flex-row justify-center text-sm items-center bg-[#1447E6] ml-1 rounded-md mr-1.5 h-fit px-3 py-1.5 hover:cursor-pointer hover:bg-[#1449e692]">
                MAX
              </div>
            </div>

            <button
              className={`w-full h-10 mt-6 py-2 ${item.btncolor} ${
                index == 1 ? "border-[1px] border-blue-400" : "border-0"
              } rounded-md  hover:cursor-pointer ${
                index == 0 ? "hover:bg-[#1449e692]" : "hover:bg-[#4b4c4e9d]"
              } `}
            >
              {item.heading}
            </button>
            <p>
              <p className="text-gray-400 font-light text-sm w-full mt-4 text-start">
                {item.discription}
              </p>
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
