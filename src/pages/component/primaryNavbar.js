import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [theme, setTheme] = useState("light-theme");
  const { account } = useWeb3React();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      setTheme(savedTheme ? savedTheme : "light-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light-theme" ? "dark-theme" : "light-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.body.className = newTheme;
  };

  const [showwallet, setShowWallet] = useState(false);


  const connectMetamaskSignUp = async () => {
    if (account) {
      const connectorId = window.localStorage.getItem("connectorId");
      await logout(connectorId);
      localStorage.removeItem("connectorId");
      localStorage.removeItem("flag");
    } else {
      login("injected");
      localStorage.setItem("connectorId", "injected");
      localStorage.setItem("flag", "true");
    }
    handleClosewallet();
  };

  return (
    <>
      <section className="main-navbar">
        <div className="custom-container">
          <nav className="navbar navbar-expand-lg">
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
                  <g clipPath="url(#clip0_48_777)">
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
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">{/*  */}</ul>
                <div className="right-content">
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
                        }}
                        className="text-center"
                      >
                        Connect Wallet
                      </a>
                    )}
                  </div>
                  <div className="languade-dropdown">
                    <div className="dropdown">
                      <button
                        className="dropdown-toggle"
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
                      <ul className="dropdown-menu">
                        <li>
                          <a className="dropdown-item" href="#">
                            ENG
                          </a>
                        </li>
                        {/* <li>
                          <a className="dropdown-item" href="#">
                            Japanese
                          </a>
                        </li>
                        <li>
                          <a className="dropdown-item" href="#">
                            Korean
                          </a>
                        </li> */}
                      </ul>
                    </div>
                  </div>
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
            <ul></ul>
          </div>
          <div className="twice-btns">
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
            <div className="languade-dropdown">
              <div className="dropdown">
                <button
                  className="dropdown-toggle"
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
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      ENG
                    </a>
                  </li>
                  {/* <li>
                    <a className="dropdown-item" href="#">
                      Japanese
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Korean
                    </a>
                  </li> */}
                </ul>
              </div>
            </div>
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
    </>
  );
};

export default Navbar;