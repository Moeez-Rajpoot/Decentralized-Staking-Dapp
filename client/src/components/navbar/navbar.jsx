import React from "react";
import Wallet from "../Wallet";
export default function navbar() {
  return (
    <div className="flex flex-row justify-between items-center bg-gray-900 p-4 border-b-2 border-gray-700">
      <div className="text-3xl tracking-widest ml-3 ">STAKER-x</div>
      <Wallet/>
    </div>
  );
}
