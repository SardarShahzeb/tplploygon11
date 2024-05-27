import { useCallback, useState } from "react";
import useWeb3 from "../useWeb3";
import { smartWalletContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";
import Environment from "../../utils/environment";

const FeeTransfer = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const tokenAddress = Environment.dopSmartWallet;

  const FeeTrans = useCallback(
    async (e) => {
      let contract = smartWalletContract(tokenAddress, web3);
      try {
        const buy = await contract.methods
          .transferFee()
          .call();
        return buy;
      } catch (error) {
        console.log("catch err", error)
        throw error;
      }
    },
    [account]
  );
  return { FeeTrans: FeeTrans };
};

export default FeeTransfer;
