import Head from "next/head";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import { Modal } from "react-bootstrap";
import { Provider, useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import useEagerConnect from "../hooks/useEagerConnect";
import axios from "axios";
import Script from "next/script";
import "../styles/app.scss";
import "../styles/navbar.scss";
import "../styles/banner.scss";
import "../styles/footer.scss";
import "../styles/encrypt.scss";
import "../styles/history.scss";
import "../styles/home.scss";
import "../styles/importwallet.scss";
import "../styles/create.scss";
import "../styles/unlock.scss";
import "../styles/badges.scss";
import "../styles/termofuse.scss";
import store from "../../store/store";
import { useEffect, useState } from "react";
import {
  hooks as walletConnectV2Hooks,
  walletConnectV2,
} from "../connectors/walletConnectV2";
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask";
import {
  FallbackProviderJsonConfig,
  NetworkName,
  MerkletreeScanUpdateEvent,
} from "dop-sharedmodels";
import { Api_URL } from "../hooks/apiUrl";
import useWeb3 from "../hooks/useWeb3";
import CryptoJS from "crypto-js";

// main.ts
import { initializeEngine } from "../components/intitalizeDOP.js";
import {
  getProver,
  loadProvider,
  setLoggers,
  setOnMerkletreeScanCallback,
  setOnBalanceUpdateCallback,
} from "dop-wallet-old";
import Footer from "./component/footer";
import { ToastContainer } from "react-toastify";
import { getData } from "../utils/db";
// import ZkMe from "./component/zkMe";

export default function App({ Component, pageProps }) {
  const [rend, setRend] = useState(false);
  const [myBalances, setMyBalances] = useState("");
  const [connectors, setConnectors] = useState(null);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [showservice, setShowService] = useState(false);
  const handleCloseService = () => setShowService(false);
  const handleShowService = () => setShowService(true);

  useEffect(() => {
    const connectors = [
      [walletConnectV2, walletConnectV2Hooks],
      [metaMask, metaMaskHooks],
    ];
    setConnectors(connectors);
  }, []);

  const loadEngineProvider = async () => {
    const GOERLI_PROVIDERS_JSON = {
      chainId: 137,
      providers: [
        // The following are example providers. Use your preferred providers here.
        {
          provider:
            "https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/",
          priority: 1,
          weight: 1,
        },
        {
          provider:
            "https://polygon-mainnet.g.alchemy.com/v2/HpqPv8tECj8F2CK3Zxyk8acQgPoS0_lQ/",
          priority: 2,
          weight: 1,
        },
      ],
    };

    const shouldDebug = 0;

    try {
      const { feesSerialized } = await loadProvider(
        GOERLI_PROVIDERS_JSON,
        NetworkName.Polygon,
        shouldDebug
      );
    } catch (err) {
      console.log("err", err);
    }
  };

  // const setEngineLoggers = () => {
  //   const logMessage = console.log;
  //   const logError = console.error;

  //   setLoggers(logMessage, logError);
  // };

  const onBalanceUpdateCallback = (balancesFormatted) => {
    // automatically managed in the local database by the Engine.
    // console.log("balancesFormatted", balancesFormatted);
    // dispatch({
    //   type: "UPDATE_EXAMPLE",
    //   payload: balancesFormatted?.erc20Amounts,
    // });
    setMyBalances(balancesFormatted?.erc20Amounts);
  };

  useEffect(() => {
    if (rend) {
      try {
        initializeEngine();
        setOnBalanceUpdateCallback(onBalanceUpdateCallback);
        const groth16 = window.snarkjs.groth16;
        if (groth16) {
          getProver().setSnarkJSGroth16(groth16);
        }
        loadEngineProvider();
        // setEngineLoggers();
      } catch (err) {
        console.error("Error initializing DOP:", err);
        // Handle the error appropriately
      }
    }
  }, [rend]);

  useEffect(() => {
    toggleTheme();
    setTimeout(() => {
      setRend(true);
    }, 3000); // Adjust the delay as needed
    getBrowserName();
    // setTimeout(() => {
    //   setRend(false);
    // }, 10000); // Adjust the delay as needed
  }, []);

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    let browserName;

    if (userAgent.match(/chrome|chromium|crios/i)) {
      browserName = "Chrome";
    } else if (userAgent.match(/firefox|fxios/i)) {
      browserName = "Firefox";
    } else if (userAgent.match(/safari/i)) {
      browserName = "Safari";
    } else if (userAgent.match(/opr\//i)) {
      browserName = "Opera";
    } else if (userAgent.match(/edg/i)) {
      browserName = "Edge";
    } else {
      browserName = "Unknown";
    }

    if (
      browserName === "Firefox" ||
      browserName === "Safari" ||
      browserName === "Edge"
    ) {
      setShow(true);
    }
  };

  const Balance = ({ myBalances }) => {
    const { account } = useWeb3React();
    const pvtBalances = useSelector((state) => state.exampleValue);
    const dispatch = useDispatch();
    const web3 = useWeb3();

    useEffect(() => {
      startProgress();
    }, []);

    const startProgress = () => {
      setTimeout(() => {
        setOnMerkletreeScanCallback(onMerkletreeScanCallback);
      }, 5000);
    };

    const onMerkletreeScanCallback = (eventData) => {
      dispatch({ type: "UPDATE_PROGRESS", payload: eventData });
      // Will get called throughout a private balance scan.
      // Handle updates on scan progress and status here, i.e. progress bar or loading indicator in the UI.
    };

    useEffect(() => {
      if (myBalances !== "") {
        dispatch({ type: "UPDATE_EXAMPLE", payload: myBalances });
      }
    }, [myBalances]);

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
            .then((response) => {
              localStorage.setItem("currentAcc", account);
              localStorage.setItem("signValue", signmessage.signature);
              localStorage.setItem("myToken", response?.data?.data.accessToken);
            })
            .catch((error) => {});
        } else {
          router.push("/");
        }
      } catch (err) {}
    };

    return <></>;
  };

  const toggleTheme = () => {
    const newTheme = localStorage.getItem("theme");
    if (newTheme) {
      document.body.className = newTheme;
    }
  };

  const get_ApiKeys = async () => {
    try {
      const response = await axios({
        method: "get",
        url: "https://ip.nf/me.json",
      });
      localStorage.setItem("ip", response?.data.ip.ip);
      get_ApiKeys1(response?.data.ip.ip);
    } catch (error) {
      setShowService(false);
      console.log(error, "error");
    }
  };

  const get_ApiKeys1 = async (e) => {
    try {
      const response = await axios({
        method: "get",
        url: `https://api.iplocation.net/?ip=${e}`,
      });
      localStorage.setItem(
        "country",
        response?.data.country_name?.toLowerCase()
      );
      if (
        response?.data.country_name?.toLowerCase()?.includes("iran") ||
        response?.data.country_name?.toLowerCase()?.includes("north korea") ||
        response?.data.country_name?.toLowerCase()?.includes("syria") ||
        response?.data.country_name?.toLowerCase()?.includes("cuba") ||
        response?.data.country_name?.toLowerCase()?.includes("iraq") ||
        response?.data.country_name?.toLowerCase()?.includes("lebanon") ||
        response?.data.country_name?.toLowerCase()?.includes("northkorea") ||
        response?.data.country_name?.toLowerCase()?.includes("america") ||
        response?.data.country_name?.toLowerCase()?.includes("usa")
      ) {
        setShowService(true);
      }
      //  }
      else {
        setShowService(false);
      }
    } catch (error) {
      setShowService(false);
      console.log(error, "error");
    }
  };
  useEffect(() => {
    get_ApiKeys();
  }, []);

  useEagerConnect();
  return (
    <Provider store={store}>
      {connectors && (
        <Web3ReactProvider connectors={connectors}>
          <ToastContainer />
          {/* <Head>
            <link
              rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css"
            />
          </Head> */}
          <Balance myBalances={myBalances} />
          <Component {...pageProps} myBalances={myBalances} />
          {/* <ZkMe /> */}
          {/* <Modal
            className="important-note"
            show={show}
            onHide={handleClose}
            centered
          >
            <Modal.Body>
              <div className="best-experience">
                <h6>For best experience use on</h6>
                <svg
                  className="noneinlight-theme"
                  xmlns="http://www.w3.org/2000/svg"
                  width="202"
                  height="55"
                  viewBox="0 0 202 55"
                  fill="none"
                >
                  <g clip-path="url(#clip0_429_3487)">
                    <path
                      d="M4.41254 12.6513V33.7591H16.8754L27.8226 15.0151H52.6136C47.999 6.09262 38.635 0 27.8226 0C17.987 0 9.36401 5.02724 4.41254 12.6513Z"
                      fill="#DB4437"
                    />
                    <path
                      d="M4.41254 12.6513V33.7591H16.8754L27.8226 15.0151H52.6136C47.999 6.09262 38.635 0 27.8226 0C17.987 0 9.36401 5.02724 4.41254 12.6513Z"
                      fill="url(#paint0_linear_429_3487)"
                    />
                    <path
                      d="M4.41254 12.6513L16.9091 33.7924L17.1786 33.6259L4.61464 12.3184C4.54727 12.4516 4.4799 12.5515 4.41254 12.6513Z"
                      fill="#3E2723"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591H16.8754L4.41254 12.6513C1.61681 16.9128 0 22.04 0 27.5C0 42.2488 11.7555 54.3008 26.5089 54.9667Z"
                      fill="#0F9D58"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591H16.8754L4.41254 12.6513C1.61681 16.9128 0 22.04 0 27.5C0 42.2488 11.7555 54.3008 26.5089 54.9667Z"
                      fill="url(#paint1_linear_429_3487)"
                    />
                    <path
                      d="M26.1721 54.9667C26.2731 54.9667 26.4079 54.9667 26.5089 55L38.5339 34.1919L38.2645 34.0254L26.1721 54.9667Z"
                      fill="#263238"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591L26.5089 54.9667Z"
                      fill="#FFCD40"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591L26.5089 54.9667Z"
                      fill="url(#paint2_linear_429_3487)"
                    />
                    <path
                      d="M27.8226 15.0151L38.7697 33.7591L26.5089 54.9667C26.9468 55 27.3847 55 27.8226 55C43.1823 55 55.6452 42.6816 55.6452 27.5C55.6452 23.0055 54.5336 18.744 52.6136 15.0151H27.8226Z"
                      fill="#FFCD40"
                    />
                    <path
                      d="M27.8226 15.0151L38.7697 33.7591L26.5089 54.9667C26.9468 55 27.3847 55 27.8226 55C43.1823 55 55.6452 42.6816 55.6452 27.5C55.6452 23.0055 54.5336 18.744 52.6136 15.0151H27.8226Z"
                      fill="url(#paint3_linear_429_3487)"
                    />
                    <path
                      d="M52.6136 15.0151H27.8226V21.5406L52.6136 15.0151Z"
                      fill="url(#paint4_radial_429_3487)"
                    />
                    <path
                      d="M4.41254 12.6513L16.8754 33.7591L22.5343 30.5297L4.41254 12.6513Z"
                      fill="url(#paint5_radial_429_3487)"
                    />
                    <path
                      d="M38.7697 33.7591L33.1446 30.5297L26.5089 54.9667L38.7697 33.7591Z"
                      fill="url(#paint6_radial_429_3487)"
                    />
                    <path
                      d="M27.8226 39.9849C34.7987 39.9849 40.4539 34.3952 40.4539 27.5C40.4539 20.6048 34.7987 15.0151 27.8226 15.0151C20.8465 15.0151 15.1913 20.6048 15.1913 27.5C15.1913 34.3952 20.8465 39.9849 27.8226 39.9849Z"
                      fill="#F1F1F1"
                    />
                    <path
                      d="M27.8226 37.4879C33.4034 37.4879 37.9276 33.0162 37.9276 27.5C37.9276 21.9838 33.4034 17.5121 27.8226 17.5121C22.2417 17.5121 17.7175 21.9838 17.7175 27.5C17.7175 33.0162 22.2417 37.4879 27.8226 37.4879Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M52.4452 14.6822H27.8226C20.8501 14.6822 15.1913 20.2754 15.1913 27.1671V27.4667C15.1913 20.5751 20.8501 14.9818 27.8226 14.9818H52.58C52.5463 14.882 52.5126 14.7821 52.4452 14.6822Z"
                      fill="#3E2723"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M28.0247 39.9849H27.8226C23.1406 39.9849 19.0649 37.4546 16.8754 33.7258L4.41254 12.6513C4.37885 12.6846 4.34517 12.7512 4.31149 12.7845L16.8754 34.0587C19.0649 37.7875 23.1406 40.3178 27.8226 40.3178C31.3257 40.3178 34.5256 38.8862 36.8161 36.589C34.5593 38.6864 31.4941 39.9849 28.1594 39.9849C28.092 40.0182 28.0584 39.9849 28.0247 39.9849Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      d="M33.6835 38.5866C33.8519 38.52 33.9867 38.4201 34.1551 38.3202C33.9867 38.4201 33.8182 38.4867 33.6835 38.5866Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      opacity="0.1"
                      d="M40.4202 28.4988V28.299C40.4547 28.3323 40.4547 28.3989 40.4202 28.4988Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M36.8161 36.589L37.6245 35.79L37.7592 35.5569C37.4561 35.9231 37.1529 36.2561 36.8161 36.589Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M40.1171 24.5036C40.4202 25.6023 40.5886 26.7343 40.5886 27.9328C40.5886 29.8305 40.1507 31.595 39.376 33.2264C40.2518 31.5285 40.7907 29.5642 40.7907 27.5C40.7907 20.6084 35.1319 15.0151 28.1594 15.0151H27.991C33.8519 15.0817 38.7697 19.1102 40.1171 24.5036Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M40.3528 29.2312C40.3528 29.1647 40.3528 29.1314 40.3873 29.0648C40.3528 29.1314 40.3528 29.1979 40.3528 29.2312Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M32.4372 39.1525C32.572 39.086 32.7404 39.0527 32.8751 38.9861C32.7404 39.0194 32.572 39.086 32.4372 39.1525Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M34.1214 38.3202C34.1888 38.2869 34.2224 38.2536 34.2898 38.2204C34.2561 38.2536 34.1888 38.2869 34.1214 38.3202Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M27.991 39.9849H28.0247C29.271 39.9516 30.4836 39.7518 31.6288 39.4189C30.4836 39.7851 29.271 39.9849 27.991 39.9849Z"
                      fill="#3E2723"
                    />
                    <path
                      d="M38.7697 33.7591C37.6918 35.5902 36.1424 37.155 34.2898 38.2536C34.2224 38.2869 34.1888 38.3202 34.1214 38.3535C33.953 38.4534 33.8182 38.52 33.6498 38.6199C33.5825 38.6532 33.5151 38.6865 33.414 38.753C33.2456 38.8529 33.0435 38.9195 32.8414 39.0194C32.7067 39.086 32.5383 39.1526 32.4035 39.1858C32.3362 39.2191 32.2688 39.2524 32.2014 39.2524C32.033 39.319 31.8983 39.3523 31.7299 39.4189C31.6962 39.4189 31.6625 39.4522 31.6288 39.4522C30.4836 39.8184 29.271 40.0182 28.0247 40.0182H28.1257C31.4941 40.0182 34.5256 38.7197 36.7824 36.6223C37.1192 36.2894 37.4224 35.9231 37.7255 35.5569L38.7697 33.7591Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      opacity="0.1"
                      d="M38.7697 33.7591C37.6918 35.5902 36.1424 37.155 34.2898 38.2536C34.2224 38.2869 34.1888 38.3202 34.1214 38.3535C33.953 38.4534 33.8182 38.52 33.6498 38.6199C33.5825 38.6532 33.5151 38.6865 33.414 38.753C33.2456 38.8529 33.0435 38.9195 32.8414 39.0194C32.7067 39.086 32.5383 39.1526 32.4035 39.1858C32.3362 39.2191 32.2688 39.2524 32.2014 39.2524C32.033 39.319 31.8983 39.3523 31.7299 39.4189C31.6962 39.4189 31.6625 39.4522 31.6288 39.4522C30.4836 39.8184 29.271 40.0182 28.0247 40.0182H28.1257C31.4941 40.0182 34.5256 38.7197 36.7824 36.6223C37.1192 36.2894 37.4224 35.9231 37.7255 35.5569L38.7697 33.7591Z"
                      fill="#3E2723"
                    />
                    <path
                      d="M40.1171 24.5036C40.0834 24.3705 40.0497 24.2706 40.016 24.1374C40.2518 24.9365 40.3865 25.7355 40.4539 26.6011V26.6677C40.4876 26.934 40.4876 27.2337 40.4876 27.5C40.4876 27.7664 40.4876 27.9994 40.4539 28.2658V28.4655C40.4539 28.6653 40.4202 28.865 40.3865 29.0648C40.3865 29.1314 40.3865 29.1647 40.3528 29.2312C40.1171 30.8626 39.5781 32.3608 38.7697 33.7258L37.7255 35.5236L37.5908 35.7567L26.5089 54.9334H26.8794L38.9044 34.1253C39.0729 33.8257 39.2413 33.4927 39.4097 33.1598C40.1844 31.5618 40.6223 29.7639 40.6223 27.8662C40.5886 26.7343 40.4202 25.6023 40.1171 24.5036Z"
                      fill="white"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M27.8226 0.299637C43.1486 0.299637 55.5441 12.5182 55.6452 27.6332V27.4667C55.6452 12.3184 43.1823 0 27.8226 0C12.4629 0 0 12.3184 0 27.5V27.6665C0.101051 12.5515 12.4966 0.299637 27.8226 0.299637Z"
                      fill="white"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M27.8226 54.7004C43.1486 54.7004 55.5441 42.4818 55.6452 27.3668V27.5333C55.6452 42.7149 43.1823 55.0333 27.8226 55.0333C12.4629 55.0333 0 42.6816 0 27.5V27.3335C0.101051 42.4485 12.4966 54.7004 27.8226 54.7004Z"
                      fill="#3E2723"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M27.8226 55C43.1886 55 55.6452 42.6878 55.6452 27.5C55.6452 12.3122 43.1886 0 27.8226 0C12.4566 0 0 12.3122 0 27.5C0 42.6878 12.4566 55 27.8226 55Z"
                      fill="url(#paint7_radial_429_3487)"
                    />
                    <path
                      d="M70.8027 28.1992C70.8027 22.273 75.0132 17.7452 81.0088 17.7452C85.7582 17.7452 88.4192 20.5418 89.6318 23.3051L86.2972 24.8699C85.4214 22.6059 83.4677 21.2076 80.8404 21.2076C77.6742 21.2076 74.6763 24.0042 74.6763 28.3323C74.6763 32.4939 77.6742 35.457 80.8404 35.457C83.6698 35.457 85.5898 34.0587 86.6677 31.7948L90.0023 33.1931C88.756 35.9897 85.9603 38.753 81.2109 38.753C75.0132 38.6532 70.8027 34.1253 70.8027 28.1992ZM96.3348 18.4443L96.1664 21.2409H96.3348C97.379 19.5097 99.8716 17.9449 102.667 17.9449C107.787 17.9449 110.246 21.2409 110.246 26.135V38.1538H106.541V26.6344C106.541 22.6392 104.419 21.2409 101.623 21.2409C98.4569 21.2409 96.3348 24.204 96.3348 27.3335V38.1205H92.6296V9.58838H96.3348V18.4443ZM114.12 38.1205V18.4443H117.656V21.5739H117.825C118.701 19.3099 121.53 17.9116 123.652 17.9116C124.898 17.9116 125.606 18.0781 126.482 18.4443L125.067 21.9401C124.528 21.7736 123.821 21.6071 123.113 21.6071C120.654 21.6071 117.993 23.7046 117.993 27.3668V38.1538H114.12V38.1205ZM146.894 28.1992C146.894 34.1253 142.683 38.6532 136.688 38.6532C130.692 38.6532 126.482 34.1253 126.482 28.1992C126.482 22.273 130.692 17.7452 136.688 17.7452C142.683 17.7452 146.894 22.273 146.894 28.1992ZM143.189 28.1992C143.189 23.6713 140.022 21.0745 136.688 21.0745C133.353 21.0745 130.187 23.6713 130.187 28.1992C130.187 32.727 133.353 35.3239 136.688 35.3239C140.022 35.3239 143.189 32.727 143.189 28.1992ZM149.858 18.4443H153.395V21.2409H153.563C154.607 19.3099 157.268 17.9449 159.727 17.9449C162.893 17.9449 165.015 19.3432 166.06 21.7736C167.474 19.5097 169.933 17.9449 172.931 17.9449C177.681 17.9449 179.971 21.2409 179.971 26.135V38.1538H176.097V26.6344C176.097 22.6392 174.514 21.2409 171.685 21.2409C168.687 21.2409 166.565 24.204 166.565 27.3335V38.1205H162.86V26.6344C162.86 22.6392 161.277 21.2409 158.447 21.2409C155.449 21.2409 153.327 24.204 153.327 27.3335V38.1205H149.622V18.4443H149.858ZM182.632 28.1992C182.632 22.6392 186.506 17.7452 192.333 17.7452C198.16 17.7452 202.034 21.9068 202.034 28.1992V28.8983H186.371C186.539 33.0599 189.537 35.3239 192.703 35.3239C194.825 35.3239 197.116 34.4582 198.16 32.0278L201.495 33.4262C200.248 36.2228 197.453 38.8196 192.872 38.8196C186.674 38.6532 182.632 34.1253 182.632 28.1992ZM192.299 21.2409C189.47 21.2409 187.381 23.1719 186.674 25.9352H198.126C197.958 24.204 196.543 21.2409 192.299 21.2409Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_429_3487"
                      x1="8.37911"
                      y1="23.7086"
                      x2="24.8806"
                      y2="13.9563"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#A52714" stop-opacity="0.6" />
                      <stop
                        offset="0.66"
                        stop-color="#A52714"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_429_3487"
                      x1="34.0291"
                      y1="46.3788"
                      x2="15.6949"
                      y2="35.5129"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#055524" stop-opacity="0.4" />
                      <stop
                        offset="0.33"
                        stop-color="#055524"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_429_3487"
                      x1="25.9383"
                      y1="15.3371"
                      x2="30.4814"
                      y2="35.4644"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EA6100" stop-opacity="0.3" />
                      <stop
                        offset="0.66"
                        stop-color="#EA6100"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_429_3487"
                      x1="34.983"
                      y1="13.2956"
                      x2="39.5261"
                      y2="33.4229"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EA6100" stop-opacity="0.3" />
                      <stop
                        offset="0.66"
                        stop-color="#EA6100"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <radialGradient
                      id="paint4_radial_429_3487"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(26.6181 14.9858) scale(26.5857 26.2775)"
                    >
                      <stop stop-color="#3E2723" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#3E2723" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_429_3487"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(4.38896 12.664) scale(24.6779 24.3918)"
                    >
                      <stop stop-color="#3E2723" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#3E2723" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint6_radial_429_3487"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(27.7754 27.5466) scale(27.7849 27.4627)"
                    >
                      <stop stop-color="#263238" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#263238" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint7_radial_429_3487"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(8.31174 7.50524) scale(55.889 55.241)"
                    >
                      <stop stop-color="white" stop-opacity="0.1" />
                      <stop offset="1" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <clipPath id="clip0_429_3487">
                      <rect width="202" height="55" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <svg
                  className="showinlight-theme"
                  xmlns="http://www.w3.org/2000/svg"
                  width="202"
                  height="55"
                  viewBox="0 0 202 55"
                  fill="none"
                >
                  <g clip-path="url(#clip0_438_3544)">
                    <path
                      d="M4.4126 12.6513V33.7591H16.8755L27.8226 15.0151H52.6137C47.9991 6.09262 38.635 0 27.8226 0C17.9871 0 9.36407 5.02724 4.4126 12.6513Z"
                      fill="#DB4437"
                    />
                    <path
                      d="M4.4126 12.6513V33.7591H16.8755L27.8226 15.0151H52.6137C47.9991 6.09262 38.635 0 27.8226 0C17.9871 0 9.36407 5.02724 4.4126 12.6513Z"
                      fill="url(#paint0_linear_438_3544)"
                    />
                    <path
                      d="M4.4126 12.6513L16.9092 33.7924L17.1786 33.6259L4.6147 12.3184C4.54733 12.4516 4.47996 12.5515 4.4126 12.6513Z"
                      fill="#3E2723"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591H16.8754L4.41254 12.6513C1.61681 16.9128 0 22.04 0 27.5C0 42.2488 11.7555 54.3008 26.5089 54.9667Z"
                      fill="#0F9D58"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591H16.8754L4.41254 12.6513C1.61681 16.9128 0 22.04 0 27.5C0 42.2488 11.7555 54.3008 26.5089 54.9667Z"
                      fill="url(#paint1_linear_438_3544)"
                    />
                    <path
                      d="M26.1721 54.9667C26.2732 54.9667 26.4079 54.9667 26.509 55L38.534 34.1919L38.2645 34.0254L26.1721 54.9667Z"
                      fill="#263238"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591L26.5089 54.9667Z"
                      fill="#FFCD40"
                    />
                    <path
                      d="M26.5089 54.9667L38.7697 42.8481V33.7591L26.5089 54.9667Z"
                      fill="url(#paint2_linear_438_3544)"
                    />
                    <path
                      d="M27.8226 15.0151L38.7697 33.7591L26.5089 54.9667C26.9468 55 27.3847 55 27.8226 55C43.1822 55 55.6451 42.6816 55.6451 27.5C55.6451 23.0055 54.5336 18.744 52.6136 15.0151H27.8226Z"
                      fill="#FFCD40"
                    />
                    <path
                      d="M27.8226 15.0151L38.7697 33.7591L26.5089 54.9667C26.9468 55 27.3847 55 27.8226 55C43.1822 55 55.6451 42.6816 55.6451 27.5C55.6451 23.0055 54.5336 18.744 52.6136 15.0151H27.8226Z"
                      fill="url(#paint3_linear_438_3544)"
                    />
                    <path
                      d="M52.6137 15.0151H27.8226V21.5406L52.6137 15.0151Z"
                      fill="url(#paint4_radial_438_3544)"
                    />
                    <path
                      d="M4.4126 12.6513L16.8755 33.7591L22.5343 30.5297L4.4126 12.6513Z"
                      fill="url(#paint5_radial_438_3544)"
                    />
                    <path
                      d="M38.7697 33.7591L33.1446 30.5297L26.5089 54.9667L38.7697 33.7591Z"
                      fill="url(#paint6_radial_438_3544)"
                    />
                    <path
                      d="M27.8226 39.9849C34.7987 39.9849 40.4539 34.3952 40.4539 27.5C40.4539 20.6048 34.7987 15.0151 27.8226 15.0151C20.8465 15.0151 15.1913 20.6048 15.1913 27.5C15.1913 34.3952 20.8465 39.9849 27.8226 39.9849Z"
                      fill="#F1F1F1"
                    />
                    <path
                      d="M27.8226 37.4879C33.4034 37.4879 37.9276 33.0162 37.9276 27.5C37.9276 21.9838 33.4034 17.5121 27.8226 17.5121C22.2417 17.5121 17.7175 21.9838 17.7175 27.5C17.7175 33.0162 22.2417 37.4879 27.8226 37.4879Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M52.4452 14.6822H27.8226C20.8501 14.6822 15.1913 20.2754 15.1913 27.1671V27.4667C15.1913 20.5751 20.8501 14.9818 27.8226 14.9818H52.58C52.5463 14.882 52.5126 14.7821 52.4452 14.6822Z"
                      fill="#3E2723"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M28.0247 39.9849H27.8226C23.1406 39.9849 19.0649 37.4546 16.8755 33.7258L4.41257 12.6513C4.37889 12.6846 4.34521 12.7512 4.31152 12.7845L16.8755 34.0587C19.0649 37.7875 23.1406 40.3178 27.8226 40.3178C31.3257 40.3178 34.5256 38.8862 36.8161 36.589C34.5593 38.6864 31.4941 39.9849 28.1594 39.9849C28.0921 40.0182 28.0584 39.9849 28.0247 39.9849Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      d="M33.6836 38.5866C33.852 38.52 33.9867 38.4201 34.1552 38.3202C33.9867 38.4201 33.8183 38.4867 33.6836 38.5866Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      opacity="0.1"
                      d="M40.4203 28.4988V28.299C40.4548 28.3323 40.4548 28.3989 40.4203 28.4988Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M36.8162 36.589L37.6246 35.79L37.7593 35.5569C37.4561 35.9231 37.153 36.2561 36.8162 36.589Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M40.117 24.5036C40.4202 25.6023 40.5886 26.7343 40.5886 27.9328C40.5886 29.8305 40.1507 31.595 39.376 33.2264C40.2518 31.5285 40.7907 29.5642 40.7907 27.5C40.7907 20.6084 35.1319 15.0151 28.1594 15.0151H27.991C33.8519 15.0817 38.7697 19.1102 40.117 24.5036Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M40.3529 29.2312C40.3529 29.1647 40.3529 29.1314 40.3874 29.0648C40.3529 29.1314 40.3529 29.1979 40.3529 29.2312Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M32.4373 39.1525C32.572 39.086 32.7404 39.0527 32.8751 38.9861C32.7404 39.0194 32.572 39.086 32.4373 39.1525Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M34.1215 38.3202C34.1888 38.2869 34.2225 38.2536 34.2899 38.2204C34.2562 38.2536 34.1888 38.2869 34.1215 38.3202Z"
                      fill="#3E2723"
                    />
                    <path
                      opacity="0.1"
                      d="M27.991 39.9849H28.0246C29.2709 39.9516 30.4835 39.7518 31.6288 39.4189C30.4835 39.7851 29.2709 39.9849 27.991 39.9849Z"
                      fill="#3E2723"
                    />
                    <path
                      d="M38.7697 33.7591C37.6918 35.5902 36.1424 37.155 34.2898 38.2536C34.2224 38.2869 34.1887 38.3202 34.1214 38.3535C33.953 38.4534 33.8182 38.52 33.6498 38.6199C33.5824 38.6532 33.5151 38.6865 33.414 38.753C33.2456 38.8529 33.0435 38.9195 32.8414 39.0194C32.7067 39.086 32.5382 39.1526 32.4035 39.1858C32.3361 39.2191 32.2688 39.2524 32.2014 39.2524C32.033 39.319 31.8983 39.3523 31.7298 39.4189C31.6962 39.4189 31.6625 39.4522 31.6288 39.4522C30.4836 39.8184 29.2709 40.0182 28.0247 40.0182H28.1257C31.4941 40.0182 34.5256 38.7197 36.7824 36.6223C37.1192 36.2894 37.4224 35.9231 37.7255 35.5569L38.7697 33.7591Z"
                      fill="white"
                      fill-opacity="0.1"
                    />
                    <path
                      opacity="0.1"
                      d="M38.7697 33.7591C37.6918 35.5902 36.1424 37.155 34.2898 38.2536C34.2224 38.2869 34.1887 38.3202 34.1214 38.3535C33.953 38.4534 33.8182 38.52 33.6498 38.6199C33.5824 38.6532 33.5151 38.6865 33.414 38.753C33.2456 38.8529 33.0435 38.9195 32.8414 39.0194C32.7067 39.086 32.5382 39.1526 32.4035 39.1858C32.3361 39.2191 32.2688 39.2524 32.2014 39.2524C32.033 39.319 31.8983 39.3523 31.7298 39.4189C31.6962 39.4189 31.6625 39.4522 31.6288 39.4522C30.4836 39.8184 29.2709 40.0182 28.0247 40.0182H28.1257C31.4941 40.0182 34.5256 38.7197 36.7824 36.6223C37.1192 36.2894 37.4224 35.9231 37.7255 35.5569L38.7697 33.7591Z"
                      fill="#3E2723"
                    />
                    <path
                      d="M40.117 24.5036C40.0834 24.3705 40.0497 24.2706 40.016 24.1374C40.2518 24.9365 40.3865 25.7355 40.4539 26.6011V26.6677C40.4876 26.934 40.4876 27.2337 40.4876 27.5C40.4876 27.7664 40.4876 27.9994 40.4539 28.2658V28.4655C40.4539 28.6653 40.4202 28.865 40.3865 29.0648C40.3865 29.1314 40.3865 29.1647 40.3528 29.2312C40.117 30.8626 39.5781 32.3608 38.7697 33.7258L37.7255 35.5236L37.5908 35.7567L26.5089 54.9334H26.8794L38.9044 34.1253C39.0729 33.8257 39.2413 33.4927 39.4097 33.1598C40.1844 31.5618 40.6223 29.7639 40.6223 27.8662C40.5886 26.7343 40.4202 25.6023 40.117 24.5036Z"
                      fill="white"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M27.8226 0.299637C43.1486 0.299637 55.5441 12.5182 55.6452 27.6332V27.4667C55.6452 12.3184 43.1823 0 27.8226 0C12.4629 0 0 12.3184 0 27.5V27.6665C0.101051 12.5515 12.4966 0.299637 27.8226 0.299637Z"
                      fill="white"
                      fill-opacity="0.2"
                    />
                    <path
                      d="M27.8226 54.7004C43.1486 54.7004 55.5441 42.4818 55.6452 27.3668V27.5333C55.6452 42.7149 43.1823 55.0333 27.8226 55.0333C12.4629 55.0333 0 42.6816 0 27.5V27.3335C0.101051 42.4485 12.4966 54.7004 27.8226 54.7004Z"
                      fill="#3E2723"
                      fill-opacity="0.15"
                    />
                    <path
                      d="M27.8226 55C43.1886 55 55.6452 42.6878 55.6452 27.5C55.6452 12.3122 43.1886 0 27.8226 0C12.4566 0 0 12.3122 0 27.5C0 42.6878 12.4566 55 27.8226 55Z"
                      fill="url(#paint7_radial_438_3544)"
                    />
                    <path
                      d="M70.8027 28.1992C70.8027 22.273 75.0132 17.7452 81.0088 17.7452C85.7582 17.7452 88.4192 20.5418 89.6318 23.3051L86.2972 24.8699C85.4214 22.6059 83.4677 21.2076 80.8404 21.2076C77.6742 21.2076 74.6763 24.0042 74.6763 28.3323C74.6763 32.4939 77.6742 35.457 80.8404 35.457C83.6698 35.457 85.5898 34.0587 86.6677 31.7948L90.0023 33.1931C88.756 35.9897 85.9603 38.753 81.2109 38.753C75.0132 38.6532 70.8027 34.1253 70.8027 28.1992ZM96.3348 18.4443L96.1664 21.2409H96.3348C97.379 19.5097 99.8716 17.9449 102.667 17.9449C107.787 17.9449 110.246 21.2409 110.246 26.135V38.1538H106.541V26.6344C106.541 22.6392 104.419 21.2409 101.623 21.2409C98.4569 21.2409 96.3348 24.204 96.3348 27.3335V38.1205H92.6296V9.58838H96.3348V18.4443ZM114.12 38.1205V18.4443H117.656V21.5739H117.825C118.701 19.3099 121.53 17.9116 123.652 17.9116C124.898 17.9116 125.606 18.0781 126.482 18.4443L125.067 21.9401C124.528 21.7736 123.821 21.6071 123.113 21.6071C120.654 21.6071 117.993 23.7046 117.993 27.3668V38.1538H114.12V38.1205ZM146.894 28.1992C146.894 34.1253 142.683 38.6532 136.688 38.6532C130.692 38.6532 126.482 34.1253 126.482 28.1992C126.482 22.273 130.692 17.7452 136.688 17.7452C142.683 17.7452 146.894 22.273 146.894 28.1992ZM143.189 28.1992C143.189 23.6713 140.022 21.0745 136.688 21.0745C133.353 21.0745 130.187 23.6713 130.187 28.1992C130.187 32.727 133.353 35.3239 136.688 35.3239C140.022 35.3239 143.189 32.727 143.189 28.1992ZM149.858 18.4443H153.395V21.2409H153.563C154.607 19.3099 157.268 17.9449 159.727 17.9449C162.893 17.9449 165.015 19.3432 166.06 21.7736C167.474 19.5097 169.933 17.9449 172.931 17.9449C177.681 17.9449 179.971 21.2409 179.971 26.135V38.1538H176.097V26.6344C176.097 22.6392 174.514 21.2409 171.685 21.2409C168.687 21.2409 166.565 24.204 166.565 27.3335V38.1205H162.86V26.6344C162.86 22.6392 161.277 21.2409 158.447 21.2409C155.449 21.2409 153.327 24.204 153.327 27.3335V38.1205H149.622V18.4443H149.858ZM182.632 28.1992C182.632 22.6392 186.506 17.7452 192.333 17.7452C198.16 17.7452 202.034 21.9068 202.034 28.1992V28.8983H186.371C186.539 33.0599 189.537 35.3239 192.703 35.3239C194.825 35.3239 197.116 34.4582 198.16 32.0278L201.495 33.4262C200.248 36.2228 197.453 38.8196 192.872 38.8196C186.674 38.6532 182.632 34.1253 182.632 28.1992ZM192.299 21.2409C189.47 21.2409 187.381 23.1719 186.674 25.9352H198.126C197.958 24.204 196.543 21.2409 192.299 21.2409Z"
                      fill="black"
                    />
                  </g>
                  <defs>
                    <linearGradient
                      id="paint0_linear_438_3544"
                      x1="8.37917"
                      y1="23.7086"
                      x2="24.8807"
                      y2="13.9563"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#A52714" stop-opacity="0.6" />
                      <stop
                        offset="0.66"
                        stop-color="#A52714"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_438_3544"
                      x1="34.0291"
                      y1="46.3788"
                      x2="15.6949"
                      y2="35.5129"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#055524" stop-opacity="0.4" />
                      <stop
                        offset="0.33"
                        stop-color="#055524"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint2_linear_438_3544"
                      x1="25.9383"
                      y1="15.3371"
                      x2="30.4814"
                      y2="35.4644"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EA6100" stop-opacity="0.3" />
                      <stop
                        offset="0.66"
                        stop-color="#EA6100"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <linearGradient
                      id="paint3_linear_438_3544"
                      x1="34.983"
                      y1="13.2956"
                      x2="39.5261"
                      y2="33.4229"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#EA6100" stop-opacity="0.3" />
                      <stop
                        offset="0.66"
                        stop-color="#EA6100"
                        stop-opacity="0"
                      />
                    </linearGradient>
                    <radialGradient
                      id="paint4_radial_438_3544"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(26.6181 14.9858) scale(26.5857 26.2775)"
                    >
                      <stop stop-color="#3E2723" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#3E2723" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint5_radial_438_3544"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(4.38902 12.664) scale(24.6779 24.3918)"
                    >
                      <stop stop-color="#3E2723" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#3E2723" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint6_radial_438_3544"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(27.7754 27.5466) scale(27.7849 27.4627)"
                    >
                      <stop stop-color="#263238" stop-opacity="0.2" />
                      <stop offset="1" stop-color="#263238" stop-opacity="0" />
                    </radialGradient>
                    <radialGradient
                      id="paint7_radial_438_3544"
                      cx="0"
                      cy="0"
                      r="1"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="translate(8.31174 7.50524) scale(55.889 55.241)"
                    >
                      <stop stop-color="white" stop-opacity="0.1" />
                      <stop offset="1" stop-color="white" stop-opacity="0" />
                    </radialGradient>
                    <clipPath id="clip0_438_3544">
                      <rect width="202" height="55" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </Modal.Body>
          </Modal> */}
          {/* <Footer /> */}

          <Modal
            className="service-modal"
            backdrop="static"
            keyboard={false}
            show={showservice}
            onHide={handleCloseService}
            centered
          >
            <Modal.Body>
              <div className="upper-div">
                <img
                  src="\ic_round-warning.svg"
                  alt="img"
                  className="img-fluid"
                />
                <h6>Service Unavailable</h6>
              </div>
              <div className="bottom-div">
                <h6>The Service is Unavailable in Your Region</h6>
                <p>
                  We’re sorry, but the service you are trying to access is not
                  available in your Country.
                </p>
              </div>
            </Modal.Body>
          </Modal>

          <Script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"></Script>
          <Script src="https://code.jquery.com/jquery-3.2.1.slim.min.js"></Script>
          <Script src="/snarkjs.min.js"></Script>
        </Web3ReactProvider>
      )}
    </Provider>
  );
}
