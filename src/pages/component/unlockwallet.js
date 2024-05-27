import Link from "next/link";
import React, { useEffect, useState } from "react";
import Loader from "../../hooks/loader";
import { getData, saveData } from "../../utils/db";
import { useRouter } from "next/router";
import CryptoJS from "crypto-js";
import Navbar from "../../components/primaryNavbar";
import { useWeb3React } from "@web3-react/core";
import useWeb3 from "../../hooks/useWeb3";
import { Api_URL } from "../../hooks/apiUrl";
import axios from "axios";
import Footer from "./footer";

const Unlockwallet = () => {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loader, setLoader] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const router = useRouter();

  const Login = async (e) => {
    e?.preventDefault();
    setError("");
    if (account) {
      let res = await getData("accounts");
      if (res?.length > 0) {
        setLoader(true);
        const key = "dopTPL_";
        const myPrivateKey = CryptoJS.AES.decrypt(
          res[0]?.password,
          key
        ).toString(CryptoJS.enc.Utf8);
        if (myPrivateKey === password) {
          // let currentDate = new Date();
          // const futureDate = new Date(
          //   currentDate.getTime() + 24 * 60 * 60 * 1000
          // );
          // await saveData("logTime", futureDate);
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
              router.push("/");
              // setLoader(false);
            })
            .catch((error) => {
              setLoader(false);
            });
        } else {
          setError("*Incorrect Password!");
          setLoader(false);
        }
      } else {
        router.push("/");
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
        document.body.classList.add("no-scroll");
      } else {
        document.body.classList.remove("no-scroll");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      document.body.classList.remove("no-scroll");
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="component-100vh">
        {loader && <Loader />}
        <Navbar showWall={showWallet} />
        <section className="unlockwallet">
          <div className="custom-container">
            <div className="innerimport">
              <div className="importheader">
                <p className="importhead">
                  Enter your password to unlock your wallet
                </p>
              </div>
              <form onSubmit={(e) => Login(e)} className="w-100">
                <div className="importbody">
                  <div className="material-textfield">
                    <input
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      value={password}
                      type={show ? "text" : "password"}
                    />
                    <label>Password</label>
                    <img
                      src="\assets\import-assets\eye-dark.svg"
                      alt="eye"
                      onClick={() => setShow(!show)}
                      className="eye dark"
                    />
                    <img
                      src="\assets\import-assets\eye-white.svg"
                      onClick={() => setShow(!show)}
                      alt="eye"
                      className="eye white"
                    />
                  </div>
                  {error ? (
                    <p
                      className="pb-3"
                      style={{ color: "red", fontSize: 12, marginTop: -6 }}
                    >
                      {error}
                    </p>
                  ) : (
                    ""
                  )}
                  <Link href="/reset">
                    <p className="common-clr forgot-text">Forgot Password?</p>
                  </Link>
                  <button type="submit" className="common-btntwo">
                    {account ? "Unlock" : "Wallet not connected"}
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

export default Unlockwallet;
