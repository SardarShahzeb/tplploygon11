import { NETWORK_CONFIG, NetworkName } from "dop-sharedmodels";
import { refreshDopBalances, createDopWallet } from "dop-wallet-old";
import Web3 from "web3";
import { gasEstimateForUnprovenTransfer } from "dop-wallet-old";
import { useState } from "react";

export default function Balances() {
  const GetBalances = async () => {
  };

  return (
    <>
      <div>
        <button style={{ marginTop: 50 }} onClick={GetBalances}>
          Get Balances...
        </button>
      </div>
    </>
  );
}