import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { createDopWallet } from "dop-wallet-old";
import { NetworkName } from "dop-sharedmodels";
import CryptoJS from "crypto-js";
import { ethers as ethers2 } from "ethers2";
import { saveData } from "../../utils/db.js";
import Loader from "../../hooks/loader";
import { setEncryptionKeyFromPassword } from "../../components/hash-service";
import Footer from "./footer.js";
import Navbar from "../../components/primaryNavbar.js";

const Reset = () => {
  const [phrase, setPhrase] = useState("");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const router = useRouter();

  const ResetWallet = async (e) => {
    e?.preventDefault();
    setError("");
    try {
      if (password?.length > 7) {
        if (password === cpassword) {
          setLoader(true);
          const mnemonic = phrase;
          const encryptionKey = await setEncryptionKeyFromPassword(password);
          let wallet = null;
          try {
            wallet = ethers2.Wallet.fromPhrase(mnemonic);
          } catch (err) {
            setError("Invalid secret phrase!");
          }
          if (wallet) {
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
            let currentDate = new Date();
            const futureDate = new Date(
              currentDate.getTime() + 24 * 60 * 60 * 1000
            );
            await saveData("logTime", futureDate);
            let currAcc = await saveData("selectedAccount", account);
            let res = await saveData("accounts", [account]);
            router.push("/");
          }
          setLoader(false);
        } else {
          setError("*Passwords don't match.");
        }
      } else {
        setError("*Password must be of length 8!");
      }
    } catch (err) {
      console.log("err", err);
      setLoader(false);
    }
  };

  return (
    <>
      {loader && <Loader />}
      <Navbar />
      <section className="createwallet">
        <div className="custom-container">
          <div className="innerimport">
            <div className="importheader">
              <Link href="/unlockwallet">
                <img
                  src="\assets\button-svgs\arrow-left.svg"
                  alt="backarrow"
                  className="backarrow"
                />
              </Link>
              <p className="importhead">Reset Wallet Password</p>
            </div>
            <form onSubmit={(e) => ResetWallet(e)} className="w-100">
              <div className="material-textfield mb-3">
                <input
                  onChange={(e) => setPhrase(e.target.value)}
                  value={phrase}
                  placeholder="Enter your Secret Phrase"
                  type={show ? "text" : "password"}
                />
                <label>Enter your Secret Recovery Phrase</label>
              </div>
              <div className="form-check radiocheck-btnn mb-4">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={() => setShow(!show)}
                  checked={show}
                  id="flexCheckDefault"
                />
                <label
                  className="form-check-label importheadddddd"
                  for="flexCheckDefault"
                >
                  Show Secret Recovery Phrase
                </label>
              </div>
              <div className="importbody">
                <div className="material-textfield">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={show1 ? "text" : "password"}
                    placeholder="Enter a new password"
                  />
                  <label>Enter a new password</label>
                  <img
                    onClick={() => setShow1(!show1)}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark"
                  />
                  <img
                    onClick={() => setShow1(!show1)}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white"
                  />
                </div>
                <div className="material-textfield">
                  <input
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    placeholder="Confirm new password"
                    type={show2 ? "text" : "password"}
                  />
                  <label>Confirm new password</label>
                  <img
                    onClick={() => setShow2(!show2)}
                    src="\assets\import-assets\eye-dark.svg"
                    alt="eye"
                    className="eye dark"
                  />
                  <img
                    onClick={() => setShow2(!show2)}
                    src="\assets\import-assets\eye-white.svg"
                    alt="eye"
                    className="eye white"
                  />
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
              </div>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Reset;
