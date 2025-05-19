import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHandshakeSimple, faHouse, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { useWallet } from "../../context/WalletState";

function Sidebar({ onOptionChange, activeSection = "Dashboard" }) {
  const options = [
    { name: "Dashboard", icon: faHouse },
    { name: "Stake", icon: faHandshakeSimple },
    { name: "Reward", icon: faGem },
    { name: "Admin", icon: faUserTie },
  ];
  const { Account, StakingTokenContract } = useWallet();
  const [owner, setOwner] = useState(null);
  const [accountString, setAccountString] = useState(""); // Add this state

  // Convert Account to string whenever it changes
  useEffect(() => {
    if (Account) {
      setAccountString(Account.toLowerCase());
    } else {
      setAccountString("");
    }
  }, [Account]);

  const fetchData = async () => {
    console.log("Fetching data for account:", accountString);
    if (!StakingTokenContract || !accountString) {
      console.log("StakingTokenContract or Account is not available yet");
      return;
    }

    try {
      let owner = await StakingTokenContract.Owner();
      owner = String(owner).toLowerCase(); // Normalize case
      setOwner(owner);
      console.log("Owner:", owner);
      console.log("Current account:", accountString);
      console.log("Is admin:", owner === accountString);
    } catch (error) {
      console.error("Error fetching Owner:", error);
    }
  };

  // Use accountString in dependency array
  useEffect(() => {
    fetchData();
  }, [accountString, StakingTokenContract]);



  const handleOptionClick = (optionName) => {
    if (onOptionChange) {
      onOptionChange(optionName);
    }
  };
  
  return (
    <div className="sidebar flex p-4 w-1/5 min-h-fit bg-[#4b4c4e36]">
      <ul className="w-full">
        {options.map((option, index) => (
          <li
            key={index}
            className={`text-lg font-mono p-3.5 mt-2 hover:bg-[#101828] hover:rounded-lg hover:cursor-pointer ${
              activeSection === option.name 
                ? "bg-[#10182850] rounded-lg font-bold outline-0 border-[1px] border-white" 
                : ""
            }   
            ${index === 3 && owner !== accountString ? "hidden" : ""}
            `}
            onClick={() => handleOptionClick(option.name)}
          >
            <FontAwesomeIcon 
              icon={option.icon} 
              className={`mr-5 ${activeSection === option.name ? "text-white" : ""}`} 
            />
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
