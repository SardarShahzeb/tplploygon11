import web3NoAccount from "./web3";
import MintContract from "./abis/mintAbi.json";
import BusdAbi from "./abis/usdcAbi.json";
import DopAbi from "./abis/dopAbi.json";
import SmartWalletAbi from "./abis/dopSmartAbi.json"
import NftAbi from "./abis/nftAbi.json"
import CoinWAbi from "./abis/coinWAbi.json"

const getContract = (abi, address, web3) => {
  const _web3 = web3 ?? web3NoAccount;
  return new _web3.eth.Contract(abi, address);
};

export const usdtContract = (address, web3) => {
  return getContract(BusdAbi, address, web3);
};

export const dopContract = (address, web3) => {
  return getContract(DopAbi, address, web3);
};

export const mintContract = (address, web3) => {
  return getContract(MintContract, address, web3);
};

export const wMainnetContract = (address, web3) => {
  return getContract(CoinWAbi, address, web3);
};

export const smartWalletContract = (address, web3) => {
  return getContract(SmartWalletAbi, address, web3);
};

export const nftWalletContract = (address, web3) => {
  return getContract(NftAbi, address, web3);
};