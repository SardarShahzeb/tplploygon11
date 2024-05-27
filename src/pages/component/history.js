import React, { useEffect, useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Navbar from "./navbar";
import Encryptinghistory from "./encryptinghistory";
import Sendinghistory from "./sendinghistory";
import Decryptinghistory from "./decryptinghistory";
import { getData } from "../../utils/db";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";
import Footer from "./footer";

const History = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("");
  const { account } = useWeb3React();

  useEffect(() => {
    let res = localStorage.getItem("pageTr");
    if (res === "2") {
      setActiveTab("sendhistory");
    } else if (res === "3") {
      setActiveTab("decrypthistory");
    } else {
      setActiveTab("encrypthistory");
    }
    localStorage.removeItem("pageTr");
  }, []);

  // useEffect(() => {
  //   CheckConnected();
  // }, [account]);

  // const CheckConnected = () => {
  //   setTimeout(() => {
  //     if (account) {
  //     } else {
  //       router.push("/unlockwallet")
  //     }
  //   }, [2000]);
  // };

  return (
    <>
      <Navbar setUser={setUser} user={user} />
      <section className="history-section">
        {/* <img
          src="\assets\body-bottom-shade.svg"
          alt="img"
          className="img-fluid bottom-body-shade noneinlight-theme"
        />
        <img
          src="\assets\body-bottom-shade-light.svg"
          alt="img"
          className="img-fluid bottom-body-shade d-none showinlight-theme"
        /> */}
        <div className="custom-container">
          {activeTab !== "" && (
            <div className="parent-history">
              <Tabs
                defaultActiveKey={activeTab}
                id="uncontrolled-tab-example"
                className="history-tab"
              >
                <Tab eventKey="encrypthistory" title="Encrypting HISTORY">
                  <Encryptinghistory />
                </Tab>
                <Tab eventKey="sendhistory" title="SENDING HISTORY">
                  <Sendinghistory />
                </Tab>
                <Tab eventKey="decrypthistory" title="DECRYPTING HISTORY">
                  <Decryptinghistory />
                </Tab>
              </Tabs>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default History;
