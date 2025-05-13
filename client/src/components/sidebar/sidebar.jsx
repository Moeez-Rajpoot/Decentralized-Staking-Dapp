import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHandshakeSimple, faHouse, faUserTie } from "@fortawesome/free-solid-svg-icons";

function Sidebar({ onOptionChange, initialActive = "Dashboard" }) {
  // State to track the active option - initialized with prop value
  const [activeOption, setActiveOption] = useState(initialActive);

  const options = [
    { name: "Dashboard", icon: faHouse },
    { name: "Stake", icon: faHandshakeSimple },
    { name: "Reward", icon: faGem },
    { name: "Admin", icon: faUserTie },
  ];

  // Handle option click
  const handleOptionClick = (optionName) => {
    setActiveOption(optionName);
    
    // Call the callback function to inform parent
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
            className={`text-lg font-mono p-3.5 mt-2 hover:bg-[#101828] hover:rounded-lg hover:cursor-pointer transition-all duration-200 ${
              activeOption === option.name 
                ? "bg-[#10182850] rounded-lg font-bold outline-0 border-[1px] border-white" 
                : ""
            }`}
            onClick={() => handleOptionClick(option.name)}
          >
            <FontAwesomeIcon 
              icon={option.icon} 
              className={`mr-5 ${activeOption === option.name ? "text-white" : ""}`} 
            />
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
