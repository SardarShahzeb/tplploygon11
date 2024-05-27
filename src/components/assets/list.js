import React, { useState, useEffect } from "react";
import DecimalPointsM from "../../hooks/dataFetchers/decimals";

const AssetLists = ({
  item,
  index,
  transfer,
  setSelectAsset,
  handleClose1,
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

  return (
    <>
      {transfer ? (
        <div
          className="inner-chain cursor-pointer"
          onClick={() => AddAsset(item)}
          key={index}
        >
          <div className="forflex">
            <div className="modalmainimg">
              <img
                src={item?.igm}
                alt="img"
                className="img-fluid modalinnerimg"
              />
              {/* <div className="tpmainimg">
                <img
                  src="\assets\history\rightcheckimg.svg"
                  alt="img"
                  className="tpinnerimg dark"
                />
                <img
                  src="\assets\history\rightcheckimgdark.svg"
                  alt="img"
                  className="tpinnerimg white"
                />
              </div> */}
            </div>
            <p className="modalmaintext">{item?.name}</p>
          </div>
          <p className="modalmainnumber"> {balance?.toString()?.slice(0,4)}</p>
        </div>
      ) : (
        <div
          onClick={() => AddAsset(item)}
          className="d-flex align-items-center w-100 justify-content-between"
        >
          <div className="lefttable">
            <div className="leftimage">
              <img src={item?.igm} alt="img" className="leftinnerimg" />
              <div className="leftcheckimg">
                <img
                  src={"/assets/tpldashboard/history/rightcheckimg.svg"}
                  alt="img"
                  className="leftcheckinnerimg dark"
                />
                <img
                  src="\assets\tpldashboard\history\rightcheckimgdark.svg"
                  alt="img"
                  className="leftcheckinnerimg white "
                />
              </div>
            </div>
            <p className="lefttext">{item?.name}</p>
          </div>
          <h4 className="righttext">{balance?.toFixed(2)}</h4>
        </div>
      )}
    </>
  );
};

export default AssetLists;
