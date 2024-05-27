import { useCallback } from "react";
import useWeb3 from "../useWeb3";
import { wMainnetContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";

const WCoin = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const CoinToken = useCallback(
    async (address, amount) => {
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = parseInt(gasPrice) + 3000000000;
      try {
        const amountInWei = web3.utils.toWei(amount.toString(), "ether");
        console.log("amountInWei", amountInWei);
        const contract = wMainnetContract(address, web3);
        const gas = await contract.methods
          .deposit()
          .estimateGas({ from: account, value: amountInWei });
        const details = await contract.methods.deposit().send({
          from: account,
          gas: gas,
          gasPrice,
          value: amountInWei,
        });
        return details;
      } catch (error) {
        throw error;
      }
    },
    [account, web3]
  );
  return { CoinToken: CoinToken };
};

export default WCoin;
