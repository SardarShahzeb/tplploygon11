import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import BalacefAccount from "../../hooks/dataFetchers/getBalance";

const TokensLists = ({ item, index }) => {
  const [balance, setBalance] = useState(0);
  const { account } = useWeb3React();
  const { BalancefAccount } = BalacefAccount();

  useEffect(() => {
    if (item && account) {
      fetchBalance();
    }
  }, [item, account]);

  const fetchBalance = async () => {
    try {
      let res = await BalancefAccount(item?.address);
      if (res) {
        // const bal = res?.toString()?.slice(0, -1);
        setBalance(parseInt(res) / item?.decimals);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  return (
    <div className="d-flex align-items-center w-100 justify-content-between">
      <div className="forflex">
        <div className="modalmainimg">
          <img src={item?.igm} alt="img" className="img-fluid modalinnerimg" />
        </div>
        <p className="modalmaintext">{item?.name}</p>
      </div>
      <p className="modalmainnumber"> {balance?.toFixed(2)} </p>
    </div>
  );
};

export default TokensLists;
