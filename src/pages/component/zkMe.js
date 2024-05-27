import React, { useState, useEffect } from "react";
import "@zkmelabs/widget/dist/style.css";
import { ZkMeWidget, verifyWithZkMeServices } from "@zkmelabs/widget";
import axios from "axios";
import { useWeb3React } from "@web3-react/core";

const ZkMe = () => {
  const [zkMeWidget, setZkMeWidget] = useState(null);
  const [token, setToken] = useState(null);
  const [rend, setRend] = useState(false);
  const { account } = useWeb3React();

  useEffect(() => {
    getAccessToken();
  }, []);

  const getAccessToken = () => {
    var config = {
      method: "post",
      url: "https://nest-api.zk.me/api/token/get",
      data: {
        apiKey: "c251b51d.881b4510da391a8644ac794c1edc4054",
        appId: "M2024010407274337207552613551538",
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

  useEffect(() => {
    if (token) {
      SetUPZkME();
    }
  }, [token]);

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
        const txResponse = await signer.sendTransaction(tx);
        return txResponse.hash;
      },
      // Cosmos
      async delegateCosmosTransaction(tx) {
        const txResponse = await signingCosmWasmClient.execute(
          tx.senderAddress,
          tx.contractAddress,
          tx.msg,
          "auto"
        );
        return txResponse.transactionHash;
      },
      // Aptos
      async delegateAptosTransaction(tx) {
        const txResponse = await aptos.signAndSubmitTransaction(tx);
        return txResponse.hash;
      },
      // ...
      // See the Provider interface definition for more details on other chains.
    };

    const zkMeWidget = new ZkMeWidget(
      "M2024010407274337207552613551538", // This parameter means the same thing as "mchNo"
      "DOP_KYC",
      137,
      provider
      // Optional configurations are detailed in the table below
      //   options
    );

    await setZkMeWidget(zkMeWidget);
    await setRend(!rend);

    async function handleFinished(verifiedAccount) {
      // We recommend that you double-check this by calling
      // the functions mentioned in the "Helper functions" section.
      if (verifiedAccount === userConnectedAddress) {
        // zkKYC
        const results = await verifyWithZkMeServices(
          appId,
          userConnectedAddress
        );

        if (results) {
          // let tok = localStorage.getItem("myToken");
          // const postData = {
          //   isKycVerified: true,
          // };
          // axios
          //   .patch(`${Api_URL}/users`, postData, {
          //     headers: {
          //       Authorization: `Bearer ${tok}`, // Include your authentication token here
          //     },
          //   })
          //   .then(async (response) => {
          //   })
          //   .catch((error) => {
          //     console.log("error", error?.response?.data?.message);
          //   });
          // Prompts the user that zkKYC/MeID verification has been completed
        }
      }
    }

    zkMeWidget.on("finished", handleFinished);
  };

  const launchZkME = () => {
    zkMeWidget.launch();
  };

  return (
    <>
      <section className="congrats">
        <div className="upper-heading">
          {account ? (
            <>
              {zkMeWidget && (
                <button onClick={() => launchZkME()}>Launch ZkME!</button>
              )}
            </>
          ) : (
            <p>Connect your wallet first</p>
          )}
          {/* 
          {token && (
            <div class="app-wrap">
              <iframe
                id="zkme-widget"
                title="zkme-widget"
                width="100%"
                height="100%"
                src={
                  "https://widget.zk.me/?mchNo=M2024010407274337207552613551538&name=DopTest&chainId=0x89&accessToken=" +
                  token
                }
              />
            </div>
          )} */}
        </div>
      </section>
    </>
  );
};

export default ZkMe;
