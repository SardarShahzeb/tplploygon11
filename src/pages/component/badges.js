import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "./navbar";
import Loader from "../../hooks/loader";
import { getData } from "../../utils/db";
import { Api_URL } from "../../hooks/apiUrl";
import axios from "axios";
import TwitterLogin from "react-twitter-auth";
import { Modal } from "react-bootstrap";
import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget, verifyWithZkMeServices } from "@zkmelabs/widget";
import { useWeb3React } from "@web3-react/core";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import Environment1 from "../../utils/environment";
import Footer from "./footer";

const Badges = () => {
  const [badgepop, setBadgepop] = useState(false);
  const [user, setUser] = useState(null);
  const [loader, setLoader] = useState(false);
  const [twitterAutization, setTwitterAutization] = useState(false);
  const [verifyemail, setVerifyEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [pastedContent, setPastedContent] = useState("");
  const [verifyemail1, setVerifyEmail1] = useState(false);
  const [verifyemail2, setVerifyEmail2] = useState(false);
  const [zkMeWidget, setZkMeWidget] = useState(null);
  const [token, setToken] = useState(null);
  const { account, chainId } = useWeb3React();
  const [rend, setRend] = useState(false);
  const [recaptch, setRecaptch] = useState(false);
  const [OauthVerifier1, setOauthVerifier1] = useState(false);
  const [OauthToken1, setOauthToken1] = useState(false);
  const [discordCode, setDiscordCode] = useState(null);
  const [telegrampop, setTelegrampop] = useState(false);
  const router = useRouter();

  const [nfts, setNfts] = useState({
    jack: 0,
    queen: 0,
    king: 0,
    treasury: 0,
  });

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
  const telegramWrapperRef = useRef(null);
  const telegramWrapperRef12 = useRef(null);

  useEffect(() => {
    if (telegramWrapperRef?.current) {
      const scriptElement = document.createElement("script");
      scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
      scriptElement.setAttribute("data-telegram-login", "DOP_mainnet2_bot");
      scriptElement.setAttribute("data-size", "large");
      scriptElement.setAttribute(
        "data-auth-url",
        "https://tplsnark-latest.vercel.app"
      );
      scriptElement.async = true;

      telegramWrapperRef.current?.appendChild(scriptElement);
    }
  }, [telegramWrapperRef]);

  useEffect(() => {
    if (telegramWrapperRef12?.current) {
      const scriptElement = document.createElement("script");
      scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
      scriptElement.setAttribute("data-telegram-login", "DOP_mainnet3_bot");
      scriptElement.setAttribute("data-size", "large");
      scriptElement.setAttribute(
        "data-auth-url",
        "https://tplsnark-latest.vercel.app"
      );
      scriptElement.async = true;

      telegramWrapperRef12.current?.appendChild(scriptElement);
    }
  }, [telegramWrapperRef12]);

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
        let headers = {
          Authorization: `Bearer ${tok}`, // Include your authentication token here
        };
        axios
          .get(`${Api_URL}/users/profile`, { headers })
          .then((response) => {
            // Handle the success of the GET request
            setUser(response.data?.data);
          })
          .catch((error) => {
            // Handle errors that occurred during the GET request
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        // toast.error(error?.response?.data?.message);
        router.push("/");
        if (
          error?.response?.data?.message !==
          "The Telegram account you are trying to log in to is affiliated with another DOP account"
        ) {
          // setTelegrampop(true);
        }
        console.error("Error2:", error);
      });
  };

  useEffect(() => {
    getProfile();
    getAccessToken();
    getNfts();
    var val = window.location.href;
    val = new URL(val);
    var id = val.searchParams.get("code");
    if (id) {
      setDiscordCode(id);
    }
  }, []);

  const getNfts = async () => {
    // 0xD644C1B56c3F8FAA7beB446C93dA2F190bFaeD9B
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
        const nftNames = res.data.result.map(
          (nft) => JSON.parse(nft.metadata).name
        ); // Adjust this line based on the actual structure of your API response
        updateNftCounts(nftNames);
      })
      .catch((err) => {
        console.log("err from moralis", err);
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

  const handleCloseverifyemail = () => {
    setVerifyEmail(false);
    setError("");
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
        router.push("/badges");
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
    // setError(JSON.stringify(error));
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
          toast.error(
            "Unable to Verify twitter due to high traffic, Please try later."
          );
          setOauthToken1(error?.response?.data?.oauth_token);
          setOauthVerifier1(error?.response?.data?.oauth_token_secret);
          const searchString = "not accepted";
          const containsPhrase = JSON.stringify(error?.message).includes(
            searchString
          );
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
        console.log("verify email", response?.data?.data);
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
        console.log("error", error?.response?.data?.message);
        setError(error?.response?.data?.message);
      });
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
          handleShoweverifyemail1();
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
          setBadgepop(true)

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
        //   console.log("error:::", err);
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

  return (
    <>
      {loader && <Loader />}
      <Navbar />
      <section className="badges-section">
        <div className="custom-container">
          <a href="/" className="btn-back-mobile d-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M8.37376 16.4675C8.20751 16.4675 8.04126 16.4062 7.91001 16.275L2.59876 10.9637C2.34501 10.71 2.34501 10.29 2.59876 10.0362L7.91001 4.72498C8.16376 4.47123 8.58376 4.47123 8.83751 4.72498C9.09126 4.97873 9.09126 5.39873 8.83751 5.65248L3.99001 10.5L8.83751 15.3475C9.09126 15.6012 9.09126 16.0212 8.83751 16.275C8.71501 16.4062 8.54001 16.4675 8.37376 16.4675Z"
                fill="white"
              />
              <path
                d="M17.9374 11.1562H3.21118C2.85243 11.1562 2.55493 10.8587 2.55493 10.5C2.55493 10.1413 2.85243 9.84375 3.21118 9.84375H17.9374C18.2962 9.84375 18.5937 10.1413 18.5937 10.5C18.5937 10.8587 18.2962 11.1562 17.9374 11.1562Z"
                fill="white"
              />
            </svg>
            Back
          </a>
          <div className="parent-badges">
            <div className="main-heading">
              <h6>Social Badges</h6>
            </div>
            <div className="inside-badges">
              <div className="single-badge">
                {/* {user?.follow_Us_On_Telegram?.isCompleted ? (
                    <img
                      src="\assets\newbadges\social\telegram-active.svg"
                      alt="img"
                      className="img-fluid"
                    />
                  ) : (
                    <div
                      className="telegram-login-widget flex justify-center mb-3"
                      ref={telegramWrapperRef}
                    ></div>
                  )} */}
                {user?.follow_Us_On_Telegram?.isCompleted ? (
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
                <div className="text">
                  <h6>
                    Join dop <br /> on Telegram
                  </h6>
                </div>
                <div
                  className="telegram-login-widget flex justify-center"
                  ref={telegramWrapperRef}
                ></div>
                {user?.follow_Us_On_Telegram?.isCompleted ? (
                  <p className="ifcompleted-show telegram-link">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                ) : (
                  // <a className="set-custom-link telegram-link">Link Telegram</a>
                  // <div style={{ display: "flex" }}>
                  //   <a
                  //     href="https://t.me/doptest_Channel"
                  //     className="set-custom-link telegram-link"
                  //   >
                  //     Join
                  //   </a>
                  //   <p style={{ color: "#fff" }}>{"&"}</p>
                  <a className="set-custom-link telegram-link">Verify</a>
                  // </div>
                )}
              </div>
              <div className="single-badge">
                {user?.follow_Us_On_Twitter?.isCompleted ? (
                  <img
                    src="\assets\newbadges\social\twitter-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <>
                    <div>
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
                        </>
                      )}
                    </div>

                    <div className="text">
                      <h6>
                        follow DOP <br /> on x
                      </h6>
                    </div>
                    {user?.follow_Us_On_Twitter?.isCompleted ? (
                      <p className="ifcompleted-show">
                        Completed{" "}
                        <span className="bg-icon-green">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="9"
                            height="6"
                            viewBox="0 0 9 6"
                            fill="none"
                          >
                            <path
                              d="M1 3.00001L3.3335 5L8 1"
                              stroke="white"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </span>
                      </p>
                    ) : (
                      <TwitterLogin
                        loginUrl={Api_URL + "/users/twitter"}
                        onFailure={onFailed}
                        onSuccess={onSuccess}
                        requestTokenUrl={Api_URL + "/users/twitter-auth"}
                        className="btn-set-twitter"
                      >
                        <div onClick={() => VerifyFollow()}>Follow on X </div>
                      </TwitterLogin>
                    )}
                  </>
                )}
              </div>
              <div className="single-badge">
                {user?.follow_Us_On_Discord?.isCompleted ? (
                  <img
                    src="\assets\newbadges\social\discord-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  // <a>
                  <img
                    src="\assets\newbadges\social\discord.svg"
                    alt="img"
                    className="img-fluid"
                  />
                  // </a>
                )}
                <div className="text">
                  <h6>
                  Join DOP's <br /> Discord Server
                  </h6>
                </div>
                {user?.follow_Us_On_Discord?.isCompleted ? (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                ) : (
                  <a
                    href="https://discord.com/oauth2/authorize?client_id=1242412043336810537&response_type=code&redirect_uri=https%3A%2F%2Ftplsnark-latest.vercel.app&scope=identify+guilds+guilds.join"
                    className="set-custom-link"
                  >
                    Join Discord
                  </a>
                )}
                {/* Mainnet */}
                {/* https://discord.com/oauth2/authorize?client_id=1242412043336810537&response_type=code&redirect_uri=https%3A%2F%2Fapp.dop.org&scope=identify+guilds+guilds.join */}
              </div>
              <div className="single-badge">
                {user?.isKycVerified ? (
                  <img
                    src="\assets\newbadges\social\zkkyc-active.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="\assets\newbadges\social\zkkyc.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                <div className="text">
                  <h6>
                    Complete <br /> zk KYC
                  </h6>
                </div>
                {user?.isKycVerified ? (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                ) : (
                  <a onClick={() => launchZkME()} className="set-custom-link">
                    Complete KYC
                  </a>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    Complete <br /> email verification
                  </h6>
                </div>
                {user?.isEmailVerified ? (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                ) : (
                  <a
                    onClick={() => setVerifyEmail(true)}
                    className="set-custom-link"
                  >
                    Start Verification
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="parent-badges">
            <div className="main-heading">
              <h6>encrypt Badges</h6>
            </div>
            <div className="inside-badges">
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    encrypt <br /> $10,000
                  </h6>
                </div>
                {user?.encryptAmount >= 10000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    encrypt <br /> $20,000
                  </h6>
                </div>
                {user?.encryptAmount >= 20000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    encrypt <br /> $50,000
                  </h6>
                </div>
                {user?.encryptAmount >= 50000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    encrypt <br /> $100,000
                  </h6>
                </div>
                {user?.encryptAmount >= 100000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
                {user?.encryptAmount <= 500000 ? (
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
                <div className="text">
                  <h6>
                    encrypt <br /> $500,000
                  </h6>
                </div>
                {user?.encryptAmount >= 500000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    encrypt <br /> $1,000,000
                  </h6>
                </div>
                {user?.encryptAmount >= 1000000 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="parent-badges">
            <div className="main-heading">
              <h6>Sends Badges</h6>
            </div>
            <div className="inside-badges">
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    50 <br /> sends
                  </h6>
                </div>
                {user?.sendCount >= 50 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    100 <br /> sends
                  </h6>
                </div>
                {user?.sendCount >= 100 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    200 <br /> sends
                  </h6>
                </div>
                {user?.sendCount >= 200 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>
                    500 <br /> sends
                  </h6>
                </div>
                {user?.sendCount >= 500 && (
                  <p className="ifcompleted-show">
                    Completed{" "}
                    <span className="bg-icon-green">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="6"
                        viewBox="0 0 9 6"
                        fill="none"
                      >
                        <path
                          d="M1 3.00001L3.3335 5L8 1"
                          stroke="white"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </span>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="parent-badges">
            <div className="main-heading">
              <h6>NFT Badges</h6>
            </div>
            <div className="inside-badges">
              <div className="single-badge">
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
                <div className="text">
                  <h6>DOP Soldier</h6>
                </div>
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>DOP Queen</h6>
                </div>
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>DOP King</h6>
                </div>
              </div>
              <div className="single-badge">
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
                <div className="text">
                  <h6>DOP Treasure </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />

      <Modal
        className="important-note"
        show={verifyemail}
        onHide={() => {
          setVerifyEmail(false);
          setError("");
        }}
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
              <a href="https://t.me/dop_community" target="_blank">
                https://t.me/dop_community
              </a>{" "}
              and verify again.
            </p>
            {/* <a href="#" className="btn-verify">
              Verify again
            </a>
            <div
              className="telegram-login-widget flex justify-center"
              ref={telegramWrapperRef12}
            ></div> */}
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
            <img
              src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188182/dop/newbadges/social/email-active_wu5mun.svg"
              alt="img"
              className="img-fluid"
            />
            {/* <h5>Encrypt ${congra?.sendCount}</h5> */}
            <Link href="/badges" className="btn-badge">
              Go to badges
            </Link>
          </div>
          <div className="badges-content mobile-view-badge d-none">
            <img src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188182/dop/newbadges/social/email-active_wu5mun.svg" alt="img" className="img-fluid" />
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

export default Badges;
