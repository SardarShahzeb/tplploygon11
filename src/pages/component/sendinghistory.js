import React, { useState, useEffect } from "react";
import { getData } from "../../utils/db";
import { Accordion } from "react-bootstrap";

const Sendinghistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    gettingHistory();
  }, []);

  const gettingHistory = async () => {
    const currHis = await getData("sendTransactions");
    setHistory(currHis);
  };

  const FormatDate = (date) => {
    const originalDate = new Date(date);
    const formattedDate = originalDate.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDate;
  };

  return (
    <>
      <section className="encrypting-history history-desktop-view">
        <div className="main-heading">
          <h6>Sending HISTORY</h6>
          {/* <a href="#" className="btn-refresh">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14.6668 8.00001C14.6668 11.68 11.6802 14.6667 8.00016 14.6667C4.32016 14.6667 2.0735 10.96 2.0735 10.96M2.0735 10.96H5.08683M2.0735 10.96V14.2933M1.3335 8.00001C1.3335 4.32001 4.2935 1.33334 8.00016 1.33334C12.4468 1.33334 14.6668 5.04001 14.6668 5.04001M14.6668 5.04001V1.70668M14.6668 5.04001H11.7068"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Refresh
          </a> */}
        </div>
        {history && history.length > 0 ? (
          <div className="historytable">
            <table>
              <thead>
                <tr>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">id</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Assets</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Time</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Amount</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">TRX hash</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                  <th>
                    <div className="tblheader">
                      <p className="tblhead">Status</p>
                      <div className="arrows">
                        <img
                          src="\assets\upperarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                        <img
                          src="\assets\lowerarrow.svg"
                          alt="innerarrow"
                          className="innerarrow dark"
                        />
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {history?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>
                        <div className="tbltd">
                          <p className="serial">{index + 1}</p>
                        </div>
                      </td>
                      <td>
                        <div className="tbltd">
                          <p className="darktext">{item?.asset?.name}</p>
                        </div>
                      </td>
                      <td>
                        <div className="tbltd">
                          <p className="darktext">
                            {item?.time?.toString()?.slice(4, 21)}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="tbltd">
                          <p className="darktext">{item?.amount}</p>
                        </div>
                      </td>
                      <td>
                        <div className="tbltd">
                          <p className="darktext">
                            {item?.hash?.transactionHash?.slice(0, 20) + "..."}
                            <a
                              target="_blank"
                              href={
                                "https://polygonscan.com/tx/" +
                                item?.hash?.transactionHash
                              }
                            >
                              {" "}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M6.66696 3.33334H5.46696C4.72022 3.33334 4.34658 3.33334 4.06136 3.47866C3.81048 3.60649 3.60665 3.81032 3.47882 4.0612C3.3335 4.34642 3.3335 4.72007 3.3335 5.4668V10.5335C3.3335 11.2802 3.3335 11.6534 3.47882 11.9386C3.60665 12.1895 3.81048 12.3937 4.06136 12.5215C4.3463 12.6667 4.71949 12.6667 5.46477 12.6667H10.5356C11.2808 12.6667 11.6535 12.6667 11.9384 12.5215C12.1893 12.3937 12.3938 12.1893 12.5216 11.9384C12.6668 11.6535 12.6668 11.2807 12.6668 10.5354V9.33334M13.3335 6.00001V2.66667M13.3335 2.66667H10.0002M13.3335 2.66667L8.66683 7.33334"
                                  stroke="#696969"
                                  stroke-width="1.5"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            </a>
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="tbltd">
                          <button className="statusbtn green">
                            <img src="\assets\tick-circle.svg" alt="tick" />
                            Success
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="custom-set-style">
            <img
              src="\assets\tableimg-ifnot.svg"
              alt="img"
              className="img-fluid"
            />
            <h6>Your sending history is empty</h6>
          </div>
        )}
      </section>
      <section className="encrypting-history history-mobile-view d-none">
        <div className="main-heading">
          <h6>Sending HISTORY</h6>
          {/* <a href="#" className="btn-refresh">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M14.6668 8.00001C14.6668 11.68 11.6802 14.6667 8.00016 14.6667C4.32016 14.6667 2.0735 10.96 2.0735 10.96M2.0735 10.96H5.08683M2.0735 10.96V14.2933M1.3335 8.00001C1.3335 4.32001 4.2935 1.33334 8.00016 1.33334C12.4468 1.33334 14.6668 5.04001 14.6668 5.04001M14.6668 5.04001V1.70668M14.6668 5.04001H11.7068"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Refresh
          </a> */}
        </div>
        {/* {history && history.length > 0 ? ( */}
        {history && history.length > 0 ? (
        <div className="accordionmobile d-none">
          <Accordion defaultActiveKey="0">
            {history?.map((item, index) => {
              return (
                <Accordion.Item eventKey={index}>
                  <Accordion.Header>
                    <div className="custom-tab-data">
                      <div className="text">
                        <p>id</p>
                        <h6>{index + 1}</h6>
                      </div>
                      <div className="text">
                        <p>Asset</p>
                        <h6>{item?.asset?.name}</h6>
                      </div>
                      <div className="text">
                        <p>Status</p>
                        <h6 style={{ color: "#00B812" }}>Success</h6>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                      >
                        <path
                          d="M17.4062 10.3999H13.4004H9.79324C9.17598 10.3999 8.86735 11.1458 9.30457 11.583L12.6352 14.9136C13.1689 15.4473 14.0369 15.4473 14.5706 14.9136L15.8373 13.647L17.9013 11.583C18.3321 11.1458 18.0234 10.3999 17.4062 10.3999Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    <div className="accinner">
                      <p className="accinnerpara">Amount</p>
                      <h6 className="accinnerhead">{item?.amount}</h6>
                    </div>
                    <div className="accinner">
                      <p className="accinnerpara">Time</p>
                      <h6 className="accinnerhead">
                        {item?.time?.toString()?.slice(4, 21)}
                      </h6>
                    </div>
                    <div className="accinner">
                      <p className="accinnerpara">TRX Hash</p>
                      <h6 className="accinnerhead">
                        {item?.hash?.transactionHash?.slice(0, 20) + "..."}
                        <a
                          href={
                            "https://polygonscan.com/tx/" +
                            item?.hash?.transactionHash
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                          >
                            <path
                              d="M6.66647 3.33329H5.46647C4.71973 3.33329 4.34609 3.33329 4.06087 3.47862C3.80999 3.60645 3.60616 3.81027 3.47833 4.06116C3.33301 4.34637 3.33301 4.72002 3.33301 5.46676V10.5334C3.33301 11.2802 3.33301 11.6533 3.47833 11.9385C3.60616 12.1894 3.80999 12.3936 4.06087 12.5214C4.34581 12.6666 4.719 12.6666 5.46428 12.6666H10.5351C11.2803 12.6666 11.653 12.6666 11.9379 12.5214C12.1888 12.3936 12.3933 12.1892 12.5212 11.9384C12.6663 11.6534 12.6663 11.2806 12.6663 10.5354V9.33329M13.333 5.99996V2.66663M13.333 2.66663H9.99967M13.333 2.66663L8.66634 7.33329"
                              stroke="#696969"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </a>
                      </h6>
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        </div> ) : (
            <div className="custom-set-style">
              <img
                src="\assets\tableimg-ifnot.svg"
                alt="img"
                className="img-fluid"
              />
              <h6>Your sending history is empty</h6>
            </div>
          )}
        {/* //   ) : (
        //   <div className="custom-set-style">
        //     <img src="\assets\tableimg-ifnot.svg" alt="img" className="img-fluid" />
        //     <h6>Your encrypting history is empty</h6>
        //   </div>
        // )} */}
        {/* mobileview */}
      </section>
    </>
  );
};

export default Sendinghistory;
