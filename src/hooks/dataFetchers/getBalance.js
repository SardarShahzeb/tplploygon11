import { useCallback } from "react";
import useWeb3 from "../useWeb3";
import { usdtContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";

const BalacefAccount = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const balancefAccount = useCallback(
    async (addresss) => {
      const contract = usdtContract(addresss, web3);
      try {
        const buy = await contract.methods.balanceOf(account).call();
        return buy;
      } catch (error) {
        throw error;
      }
    },
    [account]
  );
  return { BalancefAccount: balancefAccount };
};
export default BalacefAccount;
