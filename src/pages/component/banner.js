import Link from "next/link";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/router";
import Offcanvas from "react-bootstrap/Offcanvas";
import axios from "axios";
import { useSelector } from "react-redux";
import { getData } from "../../utils/db";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DecimalPointsM from "../../hooks/dataFetchers/decimals";
import Loader from "../../hooks/loader";
import List from "./asset/List";
import { Api_URL } from "../../hooks/apiUrl";
import { Modal } from "react-bootstrap";
import TwitterLogin from "react-twitter-auth";
import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget, verifyWithZkMeServices } from "@zkmelabs/widget";
import { useWeb3React } from "@web3-react/core";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import NFTS from "../../hooks/dataFetchers/getNfts";
import Environment1 from "../../utils/environment";
import lottie from "lottie-web";
import BadgeOffcanvas from "./BadgesInner";
import Footer from "./footer";

const Banner = ({ user, setUser }) => {
  const [badgepop, setBadgepop] = useState(false);
  const [imgeNew, setImgeNew] = useState(false);
  const [filtBalances, setFiltBalances] = useState([]);
  const [show, setShow] = useState(false);
  const [assets, setAssets] = useState([]);
  const pvtBalances = useSelector((state) => state.exampleValue);
  const fetchProgress = useSelector((state) => state.progress);
  const [myAcc, setMyAcc] = useState(null);
  const [totBool, setTotBool] = useState(false);
  const [rend, setRend] = useState(false);
  const [loader, setLoader] = useState(false);
  const [copy, setCopy] = useState(false);
  const [copy2, setCopy2] = useState(false);
  const [totalBal, setTotalBal] = useState(null);
  const { DecimalPoints } = DecimalPointsM();
  const [verifyemail, setVerifyEmail] = useState(false);
  const [pastedContent, setPastedContent] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [verifyemail1, setVerifyEmail1] = useState(false);
  const [verifyemail2, setVerifyEmail2] = useState(false);
  const [showrefferal, setrefferal] = useState(false);
  const handleCloseRefferal = () => setrefferal(false);
  const handleShowRefferal = () => setrefferal(true);
  const router = useRouter();
  const [zkMeWidget, setZkMeWidget] = useState(null);
  const [token, setToken] = useState(null);
  const { account, chainId } = useWeb3React();
  const [discordCode, setDiscordCode] = useState(null);
  const [recaptch, setRecaptch] = useState(false);
  const [telegrampop, setTelegrampop] = useState(false);
  const [twitterAutization, setTwitterAutization] = useState(false);
  const [OauthVerifier1, setOauthVerifier1] = useState(false);
  const [OauthToken1, setOauthToken1] = useState(false);
  const [totalPerc, setTotalPerc] = useState(1);
  const { OwnNFTS } = NFTS();

  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const [nfts, setNfts] = useState({
    jack: 0,
    queen: 0,
    king: 0,
    treasury: 0,
  });

  useEffect(() => {
    if (fetchProgress?.progress === 1) {
      ReScanFunc();
    }
  }, [fetchProgress]);

  const ReScanFunc = () => {
    setTimeout(() => {
      if (fetchProgress?.scanStatus !== "Complete") {
        window?.location?.reload();
      }
    }, [2000]);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [showingData, setShowingData] = useState(false);
  const toggleOffCanvas = () => {
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        setShowingData(true);
      }, 1000);
    } else {
      setShowingData(false);
    }
    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (showingData) {
      UpdateShowingData();
    }
  }, [showingData]);

  const UpdateShowingData = () => {
    setTimeout(() => {
      setShowingData(false);
    }, [2000]);
  };

  const handleCloseverifyemail = () => {
    setVerifyEmail(false);
    setError("");
  };

  // Telegram flow
  const searchParams = useMemo(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams(); // Returns a blank set if not on client side
  }, []);

  useEffect(() => {
    setId(searchParams.get("id"));
  }, [searchParams]);

  const [id, setId] = useState("");
  const telegramWrapperRef15 = useRef(null);

  useEffect(() => {
    if (telegramWrapperRef15?.current && showModal) {
      updateRef2();
    }
  }, [telegramWrapperRef15, showModal]);

  const updateRef2 = () => {
    setTimeout(() => {
      const scriptElement = document.createElement("script");
      scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
      scriptElement.setAttribute("data-telegram-login", "DOP_mainnet3_bot");
      scriptElement.setAttribute("data-size", "large");
      scriptElement.setAttribute(
        "data-auth-url",
        "https://tplsnark-latest.vercel.app"
      );
      scriptElement.async = true;

      telegramWrapperRef15.current?.appendChild(scriptElement);
    }, [1000]);
  };

  useEffect(() => {
    if (id) {
      toggleTelegram();
    }
  }, [id]);

  const toggleTelegram = async () => {
    let tok = localStorage.getItem("myToken");
    const postData = {
      telegramId: id,
    };
    axios
      .post(`${Api_URL}/users/toggle-telegram`, postData, {
        headers: {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        },
      })
      .then(async (response) => {
        setBadgepop(true);
        setImgeNew(
          "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188183/dop/newbadges/social/telegram-active_lgrnua.svg"
        );

        let headers = {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        };
        axios
          .get(`${Api_URL}/users/profile`, { headers })
          .then((response) => {
            // Handle the success of the GET request
            setUser(response.data?.data);
            setIsOpen(true);
          })
          .catch((error) => {
            // Handle errors that occurred during the GET request
            console.error("Error:", error);
          });
        closeModal();
      })
      .catch((error) => {
        // toast.error(
        //   <div>
        //     Please join this channel{" "}
        //     <a
        //       href="https://t.me/doptest_Channel"
        //       target="_blank"
        //       rel="noopener noreferrer"
        //     >
        //       'doptest_Channel'
        //     </a>{" "}
        //     on Telegram to get this badge
        //   </div>
        // );
        // toast.error(error?.response?.data?.message);
        router.push("/");
        if (
          error?.response?.data?.message !==
          "The Telegram account you are trying to log in to is affiliated with another DOP account"
        ) {
          // setTelegrampop(true);
          openModal();
        }
        // {
        //   window.open("https://t.me/doptest_Channel");
        // }
        console.error("Error2:", error);
      });
  };

  const nameToKeyMap = {
    "DOP Jack": "jack",
    "DOP Queen": "queen",
    "DOP King": "king",
    "DOP Treasure Chest": "treasury",
  };

  const updateNftCounts = (nftNames) => {
    setNfts((prevNfts) => {
      const counts = { ...prevNfts }; // Copy the current counts
      nftNames.forEach((name) => {
        const key = nameToKeyMap[name]; // Assuming nameToKeyMap is defined outside this function
        if (key) {
          counts[key] = (counts[key] || 0) + 1; // Increment the count for this NFT type
        }
      });
      return counts;
    });
    setRend(!rend);
  };

  const getAccessToken = () => {
    var config = {
      method: "post",
      url: "https://nest-api.zk.me/api/token/get",
      data: {
        apiKey: "edde27f3.f169118cf2cb787c79179cb76e114a7b",
        appId: "M2024032712011522654927764408546",
        apiModePermission: 0,
        lv: 1,
      },
    };
    axios(config)
      .then(function (response) {
        setToken(response?.data?.data?.accessToken);
      })
      .catch(function (error) {
        console.log("error", error);
      });
  };

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
      indecBy: "11",
      address: Environment?.USDC,
      id: "usd-coin",
    },
    {
      igm: "/assets/myprivateassets/dop.svg",
      name: "DOP",
      indecBy: "1",
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
      isCoin: true,
    },
  ];

  useEffect(() => {
    if (assets?.length > 0) {
      if (pvtBalances?.length > 0) {
        let balArr = [];
        for (let i of assets) {
          const found = pvtBalances.find(
            (e) => e.tokenAddress?.toLowerCase() === i?.address?.toLowerCase()
          );
          if (found) {
            i.amount = found?.amount;
          } else {
            i.amount = 0;
          }

          balArr?.push(i);

          // for (let io of pvtBalances) {
          // if (io?.tokenAddress?.toLowerCase() === i?.address?.toLowerCase()) {
          //   i.amount = io?.amount;
          //   balArr?.push(i);
          // }
        }
        setFiltBalances(balArr);
      }
    } else {
      // setFiltBalances(assets);
    }
  }, [pvtBalances, assets]);

  useEffect(() => {
    getProfile();
    setAssets(itemsAssets);
    getAccessToken();
    getAccount();
    var val = window.location.href;
    val = new URL(val);
    var id = val.searchParams.get("code");
    if (id) {
      setDiscordCode(id);
    }
  }, []);

  const getAccount = async () => {
    let item = await getData("selectedAccount");
    setMyAcc(item);
  };

  useEffect(() => {
    getMarketData();
  }, [filtBalances]);

  useEffect(() => {
    if (account) {
      getNfts();
    }
  }, [account]);

  const getNfts = async () => {
    // 0xD644C1B56c3F8FAA7beB446C93dA2F190bFaeD9B
    if (totalPerc === 1) {
      axios
        .get(
          `https://deep-index.moralis.io/api/v2/${account}/nft/${Environment1.nftContract}?chain=matic&format=decimal`,
          {
            headers: {
              "x-api-key":
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjZlMGI5MjNkLTNkYmYtNDBlZC04MGY4LTU3NWVhODEwYjc0ZiIsIm9yZ0lkIjoiMjA3ODg5IiwidXNlcklkIjoiMjA3NTYxIiwidHlwZUlkIjoiZWMwMWYzMDctNTJhMS00ZTNiLWExYzgtNWM3MmQwOGExZDc1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE2ODczNTcwNDYsImV4cCI6NDg0MzExNzA0Nn0.Uv0uw5Q_lnSgXMquIJ0GHKlx_uNMkdDptrT00MzmwPo",
            },
          }
        )
        ?.then((res) => {
          const totalMultiplier = calculateTotalMultiplier(res?.data?.result);
          const nftNames = res.data.result.map(
            (nft) => JSON.parse(nft.metadata).name
          ); // Adjust this line based on the actual structure of your API response
          updateNftCounts(nftNames);
          setTotalPerc(totalMultiplier);
        })
        .catch((err) => {
          console.log("err from moralis", err);
        });
    }
  };

  const nftMultipliers = {
    "DOP Treasure Chest": 20, // 20% multiplier
    "DOP King": 15, // 15% multiplier
    "DOP Queen": 10, // 10% multiplier
    "DOP Jack": 5, // 5% multiplier
  };

  function calculateTotalMultiplier(nfts) {
    return nfts.reduce((total, nft) => {
      const multiplier = nftMultipliers[JSON.parse(nft.metadata).name] || 0; // Get the multiplier, default to 0 if not found
      return total + multiplier;
    }, 0); // Start accumulating from 0
  }

  const getMarketData = async () => {
    if (filtBalances?.length > 0) {
      let dumArr = [];
      const dumObj = filtBalances[0];
      if (dumObj?.market_data) {
      } else {
        for (let i of filtBalances) {
          let item = i;
          try {
            let res = await axios.get(
              `${Api_URL}/transactions/get-price?coinId=${item.id}`
            );
            // let res = await axios.get(
            //   `${CoingekoBaseURL}/coins/${item.id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false&x_cg_pro_api_key=${apiKey}`
            // );
            if (res) {
              item.market_data = res?.data?.data?.market_data;
              const res0 = await DecimalPoints(item?.address);
              if (res0 === 6n) {
                let amo = parseFloat(item?.amount) / 1000000;
                item.dollVal =
                  res?.data?.data?.market_data?.current_price?.usd * amo;
              } else if (res0 === 18n) {
                let amo = parseFloat(item?.amount) / 1000000000000000000;
                item.dollVal =
                  res?.data?.data?.market_data?.current_price?.usd * amo;
              } else if (res0 === 9n) {
                let amo = parseFloat(item?.amount) / 1000000000;
                item.dollVal =
                  res?.data?.data?.market_data?.current_price?.usd * amo;
              }
            }
            console.log("dumArrdumArrdumArrdumArr", dumArr);
            dumArr.push(item);
          } catch (err) {
            console.log("err", err);
          }
        }
        if (dumArr?.length === filtBalances?.length) {
          setFiltBalances(dumArr);
          setTotBool(true);
          setRend(!rend);
        }
      }
    }
  };

  const getProfile = async () => {
    if (user) {
    } else {
      setLoader(true);
      let tok = localStorage.getItem("myToken");
      const headers = {
        Authorization: `Bearer ${tok}`,
      };
      let res = await getData("selectedAccount");
      if (res) {
        // Make the GET request using Axios
        axios
          .get(`${Api_URL}/users/profile`, { headers })
          .then((response) => {
            // Handle the success of the GET request
            setLoader(false);
            setUser(response.data?.data);
          })
          .catch((error) => {
            // Handle errors that occurred during the GET request
            console.error("Error:", error);
            router.push("/unlockwallet");
          });
      } else {
        router.push("/home");
      }
    }
  };

  useEffect(() => {
    if (totBool) {
      let bal = 0;
      for (let i of filtBalances) {
        if (i?.dollVal) {
          bal = bal + i?.dollVal;
        }
      }
      localStorage.setItem("totalBal", bal);
      setTotalBal(bal);
    }
  }, [totBool]);

  const CallCopy = () => {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, [3000]);
  };

  const CallCopy2 = () => {
    setCopy2(true);
    setTimeout(() => {
      setCopy2(false);
    }, [3000]);
  };

  // Verify email process
  const VerifyEmailAddr = async (e) => {
    e?.preventDefault();
    setError("");
    setLoader(true);
    let tok = localStorage.getItem("myToken");
    const postData = {
      email: email,
    };
    axios
      .post(`${Api_URL}/users/update_email`, postData, {
        headers: {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        },
      })
      .then(async (response) => {
        // setLoadMsg("");
        setVerifyEmail(false);
        setVerifyEmail1(true);
        setLoader(false);
        // handleCloseverifyemail();
        // handleShoweverifyemail1();
      })
      .catch((error) => {
        setError(error?.response?.data?.message);
        if (
          error?.response?.data?.message === "Verification Code already sent"
        ) {
          handleCloseverifyemail();
          // handleShoweverifyemail1();
        }
        setLoader(false);
      });
  };

  const VerifyEmailCode = async (e) => {
    e?.preventDefault();
    setError("");
    if (pastedContent !== "") {
      setLoader(true);
      let tok = localStorage.getItem("myToken");
      const postData = {
        emailVerificationCode: pastedContent,
      };
      axios
        .post(`${Api_URL}/users/verify_email_code`, postData, {
          headers: {
            Authorization: `Bearer ${tok}`, // Include your authentication token here
          },
        })
        .then(async (response) => {
          setBadgepop(true);
          setImgeNew(
            "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188182/dop/newbadges/social/email-active_wu5mun.svg"
          );
          setVerifyEmail1(false);
          setVerifyEmail2(true);
          setLoader(false);
          let headers = {
            Authorization: `Bearer ${tok}`, // Include your authentication token here
          };
          axios
            .get(`${Api_URL}/users/profile`, { headers })
            .then((response) => {
              // Handle the success of the GET request
              setLoader(false);
              setUser(response.data?.data);
            })
            .catch((error) => {
              // Handle errors that occurred during the GET request
              console.error("Error:", error);
              router.push("/unlockwallet");
            });
          // setLoadMsg("");
          // handleCloseverifyemail1();
          // handleCloseverifyemail2();
        })
        .catch((error) => {
          console.log("error", error);
          setError(error?.response?.data?.message);
          setLoader(false);
        });
    } else {
      setError("Code is required");
    }
  };

  useEffect(() => {
    if (token && account) {
      SetUPZkME();
    }
  }, [token, account]);

  const SetUPZkME = async () => {
    var userConnectedAddress = account;
    const provider = {
      async getAccessToken() {
        // Request a new token from your backend service and return it to the widget.
        // For the access token, see https://docs.zk.me/zkme-dochub/zkkyc-compliance-suite/integration-guide/widget-sdk-integration#usage-example
        return token;
      },

      async getUserAccounts() {
        // If your project is a Dapp,
        // you need to return the user's connected wallet address.
        if (!userConnectedAddress) {
          userConnectedAddress = await account;
        }
        return [userConnectedAddress];

        // If not,
        // you should return the user's e-mail address, phone number or any other unique identifier.
        //
        // return ['email address']
        // or
        // return ['phone number']
        // or
        // return ['unique identifier']
      },

      // According to which blockchain your project is integrated with,
      // choose and implement the corresponding methods as shown below.
      // If you are integrating Anti-Sybil(MeID) , you don't need to implement them.

      // EVM
      async delegateTransaction(tx) {
        // try {
        const provider = window.ethereum;
        const accounts = await provider // Or window.ethereum if you don't support EIP-6963.
          .request({ method: "eth_requestAccounts" });
        let myAccount = accounts?.find((i) => {
          return i === account?.toLowerCase();
        });
        let txResponse = null;
        provider // Or window.ethereum if you don't support EIP-6963.
          .request({
            method: "eth_sendTransaction",
            // The following sends an EIP-1559 transaction. Legacy transactions are also supported.
            // params: [tx],
            params: [
              {
                from: myAccount,
                to: tx.to,
                data: tx.data,
                gas: tx.gasLimit,
                gasPrice: tx.maxFeePerGas,
              },
            ],
          })
          .then((txHash) => {
            txResponse = txHash;
            return txHash;
          })
          .catch((error) => console.error(error));

        // if (txResponse) {
        //   return txResponse;
        // }
        // const web3 = new Web3(
        //   "https://polygon-mainnet.infura.io/v3/4748414432494c9b91c15f6188369b22"
        // );

        // const txResponse = await web3.eth.sendTransaction({
        // from: tx.from,
        // to: tx.to,
        // data: tx.data,
        // gas: tx.gasLimit,
        // gasPrice: tx.maxFeePerGas,
        // });
        // return txResponse.hash;
        // } catch (err) {
        // }
      },
      // Cosmos
      // async delegateCosmosTransaction(tx) {
      //   const txResponse = await signingCosmWasmClient.execute(
      //     tx.senderAddress,
      //     tx.contractAddress,
      //     tx.msg,
      //     "auto"
      //   );
      //   return txResponse.transactionHash;
      // },
      // // Aptos
      // async delegateAptosTransaction(tx) {
      //   const txResponse = await aptos.signAndSubmitTransaction(tx);
      //   return txResponse.hash;
      // },
      // ...
      // See the Provider interface definition for more details on other chains.
    };

    const zkMeWidget = new ZkMeWidget(
      "M2024032712011522654927764408546", // This parameter means the same thing as "mchNo"
      "DOP_KYC",
      1,
      provider
      // Optional configurations are detailed in the table below
      //   options
    );

    await setZkMeWidget(zkMeWidget);
    await setRend(!rend);

    async function handleFinished(verifiedAccount) {
      // We recommend that you double-check this by calling
      // the functions mentioned in the "Helper functions" section.
      // if (verifiedAccount === userConnectedAddress?.toLowerCase()) {
      //   let appId = "M2024032712011522654927764408546";
      //   // zkKYC
      //   const results = await verifyWithZkMeServices(
      //     appId,
      //     userConnectedAddress
      //   );
      //   let sgnn = localStorage.getItem("signValue");
      //   let tok = localStorage.getItem("dopToken");
      //   if (results) {
      //     const postData = {
      //       sign: sgnn,
      //     };
      //     axios
      //       .patch(`${Api_URL}users/update-kyc`, postData, {
      //         headers: {
      //           Authorization: `Bearer ${tok}`, // Include your authentication token here
      //         },
      //       })
      //       .then(async (response) => {
      //         // setKyc(true);
      //         // history.push('')
      //       })
      //       .catch((error) => {
      //         console.log("error", error);
      //       });
      //     // Prompts the user that zkKYC/MeID verification has been completed
      //   }
      // }
    }

    zkMeWidget.on("finished", handleFinished);
  };

  const launchZkME = () => {
    zkMeWidget.launch();
  };

  // Discord API
  useEffect(() => {
    if (discordCode) {
      verifyDiscord();
    }
  }, [discordCode]);

  const verifyDiscord = async () => {
    setError("");
    setLoader(true);
    let tok = localStorage.getItem("myToken");
    const postData = {
      code: discordCode,
    };
    axios
      .post(`${Api_URL}/users/toggle-discord`, postData, {
        headers: {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        },
      })
      .then(async (response) => {
        setBadgepop(true);
        setImgeNew(
          "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188181/dop/newbadges/social/discord-active_dn7dtd.svg"
        );

        let headers = {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        };
        axios
          .get(`${Api_URL}/users/profile`, { headers })
          .then((response) => {
            // Handle the success of the GET request
            setLoader(false);
            router.push("/");
            setUser(response.data?.data);
          })
          .catch((error) => {
            // Handle errors that occurred during the GET request
            console.error("Error:", error);
            setLoader(false);
          });
        // toast.success("Successfully verified discord!");
      })
      .catch((error) => {
        router.push("/");
        toast.error(error?.response?.data?.message);
        setError(error?.response?.data?.message);
        setLoader(false);
      });
  };

  // Twitter login
  const onSuccess = (response) => {
    const parsedUrl = new URL(response?.url);
    const searchParams = parsedUrl.searchParams;
    const oauthVerifier = searchParams.get("oauth_verifier");
    const oauthToken = searchParams.get("oauth_token");
    if (response.status === 200) {
      setTwitterAutization(true);
      // setRecaptch(true);
      setOauthVerifier1(oauthVerifier);
      setOauthToken1(oauthToken);
    }
  };

  const onFailed = (error) => {
    console.log("error twitter", error);
    setError(JSON.stringify(error));
  };

  const VerifyFollow = async () => {
    if (OauthVerifier1 && OauthToken1) {
      let tok = localStorage.getItem("myToken");
      setError("");
      const postData = {};
      axios
        .patch(
          `${Api_URL}/users/${user?._id}/toggle-twitter?oauth_verifier=${OauthVerifier1}&&oauth_token=${OauthToken1}`,
          postData,
          {
            headers: {
              Authorization: `Bearer ${tok}`, // Include your authentication token here
            },
          }
        )
        .then(async (response) => {
          setBadgepop(true);
          setImgeNew(
            "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188184/dop/newbadges/social/twitter-active_fwk5rg.svg"
          );
          let tok = localStorage.getItem("myToken");
          const headers = {
            Authorization: `Bearer ${tok}`,
          };
          let res = await getData("selectedAccount");
          if (res) {
            // Make the GET request using Axios
            axios
              .get(`${Api_URL}/users/profile`, { headers })
              .then((response) => {
                // Handle the success of the GET request
                setLoader(false);
                setUser(response.data?.data);
              })
              .catch((error) => {
                // Handle errors that occurred during the GET request
                console.error("Error:", error);
                router.push("/unlockwallet");
              });
          }
        })
        .catch((error) => {
          console.log("error", error);
          setOauthToken1(error?.response?.data?.oauth_token);
          setOauthVerifier1(error?.response?.data?.oauth_token_secret);
          const searchString = "not accepted";
          const containsPhrase = JSON.stringify(error?.message).includes(
            searchString
          );
          if (containsPhrase) {
            setError("Not Enough allowance given!");
          }
          if (error?.response?.data?.oauth_token_secret) {
            setRecaptch(true);
          }
        });
    }
  };

  const verifyCaptcha = (e) => {
    let tok = localStorage.getItem("myToken");
    const postData = {
      oauth_token_secret: OauthVerifier1,
      oauth_token: OauthToken1,
      recaptcha: e,
    };
    axios
      .patch(
        `${Api_URL}/users/${user?._id}/recaptcha/toggle-twitter`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${tok}`, // Include your authentication token here
          },
        }
      )
      .then(async (response) => {
        setBadgepop(true);
        setImgeNew(
          "https://res.cloudinary.com/drt6vurtt/image/upload/v1716188184/dop/newbadges/social/twitter-active_fwk5rg.svg"
        );
        let tok = localStorage.getItem("myToken");
        const headers = {
          Authorization: `Bearer ${tok}`,
        };
        let res = await getData("selectedAccount");
        if (res) {
          // Make the GET request using Axios
          setRecaptch(false);
          axios
            .get(`${Api_URL}/users/profile`, { headers })
            .then((response) => {
              // Handle the success of the GET request
              setLoader(false);
              setUser(response.data?.data);
            })
            .catch((error) => {
              // Handle errors that occurred during the GET request
              console.error("Error:", error);
              router.push("/unlockwallet");
            });
        }
      })
      .catch((error) => {
        toast.error(
          "Unable to Verify twitter due to high traffic, Please try later."
        );
        console.log("error", error?.response?.data?.message);
        setError(error?.response?.data?.message);
      });
  };

  const syncingRef = useRef(null);
  const syncingRefLight = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: syncingRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/synchronization1.json",
    });
    const animation1 = lottie.loadAnimation({
      container: syncingRefLight.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/synchronization.json",
    });

    return () => {
      animation.destroy();
      animation1.destroy();
    };
  }, []);

  return (
    <>
      {loader && <Loader />}
      <section className="main-banner">
        <div className="custom-container">
          <div className="parent-content">
            <div className="upper-content">
              <div className="twice-elem">
                <h6>Account Overview</h6>
                {fetchProgress?.scanStatus === "Complete" ? (
                  <></>
                ) : (
                  <>
                    {fetchProgress?.progress && (
                      <>
                        <div className="syncing-text">
                          <div
                            className="testimonial-lottie-1 dark-mode-sync"
                            ref={syncingRef}
                          ></div>
                          <div
                            className="testimonial-lottie-1 light-mode-sync d-none"
                            ref={syncingRefLight}
                          ></div>
                          <p>
                            synching...{" "}
                            {(fetchProgress?.progress * 100)?.toFixed(2)}%
                            Completed
                          </p>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
              <div
                onClick={toggleOffCanvas}
                className="badges-content desktop-badges"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M12.0378 14.5L8.03784 10.5L12.0378 6.5"
                    stroke="white"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p>My badges</p>
                <img
                  src="\assets\badges-icons.svg"
                  alt="img"
                  className="img-fluid"
                />
              </div>
              <Link href="/badges" className="d-none mobile-badges">
                <div className="badges-content d-none mobile-badges">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      d="M12.0378 14.5L8.03784 10.5L12.0378 6.5"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <p>My badges</p>
                  <img
                    src="\assets\badges-icons.svg"
                    alt="img"
                    className="img-fluid"
                  />
                </div>
              </Link>
            </div>
            <div className="bottom-content">
              <div className="main-box">
                <img
                  src="\assets\balance-bg.png"
                  alt="img"
                  className="img-fluid balance-bg"
                />
                <h5>Current Balance</h5>
                <h4>
                  <span>$</span>
                  {totalBal
                    ? parseFloat(totalBal?.toFixed(2))?.toLocaleString()
                    : "0.00"}
                </h4>
                <div className="twice-text">
                  <h6 className="position-relative">
                    My DOP Account{" "}
                    <CopyToClipboard
                      text={myAcc?.dopAdd}
                      onCopy={() => CallCopy()}
                    >
                      <span>
                        {myAcc?.dopAdd?.slice(0, 11)}....
                        {myAcc?.dopAdd?.slice(
                          myAcc?.dopAdd?.length - 5,
                          myAcc?.dopAdd?.length
                        )}{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          style={{ cursor: "pointer" }}
                        >
                          <path
                            d="M6.47499 13.2708H4.02499C1.74416 13.2708 0.729156 12.2558 0.729156 9.97501V7.52501C0.729156 5.24417 1.74416 4.22917 4.02499 4.22917H6.47499C8.75583 4.22917 9.77082 5.24417 9.77082 7.52501V9.97501C9.77082 12.2558 8.75583 13.2708 6.47499 13.2708ZM4.02499 5.10417C2.21666 5.10417 1.60416 5.71667 1.60416 7.52501V9.97501C1.60416 11.7833 2.21666 12.3958 4.02499 12.3958H6.47499C8.28332 12.3958 8.89582 11.7833 8.89582 9.97501V7.52501C8.89582 5.71667 8.28332 5.10417 6.47499 5.10417H4.02499Z"
                            fill="#7D7D7D"
                          />
                          <path
                            d="M9.97499 9.77084H9.33332C9.09416 9.77084 8.89582 9.57251 8.89582 9.33334V7.52501C8.89582 5.71667 8.28332 5.10417 6.47499 5.10417H4.66666C4.42749 5.10417 4.22916 4.90584 4.22916 4.66667V4.02501C4.22916 1.74417 5.24416 0.729172 7.52499 0.729172H9.97499C12.2558 0.729172 13.2708 1.74417 13.2708 4.02501V6.47501C13.2708 8.75584 12.2558 9.77084 9.97499 9.77084ZM9.77082 8.89584H9.97499C11.7833 8.89584 12.3958 8.28334 12.3958 6.47501V4.02501C12.3958 2.21667 11.7833 1.60417 9.97499 1.60417H7.52499C5.71666 1.60417 5.10416 2.21667 5.10416 4.02501V4.22917H6.47499C8.75582 4.22917 9.77082 5.24417 9.77082 7.52501V8.89584Z"
                            fill="#7D7D7D"
                          />
                        </svg>
                      </span>
                    </CopyToClipboard>
                    {copy && (
                      <p
                        style={{
                          background: "black",
                          fontSize: 14,
                          right: 0,
                        }}
                        className="position-absolute p-1 text-white"
                      >
                        Copied
                      </p>
                    )}
                  </h6>
                </div>
              </div>
              <div className="twice-btns">
                <Link
                  onClick={() => setLoader(true)}
                  href="/encrypt"
                  className="btn-encrypt btn-main-style"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      d="M8.19204 7.5H6.50014C5.56672 7.5 5.09966 7.5 4.74314 7.68166C4.42954 7.84144 4.17476 8.09623 4.01497 8.40983C3.83331 8.76635 3.83331 9.23341 3.83331 10.1668V14.8335C3.83331 15.7669 3.83331 16.2334 4.01497 16.5899C4.17476 16.9035 4.42954 17.1587 4.74314 17.3185C5.09931 17.5 5.56583 17.5 6.49743 17.5H14.5026C15.4341 17.5 15.9 17.5 16.2561 17.3185C16.5697 17.1587 16.8254 16.9035 16.9852 16.5899C17.1666 16.2337 17.1666 15.7679 17.1666 14.8363V10.1641C17.1666 9.23249 17.1666 8.766 16.9852 8.40983C16.8254 8.09623 16.5697 7.84144 16.2561 7.68166C15.8996 7.5 15.4336 7.5 14.5001 7.5H12.8074M8.19204 7.5H12.8074M8.19204 7.5C8.08583 7.5 7.99998 7.4139 7.99998 7.30769V5C7.99998 3.61929 9.11927 2.5 10.5 2.5C11.8807 2.5 13 3.61929 13 5V7.30769C13 7.4139 12.9136 7.5 12.8074 7.5"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Encrypt
                </Link>
                <Link
                  onClick={() => setLoader(true)}
                  href="/send"
                  className="btn-send btn-main-style"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d="M10 15.8333V4.16663M10 4.16663L5 9.16663M10 4.16663L15 9.16663"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Send
                </Link>
                <Link
                  onClick={() => setLoader(true)}
                  href="/decrypt"
                  className="btn-decrypt btn-main-style"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                  >
                    <path
                      d="M8 7.5H6.50017C5.56674 7.5 5.09969 7.5 4.74317 7.68166C4.42956 7.84145 4.17478 8.09623 4.01499 8.40983C3.83334 8.76635 3.83334 9.23341 3.83334 10.1668V14.8335C3.83334 15.7669 3.83334 16.2334 4.01499 16.5899C4.17478 16.9035 4.42956 17.1587 4.74317 17.3185C5.09934 17.5 5.56584 17.5 6.49745 17.5L14.5026 17.5C15.4342 17.5 15.9 17.5 16.2562 17.3185C16.5698 17.1587 16.8254 16.9035 16.9852 16.5899C17.1667 16.2337 17.1667 15.7679 17.1667 14.8363V10.1641C17.1667 9.23249 17.1667 8.766 16.9852 8.40983C16.8254 8.09623 16.5698 7.84144 16.2562 7.68166C15.8996 7.5 15.4336 7.5 14.5002 7.5H8ZM8 7.5V5.1001C8 3.66416 9.08335 2.5 10.4197 2.5C11.1064 2.5 11.7257 2.80732 12.1661 3.30094"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  Decrypt
                </Link>
              </div>
              <div className="points-div">
                <div className="total-points">
                  {user?.actionPoints >= 0 ? (
                    <>
                      {totalPerc > 1 ? (
                        <h6>
                          {(
                            (parseFloat(user?.actionPoints) +
                              parseFloat(user?.referralPoints)) *
                            (1 + totalPerc / 100)
                          )?.toFixed(2)}
                        </h6>
                      ) : (
                        <h6>
                          {(
                            parseFloat(user?.actionPoints) +
                            parseFloat(user?.referralPoints)
                          )?.toFixed(2)}
                        </h6>
                      )}
                    </>
                  ) : (
                    <h6>0.00</h6>
                  )}
                  <p>Total Points</p>
                </div>
                <span className="border-line"></span>
                <div className="right-content">
                  <div className="inner-left">
                    <div className="text">
                      {user?.actionPoints >= 0 ? (
                        <>
                          {totalPerc > 1 ? (
                            <h6>
                              {(
                                parseFloat(user?.actionPoints) *
                                (1 + totalPerc / 100)
                              )?.toFixed(2)}
                            </h6>
                          ) : (
                            <h6>
                              {parseFloat(user?.actionPoints)?.toFixed(2)}
                            </h6>
                          )}
                        </>
                      ) : (
                        <h6>0.00</h6>
                      )}
                      <p>Action Points</p>
                    </div>
                    <div className="text">
                      {user?.actionPoints ? (
                        <h6>
                          {(
                            parseFloat(user?.referralPoints) *
                            (1 + totalPerc / 100)
                          )?.toFixed(2)}
                        </h6>
                      ) : (
                        <h6>0.00</h6>
                      )}
                      <p>Referral Points</p>
                    </div>
                    <div className="text">
                      <h6>0</h6>
                      <p>staking points</p>
                    </div>
                  </div>
                  <div className="inner-right">
                    <p className="refferal-text">
                      {user?.actionPoints ? (
                        <h6>
                          {(
                            parseFloat(user?.referralPoints) *
                            (1 + totalPerc / 100)
                          )?.toFixed(2)}
                        </h6>
                      ) : (
                        <h6>0</h6>
                      )}{" "}
                      <span>Total Referrals</span>
                    </p>
                    <a
                      onClick={() => handleShowRefferal()}
                      className="btn-refferal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10 4.58333V6.66667M10 4.58333C10 3.43274 10.9327 2.5 12.0833 2.5C13.2339 2.5 14.1667 3.43274 14.1667 4.58333C14.1667 5.73393 13.2339 6.66667 12.0833 6.66667M10 4.58333C10 3.43274 9.06726 2.5 7.91667 2.5C6.76607 2.5 5.83333 3.43274 5.83333 4.58333C5.83333 5.73393 6.76607 6.66667 7.91667 6.66667M10 6.66667H12.0833M10 6.66667H7.91667M10 6.66667V11.6667M12.0833 6.66667H14.8335C15.7669 6.66667 16.233 6.66667 16.5895 6.84832C16.9031 7.00811 17.1587 7.26289 17.3185 7.5765C17.5 7.93267 17.5 8.39916 17.5 9.33076V11.6667M7.91667 6.66667H5.16683C4.23341 6.66667 3.76635 6.66667 3.40983 6.84832C3.09623 7.00811 2.84144 7.26289 2.68166 7.5765C2.5 7.93302 2.5 8.40008 2.5 9.3335V11.6667M2.5 11.6667V14.0002C2.5 14.9336 2.5 15.4 2.68166 15.7566C2.84144 16.0702 3.09623 16.3254 3.40983 16.4852C3.766 16.6667 4.23249 16.6667 5.16409 16.6667H10M2.5 11.6667H10M10 11.6667V16.6667M10 11.6667H17.5M10 16.6667H14.8359C15.7675 16.6667 16.2333 16.6667 16.5895 16.4852C16.9031 16.3254 17.1587 16.0702 17.3185 15.7566C17.5 15.4004 17.5 14.9346 17.5 14.003V11.6667"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      Referral Link
                    </a>
                  </div>
                </div>
              </div>
              <div className="encrypt-table">
                <h6 className="main-heading">My encrypted Assets</h6>
                {filtBalances?.length > 0 ? (
                  <div>
                    {filtBalances?.map((item, index) => {
                      return <List index={index} item={item} home={true} />;
                    })}
                  </div>
                ) : (
                  <>
                    {fetchProgress?.scanStatus === "Complete" ||
                    fetchProgress?.progress === 1 ? (
                      <div className="custom-set-style">
                        <img
                          src="\assets\empty-wallet.svg"
                          alt="img"
                          className="img-fluid"
                        />
                        <h6>You don’t have any encrypted assets.</h6>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />

      <Modal
        className="important-note"
        show={verifyemail}
        onHide={handleCloseverifyemail}
        centered
        backdrop={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify your email address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              VerifyEmailAddr(e);
            }}
          >
            <div className="verify-email-div">
              <p>Enter your email address to begin verification process.</p>
              <div className="material-textfield">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  type="text"
                />
                <label>Your Email Address</label>
              </div>
            </div>
            <p
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 12,
                paddingBottom: 20,
              }}
            >
              {error}
            </p>
            <div className="twice-btn">
              <button type="submit" className="btn-verify w-100">
                Submit
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        className="important-note"
        show={verifyemail1}
        onHide={() => setVerifyEmail1(false)}
        centered
        backdrop={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify your email address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            onSubmit={(e) => {
              VerifyEmailCode(e);
            }}
          >
            <div className="verify-email-div">
              <p>
                Enter your 6 six digit email verification code sent to your
                email address
              </p>
              <div className="material-textfield">
                <input
                  value={pastedContent}
                  onChange={(e) => setPastedContent(e.target.value)}
                  placeholder="Enter your 6 digit email verification code"
                  type="text"
                />
                <label>6 Digit Verification Code</label>
                {/* <a
                href="#"
                className="paste-text"
              >
                PASTE
              </a> */}
              </div>
            </div>
            <p
              style={{
                color: "red",
                textAlign: "center",
                fontSize: 12,
                paddingBottom: 20,
              }}
            >
              {error}
            </p>
            <div className="twice-btn">
              <button className="btn-verify w-100" type="submit">
                Verify Email
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        className="important-note"
        show={verifyemail2}
        onHide={() => setVerifyEmail2(false)}
        centered
        backdrop={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify your email address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="email-success-verified">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="110"
              height="110"
              viewBox="0 0 110 110"
              fill="none"
            >
              <g clip-path="url(#clip0_193_5268)">
                <path
                  d="M33.4782 7.17383H21.5217V14.3477H33.4782V7.17383Z"
                  fill="white"
                />
                <path
                  d="M21.5217 14.3479H14.3479V21.5217H21.5217V14.3479Z"
                  fill="white"
                />
                <path
                  d="M14.3477 21.5217H7.17383V33.4782H14.3477V21.5217Z"
                  fill="white"
                />
                <path
                  d="M14.3477 76.5217H7.17383V88.4782H14.3477V76.5217Z"
                  fill="white"
                />
                <path
                  d="M21.5217 88.4783H14.3479V95.6521H21.5217V88.4783Z"
                  fill="white"
                />
                <path
                  d="M33.4782 95.6521H21.5217V102.826H33.4782V95.6521Z"
                  fill="white"
                />
                <path d="M76.5218 0H33.4783V7.17385H76.5218V0Z" fill="white" />
                <path
                  d="M76.5218 102.826H33.4783V110H76.5218V102.826Z"
                  fill="white"
                />
                <path
                  d="M7.17385 33.4783H0V76.5218H7.17385V33.4783Z"
                  fill="white"
                />
                <path
                  d="M88.4782 7.17383H76.5217V14.3477H88.4782V7.17383Z"
                  fill="white"
                />
                <path
                  d="M95.6521 14.3479H88.4783V21.5217H95.6521V14.3479Z"
                  fill="white"
                />
                <path
                  d="M102.826 21.5217H95.6521V33.4782H102.826V21.5217Z"
                  fill="white"
                />
                <path
                  d="M102.826 76.5217H95.6521V88.4782H102.826V76.5217Z"
                  fill="white"
                />
                <path
                  d="M95.6521 88.4783H88.4783V95.6521H95.6521V88.4783Z"
                  fill="white"
                />
                <path
                  d="M88.4782 95.6521H76.5217V102.826H88.4782V95.6521Z"
                  fill="white"
                />
                <path
                  d="M110 33.4783H102.826V76.5218H110V33.4783Z"
                  fill="white"
                />
                <path
                  d="M23.913 38.261H16.7391V52.6089H23.913V38.261Z"
                  fill="white"
                />
                <path
                  d="M45.4347 38.261H38.2609V52.6089H45.4347V38.261Z"
                  fill="white"
                />
                <path
                  d="M38.2609 31.0869H23.913V38.2608H38.2609V31.0869Z"
                  fill="white"
                />
                <path
                  d="M71.7392 38.261H64.5653V52.6089H71.7392V38.261Z"
                  fill="white"
                />
                <path
                  d="M93.2609 38.261H86.087V52.6089H93.2609V38.261Z"
                  fill="white"
                />
                <path
                  d="M86.0871 31.0869H71.7391V38.2608H86.0871V31.0869Z"
                  fill="white"
                />
                <path
                  d="M66.9565 88.4783H43.0435V95.6521H66.9565V88.4783Z"
                  fill="white"
                />
                <path
                  d="M74.1303 59.7827H35.8697H28.6956V66.9566V81.3045H35.8697V66.9566H74.1303V81.3045H81.3044V66.9566V59.7827H74.1303Z"
                  fill="white"
                />
                <path
                  d="M43.0435 81.3044H35.8696V88.4783H43.0435V81.3044Z"
                  fill="white"
                />
                <path
                  d="M74.1303 81.3044H66.9565V88.4783H74.1303V81.3044Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_193_5268">
                  <rect width="110" height="110" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <h6>Email Successfully Verified</h6>
          </div>
          <div className="twice-btn">
            <button
              className="btn-verify w-100"
              onClick={() => setVerifyEmail2(false)}
            >
              Okay
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="important-note"
        show={showrefferal}
        onHide={handleCloseRefferal}
        centered
        backdrop={true}
      >
        <Modal.Body>
          <div className="inner-set">
            <div className="left">
              <h6>Your Referral Link</h6>
              <p>Copy referral link.</p>
            </div>
          </div>
          <h6 className="address-text">
            <p className="copy_data posittion-relative click___One d-flex justify-content-between align-items-center ">
              <span className="gsvsvcvst">
                {"https://app.dop.org/createwallet?referral=" +
                  user?.referalCode}
              </span>
              <CopyToClipboard
                text={
                  "https://app.dop.org/createwallet?referral=" +
                  user?.referalCode
                }
                onCopy={() => CallCopy2()}
              >
                {/* <img
                  src="/assets/button-svgs/copy.svg"
                  alt="img"
                  className="logoimggpccro ml-3 cursor-pointer"
                /> */}
                <svg
                  className="logoimggpccro ml-3 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M10.7433 20.854H6.61835C2.81418 20.854 1.11835 19.1582 1.11835 15.354V11.229C1.11835 7.42484 2.81418 5.729 6.61835 5.729H10.7433C14.5475 5.729 16.2433 7.42484 16.2433 11.229V15.354C16.2433 19.1582 14.5475 20.854 10.7433 20.854ZM6.61835 7.104C3.57501 7.104 2.49335 8.18567 2.49335 11.229V15.354C2.49335 18.3973 3.57501 19.479 6.61835 19.479H10.7433C13.7867 19.479 14.8683 18.3973 14.8683 15.354V11.229C14.8683 8.18567 13.7867 7.104 10.7433 7.104H6.61835Z"
                    fill="white"
                  />
                  <path
                    d="M16.61 12.6043H15.5558C15.18 12.6043 14.8683 12.2927 14.8683 11.9168V11.2293C14.8683 8.186 13.7867 7.10433 10.7433 7.10433H10.0558C9.68001 7.10433 9.36835 6.79266 9.36835 6.41683V5.36266C9.36835 2.44766 10.67 1.146 13.585 1.146H16.61C19.525 1.146 20.8267 2.44766 20.8267 5.36266V8.38766C20.8267 11.3027 19.525 12.6043 16.61 12.6043ZM16.2433 11.2293H16.61C18.7642 11.2293 19.4517 10.5418 19.4517 8.38766V5.36266C19.4517 3.2085 18.7642 2.521 16.61 2.521H13.585C11.4308 2.521 10.7433 3.2085 10.7433 5.36266V5.72933C14.5475 5.72933 16.2433 7.42516 16.2433 11.2293Z"
                    fill="white"
                  />
                </svg>
              </CopyToClipboard>
              {copy2 && (
                <p
                  style={{
                    background: "black",
                    fontSize: 14,
                    right: 0,
                  }}
                  className="position-absolute p-1 text-white"
                >
                  Copied
                </p>
              )}
            </p>
          </h6>
          <div className="twice-btn">
            <button
              onClick={() => handleCloseRefferal()}
              className="w-100"
              style={{ padding: 0 }}
            >
              <button className="btn-verify w-100">Done</button>
            </button>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Modal
        className="important-note refferal-modal"
        show={showrefferal}
        onHide={handleCloseRefferal}
        centered
        backdrop={true}
      >
        <Modal.Header closeButton>
          <Modal.Title>Referrals</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="historytable">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Wallet Address</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Points</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="tbltd">
                      <p className="darktext">0xc67c60cd6d82fcb2fc6a9a...</p>
                    </div>
                  </td>
                  <td>
                    <div className="tbltd">
                      <p className="darktext">500</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Modal.Body>
      </Modal> */}

      <Offcanvas
        className="badges-offcanvas"
        placement="end"
        show={show}
        onHide={() => setShow(false)}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>My badges</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="main-parent">
            <h6 className="main-heading">Social Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                <h6>
                  Join dop <br /> on Telegram
                </h6>
                {user?.follow_Us_On_Twitter?.isCompleted ? (
                  <img
                    src="\assets\newbadges\social\telegram-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\social\telegram.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                {/* <div style={{ display: "flex" }}>
                  <a
                    href="https://t.me/doptest_Channel"
                    className="set-custom-link telegram-link"
                  >
                    Join
                  </a>
                  <p style={{ color: "#fff" }}>{"&"}</p>
                  <a className="set-custom-link telegram-link">Verify</a>
                </div> */}
                <a className="set-custom-link">Verify</a>
              </div>
              <div className="single-badge">
                <h6>
                  Follow DOP <br /> on x
                </h6>
                {user?.follow_Us_On_Twitter?.isCompleted ? (
                  <img
                    src="\assets\newbadges\social\twitter-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <>
                    <img
                      src="\assets\newbadges\social\twitter.svg"
                      alt="img"
                      className="img-fluid"
                    />
                    <TwitterLogin
                      loginUrl={Api_URL + "/users/twitter"}
                      onFailure={onFailed}
                      onSuccess={onSuccess}
                      requestTokenUrl={Api_URL + "/users/twitter-auth"}
                      className="btn-set-twitter"
                    >
                      <div onClick={() => VerifyFollow()}>Follow on X </div>
                    </TwitterLogin>
                  </>
                )}
                {/* <h6>
                  Link Twitter{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6.66696 3.33366H5.46696C4.72022 3.33366 4.34658 3.33366 4.06136 3.47898C3.81048 3.60681 3.60665 3.81064 3.47882 4.06152C3.3335 4.34674 3.3335 4.72039 3.3335 5.46712V10.5338C3.3335 11.2805 3.3335 11.6537 3.47882 11.9389C3.60665 12.1898 3.81048 12.394 4.06136 12.5218C4.3463 12.667 4.71949 12.667 5.46477 12.667H10.5356C11.2808 12.667 11.6535 12.667 11.9384 12.5218C12.1893 12.394 12.3938 12.1896 12.5216 11.9387C12.6668 11.6538 12.6668 11.281 12.6668 10.5357V9.33366M13.3335 6.00033V2.66699M13.3335 2.66699H10.0002M13.3335 2.66699L8.66683 7.33366"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </h6> */}
                {/* <h5 className="verify-text">Verified <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
                <path d="M8.5 1C4.63401 1 1.5 4.13401 1.5 8C1.5 11.866 4.63401 15 8.5 15C12.366 15 15.5 11.866 15.5 8C15.5 4.13401 12.366 1 8.5 1Z" fill="#35D175" />
                <path d="M5.5 8.00001L7.8335 10L12.5 6" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg></h5> */}
              </div>
              <div className="single-badge">
                <h6>
                  Join DOP's <br /> Discord Server
                </h6>
                {user?.follow_Us_On_Discord?.isCompleted ? (
                  <img
                    src="\assets\newbadges\social\discord-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\social\discord.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                {user?.follow_Us_On_Discord?.isCompleted ? (
                  <></>
                ) : (
                  <a
                    href="https://discord.com/oauth2/authorize?client_id=1242412043336810537&response_type=code&redirect_uri=https%3A%2F%2Ftplsnark-latest.vercel.app&scope=identify+guilds+guilds.join"
                    className="set-custom-link"
                  >
                    Join Discord
                  </a>
                )}
                {/* <h6>
                  Link Discord{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6.66696 3.33366H5.46696C4.72022 3.33366 4.34658 3.33366 4.06136 3.47898C3.81048 3.60681 3.60665 3.81064 3.47882 4.06152C3.3335 4.34674 3.3335 4.72039 3.3335 5.46712V10.5338C3.3335 11.2805 3.3335 11.6537 3.47882 11.9389C3.60665 12.1898 3.81048 12.394 4.06136 12.5218C4.3463 12.667 4.71949 12.667 5.46477 12.667H10.5356C11.2808 12.667 11.6535 12.667 11.9384 12.5218C12.1893 12.394 12.3938 12.1896 12.5216 11.9387C12.6668 11.6538 12.6668 11.281 12.6668 10.5357V9.33366M13.3335 6.00033V2.66699M13.3335 2.66699H10.0002M13.3335 2.66699L8.66683 7.33366"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </h6> */}
              </div>
              <div className="single-badge">
                <h6>
                  Complete <br /> zk KYC
                </h6>
                <img
                  src="\assets\newbadges\social\zkkyc.svg"
                  alt="img"
                  className="img-fluid"
                />
                {/* <h6>
                  Complete KYC{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6.66696 3.33366H5.46696C4.72022 3.33366 4.34658 3.33366 4.06136 3.47898C3.81048 3.60681 3.60665 3.81064 3.47882 4.06152C3.3335 4.34674 3.3335 4.72039 3.3335 5.46712V10.5338C3.3335 11.2805 3.3335 11.6537 3.47882 11.9389C3.60665 12.1898 3.81048 12.394 4.06136 12.5218C4.3463 12.667 4.71949 12.667 5.46477 12.667H10.5356C11.2808 12.667 11.6535 12.667 11.9384 12.5218C12.1893 12.394 12.3938 12.1896 12.5216 11.9387C12.6668 11.6538 12.6668 11.281 12.6668 10.5357V9.33366M13.3335 6.00033V2.66699M13.3335 2.66699H10.0002M13.3335 2.66699L8.66683 7.33366"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </h6> */}
                <a onClick={() => launchZkME()} className="set-custom-link">
                  Complete KYC
                </a>
              </div>
              <div className="single-badge">
                <h6>
                  Complete <br /> email verification
                </h6>
                {user?.isEmailVerified ? (
                  <img
                    src="\assets\newbadges\social\email-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\social\email.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                {user?.isEmailVerified ? (
                  <></>
                ) : (
                  <a
                    onClick={() => setVerifyEmail(true)}
                    className="set-custom-link"
                  >
                    Start Verification
                  </a>
                )}
                {/* <h6>
                  Complete email{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M6.66696 3.33366H5.46696C4.72022 3.33366 4.34658 3.33366 4.06136 3.47898C3.81048 3.60681 3.60665 3.81064 3.47882 4.06152C3.3335 4.34674 3.3335 4.72039 3.3335 5.46712V10.5338C3.3335 11.2805 3.3335 11.6537 3.47882 11.9389C3.60665 12.1898 3.81048 12.394 4.06136 12.5218C4.3463 12.667 4.71949 12.667 5.46477 12.667H10.5356C11.2808 12.667 11.6535 12.667 11.9384 12.5218C12.1893 12.394 12.3938 12.1896 12.5216 11.9387C12.6668 11.6538 12.6668 11.281 12.6668 10.5357V9.33366M13.3335 6.00033V2.66699M13.3335 2.66699H10.0002M13.3335 2.66699L8.66683 7.33366"
                      stroke="white"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </h6> */}
              </div>
            </div>
          </div>
          <div className="main-parent">
            <h6 className="main-heading">encrypt Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $10,000
                  </h6>
                </div>
                {user?.encryptAmount < 10000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e1.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e1-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $20,000
                  </h6>
                </div>
                {user?.encryptAmount < 20000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e2.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e2-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $50,000
                  </h6>
                </div>
                {user?.encryptAmount < 50000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e3.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e3-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $100,000
                  </h6>
                </div>
                {user?.encryptAmount < 100000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e4.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e4-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $500,000
                  </h6>
                </div>
                {user?.encryptAmount < 500000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e5.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e5-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    encrypt <br /> $1,000,000
                  </h6>
                </div>
                {user?.encryptAmount < 1000000 ? (
                  <img
                    src="\assets\newbadges\encrypt\e6.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\encrypt\e6-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="main-parent">
            <h6 className="main-heading">Sends Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                <div className="text">
                  <h6>
                    50 <br /> sends
                  </h6>
                </div>
                {user?.sendCount < 50 ? (
                  <img
                    src="\assets\newbadges\send\s1.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\send\s1-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    100 <br /> sends
                  </h6>
                </div>
                {user?.sendCount < 100 ? (
                  <img
                    src="\assets\newbadges\send\s2.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\send\s2-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    200 <br /> sends
                  </h6>
                </div>
                {user?.sendCount < 200 ? (
                  <img
                    src="\assets\newbadges\send\s3.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\send\s3-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>
                    500 <br /> sends
                  </h6>
                </div>
                {user?.sendCount < 500 ? (
                  <img
                    src="\assets\newbadges\send\s4.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\send\s4-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="main-parent">
            <h6 className="main-heading">NFT Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                <div className="text">
                  <h6>DOP Soldier</h6>
                </div>
                {nfts?.jack > 0 ? (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopsoldier-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopsoldier.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>DOP Queen</h6>
                </div>
                {nfts?.queen > 0 ? (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopqueen-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopqueen.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>DOP King</h6>
                </div>
                {nfts?.king > 0 ? (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopking-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\roadtomainnet\dopking.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
              <div className="single-badge">
                <div className="text">
                  <h6>DOP Treasure </h6>
                </div>
                {nfts?.treasury > 0 ? (
                  <img
                    src="\assets\newbadges\roadtomainnet\doptreasure-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\roadtomainnet\doptreasure.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
              </div>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
      <Modal
        className="important-note"
        show={recaptch}
        onHide={() => setRecaptch(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="verify-email-div">
            <p>
              Your account is new, Please do the recaptcha in order to complete
            </p>
            <div className="material-textfield">
              <ReCAPTCHA
                sitekey="6LeXFjYpAAAAAJpYzCIqwoZ7rMaP0KMawdRh_ji5"
                onChange={verifyCaptcha}
                className="recaptchaframe"
              />
            </div>
          </div>
          <p
            style={{
              color: "red",
              textAlign: "center",
              fontSize: 12,
              paddingBottom: 20,
            }}
          >
            {error}
          </p>
        </Modal.Body>
      </Modal>

      <BadgeOffcanvas
        isOpen={isOpen}
        toggleOffCanvas={toggleOffCanvas}
        user={user}
        nfts={nfts}
        showingData={showingData}
        // telegramWrapperRef11={telegramWrapperRef11}
        Api_URL={Api_URL}
        onFailed={onFailed}
        onSuccess={onSuccess}
        VerifyFollow={VerifyFollow}
        launchZkME={launchZkME}
        setVerifyEmail={setVerifyEmail}
      />
      {isOpen && <div className="backdrop" onClick={toggleOffCanvas}></div>}

      <Modal
        className="important-note telegram-popup-modal"
        show={telegrampop}
        onHide={() => setTelegrampop(false)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Follow DOP on Telegram</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="telegram-popup">
            {/* <img
              src="\assets\telegram_img.svg"
              alt="img"
              className="img-fluid"
            /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="60"
              height="60"
              viewBox="0 0 60 60"
              fill="none"
            >
              <path
                d="M26.3557 11.3154C28.8363 11.3154 31.2369 11.3154 33.7175 11.3154C33.7175 21.2379 33.7175 31.0803 33.7175 40.9227C33.4774 41.0027 26.8358 41.0027 26.3557 40.9227C26.3557 31.0803 26.3557 21.1578 26.3557 11.3154Z"
                fill="white"
              />
              <path
                d="M40.999 3.9536C40.839 3.9536 40.679 3.9536 40.5989 3.9536C33.4772 3.9536 26.3555 3.9536 19.3137 3.9536C19.1537 3.9536 18.9937 3.9536 18.8336 3.9536C18.8336 2.67329 18.8336 1.473 18.8336 0.272705C26.1954 0.272705 33.6372 0.272705 40.999 0.272705C40.999 0.352725 40.999 0.432744 40.999 0.512763C40.999 1.55302 40.999 2.59327 40.999 3.71354C41.0791 3.71354 41.0791 3.87358 40.999 3.9536Z"
                fill="white"
              />
              <path
                d="M4.11005 18.7571C4.11005 18.9171 4.11005 18.9971 4.11005 19.1572C4.11005 26.2789 4.11005 33.4007 4.11005 40.5224C4.11005 40.6024 4.11005 40.7625 4.11005 40.8425C4.03003 40.8425 3.95001 40.9225 3.86999 40.9225C2.74972 40.9225 1.70947 40.9225 0.589192 40.9225C0.509172 40.9225 0.509175 40.9225 0.429155 40.9225C0.349136 40.6824 0.349136 19.2372 0.429155 18.7571C0.509175 18.7571 0.589191 18.7571 0.66921 18.7571C1.70946 18.7571 2.74972 18.7571 3.78997 18.7571C3.95001 18.7571 4.03003 18.7571 4.11005 18.7571Z"
                fill="white"
              />
              <path
                d="M55.8821 18.8371C55.9621 18.8371 56.0421 18.7571 56.2022 18.7571C57.2424 18.7571 58.3627 18.7571 59.4029 18.7571C59.483 18.7571 59.563 18.7571 59.643 18.7571C59.643 26.1189 59.643 33.5607 59.643 40.9225C59.563 40.9225 59.483 40.9225 59.4029 40.9225C58.3627 40.9225 57.2424 40.9225 56.2022 40.9225C56.1221 40.9225 56.0421 40.9225 55.8821 40.8425C55.8821 40.6824 55.8821 40.6024 55.8821 40.4424C55.8821 33.3206 55.8821 26.1989 55.8821 19.0772C55.8821 18.9971 55.8821 18.9171 55.8821 18.8371Z"
                fill="white"
              />
              <path
                d="M40.999 55.7261C40.999 55.8061 40.999 55.8861 40.999 55.9661C40.999 57.0864 40.999 58.1267 40.999 59.2469C40.999 59.327 40.999 59.407 40.999 59.487C33.6372 59.487 26.1954 59.487 18.8336 59.487C18.8336 58.2867 18.8336 57.0864 18.8336 55.8061C18.9937 55.8061 19.1537 55.8061 19.3137 55.8061C26.4355 55.8061 33.4772 55.8061 40.5989 55.8061C40.759 55.7261 40.919 55.7261 40.999 55.7261Z"
                fill="white"
              />
              <path
                d="M52.2819 11.2354C52.3619 11.2354 52.5219 11.3154 52.6019 11.3154C53.5622 11.3154 54.5224 11.3154 55.4826 11.3154C55.6427 11.3154 55.7227 11.3154 55.8827 11.3154C55.8827 11.4754 55.8827 11.5554 55.8827 11.6354C55.8827 13.956 55.8827 16.1966 55.8827 18.5171C55.8827 18.5971 55.8827 18.7572 55.8827 18.8372C55.8027 18.8372 55.6427 18.7572 55.5627 18.7572C54.6024 18.7572 53.6422 18.7572 52.682 18.7572C52.6019 18.7572 52.4419 18.7572 52.2819 18.7572C52.2819 18.6772 52.2819 18.5171 52.2819 18.4371C52.2819 16.1165 52.2819 13.796 52.2819 11.5554C52.2819 11.3954 52.2819 11.3154 52.2819 11.2354Z"
                fill="white"
              />
              <path
                d="M7.71001 11.2354C7.71001 11.3154 7.71001 11.4754 7.71001 11.5554C7.71001 13.876 7.71001 16.1966 7.71001 18.5171C7.71001 18.5971 7.71001 18.6772 7.71001 18.7572C7.54997 18.7572 7.46995 18.7572 7.38993 18.7572C6.4297 18.7572 5.46946 18.7572 4.42921 18.7572C4.34919 18.7572 4.18915 18.7572 4.10913 18.8372C4.10913 18.7572 4.10913 18.5971 4.10913 18.5171C4.10913 16.1966 4.10913 13.956 4.10913 11.6354C4.10913 11.5554 4.10913 11.4754 4.10913 11.3154C4.26917 11.3154 4.34919 11.3154 4.42921 11.3154C5.38944 11.3154 6.34968 11.3154 7.38993 11.3154C7.46995 11.2354 7.62999 11.2354 7.71001 11.2354Z"
                fill="white"
              />
              <path
                d="M40.9987 3.95355C41.0787 3.95355 41.1588 3.87354 41.3188 3.87354C43.6394 3.87354 45.9599 3.87354 48.2805 3.87354C48.3605 3.87354 48.3605 3.87354 48.4405 3.87354C48.4405 3.95355 48.4405 4.03357 48.4405 4.11359C48.4405 5.15385 48.4405 6.27412 48.4405 7.31438C48.4405 7.39439 48.4405 7.47441 48.3605 7.55443C48.2005 7.55443 48.1205 7.55443 47.9604 7.55443C45.7199 7.55443 43.5593 7.55443 41.3188 7.55443C41.2388 7.55443 41.0787 7.55443 40.9187 7.55443C40.9187 7.39439 40.9187 7.31437 40.9187 7.15434C40.9187 6.1941 40.9187 5.23387 40.9187 4.19361C41.0787 4.11359 41.0787 4.03357 40.9987 3.95355Z"
                fill="white"
              />
              <path
                d="M41.0794 55.7261C41.0794 55.6461 41.0794 55.4861 41.0794 55.406C41.0794 54.4458 41.0794 53.4856 41.0794 52.5253C41.0794 52.3653 41.0794 52.2853 41.0794 52.1252C41.1594 52.1252 41.2394 52.1252 41.3194 52.1252C43.64 52.1252 45.9606 52.1252 48.2811 52.1252C48.3612 52.1252 48.4412 52.1252 48.5212 52.1252V52.2053C48.5212 53.3255 48.5212 54.5258 48.5212 55.6461V55.7261C48.4412 55.7261 48.4412 55.7261 48.3612 55.7261C45.9606 55.7261 43.64 55.7261 41.2394 55.7261C41.1594 55.7261 41.0794 55.7261 41.0794 55.7261Z"
                fill="white"
              />
              <path
                d="M7.79119 48.3645C6.59089 48.3645 5.3906 48.3645 4.19031 48.3645C4.19031 48.2845 4.19031 48.2044 4.19031 48.1244C4.19031 45.8839 4.19031 43.5633 4.19031 41.3228C4.19031 41.2427 4.19031 41.0827 4.19031 41.0027C4.27033 41.0027 4.43037 41.0827 4.51039 41.0827C5.47062 41.0827 6.43085 41.0827 7.39109 41.0827C7.47111 41.0827 7.63115 41.0827 7.79119 41.0827C7.79119 41.1627 7.79119 41.2427 7.79119 41.4028C7.79119 43.7234 7.79119 45.9639 7.79119 48.2845C7.79119 48.2044 7.79119 48.2845 7.79119 48.3645Z"
                fill="white"
              />
              <path
                d="M52.2819 48.3644C52.2819 48.2844 52.2819 48.2044 52.2819 48.1244C52.2819 45.8838 52.2819 43.5633 52.2819 41.3227C52.2819 41.2427 52.2819 41.1627 52.2819 41.0026C52.4419 41.0026 52.5219 41.0026 52.682 41.0026C53.6422 41.0026 54.6024 41.0026 55.6427 41.0026C55.7227 41.0026 55.8827 41.0026 55.9628 40.9226C55.9628 41.0026 55.9628 41.1627 55.9628 41.2427C55.9628 43.4832 55.9628 45.7238 55.9628 48.0443C55.9628 48.1244 55.9628 48.2044 55.9628 48.2844H55.8827C54.6024 48.3644 53.4822 48.3644 52.2819 48.3644Z"
                fill="white"
              />
              <path
                d="M11.5513 7.63447C11.5513 7.55445 11.4713 7.47443 11.4713 7.39441C11.4713 6.27414 11.4713 5.15386 11.4713 4.03359V3.95357C11.7114 3.87355 18.193 3.87355 18.7531 3.95357C18.8331 4.19363 18.8331 6.99431 18.7531 7.63447C18.5931 7.63447 18.513 7.63447 18.353 7.63447C16.1925 7.63447 13.9519 7.63447 11.7914 7.63447C11.7914 7.55445 11.6314 7.55445 11.5513 7.63447Z"
                fill="white"
              />
              <path
                d="M26.3557 48.2844C26.3557 47.0841 26.3557 45.8838 26.3557 44.6835C26.5958 44.6035 32.9173 44.6035 33.6375 44.6835C33.7175 44.9236 33.7175 47.5643 33.7175 48.2844C33.3974 48.3644 27.2359 48.3644 26.3557 48.2844Z"
                fill="white"
              />
              <path
                d="M11.4718 52.0452C11.5519 52.0452 11.6319 52.0452 11.7919 52.0452C14.0325 52.0452 16.273 52.0452 18.5136 52.0452C18.5936 52.0452 18.6736 52.0452 18.7536 52.0452C18.8336 52.2852 18.8336 55.326 18.7536 55.7261C16.353 55.7261 13.8724 55.7261 11.4718 55.7261C11.4718 55.486 11.3918 53.1654 11.4718 52.0452Z"
                fill="white"
              />
              <path
                d="M7.71057 48.3645C8.91086 48.3645 10.1912 48.3645 11.4715 48.3645C11.4715 49.6448 11.4715 50.8451 11.4715 52.1254C11.3114 52.1254 11.2314 52.1254 11.0714 52.1254C10.1112 52.1254 9.0709 52.1254 8.11067 52.1254C8.03065 52.1254 7.87061 52.1254 7.71057 52.1254C7.71057 51.9654 7.71057 51.8854 7.71057 51.7253C7.71057 50.7651 7.71057 49.7248 7.71057 48.7646C7.79059 48.6046 7.79059 48.4445 7.71057 48.3645Z"
                fill="white"
              />
              <path
                d="M52.2811 48.3645C52.2811 49.5648 52.2811 50.7651 52.2811 52.0454C52.121 52.0454 52.041 52.0454 51.881 52.0454C50.9207 52.0454 49.8805 52.0454 48.9202 52.0454C48.7602 52.0454 48.6802 52.0454 48.5201 52.0454C48.5201 51.8053 48.5201 51.4853 48.5201 51.2452C48.5201 50.445 48.5201 49.5648 48.5201 48.7646C48.5201 48.6846 48.5201 48.5245 48.5201 48.3645C49.8005 48.3645 51.0007 48.3645 52.2811 48.3645Z"
                fill="white"
              />
              <path
                d="M11.5516 7.63448C11.5516 7.7145 11.5516 7.87453 11.5516 7.95455C11.5516 8.91479 11.5516 9.87502 11.5516 10.9153C11.5516 10.9953 11.5516 11.1553 11.5516 11.3154C11.3916 11.3154 11.3116 11.3154 11.2316 11.3154C10.1913 11.3154 9.23106 11.3154 8.19081 11.3154C8.11079 11.3154 7.95075 11.2354 7.87073 11.2354C7.87073 11.1553 7.87073 10.9953 7.87073 10.9153C7.87073 9.95504 7.87073 8.99481 7.87073 8.03458C7.87073 7.87454 7.87073 7.79452 7.87073 7.63448C7.95075 7.63448 7.95075 7.63448 8.03077 7.63448C9.15104 7.63448 10.3513 7.63448 11.4716 7.63448C11.4716 7.55446 11.4716 7.55446 11.5516 7.63448Z"
                fill="white"
              />
              <path
                d="M48.5201 7.63452C48.6002 7.63452 48.6802 7.63452 48.7602 7.63452C49.8805 7.63452 50.9207 7.63452 52.041 7.63452C52.121 7.63452 52.201 7.63452 52.2811 7.63452C52.2811 7.79456 52.2811 7.87458 52.2811 8.03462C52.2811 8.99485 52.2811 9.95509 52.2811 10.9953C52.2811 11.0754 52.2811 11.2354 52.2811 11.3154C52.201 11.3154 52.121 11.3954 51.961 11.3954C50.9207 11.3954 49.8005 11.3954 48.7602 11.3954C48.6802 11.3954 48.6002 11.3954 48.5201 11.3954C48.5201 11.2354 48.5201 11.1554 48.5201 10.9953C48.5201 10.0351 48.5201 9.07487 48.5201 8.03462C48.5201 7.79456 48.5201 7.71454 48.5201 7.63452Z"
                fill="white"
              />
            </svg>
            <h6>Oops, looks like you are not following us on Telegram</h6>
            <p>
              Follow us on{" "}
              <a href="https://t.me/doptest_Channel" target="_blank">
                https://t.me/doptest_Channel
              </a>{" "}
              and verify again.
            </p>
            {/* https://t.me/doptest_Channel  */}
            {/* https://t.me/dop_community */}
            {/* <a href="#" className="btn-verify">
              Verify again
            </a> */}
            {/* <div
              className="telegram-login-widget flex justify-center"
              ref={telegramWrapperRef12}
            ></div> */}
          </div>
        </Modal.Body>
      </Modal>

      {showModal && (
        <div className="modal-overlayy">
          <div className="telegram-popup-modal modall">
            <Modal.Header>
              <Modal.Title>Follow DOP on Telegram</Modal.Title>
              <a className="btn-closee" onClick={closeModal}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="25"
                  viewBox="0 0 24 25"
                  fill="none"
                >
                  <path
                    d="M12 23.25C6.07 23.25 1.25 18.43 1.25 12.5C1.25 6.57 6.07 1.75 12 1.75C17.93 1.75 22.75 6.57 22.75 12.5C22.75 18.43 17.93 23.25 12 23.25ZM12 3.25C6.9 3.25 2.75 7.4 2.75 12.5C2.75 17.6 6.9 21.75 12 21.75C17.1 21.75 21.25 17.6 21.25 12.5C21.25 7.4 17.1 3.25 12 3.25Z"
                    fill="white"
                  />
                  <path
                    d="M9.17011 16.0801C8.98011 16.0801 8.79011 16.0101 8.64011 15.8601C8.35011 15.5701 8.35011 15.0901 8.64011 14.8001L14.3001 9.14011C14.5901 8.85011 15.0701 8.85011 15.3601 9.14011C15.6501 9.43011 15.6501 9.91011 15.3601 10.2001L9.70011 15.8601C9.56011 16.0101 9.36011 16.0801 9.17011 16.0801Z"
                    fill="white"
                  />
                  <path
                    d="M14.8301 16.0801C14.6401 16.0801 14.4501 16.0101 14.3001 15.8601L8.64011 10.2001C8.35011 9.91011 8.35011 9.43011 8.64011 9.14011C8.93011 8.85011 9.41011 8.85011 9.70011 9.14011L15.3601 14.8001C15.6501 15.0901 15.6501 15.5701 15.3601 15.8601C15.2101 16.0101 15.0201 16.0801 14.8301 16.0801Z"
                    fill="white"
                  />
                </svg>
              </a>
            </Modal.Header>
            <div className="telegram-popup">
              {/* <img
              src="\assets\telegram_img.svg"
              alt="img"
              className="img-fluid"
            /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
              >
                <path
                  d="M26.3557 11.3154C28.8363 11.3154 31.2369 11.3154 33.7175 11.3154C33.7175 21.2379 33.7175 31.0803 33.7175 40.9227C33.4774 41.0027 26.8358 41.0027 26.3557 40.9227C26.3557 31.0803 26.3557 21.1578 26.3557 11.3154Z"
                  fill="white"
                />
                <path
                  d="M40.999 3.9536C40.839 3.9536 40.679 3.9536 40.5989 3.9536C33.4772 3.9536 26.3555 3.9536 19.3137 3.9536C19.1537 3.9536 18.9937 3.9536 18.8336 3.9536C18.8336 2.67329 18.8336 1.473 18.8336 0.272705C26.1954 0.272705 33.6372 0.272705 40.999 0.272705C40.999 0.352725 40.999 0.432744 40.999 0.512763C40.999 1.55302 40.999 2.59327 40.999 3.71354C41.0791 3.71354 41.0791 3.87358 40.999 3.9536Z"
                  fill="white"
                />
                <path
                  d="M4.11005 18.7571C4.11005 18.9171 4.11005 18.9971 4.11005 19.1572C4.11005 26.2789 4.11005 33.4007 4.11005 40.5224C4.11005 40.6024 4.11005 40.7625 4.11005 40.8425C4.03003 40.8425 3.95001 40.9225 3.86999 40.9225C2.74972 40.9225 1.70947 40.9225 0.589192 40.9225C0.509172 40.9225 0.509175 40.9225 0.429155 40.9225C0.349136 40.6824 0.349136 19.2372 0.429155 18.7571C0.509175 18.7571 0.589191 18.7571 0.66921 18.7571C1.70946 18.7571 2.74972 18.7571 3.78997 18.7571C3.95001 18.7571 4.03003 18.7571 4.11005 18.7571Z"
                  fill="white"
                />
                <path
                  d="M55.8821 18.8371C55.9621 18.8371 56.0421 18.7571 56.2022 18.7571C57.2424 18.7571 58.3627 18.7571 59.4029 18.7571C59.483 18.7571 59.563 18.7571 59.643 18.7571C59.643 26.1189 59.643 33.5607 59.643 40.9225C59.563 40.9225 59.483 40.9225 59.4029 40.9225C58.3627 40.9225 57.2424 40.9225 56.2022 40.9225C56.1221 40.9225 56.0421 40.9225 55.8821 40.8425C55.8821 40.6824 55.8821 40.6024 55.8821 40.4424C55.8821 33.3206 55.8821 26.1989 55.8821 19.0772C55.8821 18.9971 55.8821 18.9171 55.8821 18.8371Z"
                  fill="white"
                />
                <path
                  d="M40.999 55.7261C40.999 55.8061 40.999 55.8861 40.999 55.9661C40.999 57.0864 40.999 58.1267 40.999 59.2469C40.999 59.327 40.999 59.407 40.999 59.487C33.6372 59.487 26.1954 59.487 18.8336 59.487C18.8336 58.2867 18.8336 57.0864 18.8336 55.8061C18.9937 55.8061 19.1537 55.8061 19.3137 55.8061C26.4355 55.8061 33.4772 55.8061 40.5989 55.8061C40.759 55.7261 40.919 55.7261 40.999 55.7261Z"
                  fill="white"
                />
                <path
                  d="M52.2819 11.2354C52.3619 11.2354 52.5219 11.3154 52.6019 11.3154C53.5622 11.3154 54.5224 11.3154 55.4826 11.3154C55.6427 11.3154 55.7227 11.3154 55.8827 11.3154C55.8827 11.4754 55.8827 11.5554 55.8827 11.6354C55.8827 13.956 55.8827 16.1966 55.8827 18.5171C55.8827 18.5971 55.8827 18.7572 55.8827 18.8372C55.8027 18.8372 55.6427 18.7572 55.5627 18.7572C54.6024 18.7572 53.6422 18.7572 52.682 18.7572C52.6019 18.7572 52.4419 18.7572 52.2819 18.7572C52.2819 18.6772 52.2819 18.5171 52.2819 18.4371C52.2819 16.1165 52.2819 13.796 52.2819 11.5554C52.2819 11.3954 52.2819 11.3154 52.2819 11.2354Z"
                  fill="white"
                />
                <path
                  d="M7.71001 11.2354C7.71001 11.3154 7.71001 11.4754 7.71001 11.5554C7.71001 13.876 7.71001 16.1966 7.71001 18.5171C7.71001 18.5971 7.71001 18.6772 7.71001 18.7572C7.54997 18.7572 7.46995 18.7572 7.38993 18.7572C6.4297 18.7572 5.46946 18.7572 4.42921 18.7572C4.34919 18.7572 4.18915 18.7572 4.10913 18.8372C4.10913 18.7572 4.10913 18.5971 4.10913 18.5171C4.10913 16.1966 4.10913 13.956 4.10913 11.6354C4.10913 11.5554 4.10913 11.4754 4.10913 11.3154C4.26917 11.3154 4.34919 11.3154 4.42921 11.3154C5.38944 11.3154 6.34968 11.3154 7.38993 11.3154C7.46995 11.2354 7.62999 11.2354 7.71001 11.2354Z"
                  fill="white"
                />
                <path
                  d="M40.9987 3.95355C41.0787 3.95355 41.1588 3.87354 41.3188 3.87354C43.6394 3.87354 45.9599 3.87354 48.2805 3.87354C48.3605 3.87354 48.3605 3.87354 48.4405 3.87354C48.4405 3.95355 48.4405 4.03357 48.4405 4.11359C48.4405 5.15385 48.4405 6.27412 48.4405 7.31438C48.4405 7.39439 48.4405 7.47441 48.3605 7.55443C48.2005 7.55443 48.1205 7.55443 47.9604 7.55443C45.7199 7.55443 43.5593 7.55443 41.3188 7.55443C41.2388 7.55443 41.0787 7.55443 40.9187 7.55443C40.9187 7.39439 40.9187 7.31437 40.9187 7.15434C40.9187 6.1941 40.9187 5.23387 40.9187 4.19361C41.0787 4.11359 41.0787 4.03357 40.9987 3.95355Z"
                  fill="white"
                />
                <path
                  d="M41.0794 55.7261C41.0794 55.6461 41.0794 55.4861 41.0794 55.406C41.0794 54.4458 41.0794 53.4856 41.0794 52.5253C41.0794 52.3653 41.0794 52.2853 41.0794 52.1252C41.1594 52.1252 41.2394 52.1252 41.3194 52.1252C43.64 52.1252 45.9606 52.1252 48.2811 52.1252C48.3612 52.1252 48.4412 52.1252 48.5212 52.1252V52.2053C48.5212 53.3255 48.5212 54.5258 48.5212 55.6461V55.7261C48.4412 55.7261 48.4412 55.7261 48.3612 55.7261C45.9606 55.7261 43.64 55.7261 41.2394 55.7261C41.1594 55.7261 41.0794 55.7261 41.0794 55.7261Z"
                  fill="white"
                />
                <path
                  d="M7.79119 48.3645C6.59089 48.3645 5.3906 48.3645 4.19031 48.3645C4.19031 48.2845 4.19031 48.2044 4.19031 48.1244C4.19031 45.8839 4.19031 43.5633 4.19031 41.3228C4.19031 41.2427 4.19031 41.0827 4.19031 41.0027C4.27033 41.0027 4.43037 41.0827 4.51039 41.0827C5.47062 41.0827 6.43085 41.0827 7.39109 41.0827C7.47111 41.0827 7.63115 41.0827 7.79119 41.0827C7.79119 41.1627 7.79119 41.2427 7.79119 41.4028C7.79119 43.7234 7.79119 45.9639 7.79119 48.2845C7.79119 48.2044 7.79119 48.2845 7.79119 48.3645Z"
                  fill="white"
                />
                <path
                  d="M52.2819 48.3644C52.2819 48.2844 52.2819 48.2044 52.2819 48.1244C52.2819 45.8838 52.2819 43.5633 52.2819 41.3227C52.2819 41.2427 52.2819 41.1627 52.2819 41.0026C52.4419 41.0026 52.5219 41.0026 52.682 41.0026C53.6422 41.0026 54.6024 41.0026 55.6427 41.0026C55.7227 41.0026 55.8827 41.0026 55.9628 40.9226C55.9628 41.0026 55.9628 41.1627 55.9628 41.2427C55.9628 43.4832 55.9628 45.7238 55.9628 48.0443C55.9628 48.1244 55.9628 48.2044 55.9628 48.2844H55.8827C54.6024 48.3644 53.4822 48.3644 52.2819 48.3644Z"
                  fill="white"
                />
                <path
                  d="M11.5513 7.63447C11.5513 7.55445 11.4713 7.47443 11.4713 7.39441C11.4713 6.27414 11.4713 5.15386 11.4713 4.03359V3.95357C11.7114 3.87355 18.193 3.87355 18.7531 3.95357C18.8331 4.19363 18.8331 6.99431 18.7531 7.63447C18.5931 7.63447 18.513 7.63447 18.353 7.63447C16.1925 7.63447 13.9519 7.63447 11.7914 7.63447C11.7914 7.55445 11.6314 7.55445 11.5513 7.63447Z"
                  fill="white"
                />
                <path
                  d="M26.3557 48.2844C26.3557 47.0841 26.3557 45.8838 26.3557 44.6835C26.5958 44.6035 32.9173 44.6035 33.6375 44.6835C33.7175 44.9236 33.7175 47.5643 33.7175 48.2844C33.3974 48.3644 27.2359 48.3644 26.3557 48.2844Z"
                  fill="white"
                />
                <path
                  d="M11.4718 52.0452C11.5519 52.0452 11.6319 52.0452 11.7919 52.0452C14.0325 52.0452 16.273 52.0452 18.5136 52.0452C18.5936 52.0452 18.6736 52.0452 18.7536 52.0452C18.8336 52.2852 18.8336 55.326 18.7536 55.7261C16.353 55.7261 13.8724 55.7261 11.4718 55.7261C11.4718 55.486 11.3918 53.1654 11.4718 52.0452Z"
                  fill="white"
                />
                <path
                  d="M7.71057 48.3645C8.91086 48.3645 10.1912 48.3645 11.4715 48.3645C11.4715 49.6448 11.4715 50.8451 11.4715 52.1254C11.3114 52.1254 11.2314 52.1254 11.0714 52.1254C10.1112 52.1254 9.0709 52.1254 8.11067 52.1254C8.03065 52.1254 7.87061 52.1254 7.71057 52.1254C7.71057 51.9654 7.71057 51.8854 7.71057 51.7253C7.71057 50.7651 7.71057 49.7248 7.71057 48.7646C7.79059 48.6046 7.79059 48.4445 7.71057 48.3645Z"
                  fill="white"
                />
                <path
                  d="M52.2811 48.3645C52.2811 49.5648 52.2811 50.7651 52.2811 52.0454C52.121 52.0454 52.041 52.0454 51.881 52.0454C50.9207 52.0454 49.8805 52.0454 48.9202 52.0454C48.7602 52.0454 48.6802 52.0454 48.5201 52.0454C48.5201 51.8053 48.5201 51.4853 48.5201 51.2452C48.5201 50.445 48.5201 49.5648 48.5201 48.7646C48.5201 48.6846 48.5201 48.5245 48.5201 48.3645C49.8005 48.3645 51.0007 48.3645 52.2811 48.3645Z"
                  fill="white"
                />
                <path
                  d="M11.5516 7.63448C11.5516 7.7145 11.5516 7.87453 11.5516 7.95455C11.5516 8.91479 11.5516 9.87502 11.5516 10.9153C11.5516 10.9953 11.5516 11.1553 11.5516 11.3154C11.3916 11.3154 11.3116 11.3154 11.2316 11.3154C10.1913 11.3154 9.23106 11.3154 8.19081 11.3154C8.11079 11.3154 7.95075 11.2354 7.87073 11.2354C7.87073 11.1553 7.87073 10.9953 7.87073 10.9153C7.87073 9.95504 7.87073 8.99481 7.87073 8.03458C7.87073 7.87454 7.87073 7.79452 7.87073 7.63448C7.95075 7.63448 7.95075 7.63448 8.03077 7.63448C9.15104 7.63448 10.3513 7.63448 11.4716 7.63448C11.4716 7.55446 11.4716 7.55446 11.5516 7.63448Z"
                  fill="white"
                />
                <path
                  d="M48.5201 7.63452C48.6002 7.63452 48.6802 7.63452 48.7602 7.63452C49.8805 7.63452 50.9207 7.63452 52.041 7.63452C52.121 7.63452 52.201 7.63452 52.2811 7.63452C52.2811 7.79456 52.2811 7.87458 52.2811 8.03462C52.2811 8.99485 52.2811 9.95509 52.2811 10.9953C52.2811 11.0754 52.2811 11.2354 52.2811 11.3154C52.201 11.3154 52.121 11.3954 51.961 11.3954C50.9207 11.3954 49.8005 11.3954 48.7602 11.3954C48.6802 11.3954 48.6002 11.3954 48.5201 11.3954C48.5201 11.2354 48.5201 11.1554 48.5201 10.9953C48.5201 10.0351 48.5201 9.07487 48.5201 8.03462C48.5201 7.79456 48.5201 7.71454 48.5201 7.63452Z"
                  fill="white"
                />
              </svg>
              <h6>Oops, looks like you are not following us on Telegram</h6>
              <p>
                Follow us on{" "}
                <a href="https://t.me/Dop_org" target="_blank">
                  https://t.me/Dop_org
                </a>{" "}
                and verify again.
              </p>
              {/* https://t.me/doptest_Channel  */}
              {/* https://t.me/dop_community */}

              <div
                className="telegram-login-widget telegram-login-widget2 flex justify-center"
                ref={telegramWrapperRef15}
              >
                <a href="#" className="btn-verify">
                  Verify again
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <img src={imgeNew} alt="img" className="img-fluid" />
            {/* <h5>Encrypt ${congra?.sendCount}</h5> */}
            <Link href="/badges" className="btn-badge">
              Go to badges
            </Link>
          </div>
          <div className="badges-content mobile-view-badge d-none">
            <img src={imgeNew} alt="img" className="img-fluid" />
            <h6>Congratulations</h6>
            <p>
              You have successfully got <span></span> Badge
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

export default Banner;
