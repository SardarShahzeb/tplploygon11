import { useCallback } from "react";
import useWeb3 from "../useWeb3";
import { dopContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";
// import Environment from "../../utils/Environment";

const ApproveAllowance = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  // Own address
  const tokenAddress = "0xd985892ABfc2d4d84356EA980E023b7Cb5A40Bce";

  const approveDop = useCallback(
    async (address) => {
      let gasPrice = await web3.eth.getGasPrice();
      gasPrice = parseInt(gasPrice) + 3000000000;
      try {
        const contract = dopContract(address, web3);
        let nd = web3.utils.toWei(
          "90000000000000000000000000000000000",
          "ether"
        );
        const gas = await contract.methods
          .approve(tokenAddress, nd)
          .estimateGas({ from: account });
        const details = await contract.methods.approve(tokenAddress, nd).send({
          from: account,
          gas: gas,
          gasPrice,
        });
        return details;
      } catch (error) {
        throw error;
      }
    },
    [account, web3]
  );
  return { approveAllowance: approveDop };
};
export default ApproveAllowance;
