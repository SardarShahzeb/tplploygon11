import { useEffect } from "react";
import useAuth from "./useAuth";
import { connectorsByName } from "../utils/web3React";

const ConnectorNames = {
  Injected: "injected",
  WalletConnect: "walletconnect",
  BSC: "bsc",
};

const useEagerConnect = () => {
  const { login } = useAuth();

  useEffect(() => {
    try {
      const connectorId = window.localStorage.getItem("connectorId");

      // Disable eager connect for BSC Wallet. Currently the BSC Wallet extension does not inject BinanceChain
      // into the Window object in time causing it to throw an error
      // TODO: Figure out an elegant way to listen for when the BinanceChain object is ready
      if (connectorId && connectorId !== ConnectorNames.BSC) {
        try {
          connectorsByName[connectorId].connectEagerly();
        } catch (err) {
          console.log("err", err);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  }, [login]);
};

export default useEagerConnect;
