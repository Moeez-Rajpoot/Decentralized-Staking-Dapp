/* eslint-disable no-unused-vars */
import { ethers } from 'ethers';
import StakingContractabi from '../abi/Stakingabi.json';
import StakingTokenabi from '../abi/StakeTokenabi.json';
const ConnectWallet = async () => {
    try {
        let signer, provider, stakingcontract, stakingtokencontract, chainid;
        
        if (window.ethereum == null) {
            throw new Error("Please install MetaMask to use this app.");
        }
        
        // Updated for ethers v6
        provider = new ethers.BrowserProvider(window.ethereum);
        
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        signer = await provider.getSigner();
        
        // Updated for ethers v6
        const network = await provider.getNetwork();
        chainid = Number(network.chainId);
        
        let selectedaccount = accounts[0];
        if (!selectedaccount) {
            throw new Error("Please connect to MetaMask.");
        }
        
        const StakingContractAddress = import.meta.env.VITE_STAKINGCONTRACT_ADDRESS;
        const StakingTokenAddress = import.meta.env.VITE_STAKINGTOKEN_ADDRESS;
        
        stakingtokencontract = new ethers.Contract(StakingTokenAddress, StakingTokenabi, signer);
        stakingcontract = new ethers.Contract(StakingContractAddress, StakingContractabi, signer);
        
        return {
            Provider: provider,
            Account: selectedaccount,
            StakingToken: stakingtokencontract,
            StakingTokenContract: stakingcontract,
            ChainId: chainid
        };
    } catch (error) {
        console.error("Error connecting to wallet", error.message);
        // Return null instead of undefined
        return null;
    }
}

export { ConnectWallet };
