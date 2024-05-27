import React, { useState, useEffect } from "react";
import DecimalPointsM from "../../../hooks/dataFetchers/decimals";

const AssetLists = ({
  item,
  index,
  transfer,
  setSelectAsset,
  handleClose1,
  home,
}) => {
  const [balance, setBalance] = useState(0);
  const { DecimalPoints } = DecimalPointsM();

  useEffect(() => {
    if (item) {
      fetchBalance();
    }
  }, [item]);

  const fetchBalance = async () => {
    if (item?.amount) {
      const res = await DecimalPoints(item?.address);
      if (res === 6n) {
        let amo = parseFloat(item?.amount) / 1000000;
        setBalance(amo);
      } else if (res === 18n) {
        let amo = parseFloat(item?.amount) / 1000000000000000000;
        setBalance(amo);
      } else if (res === 9n) {
        let amo = parseFloat(item?.amount) / 1000000000;
        setBalance(amo);
      }
      // amo = amo - 0.01;
    } else {
      setBalance(0.0);
    }
  };

  const AddAsset = (item) => {
    let dumObj = item;
    dumObj.balance = balance;
    setSelectAsset(dumObj);
    handleClose1();
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
    // <div className="single-row">
    //   <div className="left-text">
    //     <div className="main-img">
    //       <img src={item?.igm} alt="img" className="img-fluid coin-img" />
    //       <img
    //         src="\assets\crypto-icons\dop-small-icon.svg"
    //         alt="img"
    //         className="img-fluid dop-img"
    //       />
    //     </div>
    //     <h6>{item?.name}</h6>
    //   </div>
    //   <div className="right-text">
    //     <h6>{balance?.toFixed(2)}</h6>
    //     {/* <p>$3,167.85</p> */}
    //   </div>
    // </div>
    <>
      {home ? (
        <div className="inner-table">
          <div className="single-value">
            <div className="leftside">
              <img src={item?.igm} alt="img" className="img-fluid" />
              <h6>{item?.name}</h6>
            </div>
            <div className="rightside">
              {/* <h6>{balance?.toString()?.slice(0, 4)}</h6> */}
              <h6>{formattedBalance}</h6>
              {item?.market_data && (
                <p>
                  $
                  {(item?.market_data?.current_price?.usd * balance)?.toFixed(
                    2
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="inner-table">
          <div className="single-row">
            <div className="left-text">
              <div className="main-img">
                <img
                  // src="\assets\crypto-icons\eth.svg"
                  src={item?.igm}
                  alt="img"
                  className="img-fluid coin-img"
                />
                <img
                  src="\assets\crypto-icons\dop-small-icon.svg"
                  // src={item?.igm}
                  alt="img"
                  className="img-fluid dop-img"
                />
              </div>
              <h6>{item?.name}</h6>
            </div>
            <div className="right-text">
              {/* <h6>{balance?.toString()?.slice(0, 4)}</h6> */}
              <h6>{formattedBalance}</h6>
              {item?.market_data && (
                <p>
                  $
                  {(item?.market_data?.current_price?.usd * balance)?.toFixed(
                    2
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssetLists;
