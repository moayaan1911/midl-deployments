// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

interface IDebtToken {
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Transfer(address indexed from, address indexed to, uint256 value);

    function approve(address spender, uint256 amount) external returns (bool);

    function authorizedMint(address _to, uint256 _amount) external;

    function burn(address _account, uint256 _amount) external;

    function burnWithGasCompensation(address _account, uint256 _amount) external returns (bool);

    function decreaseAllowance(address spender, uint256 subtractedValue) external returns (bool);

    function enableTroveManager(address _troveManager) external;

    function flashLoan(address receiver, uint256 amount, bytes calldata data) external returns (bool);

    function increaseAllowance(address spender, uint256 addedValue) external returns (bool);

    function mint(address _account, uint256 _amount) external;

    function mintWithGasCompensation(address _account, uint256 _amount) external returns (bool);

    function permit(
        address owner,
        address spender,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external;

    function returnFromPool(address _poolAddress, address _receiver, uint256 _amount) external;

    function sendToSP(address _sender, uint256 _amount) external;

    function setLendingVaultAdapterAddress(address _lendingVaultAdapterAddress) external;

    function transfer(address recipient, uint256 amount) external returns (bool);

    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function borrowerOperationsAddress() external view returns (address);

    function DEBT_GAS_COMPENSATION() external view returns (uint256);

    function decimals() external view returns (uint8);

    function domainSeparator() external view returns (bytes32);

    function factory() external view returns (address);

    function FLASH_LOAN_FEE() external view returns (uint256);

    function flashFee(address token, uint256 amount) external view returns (uint256);

    function gasPool() external view returns (address);

    function maxFlashLoan(address token) external view returns (uint256);

    function name() external view returns (string memory);

    function nonces(address owner) external view returns (uint256);

    function permitTypeHash() external view returns (bytes32);

    function stabilityPoolAddress() external view returns (address);

    function symbol() external view returns (string memory);

    function totalSupply() external view returns (uint256);

    function troveManager(address) external view returns (bool);

    function version() external view returns (string memory);
}
