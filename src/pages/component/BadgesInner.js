import React, { useEffect, useRef } from "react";
import { Offcanvas } from "react-bootstrap";
import TwitterLogin from "react-twitter-auth";
import Loader1 from "../../hooks/loader1";

const BadgeOffcanvas = ({
  isOpen,
  toggleOffCanvas,
  user,
  nfts,
  Api_URL,
  onFailed,
  onSuccess,
  VerifyFollow,
  launchZkME,
  showingData,
  setVerifyEmail,
}) => {
  const telegramWrapperRef11 = useRef(null);

  useEffect(() => {
    if (telegramWrapperRef11?.current) {
      updateRef();
    }
  }, [telegramWrapperRef11, isOpen]);

  const updateRef = () => {
    setTimeout(() => {
      const scriptElement = document.createElement("script");
      scriptElement.src = "https://telegram.org/js/telegram-widget.js?22";
      scriptElement.setAttribute("data-telegram-login", "DOP_mainnet2_bot");
      scriptElement.setAttribute("data-size", "large");
      scriptElement.setAttribute(
        "data-auth-url",
        "https://tplsnark-latest.vercel.app"
      );
      scriptElement.async = true;

      telegramWrapperRef11.current?.appendChild(scriptElement);
    }, [3000]);
  };

  return (
    <div className={`offcanvass badges-offcanvas ${isOpen ? "open" : ""}`}>
      <Offcanvas.Header>
        <Offcanvas.Title>My badges</Offcanvas.Title>
        <a onClick={toggleOffCanvas} className="offcanvas-close">
          <img
            src="\bg-imgs\offanvas-close-light.svg"
            alt="img"
            className="img-fluid noneindarktheme"
          />
          <img
            src="\bg-imgs\offanvas-close.svg"
            alt="img"
            className="img-fluid showindarktheme"
          />
        </a>
      </Offcanvas.Header>
      <div className="offcanvas-content">
        <>
          {showingData && <Loader1 />}
          <div className="main-parent">
            <h6 className="main-heading">Social Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                {user?.follow_Us_On_Telegram?.isCompleted ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188183/dop/newbadges/social/telegram-active_lgrnua.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188183/dop/newbadges/social/telegram_wyuein.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                <h6>
                  Join dop <br /> on Telegram
                </h6>
                <div
                  className="telegram-login-widget flex justify-center"
                  ref={telegramWrapperRef11}
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
                  // <div style={{display: 'flex'}}>
                  //   <a href="https://t.me/doptest_Channel" className="set-custom-link telegram-link">Join</a>
                  //   <p style={{ color: "#fff" }}>{"&"}</p>
                  <a className="set-custom-link telegram-link">Verify</a>
                  // </div>
                )}
              </div>
              <div className="single-badge">
                {user?.follow_Us_On_Twitter?.isCompleted ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188184/dop/newbadges/social/twitter-active_fwk5rg.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188185/dop/newbadges/social/twitter_fi7i80.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                <h6>
                  Follow DOP <br /> on x
                </h6>

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
              </div>
              <div className="single-badge">
                {user?.follow_Us_On_Discord?.isCompleted ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188181/dop/newbadges/social/discord-active_dn7dtd.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188182/dop/newbadges/social/discord_adw2hf.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                <h6>
                  Follow dop <br /> on Discord
                </h6>
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
                    Follow on discord
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
                {user?.isKycVerified ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188185/dop/newbadges/social/zkkyc-active_kfwfgw.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188185/dop/newbadges/social/zkkyc_ulgasx.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
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
                <h6>
                  Complete <br /> zk KYC
                </h6>
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188182/dop/newbadges/social/email-active_wu5mun.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188183/dop/newbadges/social/email_di6pbi.svg"
                    alt="img"
                    className="img-fluid"
                  />
                )}
                <h6>
                  Complete <br /> email verification
                </h6>
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
                {user?.encryptAmount < 10000 ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e1_zj3kld.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e1-active_invy6z.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e2_sbzeoe.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e2-active_kgkz6s.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188173/dop/newbadges/encrypt/e3_eybu11.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188172/dop/newbadges/encrypt/e3-active_pdenft.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e4_dvfovm.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188172/dop/newbadges/encrypt/e4-active_gnwhhy.svg"
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
                {user?.encryptAmount < 500000 ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188172/dop/newbadges/encrypt/e5_rwt9e5.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188170/dop/newbadges/encrypt/e5-active_xgkv0a.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188174/dop/newbadges/encrypt/e6_q72zmi.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188173/dop/newbadges/encrypt/e6-active_gbd81b.svg"
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
          <div className="main-parent">
            <h6 className="main-heading">Sends Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                {user?.sendCount < 50 ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188178/dop/newbadges/send/s1_xxpnab.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188178/dop/newbadges/send/s1-active_sl4uvx.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188179/dop/newbadges/send/s2_mrt6yn.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188179/dop/newbadges/send/s2-active_nwye9y.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188180/dop/newbadges/send/s3_uz2lsz.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188180/dop/newbadges/send/s3-active_zgs1pg.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188181/dop/newbadges/send/s4_bipy9d.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188180/dop/newbadges/send/s4-active_stx27j.svg"
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
          <div className="main-parent">
            <h6 className="main-heading">NFT Badges</h6>
            <div className="badges-parent">
              <div className="single-badge">
                {nfts?.jack > 0 ? (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188176/dop/newbadges/roadtomainnet/dopsoldier-active_a8kdud.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188177/dop/newbadges/roadtomainnet/dopsoldier_nvmzk5.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188175/dop/newbadges/roadtomainnet/dopqueen-active_lkghfd.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188175/dop/newbadges/roadtomainnet/dopqueen_bx2nhn.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188174/dop/newbadges/roadtomainnet/dopking-active_uj12jn.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188175/dop/newbadges/roadtomainnet/dopking_x7cg6e.svg"
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
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188177/dop/newbadges/roadtomainnet/doptreasure-active_vccrfh.svg"
                    alt="img"
                    className="img-fluid"
                  />
                ) : (
                  <img
                    src="https://res.cloudinary.com/drt6vurtt/image/upload/v1716188177/dop/newbadges/roadtomainnet/doptreasure_t1qnlj.svg"
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
        </>
      </div>
    </div>
  );
};

export default BadgeOffcanvas;
