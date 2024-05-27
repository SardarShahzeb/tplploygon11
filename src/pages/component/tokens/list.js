import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import BalacefAccount from "../../../hooks/dataFetchers/getBalance";
import useWeb3 from "../../../hooks/useWeb3";

const TokensLists = ({ item, index }) => {
  const [balance, setBalance] = useState(0);
  const { account } = useWeb3React();
  const { BalancefAccount } = BalacefAccount();
  const web3 = useWeb3();

  useEffect(() => {
    if (item && account) {
      fetchBalance();
    }
  }, [item, account]);

  const fetchBalance = async () => {
    try {
      if (item?.isCoin) {
        try {
          const balanceWei = await web3.eth.getBalance(account);
          const balanceEth = web3.utils.fromWei(balanceWei, "ether");
          setBalance(parseFloat(balanceEth));
        } catch (error) {
          console.error("An error occurred:", error);
        }
      } else {
        let res = await BalancefAccount(item?.address);
        if (res) {
          // const bal = res?.toString()?.slice(0, -1);
          setBalance(parseInt(res) / item?.decimals);
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  function formatBalance(balance) {
    if (balance === null || balance === undefined) return "0";
    const num = parseFloat(balance.toString());
    if (num >= 1e9) {
      return (num / 1e9).toFixed(1) + "B";
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    } else {
      return num.toString();
    }
  }

  const formattedBalance = formatBalance(balance);

  return (
    // <div className="d-flex align-items-center w-100 justify-content-between">
    //   <div className="forflex">
    //     <div className="modalmainimg">
    //       <img src={item?.igm} alt="img" className="img-fluid modalinnerimg" />
    //     </div>
    //     <p className="modalmaintext">{item?.name}</p>
    //   </div>
    //   <p className="modalmainnumber"> {balance?.toFixed(2)} </p>
    // </div>
    <>
      <div className="forflex">
        <img src={item?.igm} alt="img" className="img-fluid" />
        {item?.name}
      </div>
      {formattedBalance}
    </>
  );
};

export default TokensLists;
