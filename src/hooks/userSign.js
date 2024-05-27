import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect } from "react";
// import Web3 from "web3";
import { getLibraryForSign } from "../utils/web3React";
// import "react-toastify/dist/ReactToastify.css";
import useWeb3 from "../hooks/useWeb3";
import { connectorsByName } from "../utils/web3React";

import { ethers } from "ethers";
export const Signature = (data) => {
  // const { account } = useWeb3React()
  const { account } = useWeb3React();
  const web3 = useWeb3();
  var library = null;
  const connectorId = window.localStorage.getItem("connectorId");
  if (connectorId === "injected" && account) {
    library = getLibraryForSign(web3?.givenProvider);
  } else {
    if (connectorsByName.walletconnect.provider) {
      library = getLibraryForSign(connectorsByName.walletconnect.provider);
    }
  }
  const sign = useCallback(
    async (accountData) => {
      if (library && account) {
        try {
          if (account) {
            const connectorId = window.localStorage.getItem("connectorId");
            if (connectorId === "injected") {
              library = getLibraryForSign(web3?.givenProvider);
            } else {
              library = getLibraryForSign(
                connectorsByName.walletconnect.provider
              );
            }
            let signature = await library.send("personal_sign", [
              ethers.utils.hexlify(
                ethers.utils.toUtf8Bytes(account?.toLowerCase())
              ),
              account.toLowerCase(),
            ]);
            return signature;
          }
        } catch (error) {
          throw error;
        }
      }
    },
    [account, library, data, web3]
  );
  return { userSign: sign };
};
export default Signature;