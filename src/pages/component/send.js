import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import { Modal } from "react-bootstrap";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getData, saveData } from "../../utils/db";
// import Environment from "../../utils/Environment";
import axios from "axios";
import Loader from "../../hooks/loader";
import { ethers as ethers2 } from "ethers2";
import CryptoJS from "crypto-js";
import { Api_URL } from "../../hooks/apiUrl";
import { useRouter } from "next/router";
import DecimalPointsM from "../../hooks/dataFetchers/decimals";
import FeeTransfer from "../../hooks/dataFetchers/getFee";
import BalacefAccount from "../../hooks/dataFetchers/getBalance";

import {
  NetworkName,
  TransactionGasDetails,
  EVMGasType,
  FeeTokenDetails,
  SelectedRelayer,
  calculateGasPrice,
  getEVMGasTypeForTransaction,
} from "dop-sharedmodels";
import {
  gasEstimateForUnprovenUnshield,
  populateProvedUnshield,
  createDopWallet,
  populateProvedTransfer,
  generateTransferProof,
  generateUnshieldProof,
  loadWalletByID,
} from "dop-wallet-old";
import { gasEstimateForUnprovenTransfer } from "dop-wallet-old";
import List from "../../components/assets/list";
import { useWeb3React } from "@web3-react/core";
import useWeb3 from "../../hooks/useWeb3";
import Footer from "./footer";
import { setupNetwork } from "../../utils/wallet";

