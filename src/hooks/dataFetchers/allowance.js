import { useCallback, useState } from "react";
import useWeb3 from "../useWeb3";
import { dopContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";

const AllowanceTpl = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  // Own address
  const tokenAddress = "0xd985892ABfc2d4d84356EA980E023b7Cb5A40Bce";

  const allowanceTpl = useCallback(
    async (e, acco) => {
      let contract = dopContract(e, web3);
      try {
        const buy = await contract.methods
          .allowance(account, tokenAddress)
          .call();
        return buy;
      } catch (error) {
        throw error;
      }
    },
    [account]
  );
  return { allowanceTpl: allowanceTpl };
};

export default AllowanceTpl;
