import Link from "next/link";
import Navbar from "../../components/primaryNavbar";
import React, { useEffect, useState } from "react";
import { getData, saveData } from "../../utils/db.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Mnemonic, randomBytes, Wallet } from "ethers";
import { ethers as ethers2 } from "ethers2";
import CryptoJS from "crypto-js";
import { createDopWallet } from "dop-wallet-old";
import { NetworkName } from "dop-sharedmodels";
import { setEncryptionKeyFromPassword } from "../../components/hash-service";
import { useRouter } from "next/router";
import Loader from "../../hooks/loader";
import axios from "axios";
import { Api_URL } from "../../hooks/apiUrl";
import { useWeb3React } from "@web3-react/core";
import useWeb3 from "../../hooks/useWeb3";
import Footer from "./footer.js";

const Secretrecoveryphrase = () => {
  const [showWallet, setShowWallet] = useState(false);
  const [mnemonic, setMnemonic] = useState("");
  const [mnemonicArr, setMnemonicArr] = useState([]);
  const [schuffArr, setSchuffArr] = useState([]);
  const [userMnemonic, setUserMnemonic] = useState([]);
  const [rend, setRend] = useState(false);
  const [error, setError] = useState("");
  const [copy, setCopy] = useState(false);
  const [verify, setVerify] = useState(false);
  const [loader, setLoader] = useState(false);
  const [count, setCount] = useState(1);
  const router = useRouter();
  const { account } = useWeb3React();
  const web3 = useWeb3();
  const [setPhrases, setSetPhrases] = useState([]);

  useEffect(() => {
    getVariables();
  }, []);

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

  const getVariables = async () => {
    let res = await getData("dumObj");
    if (res) {
      setMnemonic(res?.phrase);

      const wordArray = res?.phrase.split(" ");
      setMnemonicArr(wordArray);

      let dumArr = [...wordArray];
      dumArr = dumArr.sort(getRandomNumber);
      const arrayOfObjects = dumArr.map((str, index) => ({
        id: "", // You can use a different way to generate unique IDs
        value: str,
        selected: false,
      }));
      setSchuffArr(arrayOfObjects);
      setUserMnemonic([]);
      setCount(1);
      setRend(!rend);
    } else {
      let myAccs = await getData("accounts");

      if (myAccs?.length > 0) {
        const key = "dopTPL_";
        const decPass = CryptoJS.AES.decrypt(
          myAccs[0]?.password,
          key
        ).toString();
        const mnemonic = generateUniqueMnemonic();

        const encryptionKey = await setEncryptionKeyFromPassword(decPass);
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
        const encrypted = CryptoJS.AES.encrypt(
          privateKeyString,
          key
        ).toString();
        const encryptionKey1 = CryptoJS.AES.encrypt(
          encryptionKey,
          key
        ).toString();
        const id = dopWalletInfo.id; // Store this value.
        const dopAdd = dopWalletInfo.dopAddress; // Store this value.
        const account = {
          address: wallet.address,
          phrase: mnemonic,
          privateKey: encrypted,
          dopAdd: dopAdd,
          dopId: id,
          dopEncryptionKey: encryptionKey1,
          password: myAccs[0]?.password,
        };
        await saveData("dumObj", account);
        setMnemonic(account?.phrase);

        const wordArray = account?.phrase.split(" ");
        setMnemonicArr(wordArray);

        let dumArr = [...wordArray];
        dumArr = dumArr.sort(getRandomNumber);
        const arrayOfObjects = dumArr.map((str, index) => ({
          id: "", // You can use a different way to generate unique IDs
          value: str,
          selected: false,
        }));
        setSchuffArr(arrayOfObjects);
        setUserMnemonic([]);
        setCount(1);
        setRend(!rend);
      } else {
        router.push("/");
      }
    }
  };

  function getRandomNumber() {
    return Math.random() - 0.5;
  }

  const CallCopy = () => {
    setCopy(true);
    setTimeout(() => {
      setCopy(false);
    }, [3000]);
  };

  const CheckUserPhrase = async () => {
    setError("");
    if (account) {
      let dumArr = setPhrases;
      const resultString = dumArr.join(" ");
      if (resultString === mnemonic) {
        let tring = "weareDOPdev";
        let res = await getData("dumObj");
        const key = "dopTPL_";
        const myPrivateKey = CryptoJS.AES.decrypt(
          res?.privateKey,
          key
        ).toString(CryptoJS.enc.Utf8);
        let newwallet = web3.eth.accounts.privateKeyToAccount(myPrivateKey);
        let wall = newwallet.address.toLowerCase();
        web3.eth.accounts.wallet.add(newwallet);
        let signmessage = await web3.eth.sign(
          `${wall}${account.toLowerCase()}${tring}`,
          wall
        );
        try {
          let ref = localStorage.getItem("referral");
          setLoader(true);
          let country = localStorage.getItem("country");
          const postData = {
            externalWalletAddress: account?.toLowerCase(),
            internalWalletAddress: wall,
            sign: signmessage.signature,
            location: country ? country : "Anonymous",
            referalByCode: ref ? ref : "",
            blockNumber: res?.blockNumber?.toString(),
          };
          axios
            .post(`${Api_URL}/auth/users/signup-signin`, postData)
            .then(async (response) => {
              localStorage.setItem("myToken", response?.data?.data.accessToken);
              localStorage.removeItem("referral");
              let accounts = await getData("accounts");
              if (accounts?.length > 0) {
                // res.accountNo = accounts?.length + 1;
                accounts.push(res);
              } else {
                // res.accountNo = 1;
                accounts = [res];
              }
              let currAcc = await saveData("selectedAccount", res);
              await saveData("accounts", accounts);
              router.push("/congrats");
              // setLoader(false);
            })
            .catch((error) => {
              // Handle errors that occurred during the POST request
              // setError("External wallet address already exists");
              console.error("Error::::===>", error?.response?.data?.message);
              setError(error?.response?.data?.message);
              // const searchString = "already exist";
              // const containsPhrase =
              //   JSON.stringify(error).includes(searchString);
              // if (containsPhrase) {
              //   setError("External wallet address already exists");
              // } else {
              //   setError(error?.response?.data?.message)
              // }
              setLoader(false);
            });
        } catch (err) {}
      } else {
        setError("Incorrect mnemonic phrase");
        getVariables();
        setVerify(false);
      }
      // }
    } else {
      setShowWallet(true);
    }
  };

  const Verifyphrases = (item, index) => {
    let newArr = setPhrases;
    let newObj = newArr?.find((i) => {
      return i === item?.value;
    });
    if (newObj) {
    } else {
      let selectedPhrase = schuffArr[index];
      selectedPhrase.id = count;
      selectedPhrase.selected = true;

      let updatedArr = schuffArr.map((phrase) => {
        if (phrase.id === selectedPhrase.id) {
          return selectedPhrase;
        }
        return phrase;
      });
      setSchuffArr(updatedArr);

      setCount(count + 1);

      setSetPhrases((prevSetPhrases) => [
        ...prevSetPhrases,
        selectedPhrase.value,
      ]);
    }
  };

  const removePhrase = (index) => {
    // Create a new copy of schuffArr to avoid mutating the original array directly
    const updatedArray = schuffArr.map((item, idx) => {
      if (index === 0) {
        if (idx >= index) {
          return { ...item, selected: false };
        }
      } else if (idx > index) {
        return { ...item, selected: false };
      }
      return item;
    });

    // Assuming setSchuffArr is the setter function from useState for updating the schuffArr
    setSchuffArr(updatedArray);

    // Since it seems you want to update another state as well, including setSetPhrases and rend
    // Update setSetPhrases if necessary, depending on what it's supposed to contain post update
    // For example, if setSetPhrases should also remove items from index onward
    if (index === 0) {
      setSetPhrases([]);
    } else {
      const newPhrases = setPhrases.slice(0, index);
      setSetPhrases(newPhrases);
    }

    // Toggling 'rend' state to force a re-render, this seems to be a pattern you are using to manage updates
    setRend(!rend);
  };

  const handleRemove = (index) => {
    removePhrase(index);
  };

  return (
    <>
      <Navbar showWall={showWallet} />
      {loader && <Loader />}
      {verify === false ? (
        <section className="secret-recovery">
          <div className="custom-container">
            <div className="secret-recover-div">
              <div className="upper-heading">
                <Link href="/createwallet">
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
                <h6>Secret Recovery Phrase</h6>
              </div>
              <div className="bottom-content">
                <p className="para">
                  Your Secret Recovery Phrase allows you to backup and restore
                  your wallet. On the next screen you’ll be asked to enter the
                  words in the correct order to verify the secret phrase.
                </p>
                <div className="phrase-content show-border-here">
                  {mnemonicArr?.map((item, index) => {
                    return (
                      <div key={index} className="single-phrase">
                        <span>{index + 1}.</span>
                        <p>{item}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="bottom-para">
                  <p>
                    Warning: Do not share your secret phrase with anyone. Anyone
                    who has your secret phrase can control your assets!
                  </p>
                </div>
                <p
                  className="text-center pb-3"
                  style={{ color: "red", fontSize: 12, marginTop: -6 }}
                >
                  {error}
                </p>
                <div className="twice-btn">
                  <CopyToClipboard text={mnemonic} onCopy={() => CallCopy()}>
                    <button className="btn-skip position-relative">
                      <p className="copy_data click___One justify-content-center;">
                        Copy Phrase
                        <span className="gsvsvcvst"></span>{" "}
                        <img
                          src="\assets\button-svgs\Accountcopypicwhite.svg"
                          alt="img"
                          className="logoimggpccro ml-3"
                        />
                      </p>
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
                    </button>
                  </CopyToClipboard>
                  <button
                    onClick={() => {
                      setVerify(true), setSetPhrases([]), setError("");
                    }}
                    className="btn-verify w-100"
                  >
                    Verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="secret-recovery">
          <div className="custom-container">
            <div className="secret-recover-div">
              <div className="upper-heading ">
                <div
                  onClick={() => {
                    setVerify(false);
                    setSetPhrases([]);
                    // setSchuffArr([]);
                  }}
                >
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
                </div>
                <h6>Verify your Secret Phrase</h6>
              </div>
              <div className="bottom-content">
                <p className="para">
                  Select the words in the correct order to ensure you have kept
                  the correct phrase.
                </p>
                {setPhrases != "" && (
                  <div className="set-phrases">
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "end",
                      }}
                    >
                      {/* <svg
                        onClick={() => handleRemove(0)}
                        style={{ cursor: "pointer" }}
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-tabler icon-tabler-refresh"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="#000000"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                        <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                      </svg> */}
                      {/* <svg
                        className="cursor-pointer"
                        style={{ cursor: "pointer" }}
                        xmlns="http://www.w3.org/2000/svg"
                        width="9"
                        height="9"
                        viewBox="0 0 9 9"
                        fill="none"
                      >
                        <path
                          d="M1.69497 8.58004C1.47836 8.58004 1.26175 8.50024 1.09074 8.32923C0.760119 7.99861 0.760119 7.45138 1.09074 7.12076L7.54349 0.668008C7.87411 0.337389 8.42134 0.337389 8.75196 0.668008C9.08258 0.998626 9.08258 1.54586 8.75196 1.87647L2.2992 8.32923C2.13959 8.50024 1.91158 8.58004 1.69497 8.58004Z"
                          fill="black"
                        />
                        <path
                          d="M8.14773 8.58004C7.93111 8.58004 7.7145 8.50024 7.54349 8.32923L1.09074 1.87647C0.760119 1.54586 0.760119 0.998626 1.09074 0.668008C1.42136 0.337389 1.96858 0.337389 2.2992 0.668008L8.75196 7.12076C9.08258 7.45138 9.08258 7.99861 8.75196 8.32923C8.58095 8.50024 8.36434 8.58004 8.14773 8.58004Z"
                          fill="black"
                        />
                      </svg> */}
                    </div>
                    {setPhrases.map((phrase, index) => (
                      <div key={index} className="single-phrase cursor-pointer">
                        <p>{phrase}</p>
                        <svg
                          onClick={() => removePhrase(index)}
                          className="cursor-pointer"
                          style={{ cursor: "pointer" }}
                          xmlns="http://www.w3.org/2000/svg"
                          width="9"
                          height="9"
                          viewBox="0 0 9 9"
                          fill="none"
                        >
                          <path
                            d="M1.69497 8.58004C1.47836 8.58004 1.26175 8.50024 1.09074 8.32923C0.760119 7.99861 0.760119 7.45138 1.09074 7.12076L7.54349 0.668008C7.87411 0.337389 8.42134 0.337389 8.75196 0.668008C9.08258 0.998626 9.08258 1.54586 8.75196 1.87647L2.2992 8.32923C2.13959 8.50024 1.91158 8.58004 1.69497 8.58004Z"
                            fill="black"
                          />
                          <path
                            d="M8.14773 8.58004C7.93111 8.58004 7.7145 8.50024 7.54349 8.32923L1.09074 1.87647C0.760119 1.54586 0.760119 0.998626 1.09074 0.668008C1.42136 0.337389 1.96858 0.337389 2.2992 0.668008L8.75196 7.12076C9.08258 7.45138 9.08258 7.99861 8.75196 8.32923C8.58095 8.50024 8.36434 8.58004 8.14773 8.58004Z"
                            fill="black"
                          />
                        </svg>
                      </div>
                    ))}
                  </div>
                )}

                <div className="phrase-content">
                  {schuffArr?.map((item, index) => {
                    const buttonStyle = item.isSelected
                      ? "lightblue"
                      : "var(--body-bg)";
                    return (
                      <>
                        {!item?.selected && (
                          <button
                            key={index}
                            onClick={() => Verifyphrases(item, index)}
                            className="single-phrase"
                            style={{ backgroundColor: buttonStyle }}
                          >
                            <span></span>
                            <p>{item?.value}</p>
                          </button>
                        )}
                      </>
                    );
                  })}
                </div>
                <p
                  className="text-center pb-3"
                  style={{ color: "red", fontSize: 12, paddingTop: 25 }}
                >
                  {error}
                </p>
                <div className="twice-btn">
                  <button
                    onClick={() => CheckUserPhrase()}
                    className="btn-verify done-btn w-100"
                  >
                    {account ? "Ok, i’m Done" : "Wallet not connected"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  );
};

export default Secretrecoveryphrase;
