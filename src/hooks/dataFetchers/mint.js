import { useCallback } from "react";
import useWeb3 from "../useWeb3";
import { mintContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";

const Mint = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();

  const mint = useCallback(
    async (addresss, indux, amount) => {
      let nd = "";
      let gas = "";
      let details = "";
      // if (indux == 0 || indux == 1) {
      //   nd = web3.utils.toWei(amount.toString(), "mwei");
      // } else {
      nd = web3.utils.toWei(amount.toString(), "ether");
      // }
      const contract = mintContract(addresss, web3);
      try {
        gas = await contract.methods.mint(nd).estimateGas({
          from: account,
        });
        details = await contract.methods.mint(nd).send({
          from: account,
          gas,
        });
        return details;
      } catch (error) {
        throw error;
      }
    },
    [account, web3]
  );
  return { mint: mint };
};

export default Mint;
