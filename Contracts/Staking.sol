 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract StakingLogic is ReentrancyGuard {
    using SafeMath for uint256;
    IERC20 public immutable StakeToken;
    IERC20 public immutable RewardToken;
    address immutable Owner;
    uint256 public RewardRate= 1e18;
    uint256 private TotalStakedToken;
    uint256 public RewardPerTokenStored;
    uint256 public LastUpdatedTime;
    


    mapping (address => uint256) public StakedBalance;            //User Staked Token Stored
    mapping (address => uint256) public Reward;                   //User Total Reward
    mapping (address => uint256) public UserRewardPerTokenPaid;   //User Reward per token


    event Stake( address indexed user, uint256 Amount); 
    event WithDraw (address indexed user , uint256 Amount);
    event ClaimReward( address indexed user , uint256 Amount ); 
    event RewardDeposited( address indexed user , uint256 Amount );

    constructor(address StakedToken_ ,  address RewardToken_) {
        StakeToken = IERC20(StakedToken_);
        RewardToken = IERC20(RewardToken_);
        Owner= msg.sender;

    }

    modifier onlyOwner {
        require ( Owner == msg.sender , "only owner can call this method" );
        _;
    }

    function RewardPerToken() public view returns (uint256)  {
        if(TotalStakedToken<=0){
            return RewardPerTokenStored;
        }
        uint256 totaltime = block.timestamp.sub(LastUpdatedTime);
        uint256 totalreward = RewardRate.mul(totaltime);
        return RewardPerTokenStored.add(totalreward.mul(1e18).div(TotalStakedToken));

            
    }

    function Earned(address User) public view returns (uint256){  
        return StakedBalance[User].mul(RewardPerToken().sub(UserRewardPerTokenPaid[User])).div(1e18).add(Reward[User]);


        // 100 * ( 0.2 - 0.1 ) + 122
        //0.1 perivous reward 
        //0.2 new reward with onward time
        //0.2 -0.1 is to cal currect reward by removing perivous reward 
        //122 is perivus token which user can withdraw
    }

    modifier UpdateReward(address User) {
        RewardPerTokenStored = RewardPerToken();
        LastUpdatedTime = block.timestamp;
        Reward[User]=Earned(User);
        UserRewardPerTokenPaid[User]= RewardPerTokenStored;
        _;
    }


    function StakeTokens(uint256 Amount) external nonReentrant UpdateReward(msg.sender) {
        require(Amount>0,"amount should be more than 0");
        StakedBalance[msg.sender] = StakedBalance[msg.sender].add(Amount);
        TotalStakedToken=TotalStakedToken.add(Amount);
        emit Stake(msg.sender, Amount );

        bool check = StakeToken.transferFrom(msg.sender, (address(this)), Amount);
        require(check,"unable to transfer tokens");
    }

    function WithDrawTokens(uint256 Amount) external nonReentrant UpdateReward(msg.sender) {
        require(Amount>0,"amount should be more than 0");
        StakedBalance[msg.sender] = StakedBalance[msg.sender].sub(Amount);
        TotalStakedToken=TotalStakedToken.sub(Amount);
        emit WithDraw(msg.sender, Amount );

        bool check = StakeToken.transfer(msg.sender, Amount);
        require(check,"unable to transfer tokens");

        
    }

    function ClaimRewards() external UpdateReward(msg.sender) nonReentrant  {
        uint reward =  Reward[msg.sender];
        require(reward > 0, "No rewards yet!");
        Reward[msg.sender] = 0;
        emit ClaimReward (msg.sender , reward );

        bool check = RewardToken.transfer(msg.sender,reward); 
        require(check,"unable to transfer reward tokens");
    }

    function DepositRewardToken(uint Amount) external onlyOwner {
        require (Amount > 0 , "amount should be more than zero" );
        
        bool check = RewardToken.transferFrom((address)(msg.sender), address(this),  Amount);
        require (check,"unable to deposit tokens");
        emit RewardDeposited(msg.sender, Amount);
    }

    function UpdateRewardRate(uint256 newRate) external onlyOwner { 
        RewardRate = newRate;
    }

    function RewardPoolBalance() external view returns (uint256) {
    return RewardToken.balanceOf(address(this));
}


    

    
}
