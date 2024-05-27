import { useCallback, useState } from "react";
import useWeb3 from "../useWeb3";
import { nftWalletContract } from "../../utils/contractHelpers";
import { useWeb3React } from "@web3-react/core";
import Environment from "../../utils/environment";

const NFTS = () => {
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const tokenAddress = Environment.nftContract;

  const OwnNFTS = useCallback(
    async (address) => {
      let contract = nftWalletContract(tokenAddress, web3);
      try {
        const buy = await contract.methods.balanceOf(address).call();
        return buy;
      } catch (error) {
        throw error;
      }
    },
    [account]
  );
  return { OwnNFTS: OwnNFTS };
};

export default NFTS;
