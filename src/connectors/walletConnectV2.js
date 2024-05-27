import { initializeConnector } from "@web3-react/core";
import { WalletConnect as WalletConnectV2 } from "@web3-react/walletconnect-v2";

// import { MAINNET_CHAINS } from "../chains";

// const [mainnet, ...optionalChains] = Object.keys(MAINNET_CHAINS).map(Number);

export const [walletConnectV2, hooks] = initializeConnector(
  (actions) =>
    new WalletConnectV2({
      actions,
      options: {
        projectId: "c4ec78a803d413d1caad6a1a808a6738",
        chains: [137],
        optionalChains: [137],
        showQrModal: true,
      },
      timeout: 10000,
      onError: (err) => {
        console.log("error in connector::::", err);
      },
    })
);
