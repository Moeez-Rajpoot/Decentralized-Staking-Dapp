import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGem, faHandshakeSimple, faHouse, faUserTie } from "@fortawesome/free-solid-svg-icons";

function Sidebar() {

  const options = [
    { name: "Dashboard", icon: faHouse },
    { name: "Stake", icon: faHandshakeSimple },
    { name: "Reward", icon: faGem },
    { name: "Admin", icon: faUserTie },
  ];
  return (
    <div className="sidebar flex p-4 w-1/5 h-screen bg-blend-normal bg-gradient-to-br from-[#586FEC] to-[#0f468a] ">
      <ul className="w-full">
        {options.map((option, index) => (
          <li
            key={index}
            className="text-lg font-mono p-3.5 hover:bg-[#101828] hover:rounded-lg hover:cursor-pointer"
          >
            <FontAwesomeIcon icon={option.icon} className="mr-5" />
            {option.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
