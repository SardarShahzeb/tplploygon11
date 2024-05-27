import Navbar from "../../components/primaryNavbar";
import Link from "next/link";
import { Mnemonic, randomBytes } from "ethers";
import React, { useEffect, useState } from "react";
import Wallet from "ethereumjs-wallet";
import { ethers as ethers2 } from "ethers2";
import CryptoJS from "crypto-js";
import { createDopWallet } from "dop-wallet-old";
import { NetworkName } from "dop-sharedmodels";
import { setEncryptionKeyFromPassword } from "../../components/hash-service";
import Loader from "../../hooks/loader";
import { getData, saveData } from "../../utils/db";
import { useRouter } from "next/router";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Footer from "./footer";

const Createwallet = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");
  const [showWallet, setShowWallet] = useState(false);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const { account } = useWeb3React();

  useEffect(() => {
    var val = window.location.href;
    val = new URL(val);
    var id = val.searchParams.get("referral");
    localStorage.setItem("referral", id);
  }, []);

  const CheckType1 = () => {
    if (type1 === "password") {
      setType1("text");
    } else {
      setType1("password");
    }
  };

  const CheckType2 = () => {
    if (type2 === "password") {
      setType2("text");
    } else {
      setType2("password");
    }
  };

  function generateUniqueMnemonic() {
    let mnemonic;
    let hasDuplicates;

    do {
      mnemonic = Mnemonic.fromEntropy(randomBytes(16)).phrase.trim(); // Generates a mnemonic directly
      const words = mnemonic.split(" ");
      const uniqueWords = new Set(words);
      hasDuplicates = uniqueWords.size !== words.length;
    } while (hasDuplicates);
    return mnemonic;
  }

  const CreateWallet = async (e) => {
    e.preventDefault();
    if (account) {
      try {
        setError("");
        if (password?.length > 7) {
          if (password === cpassword) {
            setLoader(true);
            const web3 = new Web3(
              "https://light-serene-feather.matic.quiknode.pro/f0cdd8c4c146e68ce2f935bba399ca66cbe45868/"
            );
            let blockNumb = null;
            web3.eth
              .getBlockNumber()
              .then((blockNumber) => {
                blockNumb = parseInt(blockNumber);
              })
              .catch((error) => {
                console.error("Error:", error);
              });
            const mnemonic = generateUniqueMnemonic();
            const encryptionKey = await setEncryptionKeyFromPassword(password);
            const wallet = ethers2.Wallet.fromPhrase(mnemonic);
            const privateKeyString = wallet.privateKey;
            const creationBlockNumberMap = {
              [NetworkName.Polygon]: 55853022,
              [NetworkName.Polygon]: 55853022,
            };

            const dopWalletInfo = await createDopWallet(
              encryptionKey,
              mnemonic,
              creationBlockNumberMap
            );
            const key = "dopTPL_";
            const encrypted = CryptoJS.AES.encrypt(
              privateKeyString,
              key
            ).toString();
            const encryptionKey1 = CryptoJS.AES.encrypt(
              encryptionKey,
              key
            ).toString();
            const password1 = CryptoJS.AES.encrypt(password, key).toString();

            const id = dopWalletInfo.id; // Store this value.
            const dopAdd = dopWalletInfo.dopAddress; // Store this value.
            const account = {
              address: wallet.address,
              phrase: mnemonic,
              privateKey: encrypted,
              dopAdd: dopAdd,
              dopId: id,
              dopEncryptionKey: encryptionKey1,
              password: password1,
              blockNumber: blockNumb,
            };
            await saveData("dumObj", account);
            let currentDate = new Date();
            const futureDate = new Date(
              currentDate.getTime() + 24 * 60 * 60 * 1000
            );
            await saveData("logTime", futureDate);
            router.push("/secretrecoveryphrase");
            setShowWallet(false);
            setLoader(false);
          } else {
            setLoader(false);
            setError("*Passwords don't match.");
          }
        } else {
          setError("*Password must be of length 8!");
        }
      } catch (err) {
        console.log("err", err);
        setLoader(false);
      }
    } else {
      setShowWallet(true);
    }
  };



  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        document.body.classList.add('no-scroll');
      } else {
        document.body.classList.remove('no-scroll');
      }
    };

   
    handleResize();

    
    window.addEventListener('resize', handleResize);

   
    return () => {
      document.body.classList.remove('no-scroll');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
    <div className="component-100vh">
      {loader && <Loader />}
      <Navbar showWall={showWallet} />
      <section className="createwallet">
        <div className="custom-container">
          <div className="innerimport">
            <div className="importheader">
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
                    fill="#5F5F5F"
                  />
                  <path
                    d="M20.4999 12.75H3.66992C3.25992 12.75 2.91992 12.41 2.91992 12C2.91992 11.59 3.25992 11.25 3.66992 11.25H20.4999C20.9099 11.25 21.2499 11.59 21.2499 12C21.2499 12.41 20.9099 12.75 20.4999 12.75Z"
                    fill="#5F5F5F"
                  />
                </svg>
              </Link>
              <p className="importhead">Set a Wallet Password</p>
            </div>
            <form onSubmit={(e) => CreateWallet(e)} className="w-100">
              <div className="importbody">
                <div className="material-textfield">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={type1}
                    placeholder="Enter new password"
                  />
                  <label>New password</label>
                  <img
                    onClick={() => CheckType1()}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark cursor-pointer"
                  />
                  <img
                    onClick={() => CheckType1()}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white cursor-pointer"
                  />
                </div>
                <div className="material-textfield">
                  <input
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    type={type2}
                    placeholder="Confirm new password"
                  />
                  <label>Confirm new password</label>
                  <img
                    onClick={() => CheckType2()}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark cursor-pointer"
                  />
                  <img
                    onClick={() => CheckType2()}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white cursor-pointer"
                  />
                </div>
                <p
                  className="text-center pb-2"
                  style={{ color: "red", fontSize: 12 }}
                >
                  {error}
                </p>
                <button type="submit" className="common-btntwo">
                  {account ? "Submit" : "Connect Wallet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
      </div>
    </>
  );
};

export default Createwallet;
