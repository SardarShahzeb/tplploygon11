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
import { useRouter } from "next/router";
import { getData, saveData } from "../../utils/db.js";
import { useWeb3React } from "@web3-react/core";
import Navbar from "../../components/primaryNavbar";
import axios from "axios";
import { Api_URL } from "../../hooks/apiUrl";
import useWeb3 from "../../hooks/useWeb3";
import Footer from "./footer.js";

const Importwallet = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [type1, setType1] = useState("password");
  const [type2, setType2] = useState("password");
  const [loader, setLoader] = useState(false);
  const [myAccs, setMyAccs] = useState(0);
  const [block, setBlock] = useState(null);
  const [showWallet, setShowWallet] = useState(false);
  const { account } = useWeb3React();
  const router = useRouter();
  const web3 = useWeb3();

  // useEffect(() => {
  //   getMyData();
  // }, []);

  // const getMyData = async () => {
  //   let res = await getData("accounts");
  //   if (res?.length > 0) {
  //     setMyAccs(1);
  //   }
  // };

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

  const ImportWallet = async (e) => {
    e.preventDefault();
    if (account) {
      setError("");
      try {
        if (mnemonic?.length > 20) {
          if (password?.length > 7) {
            if (password === cpassword) {
              setLoader(true);
              const encryptionKey = await setEncryptionKeyFromPassword(
                password
              );
              const wallet = ethers2.Wallet.fromPhrase(mnemonic);
              const myPrivateKey = wallet.signingKey.privateKey;
              let tring = "weareDOPdev";
              let newwallet =
                web3.eth.accounts.privateKeyToAccount(myPrivateKey);
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
                  const block = parseInt(response?.data?.data?.blockNumber);
                  localStorage.setItem(
                    "myToken",
                    response?.data?.data.accessToken
                  );
                  localStorage.setItem("signValue", signmessage.signature);
                  const key = "dopTPL_";
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
                  const encrypted = CryptoJS.AES.encrypt(
                    privateKeyString,
                    key
                  ).toString();
                  const encryptionKey1 = CryptoJS.AES.encrypt(
                    encryptionKey,
                    key
                  ).toString();
                  const password1 = CryptoJS.AES.encrypt(
                    password,
                    key
                  ).toString();

                  const id = dopWalletInfo.id; // Store this value.
                  const dopAdd = dopWalletInfo.dopAddress; // Store this value.
                  const account0 = {
                    address: wallet.address,
                    phrase: mnemonic,
                    privateKey: encrypted,
                    dopAdd: dopAdd,
                    dopId: id,
                    dopEncryptionKey: encryptionKey1,
                    password: password1,
                  };
                  let currAcc = await saveData("selectedAccount", account0);
                  let res = await saveData("accounts", [account0]);
                  router.push("/");
                  // setLoader(false);
                })
                .catch((error) => {
                  setError(error?.response?.data?.message);
                  setLoader(false);
                });
            } else {
              setError("*Passwords don't match.");
            }
          } else {
            setError("*Password must be of length 8!");
          }
        } else {
          setError("*Valid mnemonic is required!");
        }
      } catch (err) {
        console.log("err", err);
        setError("Invalid mnemonic!");
        setLoader(false);
      }
    } else {
      setShowWallet(true);
    }
  };

  const ImportWallet2 = async (e) => {
    e?.preventDefault();
    let accounts = await getData("accounts");
    let dumObj = accounts?.find((item) => {
      return item.phrase === mnemonic;
    });
    if (dumObj) {
      setError("Wallet already exists with this recovery phrase");
    } else {
      try {
        if (mnemonic?.length > 20) {
          setLoader(true);
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
          };
          if (accounts?.length > 0) {
            let accs = accounts;
            accs.push(account);
            let currAcc = await saveData("selectedAccount", account);
            let res = await saveData("accounts", accs);
            router.push("/");
            setLoader(false);
          } else {
            let currAcc = await saveData("selectedAccount", account);
            let res = await saveData("accounts", [account]);
            router.push("/");
            setLoader(false);
          }
        } else {
          setError("*Valid mnemonic is required!");
        }
      } catch (err) {
        console.log("err", err);
        setError(err?.toString()?.slice(0, 35));
        setLoader(false);
      }
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Navbar showWall={showWallet} />
      <section className="importwallet">
        <div className="custom-container">
          <div className="innerimport">
            <div className="importheader">
              <Link href="/">
                <img
                  src="\assets\button-svgs\arrow-left.svg"
                  alt="backarrow"
                  className="backarrow"
                />
              </Link>
              <p className="importhead">Import Wallet</p>
            </div>
            {myAccs === 0 ? (
              <form onSubmit={(e) => ImportWallet(e)} className="importbody">
                <p className="importpara">
                  {/* or Private Key */}
                  Only the first account on this wallet will auto load. After
                  completing this process, to add additional account, click
                  Create.
                </p>
                <div className="material-textfield">
                  <input
                    onChange={(e) => setMnemonic(e.target.value)}
                    // or Private Key
                    placeholder="Enter your mnemonic recovery phrase"
                    type={show ? "text" : "password"}
                  />
                  <label>Secret Recovery Phrase</label>
                  <img
                    onClick={() => setShow(!show)}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                {/* <div className="material-textfield">
                  <input
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="Secret Phrase or Private Key"
                  />
                  <label>Add Block Number</label>
                </div> */}
                {/* <div className="form-check radiocheck-btnn">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label importhead"
                    for="flexCheckDefault"
                  >
                    Show secret recovery phrase
                  </label>
                </div> */}
                <div className="material-textfield">
                  <input
                    value={password}
                    type={type1}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <label>New password</label>
                  <img
                    onClick={() => CheckType1()}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark"
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    onClick={() => CheckType1()}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white"
                    style={{ cursor: "pointer" }}
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
                    className="eye dark"
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    onClick={() => CheckType2()}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <p
                  className="text-center pb-2"
                  style={{ color: "red", fontSize: 12 }}
                >
                  {error}
                </p>
                <button type="submit" className="common-btntwo">
                  {account ? "Submit" : "Wallet not connected"}
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => ImportWallet2(e)} className="importbody">
                <p className="importpara">
                  Use your Secret Phrase to import an existing DOP wallet.{" "}
                </p>
                <div className="material-textfield">
                  <input
                    onChange={(e) => setMnemonic(e.target.value)}
                    placeholder="Secret Phrase"
                    type={show ? "text" : "password"}
                  />
                  <label>Secret Phrase</label>
                </div>
                {/* <div className="material-textfield">
                  <input
                    onChange={(e) => setBlock(e.target.value)}
                    placeholder="Secret Phrase or Private Key"
                  />
                  <label>Add Block Number</label>
                </div> */}
                <div className="form-check radiocheck-btnn">
                  <input
                    onChange={(e) => setShow(!show)}
                    className="form-check-input"
                    type="checkbox"
                    id="flexCheckDefault"
                  />
                  <label
                    className="form-check-label importhead"
                    for="flexCheckDefault"
                  >
                    Show Secret Phrase
                  </label>
                </div>
                <p
                  className="text-center pb-2"
                  style={{ color: "red", fontSize: 12 }}
                >
                  {error}
                </p>
                <button type="submit" className="common-btntwo">
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Importwallet;
