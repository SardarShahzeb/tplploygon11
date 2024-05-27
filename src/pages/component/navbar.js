import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import useAuth from "../../hooks/useAuth";
const { NETWORK_CONFIG, NetworkName } = require("dop-sharedmodels");
import Loader from "../../hooks/loader";
import { useSelector, useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import { Api_URL } from "../../hooks/apiUrl";
import axios from "axios";
import Accordion from "react-bootstrap/Accordion";
const {
  refreshDopBalances,
  rescanFullMerkletreesAndWallets,
  createDopWallet,
} = require("dop-wallet-old");
import { getData } from "../../utils/db";

const Navbar = ({ user, setUser }) => {
  const router = useRouter();
  const { account } = useWeb3React();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { login, logout } = useAuth();
  const [theme, setTheme] = useState("dark-theme");
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setTheme(savedTheme ? savedTheme : "dark-theme");
    }
    getProfile();
  }, []);

  const getProfile = async () => {
    let tok = localStorage.getItem("myToken");
    const headers = {
      Authorization: `Bearer ${tok}`,
    };
    axios
      .get(`${Api_URL}/users/profile`, { headers })
      .then((response) => { })
      .catch((error) => {
        console.error("Error:", error);
        let soso = getData("accounts");
        if (soso?.length > 0) {
          router.push("/unlockwallet");
        } else {
          router.push("/home");
        }
      });
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    document.body.className = newTheme;
  };


  const [showwallet, setShowWallet] = useState(false);
  const handleClosewallet = () => setShowWallet(false);

  const [showfaq, setShowfaq] = useState(false);
  const handleClosefaq = () => setShowfaq(false);

  const connectMetamaskSignUp = async () => {
    if (account) {
      const connectorId = window.localStorage.getItem("connectorId");
      await logout(connectorId);
      localStorage.removeItem("connectorId");
      localStorage.removeItem("flag");
      localStorage.removeItem("myToken");
      localStorage.removeItem("signValue");
      router.push("/unlockwallet");
    } else {
      login("injected");
      localStorage.setItem("connectorId", "injected");
      localStorage.setItem("flag", "true");
    }
    handleClosewallet();
  };

  const trustWalletSignUp = async () => {
    if (account) {
      await logout("walletconnect");
      localStorage.removeItem("myToken");
      localStorage.removeItem("signValue");
      router.push("/unlockwallet");
    } else {
      login("walletconnect");
      localStorage.setItem("connectorId", "walletconnect");
      localStorage.setItem("flag", "true");
    }
    handleClosewallet();
  };

  useEffect(() => {
    setTimeout(() => {
      GetBalances();
    }, 3000);
  }, []);

  const GetBalances = async () => {
    let item = await getData("selectedAccount");
    // setLoader(true);
    if (item) {
      dispatch({ type: "UPDATE_EXAMPLE", payload: [] });
      const { chain } = NETWORK_CONFIG[NetworkName.Polygon];
      const creationBlockNumberMap = {
        [NetworkName.Polygon]: 55853022,
        [NetworkName.Polygon]: 55853022,
      };
      const key = "dopTPL_";
      const encryptionKey = CryptoJS.AES?.decrypt(
        item?.dopEncryptionKey,
        key
      ).toString(CryptoJS.enc.Utf8);
      const mnemonic = item?.phrase;
      // const mnemonic =  "direct hip around gossip giant bargain entire certain decline focus mesh boy";
      const dopWalletInfo = await createDopWallet(
        encryptionKey,
        mnemonic,
        creationBlockNumberMap
      );
      const dopWalletID = dopWalletInfo.id;
      try {
        const fullRescan = true;
        const res = await refreshDopBalances(
          chain,
          dopWalletID,
          fullRescan
        );
        // const res = await rescanFullMerkletreesAndWallets(chain);
        setLoader(false);
        // dispatch({
        //   type: "UPDATE_EXAMPLE",
        //   payload: balancesFormatted?.erc20Amounts,
        // });
      } catch (err) {
        setLoader(false);
        console.log("err", err);
      }
    }
  };

  return (
    <>
      {loader && <Loader />}
      {/* {loader && <Loader text={"Fetching private balances..."} />} */}
      <section className="main-navbar">
        <div className="custom-container">
          <nav className="navbar navbar-expand-xl">
            <div className="container-fluid p-0">
              <Link href="/" className="navbar-brand">
                {theme == "light-theme" ? (
                  <img src="\logo.svg" alt="logo" className="logo" />
                ) : (
                  <img src="\dark-logo.svg" alt="logo" className="logo" />
                )}
              </Link>
              <button
                onClick={handleShow}
                className="navbar-toggler"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <g clip-path="url(#clip0_48_777)">
                    <path
                      d="M3 18H21V16H3V18ZM3 13H21V11H3V13ZM3 6V8H21V6H3Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_48_777">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
              <div
                className="collapse navbar-collapse navbar-dnone-in-mobile"
                id="navbarSupportedContent"
              >
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                  <li class="nav-item">
                    <Link
                      href="/"
                      onClick={() => setLoader(true)}
                      className={
                        router.pathname === "/" ? "nav-link active" : "nav-link"
                      }
                      aria-current="page"
                    >
                      Account
                    </Link>
                  </li>
                  <li class="nav-item">
                    <Link
                      onClick={() => setLoader(true)}
                      className={
                        router.pathname === "/component/history"
                          ? "nav-link active"
                          : "nav-link"
                      }
                      href="/history"
                    >
                      History
                    </Link>
                  </li>
                  {/* <li class="nav-item">
                    <Link
                      onClick={() => setLoader(true)}
                      className={
                        router.pathname === "/component/transaction"
                          ? "nav-link active"
                          : "nav-link"
                      }
                      href="/"
                    >
                      Referrals
                    </Link>
                  </li> */}
                  <li class="nav-item">
                    <Link
                      onClick={() => setLoader(true)}
                      className={
                        router.pathname === "/component/badges"
                          ? "nav-link active"
                          : "nav-link"
                      }
                      href="/badges"
                    >
                      Badges
                    </Link>
                  </li>
                </ul>
                <div className="right-content">
                  {/* <a href="#" >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <path
                        d="M9.49875 0C7.6925 0 6.35375 0.5525 5.50375 1.4025C4.65375 2.2525 4.35625 3.315 4.25 4.1225L6.375 4.39875C6.46 3.8675 6.63 3.33625 7.03375 2.9325C7.4375 2.52875 8.075 2.125 9.49875 2.125C10.9012 2.125 11.6662 2.465 12.0912 2.8475C12.5162 3.23 12.6862 3.6975 12.6862 4.25C12.6862 6.01375 11.9637 6.5025 10.9012 7.4375C9.83875 8.3725 8.43625 9.7325 8.43625 12.2188V12.75H10.5612V12.2188C10.5612 10.455 11.22 9.96625 12.2825 9.03125C13.345 8.09625 14.8112 6.73625 14.8112 4.25C14.8112 3.23 14.45 2.0825 13.5575 1.25375C12.6437 0.425 11.2837 0 9.49875 0ZM8.43625 14.875V17H10.5612V14.875H8.43625Z"
                        fill="white"
                      />
                    </svg>
                  </a> */}
                  <div class="btn-group custom-faqs-drop">
                    <button
                      class="dropdown-toggle question-btn"
                      type="button"
                      data-bs-toggle="dropdown"
                      data-bs-auto-close="outside"
                      aria-expanded="false"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <path
                          d="M9.49875 0C7.6925 0 6.35375 0.5525 5.50375 1.4025C4.65375 2.2525 4.35625 3.315 4.25 4.1225L6.375 4.39875C6.46 3.8675 6.63 3.33625 7.03375 2.9325C7.4375 2.52875 8.075 2.125 9.49875 2.125C10.9012 2.125 11.6662 2.465 12.0912 2.8475C12.5162 3.23 12.6862 3.6975 12.6862 4.25C12.6862 6.01375 11.9637 6.5025 10.9012 7.4375C9.83875 8.3725 8.43625 9.7325 8.43625 12.2188V12.75H10.5612V12.2188C10.5612 10.455 11.22 9.96625 12.2825 9.03125C13.345 8.09625 14.8112 6.73625 14.8112 4.25C14.8112 3.23 14.45 2.0825 13.5575 1.25375C12.6437 0.425 11.2837 0 9.49875 0ZM8.43625 14.875V17H10.5612V14.875H8.43625Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                    <ul class="dropdown-menu">
                      <div className="parent-question">
                        <div className="upper-heading">
                          <h6>Help & Support</h6>
                        </div>
                        <div className="twice-btns">
                          <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                              <path d="M12.75 1.82251H5.25C3 1.82251 1.5 3.32251 1.5 5.57251V10.0725C1.5 12.3225 3 13.8225 5.25 13.8225V15.42C5.25 16.02 5.9175 16.38 6.4125 16.0425L9.75 13.8225H12.75C15 13.8225 16.5 12.3225 16.5 10.0725V5.57251C16.5 3.32251 15 1.82251 12.75 1.82251ZM9 10.95C8.685 10.95 8.4375 10.695 8.4375 10.3875C8.4375 10.08 8.685 9.82501 9 9.82501C9.315 9.82501 9.5625 10.08 9.5625 10.3875C9.5625 10.695 9.315 10.95 9 10.95ZM9.945 7.83751C9.6525 8.03251 9.5625 8.16001 9.5625 8.37001V8.52751C9.5625 8.83501 9.3075 9.09001 9 9.09001C8.6925 9.09001 8.4375 8.83501 8.4375 8.52751V8.37001C8.4375 7.50001 9.075 7.07251 9.315 6.90751C9.5925 6.72001 9.6825 6.59251 9.6825 6.39751C9.6825 6.02251 9.375 5.71501 9 5.71501C8.625 5.71501 8.3175 6.02251 8.3175 6.39751C8.3175 6.70501 8.0625 6.96001 7.755 6.96001C7.4475 6.96001 7.1925 6.70501 7.1925 6.39751C7.1925 5.40001 8.0025 4.59001 9 4.59001C9.9975 4.59001 10.8075 5.40001 10.8075 6.39751C10.8075 7.25251 10.1775 7.68001 9.945 7.83751Z" fill="white" />
                            </svg>
                            Create support ticket
                          </a>
                          <a href="#">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="19"
                              viewBox="0 0 18 19"
                              fill="none"
                            >
                              <rect
                                y="0.5"
                                width="18"
                                height="18"
                                rx="9"
                                fill="white"
                              />
                              <path
                                d="M13.5138 6.41745C12.6881 5.7569 11.6972 5.42663 10.6514 5.37158L10.4862 5.53672C11.422 5.7569 12.2477 6.19727 13.0183 6.80277C12.0826 6.30736 11.0367 5.97709 9.93578 5.86699C9.6055 5.81195 9.33028 5.81195 9 5.81195C8.66972 5.81195 8.3945 5.81195 8.06422 5.86699C6.9633 5.97709 5.91743 6.30736 4.98165 6.80277C5.75229 6.19727 6.57798 5.7569 7.51376 5.53672L7.34862 5.37158C6.30275 5.42663 5.31193 5.7569 4.48624 6.41745C3.55046 8.17892 3.05505 10.1606 3 12.1973C3.82569 13.078 4.98165 13.6285 6.19266 13.6285C6.19266 13.6285 6.57798 13.1881 6.85321 12.8028C6.13761 12.6376 5.47706 12.2523 5.0367 11.6468C5.42202 11.867 5.80734 12.0872 6.19266 12.2523C6.68807 12.4725 7.18349 12.5826 7.6789 12.6927C8.11927 12.7477 8.55963 12.8028 9 12.8028C9.44037 12.8028 9.88073 12.7477 10.3211 12.6927C10.8165 12.5826 11.3119 12.4725 11.8073 12.2523C12.1927 12.0872 12.578 11.867 12.9633 11.6468C12.5229 12.2523 11.8624 12.6376 11.1468 12.8028C11.422 13.1881 11.8073 13.6285 11.8073 13.6285C13.0183 13.6285 14.1743 13.078 15 12.1973C14.945 10.1606 14.4495 8.17892 13.5138 6.41745ZM7.18349 11.2064C6.63303 11.2064 6.13761 10.711 6.13761 10.1055C6.13761 9.50002 6.63303 9.00461 7.18349 9.00461C7.73394 9.00461 8.22936 9.50002 8.22936 10.1055C8.22936 10.711 7.73394 11.2064 7.18349 11.2064ZM10.8165 11.2064C10.2661 11.2064 9.77064 10.711 9.77064 10.1055C9.77064 9.50002 10.2661 9.00461 10.8165 9.00461C11.367 9.00461 11.8624 9.50002 11.8624 10.1055C11.8624 10.711 11.367 11.2064 10.8165 11.2064Z"
                                fill="black"
                              />
                            </svg>{" "}
                            contact on discord
                          </a>
                        </div>
                        <div className="faqs-part">
                          <div className="main-heading">
                            <h6>Frequently Asked Questions</h6>
                          </div>
                          <Accordion>
                            <Accordion.Item eventKey="0">
                              <Accordion.Header>
                                {" "}
                                <span>01.</span> What is the DOP mainnet?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet is the live, production-ready
                                version of the Data Ownership Protocol, which
                                allows users to encrypt, send, and decrypt
                                transactions on the Ethereum blockchain. It
                                enables selective transparency, giving users
                                control over their financial data and
                                transactions. <br />
                                That said,{" "}
                                <span style={{ fontWeight: "bold" }}>
                                  it is still in Beta version
                                </span>
                                , featuring only the core features of the Data
                                Ownership Protocol. More features will be added
                                over time.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="1">
                              <Accordion.Header>
                                {" "}
                                <span>02.</span> What are the key features of
                                the DOP mainnet?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet offers several key features:{" "}
                                <br />
                                <ul>
                                  <li>
                                    Secure encryption and decryption of assets
                                    using zero-knowledge proofs
                                  </li>
                                  <li>
                                    Ability to selectively disclose holdings,
                                    transactions, and activity
                                  </li>
                                  <li>
                                    Seamless integration with existing Ethereum
                                    wallets
                                  </li>
                                  <li>
                                    Collaboration with Chainalysis to screen
                                    transactions and prevent illicit funds
                                  </li>
                                </ul>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="2">
                              <Accordion.Header>
                                {" "}
                                <span>03.</span> What are the benefits of using
                                the DOP mainnet?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet provides benefits for both
                                individual users and businesses: <br />
                                <ul>
                                  <li>
                                    For individuals, it enables privacy and
                                    control over personal data and financial
                                    transactions, allowing for confidential
                                    crypto payments and DeFi exploration.
                                  </li>
                                  <li>
                                    For businesses, it offers secure and
                                    efficient solutions to protect competitive
                                    edges, integrate with existing systems, and
                                    avoid risks from tainted funds.
                                  </li>
                                </ul>
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="3">
                              <Accordion.Header>
                                {" "}
                                <span>04.</span> How does the DOP mainnet work?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet uses unique "smart bouncers" and
                                zero-knowledge proofs to enable selective
                                transparency on the Ethereum blockchain. Users
                                can encrypt their assets, send them to other DOP
                                wallets, and decrypt them as needed, maintaining
                                control over their financial data.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="4">
                              <Accordion.Header>
                                {" "}
                                <span>05.</span> How can users participate in
                                the Mainnet Airdrop Campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                Users can participate in the Mainnet Airdrop
                                Campaign by engaging in various activities on
                                the DOP mainnet, such as encrypting assets,
                                decrypting assets, sending transactions,
                                referring others, and staking DOP tokens (once
                                available). For the full details, read our{" "}
                                <a
                                  href="https://dop.org/blog/earn-dop-tokens-with-our-mainnet-reward-campaign"
                                  target="_blank"
                                >
                                  blog post
                                </a>
                                .
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="5">
                              <Accordion.Header>
                                {" "}
                                <span>06.</span>What are the rewards for
                                participating in the Mainnet Airdrop Campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                The Mainnet Airdrop Campaign rewards users based
                                on a points system. Users can earn points for
                                actions like encryption, decryption, sending,
                                referrals, and staking. These points will be
                                used to determine the amount of DOP tokens users
                                receive as rewards.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="6">
                              <Accordion.Header>
                                {" "}
                                <span>07.</span> What is the purpose of the DOP
                                Mainnet Airdrop Campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                The primary purpose of the DOP Mainnet Airdrop
                                Campaign is to promote the usage of the DOP
                                mainnet, increase the protocol's total value
                                locked (TVL), and incentivize staking of the DOP
                                token once it becomes available.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="7">
                              <Accordion.Header>
                                {" "}
                                <span>08.</span> How many DOP tokens are
                                allocated for the Mainnet Airdrop Campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                The Mainnet Airdrop Campaign is divided into two
                                phases: V1 and V2. A total of 460,000,000 DOP
                                tokens have been allocated for the campaign,
                                with 230,000,000 DOP tokens dedicated to the
                                first phase (V1), which is currently ongoing.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="8">
                              <Accordion.Header>
                                {" "}
                                <span>09.</span> What actions are rewarded in
                                the V1 campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                In the V1 campaign, users can earn rewards for
                                the following actions: encrypting assets,
                                decrypting assets, completing achievements
                                (badges), and staking DOP tokens (once
                                available).
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="9">
                              <Accordion.Header>
                                {" "}
                                <span>10.</span> How is the points system
                                structured for the V1 campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                The points system in the V1 campaign works as
                                follows: <br />
                                Encryption: 1 point per $1 worth of assets
                                encrypted (with a 0.1% fee) <br />
                                Decryption: 0.5 points per $1 worth of assets
                                decrypted (with a 0.1% fee) <br />
                                Sending: 20 points per sending action <br />
                                Referrals: 10% bonus on referral points, 100
                                points bonus for referred user after first
                                encryption <br />
                                Badges: Social (+300 points), Encrypt (+300
                                points per 10k), Sends (+300 points per 50
                                sends) <br />
                                Staking: 0.05 points per 1 DOP staked per 24
                                hours, 10% bonus for every 30 days of staking
                                (once available)
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="10">
                              <Accordion.Header>
                                {" "}
                                <span>11.</span> What are the fees for using the
                                mainnet?
                              </Accordion.Header>
                              <Accordion.Body>
                                There is a fee of 0.1% for every encryption and
                                decryption action. At a later stage, an
                                additional fee of 10 DOP will be applied to each
                                transaction. Since DOP currently operates on
                                Ethereum, all transactions will also incur the
                                usual Ethereum network gas fees. <br />
                                It’s important to note that in the
                                not-so-distant future DOP will be integrated
                                into various EVMs, so the network gas fees will
                                vary accordingly, and will be significantly
                                lower than Ethereum’s.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="11">
                              <Accordion.Header>
                                {" "}
                                <span>12.</span> How are the fees generated from
                                the DOP mainnet used?
                              </Accordion.Header>
                              <Accordion.Body>
                                The fees generated from the DOP mainnet are used
                                for two purposes: 75% of the fees go towards the
                                buy-back-burn of DOP tokens, while the remaining
                                25% are used for staking incentives.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="12">
                              <Accordion.Header>
                                {" "}
                                <span>13.</span> When will the V2 campaign of
                                the Mainnet Airdrop start?
                              </Accordion.Header>
                              <Accordion.Body>
                                The details of the V2 campaign, including its
                                start date, are currently unknown. The V2
                                campaign will be launched during phase 2 of the
                                DOP project's development.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="13">
                              <Accordion.Header>
                                {" "}
                                <span>14.</span> How does the DOP mainnet ensure
                                the security of encrypted assets?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet uses zero-knowledge proofs and
                                "smart bouncers" to securely store and transfer
                                encrypted assets on the Ethereum blockchain.
                                This ensures the integrity and privacy of user
                                transactions and holdings.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="14">
                              <Accordion.Header>
                                {" "}
                                <span>15.</span> What is the role of the DOP
                                token in the ecosystem?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP token is the native utility token of the
                                DOP ecosystem. It is used to facilitate private
                                transactions, incentivize network participation,
                                and enable staking rewards.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="15">
                              <Accordion.Header>
                                {" "}
                                <span>16.</span> How does the DOP mainnet align
                                with the project's vision of data ownership and
                                privacy?
                              </Accordion.Header>
                              <Accordion.Body>
                                The DOP mainnet is a crucial first step in the
                                project's long-term vision of bringing data
                                ownership and privacy to the Ethereum ecosystem.
                                Future phases of the project will focus on
                                expanding the platform's capabilities in this
                                area.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="16">
                              <Accordion.Header>
                                {" "}
                                <span>17.</span> What happens to the DOP tokens
                                that are not claimed at the end of the Mainnet
                                Airdrop Campaign?
                              </Accordion.Header>
                              <Accordion.Body>
                                Any DOP tokens that are not claimed at the end
                                of the Mainnet Airdrop Campaign will be used to
                                benefit the community. This could include future
                                airdrops, community incentives, or other
                                initiatives designed to enhance the DOP
                                ecosystem, or even burning the tokens to
                                positively impact the total supply and scarcity
                                of the token, ultimately benefiting the token's
                                value.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="17">
                              <Accordion.Header>
                                {" "}
                                <span>18.</span> How will the DOP tokens
                                allocated for the Mainnet Airdrop Campaign
                                impact the overall token supply and
                                distribution?
                              </Accordion.Header>
                              <Accordion.Body>
                                The Mainnet Airdrop Campaign will be divided
                                into two phases to prevent a massive release of
                                tokens all at once. Although these tokens are
                                considered released and in circulation, they
                                will only reach users gradually over several
                                months, following the completion of the first
                                campaign. It is important to note that this
                                campaign will not affect the total supply of DOP
                                tokens.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="18">
                              <Accordion.Header>
                                {" "}
                                <span>19.</span> Will any verification be
                                required to claim the rewards when the campaign
                                ends?
                              </Accordion.Header>
                              <Accordion.Body>
                                To claim rewards from the Mainnet Airdrop
                                Campaign, users might be required to go through
                                a proof-of-humanity process to verify their
                                identity and prevent bots or fake accounts from
                                participating.
                              </Accordion.Body>
                            </Accordion.Item>
                            <Accordion.Item eventKey="19">
                              <Accordion.Header>
                                {" "}
                                <span>20.</span> How secure is the DOP mainnet
                                and protocol?
                              </Accordion.Header>
                              <Accordion.Body>
                                We place a high priority on security and have
                                invested significantly in ensuring the safety of
                                the DOP mainnet and protocol. With the launch of
                                the mainnet, we will continue to employ
                                additional tools to further strengthen security.
                                We have made extensive efforts to secure the
                                protocol, including a comprehensive security
                                audit by Hacken, which awarded us an impressive
                                Security Score of 10/10, Code Quality Score of
                                10/10, and an Overall Score of 9.7/10. <br />
                                Our team includes security experts who
                                contribute to the proper architecture and
                                ongoing security measures. Additionally, we plan
                                to conduct future bug bounty campaigns to
                                continuously enhance our security posture.
                              </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                        </div>
                      </div>
                    </ul>
                  </div>
                  <div className="themeimg ms-auto" onClick={toggleTheme}>
                    {theme == "light-theme" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M8.82545 12.6663C11.4028 12.6663 13.4921 10.577 13.4921 7.99967C13.4921 5.42235 11.4028 3.33301 8.82545 3.33301C6.24812 3.33301 4.15878 5.42235 4.15878 7.99967C4.15878 10.577 6.24812 12.6663 8.82545 12.6663Z"
                          fill="black"
                        />
                        <path
                          d="M8.82543 15.307C8.45876 15.307 8.15876 15.0337 8.15876 14.667V14.6137C8.15876 14.247 8.45876 13.947 8.82543 13.947C9.1921 13.947 9.4921 14.247 9.4921 14.6137C9.4921 14.9803 9.1921 15.307 8.82543 15.307ZM13.5854 13.427C13.4121 13.427 13.2454 13.3603 13.1121 13.2337L13.0254 13.147C12.7654 12.887 12.7654 12.467 13.0254 12.207C13.2854 11.947 13.7054 11.947 13.9654 12.207L14.0521 12.2937C14.3121 12.5537 14.3121 12.9737 14.0521 13.2337C13.9254 13.3603 13.7588 13.427 13.5854 13.427ZM4.06543 13.427C3.8921 13.427 3.72543 13.3603 3.5921 13.2337C3.3321 12.9737 3.3321 12.5537 3.5921 12.2937L3.67876 12.207C3.93876 11.947 4.35876 11.947 4.61876 12.207C4.87876 12.467 4.87876 12.887 4.61876 13.147L4.5321 13.2337C4.40543 13.3603 4.2321 13.427 4.06543 13.427ZM15.4921 8.66699H15.4388C15.0721 8.66699 14.7721 8.36699 14.7721 8.00033C14.7721 7.63366 15.0721 7.33366 15.4388 7.33366C15.8054 7.33366 16.1321 7.63366 16.1321 8.00033C16.1321 8.36699 15.8588 8.66699 15.4921 8.66699ZM2.2121 8.66699H2.15876C1.7921 8.66699 1.4921 8.36699 1.4921 8.00033C1.4921 7.63366 1.7921 7.33366 2.15876 7.33366C2.52543 7.33366 2.8521 7.63366 2.8521 8.00033C2.8521 8.36699 2.57876 8.66699 2.2121 8.66699ZM13.4988 3.99366C13.3254 3.99366 13.1588 3.92699 13.0254 3.80033C12.7654 3.54033 12.7654 3.12033 13.0254 2.86033L13.1121 2.77366C13.3721 2.51366 13.7921 2.51366 14.0521 2.77366C14.3121 3.03366 14.3121 3.45366 14.0521 3.71366L13.9654 3.80033C13.8388 3.92699 13.6721 3.99366 13.4988 3.99366ZM4.1521 3.99366C3.97876 3.99366 3.8121 3.92699 3.67876 3.80033L3.5921 3.70699C3.3321 3.44699 3.3321 3.02699 3.5921 2.76699C3.8521 2.50699 4.2721 2.50699 4.5321 2.76699L4.61876 2.85366C4.87876 3.11366 4.87876 3.53366 4.61876 3.79366C4.4921 3.92699 4.31876 3.99366 4.1521 3.99366ZM8.82543 2.02699C8.45876 2.02699 8.15876 1.75366 8.15876 1.38699V1.33366C8.15876 0.966992 8.45876 0.666992 8.82543 0.666992C9.1921 0.666992 9.4921 0.966992 9.4921 1.33366C9.4921 1.70033 9.1921 2.02699 8.82543 2.02699Z"
                          fill="black"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="16"
                        viewBox="0 0 17 16"
                        fill="none"
                      >
                        <path
                          d="M8.82548 12.6667C11.4028 12.6667 13.4921 10.5773 13.4921 8.00001C13.4921 5.42268 11.4028 3.33334 8.82548 3.33334C6.24815 3.33334 4.15881 5.42268 4.15881 8.00001C4.15881 10.5773 6.24815 12.6667 8.82548 12.6667Z"
                          fill="white"
                        />
                        <path
                          d="M8.8254 15.3067C8.45873 15.3067 8.15873 15.0333 8.15873 14.6667V14.6133C8.15873 14.2467 8.45873 13.9467 8.8254 13.9467C9.19207 13.9467 9.49207 14.2467 9.49207 14.6133C9.49207 14.98 9.19207 15.3067 8.8254 15.3067ZM13.5854 13.4267C13.4121 13.4267 13.2454 13.36 13.1121 13.2333L13.0254 13.1467C12.7654 12.8867 12.7654 12.4667 13.0254 12.2067C13.2854 11.9467 13.7054 11.9467 13.9654 12.2067L14.0521 12.2933C14.3121 12.5533 14.3121 12.9733 14.0521 13.2333C13.9254 13.36 13.7587 13.4267 13.5854 13.4267ZM4.0654 13.4267C3.89207 13.4267 3.7254 13.36 3.59207 13.2333C3.33207 12.9733 3.33207 12.5533 3.59207 12.2933L3.67873 12.2067C3.93873 11.9467 4.35873 11.9467 4.61873 12.2067C4.87873 12.4667 4.87873 12.8867 4.61873 13.1467L4.53207 13.2333C4.4054 13.36 4.23207 13.4267 4.0654 13.4267ZM15.4921 8.66666H15.4387C15.0721 8.66666 14.7721 8.36666 14.7721 7.99999C14.7721 7.63332 15.0721 7.33332 15.4387 7.33332C15.8054 7.33332 16.1321 7.63332 16.1321 7.99999C16.1321 8.36666 15.8587 8.66666 15.4921 8.66666ZM2.21207 8.66666H2.15873C1.79207 8.66666 1.49207 8.36666 1.49207 7.99999C1.49207 7.63332 1.79207 7.33332 2.15873 7.33332C2.5254 7.33332 2.85207 7.63332 2.85207 7.99999C2.85207 8.36666 2.57873 8.66666 2.21207 8.66666ZM13.4987 3.99332C13.3254 3.99332 13.1587 3.92666 13.0254 3.79999C12.7654 3.53999 12.7654 3.11999 13.0254 2.85999L13.1121 2.77332C13.3721 2.51332 13.7921 2.51332 14.0521 2.77332C14.3121 3.03332 14.3121 3.45332 14.0521 3.71332L13.9654 3.79999C13.8387 3.92666 13.6721 3.99332 13.4987 3.99332ZM4.15207 3.99332C3.97873 3.99332 3.81207 3.92666 3.67873 3.79999L3.59207 3.70666C3.33207 3.44666 3.33207 3.02666 3.59207 2.76666C3.85207 2.50666 4.27207 2.50666 4.53207 2.76666L4.61873 2.85332C4.87873 3.11332 4.87873 3.53332 4.61873 3.79332C4.49207 3.92666 4.31873 3.99332 4.15207 3.99332ZM8.8254 2.02666C8.45873 2.02666 8.15873 1.75332 8.15873 1.38666V1.33332C8.15873 0.966657 8.45873 0.666656 8.8254 0.666656C9.19207 0.666656 9.49207 0.966657 9.49207 1.33332C9.49207 1.69999 9.19207 2.02666 8.8254 2.02666Z"
                          fill="white"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="wallet-connection" style={{ width: 173 }}>
                    {account ? (
                      <a
                        onClick={() => {
                          connectMetamaskSignUp();
                        }}
                      >
                        {account?.slice(0, 11)}...
                        {account?.slice(account?.length - 3, account?.length)}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="23"
                          viewBox="0 0 22 23"
                          fill="none"
                        >
                          <path
                            d="M10.9998 14.25L13.7498 11.5M13.7498 11.5L10.9998 8.74996M13.7498 11.5H3.6665M3.6665 7.14398V7.10014C3.6665 6.07338 3.6665 5.55961 3.86633 5.16744C4.04209 4.82248 4.32235 4.54222 4.66732 4.36645C5.05949 4.16663 5.57325 4.16663 6.60002 4.16663H15.4C16.4268 4.16663 16.9394 4.16663 17.3316 4.36645C17.6766 4.54222 17.9578 4.82248 18.1335 5.16744C18.3332 5.55923 18.3332 6.07237 18.3332 7.09713V15.9032C18.3332 16.928 18.3332 17.4404 18.1335 17.8322C17.9578 18.1771 17.6766 18.4579 17.3316 18.6337C16.9398 18.8333 16.4274 18.8333 15.4027 18.8333H6.597C5.57225 18.8333 5.05911 18.8333 4.66732 18.6337C4.32235 18.4579 4.04209 18.1769 3.86633 17.8319C3.6665 17.4397 3.6665 16.9267 3.6665 15.9V15.8541"
                            stroke="#FF0000"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </a>
                    ) : (
                      <a
                        onClick={() => {
                          setShowWallet(true);
                        }}
                        className="text-center"
                        style={{ width: 130 }}
                      >
                        Connect Wallet
                      </a>
                    )}
                  </div>
                  {/* <div className="languade-dropdown">
                    <div class="dropdown">
                      <button
                        class="dropdown-toggle"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        ENG{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                        >
                          <path
                            d="M18.3894 13H15.308H12.5333C12.0585 13 11.8211 13.5737 12.1574 13.9101L14.7195 16.4721C15.13 16.8826 15.7977 16.8826 16.2082 16.4721L17.1826 15.4977L18.7703 13.9101C19.1016 13.5737 18.8642 13 18.3894 13Z"
                            fill="white"
                          />
                        </svg>
                      </button>
                      <ul class="dropdown-menu">
                        <li>
                          <a class="dropdown-item" href="#">
                            ENG
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">
                            Japanese
                          </a>
                        </li>
                        <li>
                          <a class="dropdown-item" href="#">
                            Korean
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </section>

      <Offcanvas
        placement="end"
        className="mobile-menu-offcanvas"
        show={show}
        onHide={handleClose}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            {" "}
            <Link href="/">
              {" "}
              {theme == "light-theme" ? (
                <img src="\logo.svg" alt="logo" className="logo" />
              ) : (
                <img src="\dark-logo.svg" alt="logo" className="logo" />
              )}
            </Link>{" "}
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="upper-link">
            <ul>
              <li class="nav-item">
                <Link
                  href="/"
                  className={
                    router.pathname === "/" ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                >
                  Account
                </Link>
              </li>
              <li class="nav-item">
                <Link
                  onClick={() => setLoader(true)}
                  className={
                    router.pathname === "/component/history"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/history"
                >
                  History
                </Link>
              </li>
              {/* <li class="nav-item">
                <Link
                  // onClick={() => setLoader(true)}
                  className={
                    router.pathname === "/component/transaction"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/"
                >
                  Referrals
                </Link>
              </li> */}
              <li class="nav-item">
                <Link
                  onClick={() => setLoader(true)}
                  className={
                    router.pathname === "/component/badges"
                      ? "nav-link active"
                      : "nav-link"
                  }
                  href="/badges"
                >
                  Badges
                </Link>
              </li>
            </ul>
          </div>
          <div className="wallet-connection">
            {account ? (
              <a
                onClick={() => {
                  connectMetamaskSignUp();
                }}
              >
                {account?.slice(0, 11)}...
                {account?.slice(account?.length - 3, account?.length)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 15L15 12M15 12L12 9M15 12H4M4 7.24802V7.2002C4 6.08009 4 5.51962 4.21799 5.0918C4.40973 4.71547 4.71547 4.40973 5.0918 4.21799C5.51962 4 6.08009 4 7.2002 4H16.8002C17.9203 4 18.4796 4 18.9074 4.21799C19.2837 4.40973 19.5905 4.71547 19.7822 5.0918C20 5.5192 20 6.07899 20 7.19691V16.8036C20 17.9215 20 18.4805 19.7822 18.9079C19.5905 19.2842 19.2837 19.5905 18.9074 19.7822C18.48 20 17.921 20 16.8031 20H7.19691C6.07899 20 5.5192 20 5.0918 19.7822C4.71547 19.5905 4.40973 19.2839 4.21799 18.9076C4 18.4798 4 17.9201 4 16.8V16.75"
                    stroke="#FF0000"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </a>
            ) : (
              <a
                onClick={() => {
                  setShowWallet(true);
                  setShow(false);
                }}
                style={{ width: "100%", justifyContent: "center" }}
              >
                Connect Wallet
              </a>
            )}
          </div>
          <div className="twice-btns">
            <a
              onClick={() => {
                setShow(false);
                setShowfaq(true);
              }}
              className="question-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M9.49875 0C7.6925 0 6.35375 0.5525 5.50375 1.4025C4.65375 2.2525 4.35625 3.315 4.25 4.1225L6.375 4.39875C6.46 3.8675 6.63 3.33625 7.03375 2.9325C7.4375 2.52875 8.075 2.125 9.49875 2.125C10.9012 2.125 11.6662 2.465 12.0912 2.8475C12.5162 3.23 12.6862 3.6975 12.6862 4.25C12.6862 6.01375 11.9637 6.5025 10.9012 7.4375C9.83875 8.3725 8.43625 9.7325 8.43625 12.2188V12.75H10.5612V12.2188C10.5612 10.455 11.22 9.96625 12.2825 9.03125C13.345 8.09625 14.8112 6.73625 14.8112 4.25C14.8112 3.23 14.45 2.0825 13.5575 1.25375C12.6437 0.425 11.2837 0 9.49875 0ZM8.43625 14.875V17H10.5612V14.875H8.43625Z"
                  fill="white"
                />
              </svg>
            </a>
            <div className="themeimg ms-auto">
              {theme == "light-theme" ? (
                <svg
                  onClick={toggleTheme}
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M8.82545 12.6663C11.4028 12.6663 13.4921 10.577 13.4921 7.99967C13.4921 5.42235 11.4028 3.33301 8.82545 3.33301C6.24812 3.33301 4.15878 5.42235 4.15878 7.99967C4.15878 10.577 6.24812 12.6663 8.82545 12.6663Z"
                    fill="black"
                  />
                  <path
                    d="M8.82543 15.307C8.45876 15.307 8.15876 15.0337 8.15876 14.667V14.6137C8.15876 14.247 8.45876 13.947 8.82543 13.947C9.1921 13.947 9.4921 14.247 9.4921 14.6137C9.4921 14.9803 9.1921 15.307 8.82543 15.307ZM13.5854 13.427C13.4121 13.427 13.2454 13.3603 13.1121 13.2337L13.0254 13.147C12.7654 12.887 12.7654 12.467 13.0254 12.207C13.2854 11.947 13.7054 11.947 13.9654 12.207L14.0521 12.2937C14.3121 12.5537 14.3121 12.9737 14.0521 13.2337C13.9254 13.3603 13.7588 13.427 13.5854 13.427ZM4.06543 13.427C3.8921 13.427 3.72543 13.3603 3.5921 13.2337C3.3321 12.9737 3.3321 12.5537 3.5921 12.2937L3.67876 12.207C3.93876 11.947 4.35876 11.947 4.61876 12.207C4.87876 12.467 4.87876 12.887 4.61876 13.147L4.5321 13.2337C4.40543 13.3603 4.2321 13.427 4.06543 13.427ZM15.4921 8.66699H15.4388C15.0721 8.66699 14.7721 8.36699 14.7721 8.00033C14.7721 7.63366 15.0721 7.33366 15.4388 7.33366C15.8054 7.33366 16.1321 7.63366 16.1321 8.00033C16.1321 8.36699 15.8588 8.66699 15.4921 8.66699ZM2.2121 8.66699H2.15876C1.7921 8.66699 1.4921 8.36699 1.4921 8.00033C1.4921 7.63366 1.7921 7.33366 2.15876 7.33366C2.52543 7.33366 2.8521 7.63366 2.8521 8.00033C2.8521 8.36699 2.57876 8.66699 2.2121 8.66699ZM13.4988 3.99366C13.3254 3.99366 13.1588 3.92699 13.0254 3.80033C12.7654 3.54033 12.7654 3.12033 13.0254 2.86033L13.1121 2.77366C13.3721 2.51366 13.7921 2.51366 14.0521 2.77366C14.3121 3.03366 14.3121 3.45366 14.0521 3.71366L13.9654 3.80033C13.8388 3.92699 13.6721 3.99366 13.4988 3.99366ZM4.1521 3.99366C3.97876 3.99366 3.8121 3.92699 3.67876 3.80033L3.5921 3.70699C3.3321 3.44699 3.3321 3.02699 3.5921 2.76699C3.8521 2.50699 4.2721 2.50699 4.5321 2.76699L4.61876 2.85366C4.87876 3.11366 4.87876 3.53366 4.61876 3.79366C4.4921 3.92699 4.31876 3.99366 4.1521 3.99366ZM8.82543 2.02699C8.45876 2.02699 8.15876 1.75366 8.15876 1.38699V1.33366C8.15876 0.966992 8.45876 0.666992 8.82543 0.666992C9.1921 0.666992 9.4921 0.966992 9.4921 1.33366C9.4921 1.70033 9.1921 2.02699 8.82543 2.02699Z"
                    fill="black"
                  />
                </svg>
              ) : (
                <svg
                  onClick={toggleTheme}
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                >
                  <path
                    d="M8.82548 12.6667C11.4028 12.6667 13.4921 10.5773 13.4921 8.00001C13.4921 5.42268 11.4028 3.33334 8.82548 3.33334C6.24815 3.33334 4.15881 5.42268 4.15881 8.00001C4.15881 10.5773 6.24815 12.6667 8.82548 12.6667Z"
                    fill="white"
                  />
                  <path
                    d="M8.8254 15.3067C8.45873 15.3067 8.15873 15.0333 8.15873 14.6667V14.6133C8.15873 14.2467 8.45873 13.9467 8.8254 13.9467C9.19207 13.9467 9.49207 14.2467 9.49207 14.6133C9.49207 14.98 9.19207 15.3067 8.8254 15.3067ZM13.5854 13.4267C13.4121 13.4267 13.2454 13.36 13.1121 13.2333L13.0254 13.1467C12.7654 12.8867 12.7654 12.4667 13.0254 12.2067C13.2854 11.9467 13.7054 11.9467 13.9654 12.2067L14.0521 12.2933C14.3121 12.5533 14.3121 12.9733 14.0521 13.2333C13.9254 13.36 13.7587 13.4267 13.5854 13.4267ZM4.0654 13.4267C3.89207 13.4267 3.7254 13.36 3.59207 13.2333C3.33207 12.9733 3.33207 12.5533 3.59207 12.2933L3.67873 12.2067C3.93873 11.9467 4.35873 11.9467 4.61873 12.2067C4.87873 12.4667 4.87873 12.8867 4.61873 13.1467L4.53207 13.2333C4.4054 13.36 4.23207 13.4267 4.0654 13.4267ZM15.4921 8.66666H15.4387C15.0721 8.66666 14.7721 8.36666 14.7721 7.99999C14.7721 7.63332 15.0721 7.33332 15.4387 7.33332C15.8054 7.33332 16.1321 7.63332 16.1321 7.99999C16.1321 8.36666 15.8587 8.66666 15.4921 8.66666ZM2.21207 8.66666H2.15873C1.79207 8.66666 1.49207 8.36666 1.49207 7.99999C1.49207 7.63332 1.79207 7.33332 2.15873 7.33332C2.5254 7.33332 2.85207 7.63332 2.85207 7.99999C2.85207 8.36666 2.57873 8.66666 2.21207 8.66666ZM13.4987 3.99332C13.3254 3.99332 13.1587 3.92666 13.0254 3.79999C12.7654 3.53999 12.7654 3.11999 13.0254 2.85999L13.1121 2.77332C13.3721 2.51332 13.7921 2.51332 14.0521 2.77332C14.3121 3.03332 14.3121 3.45332 14.0521 3.71332L13.9654 3.79999C13.8387 3.92666 13.6721 3.99332 13.4987 3.99332ZM4.15207 3.99332C3.97873 3.99332 3.81207 3.92666 3.67873 3.79999L3.59207 3.70666C3.33207 3.44666 3.33207 3.02666 3.59207 2.76666C3.85207 2.50666 4.27207 2.50666 4.53207 2.76666L4.61873 2.85332C4.87873 3.11332 4.87873 3.53332 4.61873 3.79332C4.49207 3.92666 4.31873 3.99332 4.15207 3.99332ZM8.8254 2.02666C8.45873 2.02666 8.15873 1.75332 8.15873 1.38666V1.33332C8.15873 0.966657 8.45873 0.666656 8.8254 0.666656C9.19207 0.666656 9.49207 0.966657 9.49207 1.33332C9.49207 1.69999 9.19207 2.02666 8.8254 2.02666Z"
                    fill="white"
                  />
                </svg>
              )}
            </div>
            {/* <div className="languade-dropdown">
              <div class="dropdown">
                <button
                  class="dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  ENG{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                  >
                    <path
                      d="M18.3894 13H15.308H12.5333C12.0585 13 11.8211 13.5737 12.1574 13.9101L14.7195 16.4721C15.13 16.8826 15.7977 16.8826 16.2082 16.4721L17.1826 15.4977L18.7703 13.9101C19.1016 13.5737 18.8642 13 18.3894 13Z"
                      fill="white"
                    />
                  </svg>
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <a class="dropdown-item" href="#">
                      ENG
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Japanese
                    </a>
                  </li>
                  <li>
                    <a class="dropdown-item" href="#">
                      Korean
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Modal
        className="connect-wallet-modal common-modal-style"
        show={showwallet}
        onHide={handleClosewallet}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Connect wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="twice-btn-wallet">
            <a onClick={() => connectMetamaskSignUp()} className="btn-metamask">
              <img src="\assets\metamask.svg" alt="img" className="img-fluid" />
              Metamask
            </a>
            <a onClick={() => trustWalletSignUp()} className="btn-trustwallet">
              <img
                src="\assets\trustwallet.svg"
                alt="img"
                className="img-fluid"
              />
              WalletConnect
            </a>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        className="connect-wallet-modal common-modal-style faqs-offcanvas"
        show={showfaq}
        onHide={handleClosefaq}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Help & Support</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="parent-question">
            <div className="twice-btns">
              <a href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M12.75 1.82251H5.25C3 1.82251 1.5 3.32251 1.5 5.57251V10.0725C1.5 12.3225 3 13.8225 5.25 13.8225V15.42C5.25 16.02 5.9175 16.38 6.4125 16.0425L9.75 13.8225H12.75C15 13.8225 16.5 12.3225 16.5 10.0725V5.57251C16.5 3.32251 15 1.82251 12.75 1.82251ZM9 10.95C8.685 10.95 8.4375 10.695 8.4375 10.3875C8.4375 10.08 8.685 9.82501 9 9.82501C9.315 9.82501 9.5625 10.08 9.5625 10.3875C9.5625 10.695 9.315 10.95 9 10.95ZM9.945 7.83751C9.6525 8.03251 9.5625 8.16001 9.5625 8.37001V8.52751C9.5625 8.83501 9.3075 9.09001 9 9.09001C8.6925 9.09001 8.4375 8.83501 8.4375 8.52751V8.37001C8.4375 7.50001 9.075 7.07251 9.315 6.90751C9.5925 6.72001 9.6825 6.59251 9.6825 6.39751C9.6825 6.02251 9.375 5.71501 9 5.71501C8.625 5.71501 8.3175 6.02251 8.3175 6.39751C8.3175 6.70501 8.0625 6.96001 7.755 6.96001C7.4475 6.96001 7.1925 6.70501 7.1925 6.39751C7.1925 5.40001 8.0025 4.59001 9 4.59001C9.9975 4.59001 10.8075 5.40001 10.8075 6.39751C10.8075 7.25251 10.1775 7.68001 9.945 7.83751Z" fill="white" />
                </svg>
                Create support ticket
              </a>
              <a href="#">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="19"
                  viewBox="0 0 18 19"
                  fill="none"
                >
                  <rect y="0.5" width="18" height="18" rx="9" fill="white" />
                  <path
                    d="M13.5138 6.41745C12.6881 5.7569 11.6972 5.42663 10.6514 5.37158L10.4862 5.53672C11.422 5.7569 12.2477 6.19727 13.0183 6.80277C12.0826 6.30736 11.0367 5.97709 9.93578 5.86699C9.6055 5.81195 9.33028 5.81195 9 5.81195C8.66972 5.81195 8.3945 5.81195 8.06422 5.86699C6.9633 5.97709 5.91743 6.30736 4.98165 6.80277C5.75229 6.19727 6.57798 5.7569 7.51376 5.53672L7.34862 5.37158C6.30275 5.42663 5.31193 5.7569 4.48624 6.41745C3.55046 8.17892 3.05505 10.1606 3 12.1973C3.82569 13.078 4.98165 13.6285 6.19266 13.6285C6.19266 13.6285 6.57798 13.1881 6.85321 12.8028C6.13761 12.6376 5.47706 12.2523 5.0367 11.6468C5.42202 11.867 5.80734 12.0872 6.19266 12.2523C6.68807 12.4725 7.18349 12.5826 7.6789 12.6927C8.11927 12.7477 8.55963 12.8028 9 12.8028C9.44037 12.8028 9.88073 12.7477 10.3211 12.6927C10.8165 12.5826 11.3119 12.4725 11.8073 12.2523C12.1927 12.0872 12.578 11.867 12.9633 11.6468C12.5229 12.2523 11.8624 12.6376 11.1468 12.8028C11.422 13.1881 11.8073 13.6285 11.8073 13.6285C13.0183 13.6285 14.1743 13.078 15 12.1973C14.945 10.1606 14.4495 8.17892 13.5138 6.41745ZM7.18349 11.2064C6.63303 11.2064 6.13761 10.711 6.13761 10.1055C6.13761 9.50002 6.63303 9.00461 7.18349 9.00461C7.73394 9.00461 8.22936 9.50002 8.22936 10.1055C8.22936 10.711 7.73394 11.2064 7.18349 11.2064ZM10.8165 11.2064C10.2661 11.2064 9.77064 10.711 9.77064 10.1055C9.77064 9.50002 10.2661 9.00461 10.8165 9.00461C11.367 9.00461 11.8624 9.50002 11.8624 10.1055C11.8624 10.711 11.367 11.2064 10.8165 11.2064Z"
                    fill="black"
                  />
                </svg>{" "}
                contact on discord
              </a>
            </div>
            <div className="faqs-part">
              <div className="main-heading">
                <h6>Frequently Asked Questions</h6>
              </div>
              <Accordion>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>
                    {" "}
                    <span>01.</span> What is the DOP mainnet?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet is the live, production-ready version of the
                    Data Ownership Protocol, which allows users to encrypt,
                    send, and decrypt transactions on the Ethereum blockchain.
                    It enables selective transparency, giving users control over
                    their financial data and transactions. <br />
                    That said,{" "}
                    <span style={{ fontWeight: "bold" }}>
                      it is still in Beta version
                    </span>
                    , featuring only the core features of the Data Ownership
                    Protocol. More features will be added over time.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    {" "}
                    <span>02.</span> What are the key features of the DOP
                    mainnet?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet offers several key features: <br />
                    <ul>
                      <li>
                        Secure encryption and decryption of assets using
                        zero-knowledge proofs
                      </li>
                      <li>
                        Ability to selectively disclose holdings, transactions,
                        and activity
                      </li>
                      <li>
                        Seamless integration with existing Ethereum wallets
                      </li>
                      <li>
                        Collaboration with Chainalysis to screen transactions
                        and prevent illicit funds
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header>
                    {" "}
                    <span>03.</span> What are the benefits of using the DOP
                    mainnet?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet provides benefits for both individual users
                    and businesses: <br />
                    <ul>
                      <li>
                        For individuals, it enables privacy and control over
                        personal data and financial transactions, allowing for
                        confidential crypto payments and DeFi exploration.
                      </li>
                      <li>
                        For businesses, it offers secure and efficient solutions
                        to protect competitive edges, integrate with existing
                        systems, and avoid risks from tainted funds.
                      </li>
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header>
                    {" "}
                    <span>04.</span> How does the DOP mainnet work?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet uses unique "smart bouncers" and
                    zero-knowledge proofs to enable selective transparency on
                    the Ethereum blockchain. Users can encrypt their assets,
                    send them to other DOP wallets, and decrypt them as needed,
                    maintaining control over their financial data.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="4">
                  <Accordion.Header>
                    {" "}
                    <span>05.</span> How can users participate in the Mainnet
                    Airdrop Campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    Users can participate in the Mainnet Airdrop Campaign by
                    engaging in various activities on the DOP mainnet, such as
                    encrypting assets, decrypting assets, sending transactions,
                    referring others, and staking DOP tokens (once available).
                    For the full details, read our{" "}
                    <a
                      href="https://dop.org/blog/earn-dop-tokens-with-our-mainnet-reward-campaign"
                      target="_blank"
                    >
                      blog post
                    </a>
                    .
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="5">
                  <Accordion.Header>
                    {" "}
                    <span>06.</span>What are the rewards for participating in
                    the Mainnet Airdrop Campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    The Mainnet Airdrop Campaign rewards users based on a points
                    system. Users can earn points for actions like encryption,
                    decryption, sending, referrals, and staking. These points
                    will be used to determine the amount of DOP tokens users
                    receive as rewards.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="6">
                  <Accordion.Header>
                    {" "}
                    <span>07.</span> What is the purpose of the DOP Mainnet
                    Airdrop Campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    The primary purpose of the DOP Mainnet Airdrop Campaign is
                    to promote the usage of the DOP mainnet, increase the
                    protocol's total value locked (TVL), and incentivize staking
                    of the DOP token once it becomes available.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="7">
                  <Accordion.Header>
                    {" "}
                    <span>08.</span> How many DOP tokens are allocated for the
                    Mainnet Airdrop Campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    The Mainnet Airdrop Campaign is divided into two phases: V1
                    and V2. A total of 460,000,000 DOP tokens have been
                    allocated for the campaign, with 230,000,000 DOP tokens
                    dedicated to the first phase (V1), which is currently
                    ongoing.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="8">
                  <Accordion.Header>
                    {" "}
                    <span>09.</span> What actions are rewarded in the V1
                    campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    In the V1 campaign, users can earn rewards for the following
                    actions: encrypting assets, decrypting assets, completing
                    achievements (badges), and staking DOP tokens (once
                    available).
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="9">
                  <Accordion.Header>
                    {" "}
                    <span>10.</span> How is the points system structured for the
                    V1 campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    The points system in the V1 campaign works as follows:{" "}
                    <br />
                    Encryption: 1 point per $1 worth of assets encrypted (with a
                    0.1% fee) <br />
                    Decryption: 0.5 points per $1 worth of assets decrypted
                    (with a 0.1% fee) <br />
                    Sending: 20 points per sending action <br />
                    Referrals: 10% bonus on referral points, 100 points bonus
                    for referred user after first encryption <br />
                    Badges: Social (+300 points), Encrypt (+300 points per 10k),
                    Sends (+300 points per 50 sends) <br />
                    Staking: 0.05 points per 1 DOP staked per 24 hours, 10%
                    bonus for every 30 days of staking (once available)
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="10">
                  <Accordion.Header>
                    {" "}
                    <span>11.</span> What are the fees for using the mainnet?
                  </Accordion.Header>
                  <Accordion.Body>
                    There is a fee of 0.1% for every encryption and decryption
                    action. At a later stage, an additional fee of 10 DOP will
                    be applied to each transaction. Since DOP currently operates
                    on Ethereum, all transactions will also incur the usual
                    Ethereum network gas fees. <br />
                    It’s important to note that in the not-so-distant future DOP
                    will be integrated into various EVMs, so the network gas
                    fees will vary accordingly, and will be significantly lower
                    than Ethereum’s.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="11">
                  <Accordion.Header>
                    {" "}
                    <span>12.</span> How are the fees generated from the DOP
                    mainnet used?
                  </Accordion.Header>
                  <Accordion.Body>
                    The fees generated from the DOP mainnet are used for two
                    purposes: 75% of the fees go towards the buy-back-burn of
                    DOP tokens, while the remaining 25% are used for staking
                    incentives.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="12">
                  <Accordion.Header>
                    {" "}
                    <span>13.</span> When will the V2 campaign of the Mainnet
                    Airdrop start?
                  </Accordion.Header>
                  <Accordion.Body>
                    The details of the V2 campaign, including its start date,
                    are currently unknown. The V2 campaign will be launched
                    during phase 2 of the DOP project's development.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="13">
                  <Accordion.Header>
                    {" "}
                    <span>14.</span> How does the DOP mainnet ensure the
                    security of encrypted assets?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet uses zero-knowledge proofs and "smart
                    bouncers" to securely store and transfer encrypted assets on
                    the Ethereum blockchain. This ensures the integrity and
                    privacy of user transactions and holdings.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="14">
                  <Accordion.Header>
                    {" "}
                    <span>15.</span> What is the role of the DOP token in the
                    ecosystem?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP token is the native utility token of the DOP
                    ecosystem. It is used to facilitate private transactions,
                    incentivize network participation, and enable staking
                    rewards.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="15">
                  <Accordion.Header>
                    {" "}
                    <span>16.</span> How does the DOP mainnet align with the
                    project's vision of data ownership and privacy?
                  </Accordion.Header>
                  <Accordion.Body>
                    The DOP mainnet is a crucial first step in the project's
                    long-term vision of bringing data ownership and privacy to
                    the Ethereum ecosystem. Future phases of the project will
                    focus on expanding the platform's capabilities in this area.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="16">
                  <Accordion.Header>
                    {" "}
                    <span>17.</span> What happens to the DOP tokens that are not
                    claimed at the end of the Mainnet Airdrop Campaign?
                  </Accordion.Header>
                  <Accordion.Body>
                    Any DOP tokens that are not claimed at the end of the
                    Mainnet Airdrop Campaign will be used to benefit the
                    community. This could include future airdrops, community
                    incentives, or other initiatives designed to enhance the DOP
                    ecosystem, or even burning the tokens to positively impact
                    the total supply and scarcity of the token, ultimately
                    benefiting the token's value.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="17">
                  <Accordion.Header>
                    {" "}
                    <span>18.</span> How will the DOP tokens allocated for the
                    Mainnet Airdrop Campaign impact the overall token supply and
                    distribution?
                  </Accordion.Header>
                  <Accordion.Body>
                    The Mainnet Airdrop Campaign will be divided into two phases
                    to prevent a massive release of tokens all at once. Although
                    these tokens are considered released and in circulation,
                    they will only reach users gradually over several months,
                    following the completion of the first campaign. It is
                    important to note that this campaign will not affect the
                    total supply of DOP tokens.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="18">
                  <Accordion.Header>
                    {" "}
                    <span>19.</span> Will any verification be required to claim
                    the rewards when the campaign ends?
                  </Accordion.Header>
                  <Accordion.Body>
                    To claim rewards from the Mainnet Airdrop Campaign, users
                    might be required to go through a proof-of-humanity process
                    to verify their identity and prevent bots or fake accounts
                    from participating.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="19">
                  <Accordion.Header>
                    {" "}
                    <span>20.</span> How secure is the DOP mainnet and protocol?
                  </Accordion.Header>
                  <Accordion.Body>
                    We place a high priority on security and have invested
                    significantly in ensuring the safety of the DOP mainnet and
                    protocol. With the launch of the mainnet, we will continue
                    to employ additional tools to further strengthen security.
                    We have made extensive efforts to secure the protocol,
                    including a comprehensive security audit by Hacken, which
                    awarded us an impressive Security Score of 10/10, Code
                    Quality Score of 10/10, and an Overall Score of 9.7/10.{" "}
                    <br />
                    Our team includes security experts who contribute to the
                    proper architecture and ongoing security measures.
                    Additionally, we plan to conduct future bug bounty campaigns
                    to continuously enhance our security posture.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
