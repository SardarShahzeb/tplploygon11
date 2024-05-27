import { useCallback, useState } from "react";
import useWeb3 from "../useWeb3";
import { dopContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";

const DecimalPointsM = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();

  const decimalPoints = useCallback(
    async (e) => {
      let contract = dopContract(e, web3);
      try {
        const buy = await contract.methods
          .decimals()
          .call();
        return buy;
      } catch (error) {
        throw error;
      }
    },
    [account]
  );
  return { DecimalPoints: decimalPoints };
};

export default DecimalPointsM;