const Send = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [show3, setShow3] = useState(false);
  const pvtBalances = useSelector((state) => state.exampleValue);
  const [amount, setAmount] = useState("");
  const [fees, setFees] = useState(0);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const [showgift, setShowgift] = useState(false);
  const handleClosegift = () => setShowgift(false);
  const [off, setOff] = useState(false);
  const [assets, setAssets] = useState([]);
  const [filtBalances, setFiltBalances] = useState([]);
  const [current, setCurrent] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectAsset, setSelectAsset] = useState(null);
  const [selectedItemBalance, setSelectedItemBalance] = useState(0.0);
  const [dollarPrice, setDollarPrice] = useState(0.0);
  const [sendAccount, setSendAccount] = useState("");
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");
  const [badgepop, setBadgepop] = useState(false);
  const [decryptTransaction, setDecryptTransaction] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const { DecimalPoints } = DecimalPointsM();
  const { FeeTrans } = FeeTransfer();
  const { account,chainId } = useWeb3React();
  const [congra, setCongra] = useState(null);
  const { BalancefAccount } = BalacefAccount();
  const router = useRouter();
  const web3 = useWeb3();
  let Environment = {
    usdt: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    USDC: "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359",
    DOP: "0x49630C4E508ab3Fd339905424CE33D9fBa8FBABF",
    Dop: "0x49630C4E508ab3Fd339905424CE33D9fBa8FBABF",
    router: "0xC532a74256D3Db42D0Bf7a0400fEFDbad7694008",
    wBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
    CoinW: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
  };
  const itemsAssets = [
    {
      igm: "/assets/myprivateassets/imgtwo.svg",
      name: "USDT",
      indecBy: "0",
      address: Environment?.usdt,
      id: "tether",
    },
    {
      igm: "/assets/myprivateassets/imgthree.svg",
      name: "USDC",
      indecBy: "1",
      address: Environment?.USDC,
      id: "usd-coin",
    },
    {
      igm: "/assets/myprivateassets/dop.svg",
      name: "DOP",
      indecBy: "11",
      address: Environment?.DOP,
      id: "usd-coin",
    },
    {
      igm: "/assets/myprivateassets/wbtc.svg",
      name: "WBTC",
      indecBy: "9",
      address: Environment?.wBTC,
      id: "matic-network",
    },
    {
      igm: "/assets/myprivateassets/eth.svg",
      name: "MATIC",
      indecBy: "9",
      address: Environment?.CoinW,
      id: "matic-network",
    },
  ];

  // useEffect(() => {
  //   CheckConnected();
  // }, [account]);

  const CheckConnected = () => {
    setTimeout(() => {
      if (account) {
      } else {
        router.push("/unlockwallet");
      }
    }, [2000]);
  };

  useEffect(() => {
    getAccounts();
    // GetAPIKeys();
    setAssets(itemsAssets);
  }, []);

  const Search = (val) => {
    setSearch(val);
    if (val === "") {
      setAssets(itemsAssets);
    } else {
      let dumArr = [];
      for (let i of itemsAssets) {
        if (
          i?.name?.toLowerCase().includes(val?.toLowerCase()) ||
          i?.symbol?.toLowerCase().includes(val?.toLowerCase())
        ) {
          dumArr.push(i);
        }
      }
      setAssets(dumArr);
    }
  };

  const handleClose3 = () => {
    router.push("/");
    setShow3(false);
  };

  useEffect(() => {
    if (selectAsset) {
      getBalanceSelect();
    }
  }, [selectAsset]);

  const getBalanceSelect = async () => {
    try {
      setSelectedItemBalance(selectAsset?.balance);
      let res = await axios.get(
        `${Api_URL}/transactions/get-price?coinId=${selectAsset.id}`
      );
      if (res) {
        setDollarPrice(res?.data?.data?.market_data);
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (assets?.length > 0) {
      if (pvtBalances?.length > 0) {
        let balArr = [];
        for (let i of assets) {
          for (let io of pvtBalances) {
            if (io?.tokenAddress?.toLowerCase() === i?.address?.toLowerCase()) {
              i.amount = io?.amount;
              balArr?.push(i);
            }
          }
        }
        setFiltBalances(balArr);
      } else {
        // setFiltBalances(assets);
      }
    }
  }, [pvtBalances, assets]);

  const getAccounts = async () => {
    const feeses = await FeeTrans();
    setFees(parseInt(feeses));
    let res = await getData("accounts");
    let acc = await getData("selectedAccount");
    setCurrent(acc);
    setAccounts(res);
  };

  const chainChech=async()=>{
    if(chainId===137){
      SendEnc()
    }else{
      let a = await setupNetwork()
      if (a){
        SendEnc()
      }
    }

  }

  const SendEnc = async () => {
    setError("");
    if (account) {
      if (sendAccount?.length > 40) {
        let dumObj = null;
        dumObj = pvtBalances?.find((i) => {
          return (
            i?.tokenAddress ===
            "0x49630C4E508ab3Fd339905424CE33D9fBa8FBABF"?.toLowerCase()
          );
        });
        // 20000000000000000000n
        if ((dumObj && dumObj?.amount >= fees) || parseInt(fees) === 0) {
          // if (user?.externalWalletAddress === account?.toLowerCase()) {
          if (selectAsset) {
            console.log(
              "parseFloat(amount) <= parseFloat(selectAsset?.balance",
              parseFloat(amount),
              parseFloat(selectAsset?.balance)
            );
            if (parseFloat(amount) <= parseFloat(selectAsset?.balance)) {
              try {
                const CoingekoBaseURL = "https://pro-api.coingecko.com/api/v3";
                let dollarPrice = 1;
                let res = await axios.get(
                  `${Api_URL}/transactions/get-price?coinId=${selectAsset.id}`
                );
                // let res = await axios.get(
                //   `${CoingekoBaseURL}/coins/${selectAsset.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_pro_api_key=${apiKey}`
                // );
                if (res) {
                  dollarPrice =
                    res?.data?.data?.market_data?.current_price?.usd;
                  setLoader(true);
                  setLoadMsg("Preparing to send...");
                  const dopAddress = sendAccount;
                  const key = "dopTPL_";
                  const encryptionKey = CryptoJS.AES.decrypt(
                    current?.dopEncryptionKey,
                    key
                  ).toString(CryptoJS.enc.Utf8);
                  // const memoText = "Thank you for dinner! 🍝😋";
                  const memoText = "";
                  let decimals = await DecimalPoints(selectAsset?.address);
                  let decs = 18;
                  if (decimals === 6n) {
                    decs = 6;
                  } else if (decimals === 9n) {
                    decs = 9;
                  }
                  const tomiAmountToUnShield = BigInt(
                    amount * Math.pow(10, decs)
                  );
                  const erc20AmountRecipients = [
                    {
                      tokenAddress: selectAsset?.address,
                      amount: tomiAmountToUnShield,
                      recipientAddress: dopAddress,
                    },
                  ];
                  const sendWithPublicWallet = true;
                  const evmGasType = getEVMGasTypeForTransaction(
                    NetworkName.Polygon,
                    sendWithPublicWallet
                  );
                  const originalGasEstimate = 0n;
                  // const web3 = new Web3(
                  //   "https://light-serene-feather.matic.quiknode.pro/f0cdd8c4c146e68ce2f935bba399ca66cbe45868/"
                  // );
                  let gasPri = await web3.eth.getGasPrice();
                  let originalGasDetails;
                  switch (evmGasType) {
                    case EVMGasType.Type0:
                    case EVMGasType.Type1:
                      originalGasDetails = {
                        evmGasType,
                        originalGasEstimate,
                        gasPrice: BigInt("0x100000"),
                      };
                      break;
                    case EVMGasType.Type2:
                      const maxFeePerGas = BigInt(gasPri);
                      const maxPriorityFeePerGas = BigInt("0x10");
                      originalGasDetails = {
                        evmGasType,
                        originalGasEstimate,
                        maxFeePerGas,
                        maxPriorityFeePerGas,
                      };
                      break;
                  }
                  const selectedTokenFeeAddress =
                    "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";
                  const selectedRelayer = null;
                  const feeTokenDetails = null;
                  const creationBlockNumberMap = {
                    [NetworkName.Polygon]: 55853022,
                    [NetworkName.Polygon]: 55853022,
                  };
                  const mnemonic = current?.phrase;
                  const dopWalletInfo = await createDopWallet(
                    encryptionKey,
                    mnemonic,
                    creationBlockNumberMap
                  );
                  const dopWalletID = dopWalletInfo.id;
                  const { gasEstimate } = await gasEstimateForUnprovenTransfer(
                    NetworkName.Polygon,
                    dopWalletID,
                    encryptionKey,
                    memoText,
                    erc20AmountRecipients,
                    [], // nftAmountRecipients
                    originalGasDetails,
                    feeTokenDetails,
                    sendWithPublicWallet
                  );
                  const gases = BigInt(gasPri);
                  const transactionGasDetails = {
                    evmGasType,
                    gasEstimate,
                    gasPrice: gases,
                  };
                  generateProof(
                    selectedTokenFeeAddress,
                    undefined,
                    dopWalletInfo.id,
                    encryptionKey,
                    memoText,
                    erc20AmountRecipients,
                    sendWithPublicWallet,
                    transactionGasDetails,
                    dollarPrice
                  );
                }
              } catch (err) {
                setLoader(false);
                console.log("err", err);
                setError(err?.toString()?.slice(0, 40));
              }
            } else {
              if (parseFloat(amount) > 0) {
                setError("Send amount cannot be greater than balance!");
              } else {
                setError("Amount cannot be zero!");
              }
            }
          } else {
            setError("Please select asset that needs to be send!");
          }
          // } else {
          //   setError(
          //     `Please connect with account that was connected during signup! \n (${user?.externalWalletAddress})`
          //   );
          // }
        } else {
          setError(
            `You must have atleast ${fees} DOP encrypted to send private transaction`
          );
        }
      } else {
        setError("Invalid DOP address!");
      }
    } else {
      setError("Account not connected");
    }
  };

  const generateProof = async (
    selectedTokenFeeAddress,
    selectedRelayer,
    dopWalletID,
    encryptionKey,
    memoText,
    tokenAmountRecipients,
    sendWithPublicWallet,
    transactionGasDetails,
    dollarPrice
  ) => {
    try {
      // Token fee to pay Relayer.
      const relayerFeeERC20AmountRecipient = undefined;

      const progressCallback = (progress) => {
        // console.log("generatingSend progress", progress);
        setLoadMsg(`Generating proofs ${progress}%`);
      };

      const showSenderAddressToRecipient = false;

      await generateTransferProof(
        NetworkName.Polygon,
        dopWalletID,
        encryptionKey,
        showSenderAddressToRecipient,
        memoText,
        tokenAmountRecipients,
        [], // nftAmountRecipients
        relayerFeeERC20AmountRecipient,
        sendWithPublicWallet,
        undefined,
        progressCallback
      );

      PopulateTransaction(
        dopWalletID,
        memoText,
        tokenAmountRecipients,
        sendWithPublicWallet,
        transactionGasDetails,
        showSenderAddressToRecipient,
        undefined,
        undefined,
        dollarPrice
      );
    } catch (err) {
      console.log("err", err);
      setLoader(false);
    }
  };

  const PopulateTransaction = async (
    dopWalletID,
    memoText,
    tokenAmountRecipients,
    sendWithPublicWallet,
    transactionGasDetails,
    showSenderAddressToRecipient,
    overallBatchMinGasPrice,
    relayerFeeERC20AmountRecipient,
    dollarPrice
  ) => {
    const populateResponse = await populateProvedTransfer(
      NetworkName.Polygon,
      dopWalletID,
      showSenderAddressToRecipient,
      memoText,
      tokenAmountRecipients,
      [], // nftAmountRecipients
      relayerFeeERC20AmountRecipient,
      sendWithPublicWallet,
      overallBatchMinGasPrice,
      transactionGasDetails
    );
    const key = "dopTPL_";
    const pKey = CryptoJS.AES.decrypt(current?.privateKey, key).toString(
      CryptoJS.enc.Utf8
    );
    if (populateResponse?.transaction) {
      try {
        const transaction = populateResponse.transaction;
        // const web3 = new Web3(window.ethereum);
        let currentTransactions = await getData("sendTransactions");
        // await window.ethereum.request({
        //   method: "eth_requestAccounts",
        // });
        const transactionHash = await web3.eth.sendTransaction({
          to: transaction.to,
          gasLimit: web3.utils.toHex(transaction.gasLimit),
          // data: [transaction.data, decryptTransaction.data],
          data: transaction.data,
          from: account,
        });
        if (transactionHash) {
          setShow3(true);
          let res = await getData("selectedAccount");
          let tring = "weareDOPdev";
          let res1 = res;
          const key = "dopTPL_";
          const myPrivateKey = CryptoJS.AES.decrypt(
            res1?.privateKey,
            key
          ).toString(CryptoJS.enc.Utf8);
          let newwallet = web3.eth.accounts.privateKeyToAccount(myPrivateKey);
          let wall = newwallet.address.toLowerCase();
          web3.eth.accounts.wallet.add(newwallet);
          let signmessage = await web3.eth.sign(
            `${wall}${account.toLowerCase()}${tring}`,
            wall
          );
          let tok = localStorage.getItem("myToken");
          const postData = {
            sign: signmessage.signature,
            externalWalletAddress: account?.toLowerCase(),
            internalWalletAddress: wall,
            txHash: transactionHash?.transactionHash,
          };
          axios
            .post(`${Api_URL}/transactions/send-asset`, postData, {
              headers: {
                Authorization: `Bearer ${tok}`, // Include your authentication token here
              },
            })
            .then(async (response) => {
              console.log("response", response.data);
              let sendCount = response.data?.data?.sendCount;
              if (sendCount === 50) {
                setCongra({
                  count: sendCount,
                  img: "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188178/dop/newbadges/send/s1-active_sl4uvx.svg",
                });
                setBadgepop(true);
              } else if (sendCount === 100) {
                setCongra({
                  count: sendCount,
                  img: "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188179/dop/newbadges/send/s2-active_nwye9y.svg",
                });
                setBadgepop(true);
              } else if (sendCount === 200) {
                setCongra({
                  count: sendCount,
                  img: "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188180/dop/newbadges/send/s3-active_zgs1pg.svg",
                });
                setBadgepop(true);
              } else if (sendCount === 500) {
                setCongra({
                  count: sendCount,
                  img: "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188180/dop/newbadges/send/s4-active_stx27j.svg",
                });
                setBadgepop(true);
              }
              let dumObj = {
                hash: transactionHash,
                from: account,
                to: sendAccount,
                time: new Date(),
                amount: amount,
                asset: selectAsset,
                status: "success",
              };
              if (currentTransactions) {
                currentTransactions.push(dumObj);
              } else {
                currentTransactions = [dumObj];
              }
              setLoader(false);
              setLoadMsg("");
              await saveData("sendTransactions", currentTransactions);
            })
            .catch(async (error) => {
              console.log("error transactionHash", error);
              let dumObj = {
                hash: transactionHash,
                from: account,
                to: sendAccount,
                time: new Date(),
                amount: amount,
                asset: selectAsset,
                status: "success",
              };
              if (currentTransactions) {
                currentTransactions.push(dumObj);
              } else {
                currentTransactions = [dumObj];
              }
              setLoader(false);
              setLoadMsg("");
              await saveData("sendTransactions", currentTransactions);
            });
        }
      } catch (error) {
        setLoader(false);
        const searchString = "insufficient funds";
        const containsPhrase = JSON.stringify(error).includes(searchString);
        if (containsPhrase) {
          setError("Insufficient funds for gas fees!");
        }
        console.error("Transaction Error:", error);
      }
    } else {
      setLoader(false);
    }
    // Sign and Send Transaction
  };

  const handler3 = (e) => {
    setError("");
    // let a = parseFloat(e.target.value);
    // if (a >= 0.00001) {
    setAmount(e.target.value);
    // } else {
    //   // Optionally, you can provide feedback to the user
    //   setAmount("");
    //   setError("Amount cannot be less than 0.1");
    // }
  };

  const MoveNext = () => {
    router.push("/history");
    localStorage.setItem("pageTr", "2");
    setShow3(false);
  };

  useEffect(() => {
    let prevAcc = localStorage.getItem("currentAcc");
    if (account && account !== prevAcc) {
      reLogin();
    }
  }, [account]);

  const reLogin = async () => {
    try {
      let res = await getData("accounts");
      if (res?.length > 0) {
        setLoader(true);
        let tring = "weareDOPdev";
        let res1 = res[0];
        const key = "dopTPL_";
        const myPrivateKey = CryptoJS.AES.decrypt(
          res1?.privateKey,
          key
        ).toString(CryptoJS.enc.Utf8);
        let newwallet = web3.eth.accounts.privateKeyToAccount(myPrivateKey);
        let wall = newwallet.address.toLowerCase();
        web3.eth.accounts.wallet.add(newwallet);
        let signmessage = await web3.eth.sign(
          `${wall}${account.toLowerCase()}${tring}`,
          wall
        );
        let country = localStorage.getItem("country");
        const postData = {
          internalWalletAddress: wall,
          sign: signmessage.signature,
          externalWalletAddress: account?.toLowerCase(),
          location: country ? country : "Anonymous",
          referalByCode: "",
          blockNumber: "0",
        };
        axios
          .post(`${Api_URL}/auth/users/signup-signin`, postData)
          .then(async (response) => {
            localStorage.setItem("signValue", signmessage.signature);
            localStorage.setItem("myToken", response?.data?.data.accessToken);
            localStorage.setItem("currentAcc", account);
            setLoader(false);
          })
          .catch((error) => {
            setLoader(false);
          });
      } else {
        router.push("/");
      }
    } catch (err) {}
  };

  const OpenConfirm = () => {
    console.log("selectAssetselectAsset", selectAsset);
    if (parseFloat(amount) <= parseFloat(selectAsset?.balance)) {
      setShow2(true);
    } else {
      if (parseFloat(amount) > 0) {
        setError("Send amount cannot be greater than balance!");
      } else {
        setError("Amount cannot be zero!");
      }
    }
  };

  return (
    <>
      {loader && <Loader text={loadMsg} />}
      <Navbar />
      <section className="encrypt-section">
        <div className="custom-container">
          <div className="encrypt-parent">
            <div className="upper-content">
              <Link href="/">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M9.56994 18.82C9.37994 18.82 9.18994 18.75 9.03994 18.6L2.96994 12.53C2.67994 12.24 2.67994 11.76 2.96994 11.47L9.03994 5.4C9.32994 5.11 9.80994 5.11 10.0999 5.4C10.3899 5.69 10.3899 6.17 10.0999 6.46L4.55994 12L10.0999 17.54C10.3899 17.83 10.3899 18.31 10.0999 18.6C9.95994 18.75 9.75994 18.82 9.56994 18.82Z"
                    fill="white"
                  />
                  <path
                    d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z"
                    fill="white"
                  />
                </svg>
              </Link>
              <h6>SEND assets</h6>
              <a onClick={() => setShow2(true)}>
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 21.9375C11.7514 21.9375 11.5129 21.8388 11.3371 21.6629C11.1613 21.4871 11.0625 21.2487 11.0625 21C11.0625 20.7514 11.1613 20.5129 11.3371 20.3371C11.5129 20.1613 11.7514 20.0625 12 20.0625C13.8993 20.0625 15.7377 19.3919 17.191 18.169C18.6443 16.9462 19.6192 15.2495 19.9438 13.3781C20.2685 11.5067 19.9221 9.58078 18.9656 7.93984C18.0092 6.29889 16.5041 5.04828 14.7158 4.40847C14.4816 4.32514 14.29 4.15215 14.1833 3.92758C14.0765 3.703 14.0634 3.44522 14.1467 3.21096C14.2301 2.97669 14.4031 2.78512 14.6276 2.6784C14.8522 2.57167 15.11 2.55854 15.3442 2.64187C17.549 3.42982 19.4048 4.97092 20.5843 6.99343C21.7638 9.01595 22.1914 11.39 21.7915 13.6969C21.3917 16.0039 20.1902 18.0956 18.3988 19.6032C16.6075 21.1108 14.3413 21.9375 12 21.9375Z"
                    fill="white"
                  />
                  <path
                    d="M8.96982 21.4123C8.86299 21.4123 8.75695 21.394 8.65631 21.3582C7.61314 20.9872 6.63964 20.4438 5.77643 19.7505C5.62471 19.6291 5.51449 19.4635 5.46103 19.2767C5.40757 19.0899 5.41352 18.8911 5.47804 18.7078C5.54257 18.5245 5.66248 18.3659 5.82119 18.2537C5.97989 18.1416 6.16952 18.0816 6.36383 18.082C6.57667 18.0824 6.78314 18.1547 6.94976 18.2871C7.6492 18.8497 8.43829 19.2907 9.284 19.5916C9.49221 19.6656 9.66757 19.8109 9.77912 20.0017C9.89066 20.1924 9.93123 20.4165 9.89365 20.6343C9.85607 20.852 9.74277 21.0495 9.57373 21.1919C9.4047 21.3343 9.19081 21.4123 8.96982 21.4123ZM4.37823 17.7268C4.21959 17.7272 4.06345 17.6872 3.92455 17.6106C3.78564 17.534 3.66854 17.4232 3.58429 17.2888C2.99378 16.3518 2.56542 15.322 2.31719 14.2427C2.2616 14.0004 2.30443 13.7461 2.43627 13.5354C2.5681 13.3247 2.77817 13.175 3.02032 13.1192C3.14027 13.0914 3.26453 13.0875 3.38597 13.1078C3.50742 13.1281 3.62366 13.1722 3.72804 13.2375C3.83241 13.3028 3.92287 13.3881 3.99423 13.4885C4.06558 13.5888 4.11643 13.7022 4.14386 13.8223C4.34583 14.6967 4.69319 15.5311 5.17145 16.2905C5.26057 16.4323 5.31007 16.5954 5.3148 16.7629C5.31953 16.9303 5.27932 17.0959 5.19834 17.2425C5.11737 17.3892 4.99859 17.5114 4.85436 17.5966C4.71013 17.6817 4.54572 17.7267 4.37823 17.7268ZM2.95074 11.9839C2.82834 11.9712 2.70964 11.9346 2.60143 11.876C2.49323 11.8174 2.39764 11.738 2.32015 11.6424C2.24266 11.5468 2.18478 11.4369 2.14984 11.3189C2.1149 11.2009 2.10358 11.0772 2.11652 10.9548C2.23062 9.85338 2.52948 8.77901 3.00056 7.77685C3.05277 7.66504 3.12653 7.56463 3.21761 7.48137C3.30868 7.3981 3.4153 7.33363 3.53133 7.29164C3.64737 7.24965 3.77055 7.23097 3.89382 7.23666C4.01709 7.24236 4.13803 7.27232 4.2497 7.32483C4.36137 7.37734 4.46158 7.45137 4.5446 7.54268C4.62761 7.63398 4.69179 7.74077 4.73347 7.85692C4.77514 7.97307 4.79349 8.0963 4.78746 8.21956C4.78142 8.34281 4.75113 8.46366 4.69832 8.57519C4.31622 9.38691 4.0738 10.2573 3.98127 11.1497C3.95805 11.3804 3.8498 11.5942 3.67758 11.7495C3.50537 11.9048 3.28153 11.9904 3.04964 11.9897C3.01659 11.9896 2.98358 11.9876 2.95074 11.9839ZM5.55011 6.65918C5.36575 6.65918 5.18548 6.60482 5.03186 6.5029C4.87823 6.40098 4.75807 6.25603 4.68639 6.08618C4.61471 5.91633 4.5947 5.72911 4.62887 5.54794C4.66304 5.36678 4.74986 5.19971 4.87847 5.06763C5.64958 4.27474 6.54736 3.61582 7.53497 3.11792C7.66555 3.05274 7.80944 3.01864 7.95538 3.01831C8.1666 3.01785 8.37178 3.08872 8.5377 3.21943C8.70361 3.35014 8.82054 3.53304 8.86953 3.7385C8.91852 3.94396 8.89671 4.15994 8.80763 4.35145C8.71855 4.54297 8.56742 4.6988 8.37873 4.7937C7.57655 5.19709 6.84749 5.73182 6.22174 6.37575C6.13457 6.46569 6.03018 6.53715 5.91478 6.58584C5.79938 6.63454 5.67536 6.65948 5.55011 6.65918ZM10.8096 4.01514C10.5717 4.01506 10.3426 3.92448 10.169 3.76177C9.99529 3.59906 9.89001 3.3764 9.87445 3.13893C9.85889 2.90146 9.93423 2.66697 10.0852 2.48299C10.2361 2.29901 10.4514 2.17932 10.6873 2.14819C11.1225 2.09115 11.5609 2.06252 11.9998 2.0625C12.2485 2.0625 12.4869 2.16127 12.6627 2.33709C12.8385 2.5129 12.9373 2.75136 12.9373 3C12.9373 3.24864 12.8385 3.4871 12.6627 3.66291C12.4869 3.83873 12.2485 3.9375 11.9998 3.9375C11.643 3.93762 11.2865 3.96087 10.9327 4.00708C10.8919 4.01227 10.8508 4.01496 10.8096 4.01514Z"
                    fill="white"
                  />
                  <path
                    d="M14.25 15.9375C14.1268 15.9379 14.0048 15.9138 13.8911 15.8666C13.7773 15.8195 13.674 15.7502 13.5872 15.6628L11.3372 13.4128C11.2498 13.326 11.1805 13.2227 11.1334 13.109C11.0862 12.9952 11.0622 12.8732 11.0625 12.75V9C11.0625 8.75136 11.1613 8.5129 11.3371 8.33709C11.5129 8.16127 11.7514 8.0625 12 8.0625C12.2486 8.0625 12.4871 8.16127 12.6629 8.33709C12.8387 8.5129 12.9375 8.75136 12.9375 9V12.3618L14.9128 14.3372C15.0439 14.4683 15.1332 14.6353 15.1694 14.8171C15.2055 14.999 15.187 15.1875 15.116 15.3587C15.0451 15.53 14.9249 15.6764 14.7708 15.7795C14.6166 15.8825 14.4354 15.9375 14.25 15.9375Z"
                    fill="white"
                  />
                </svg> */}
              </a>
            </div>
            <div className="bottom-content">
              <div className="select-asset" onClick={() => setShow(true)}>
                <label>Select Asset</label>
                {selectAsset ? (
                  <div className="left-side">
                    <img
                      src={selectAsset?.igm}
                      alt="img"
                      className="img-fluid"
                    />
                    <p className="set-text-after-select">
                      {" "}
                      {selectAsset?.name}
                    </p>
                  </div>
                ) : (
                  <div className="left-side">
                    {/* <img
                      src="\assets\select-assetquest.svg"
                      alt="img"
                      className="img-fluid"
                    /> */}
                    <p>Choose asset to send</p>
                  
                  </div>
                )}
                <div className="right-side">
                {selectAsset && (
                  
                    <div className="with-balance">
                      {selectedItemBalance > 0.0 ? (
                        <h6>
                          Balance:{" "}
                          {selectedItemBalance?.toString()?.slice(0, 4)}
                        </h6>
                      ) : (
                        <h6>Balance: {0.0}</h6>
                      )}
                    </div>
                 
                )}
                </div>
                <div className="right-side">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M14.3045 7H10.2997H6.69346C6.07635 7 5.76779 7.75891 6.20492 8.20379L9.53476 11.5927C10.0683 12.1358 10.9361 12.1358 11.4697 11.5927L12.736 10.3039L14.7995 8.20379C15.2302 7.75891 14.9217 7 14.3045 7Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <div className="amount-div" style={{ marginBottom: "30px" }}>
                <img
                  src="\assets\balance-bg.png"
                  alt="img"
                  className="img-fluid balance-bg"
                />
                <p>AMOUNT</p>
                <input
                  value={amount}
                  onChange={(e) => handler3(e)}
                  type="number"
                  placeholder="0.00"
                />
                {amount && dollarPrice ? (
                  <p>
                    $
                    {(
                      parseFloat(amount) * dollarPrice?.current_price?.usd
                    )?.toFixed(4)}
                  </p>
                ) : (
                  <p></p>
                )}
                <a
                  onClick={() => setAmount(selectAsset?.balance)}
                  className="btn-max"
                >
                  MAX
                </a>
                {/* <p>$0.00</p> */}
              </div>
              <div class="material-textfield" style={{ marginBottom: "50px" }}>
                <input
                  value={sendAccount}
                  onChange={(e) => setSendAccount(e.target.value?.trim())}
                  placeholder="Enter Recipient DOP Wallet address"
                  type="text"
                />
                <label>Recipient</label>
              </div>
              <p
                className="text-center pt-3"
                style={{
                  color: "red",
                  fontSize: 12,
                  marginBottom: 10,
                  marginTop: -30,
                }}
              >
                {error}
              </p>
              <button
                disabled={
                  selectAsset === null || amount === "" || sendAccount === ""
                }
                style={{
                  opacity:
                    selectAsset === null || amount === "" || sendAccount === ""
                      ? 0.5
                      : 1,
                }}
                onClick={() => OpenConfirm()}
                className="btn-encrypt"
              >
                SEND
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />

      <Modal
        className="selectnetwork-modal common-modal-style"
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Asset</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div class="material-textfield mt-3">
            <input
              placeholder="Search..."
              type="text"
              onChange={(e) => Search(e.target.value)}
              value={search}
              className="search-field searchasset-input"
            />
            <label className="specific-left-padding">Search asset</label>
            <svg
              className="search-icon"
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
            >
              <path
                d="M8.625 16.3125C4.3875 16.3125 0.9375 12.8625 0.9375 8.625C0.9375 4.3875 4.3875 0.9375 8.625 0.9375C12.8625 0.9375 16.3125 4.3875 16.3125 8.625C16.3125 12.8625 12.8625 16.3125 8.625 16.3125ZM8.625 2.0625C5.0025 2.0625 2.0625 5.01 2.0625 8.625C2.0625 12.24 5.0025 15.1875 8.625 15.1875C12.2475 15.1875 15.1875 12.24 15.1875 8.625C15.1875 5.01 12.2475 2.0625 8.625 2.0625Z"
                fill="#A6A6A6"
              />
              <path
                d="M16.5 17.0625C16.3575 17.0625 16.215 17.01 16.1025 16.8975L14.6025 15.3975C14.385 15.18 14.385 14.82 14.6025 14.6025C14.82 14.385 15.18 14.385 15.3975 14.6025L16.8975 16.1025C17.115 16.32 17.115 16.68 16.8975 16.8975C16.785 17.01 16.6425 17.0625 16.5 17.0625Z"
                fill="#A6A6A6"
              />
            </svg>
          </div>
          <div className="select-chain">
            {filtBalances?.map((item, index) => {
              return (
                <div key={index}>
                  <List
                    setSelectAsset={setSelectAsset}
                    handleClose1={handleClose}
                    transfer={true}
                    item={item}
                    index={index}
                  />
                </div>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>

      {/* transaction summary modal here..................... */}
      <Modal
        className="summary-modal common-modal-style"
        show={show2}
        onHide={handleClose2}
        centered
      >
        <Modal.Header>
          <Modal.Title>
            <h6>Transaction Summary</h6>
            <p>Please confirm your transaction details</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="bottom-content">
            <div className="inner-text">
              <p>Amount</p>
              <h6>
                {amount} {selectAsset?.name}
              </h6>
            </div>
            <div className="inner-text">
              <p>DOP Address</p>
              <h6>
                {sendAccount?.slice(0, 20)}...
                {sendAccount?.slice(
                  sendAccount?.length - 10,
                  sendAccount?.length
                )}
              </h6>
            </div>
            <div className="inner-text">
              <p>Fees</p>
              <h6>{fees} DOP</h6>
            </div>
          </div>
          <div className="total-value">
            <div className="inner-text">
              <p>Total</p>
              <h6>
                {parseFloat(amount)} {selectAsset?.name} <br /> {fees} DOP{" "}
              </h6>
            </div>
          </div>
          <div className="twice-btn">
            <button onClick={handleClose2} className="btn-cancel">
              Cancel
            </button>
            <button
              className="btn-confirm common-box-style"
              onClick={() => {
                chainChech();
                handleClose2();
              }}
            >
              Confirm
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="successsssss-modal common-modal-style"
        show={show3}
        onHide={handleClose3}
        centered
      >
        <Modal.Body>
          <div className="inner-content">
            <img
              src="\assets\checkmark-dark.svg"
              alt="img"
              className="img-fluid noneinlight-theme"
            />
            <img
              src="\assets\checkmark-light.svg"
              alt="img"
              className="img-fluid d-none showinlight-theme"
            />
            <h6 className="main-head">Successfully Transferred</h6>
            <div className="inline-text">
              <div className="tpmodalmainimg">
                <img
                  src={selectAsset?.igm}
                  alt="img"
                  className="img-fluid tpmodalinnerimg"
                />
              </div>
              <h4>
                {amount} <h6>{selectAsset?.name}</h6>
              </h4>
            </div>
            <p className="para">
              Check transaction history for more information.
            </p>
          </div>
          <div className="twice-btns" style={{ gap: "20px" }}>
            <button onClick={() => handleClose3()} className="btn-closee">
              Close
            </button>
            <button onClick={() => MoveNext()} className="btn-explorer">
              {" "}
              View History{" "}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="important-note badges-popup"
        show={badgepop}
        onHide={() => setBadgepop(false)}
        centered
        backdrop="static"
      >
        <Modal.Body>
          <div className="badges-content desktop-view-badge">
            <h6>Congratulations</h6>
            <p>You have unlocked a new badge.</p>
            <img src={congra?.img} alt="img" className="img-fluid" />
            <h5>Send Count {congra?.sendCount}</h5>
            <Link href="/badges" className="btn-badge">
              Go to badges
            </Link>
          </div>
          <div className="badges-content mobile-view-badge d-none">
            <img src={congra?.img} alt="img" className="img-fluid" />
            <h6>Congratulations</h6>
            <p>
              You have successfully got <span> ${congra?.sendCount} Send</span>{" "}
              Badge
            </p>
            <Link href="/badges" className="btn-badge">
              Go to badges
            </Link>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Send;
