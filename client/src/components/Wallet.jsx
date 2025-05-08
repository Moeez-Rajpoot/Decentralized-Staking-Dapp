/* eslint-disable no-unused-vars */
import { useState, useEffect, Children } from "react";
import { ConnectWallet } from "../utils/WalletConnection";
import { WalletProvider } from "../context/WalletState";

const Wallet = ({Children}) => {
  const [state, setstate] = useState({
    Provider: null,
    Account: null,
    StakingToken: null,
    StakingTokenContract: null,
    ChainId: null,
  });

  const [isloading, setisloading] = useState(true);

  const handlewallet = async () => {
    try {
      setisloading(true);
      const { Provider, Account, StakingToken, StakingTokenContract, ChainId } =
        await ConnectWallet();

      setstate({
        Provider,
        Account,
        StakingToken,
        StakingTokenContract,
        ChainId,
      });
      console.log("Wallet connected successfully", state);
      console.log("Provider", Provider);
      console.log("Account", Account);
      console.log("StakingToken", StakingToken);
      console.log("StakingTokenContract", StakingTokenContract);
      console.log("ChainId", ChainId);
      setisloading(false);
    } catch (error) {
      setisloading(false);
      console.error("Error connecting to wallet", error.message);
    } finally {
      setisloading(false);
    }
  };

  return (
    <>
      <div>
        <WalletProvider value={state}>{Children}</WalletProvider>
        <button onClick={handlewallet}>Connect Wallet</button>
      </div>
    </>
  );

  //0x9e56fD8D63AcF1A6DE51Fac31A68FB3cE7482f72  StakeToken Address
  //0x84Faf1f9347dC2a7340Ec41Da70000BCDDD98185 RewardToken Address
  //0x90F43C7Ccf1a19Fa168980457eC58ADDe0614b61 StakingContract Address
};

export default Wallet;
