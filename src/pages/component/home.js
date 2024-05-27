import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import Navbar from '../../components/primaryNavbar';
import Loader from '../../hooks/loader';
import Footer from './footer';
import VideoComponent from './videocomponent';

const Home = () => {
    const [showdisclaimer1, setShowdisclaimer1] = useState(false);
    const [loader, setLoader] = useState(false);
    const handleClosedisclaimer1 = () => setShowdisclaimer1(false);
    const handleShowdisclaimer1 = () => setShowdisclaimer1(true);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [videoEnded, setVideoEnded] = useState(false);
    const [showSplit, setShowSplit] = useState(false);
    const [isNewUser, setIsNewUser] = useState(false);
    const [text, setText] = useState(false);

    useEffect(() => {
        const hasSeenVideo = localStorage.getItem('hasSeenVideo');
        if (!hasSeenVideo) {
            setIsNewUser(true);
        } else {
            setShowSplit(true);
        }
    }, []);


    useEffect(() => {
        if (showSplit) {
            const timer = setTimeout(() => {
                setText(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showSplit]);

    const handleVideoEnd = () => {
        setVideoEnded(true);
        localStorage.setItem('hasSeenVideo', 'true');
        setShowSplit(true);
    };




    return (
        <>
            {!videoEnded && isNewUser &&
                <VideoComponent
                    videoSrc="https://res.cloudinary.com/drt6vurtt/video/upload/v1716312564/dop/intro_dop_3_lybokf.mp4"
                    onVideoEnd={handleVideoEnd}
                    className="video-onstart"
                />
            }
            {showSplit && isNewUser &&
                <>
                    {
                        text ? "" : <div className="split-screen">
                            <div className="split top"></div>
                            <div className="split bottom"></div>
                        </div>
                    }
                </>
            }

            {
                showSplit && <>
                 {loader && <Loader />}
            <Navbar />
            <section className="main-home">
                <div className="custom-container">
                    <div className="bannerheadings">
                        <h4 className="bannerhead">DOP Web Wallet</h4>
                        <p className="bannerpara">DOP's wallet currently works only on Ethereum. Click Connect Wallet at the top right of the screen and make sure to switch to the Ethereum network.</p>
                    </div>
                    <div className="bannerwallet">
                        <div className="mainwallet">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                <path d="M25 46.875C37.0812 46.875 46.875 37.0812 46.875 25C46.875 12.9188 37.0812 3.125 25 3.125C12.9188 3.125 3.125 12.9188 3.125 25C3.125 37.0812 12.9188 46.875 25 46.875Z" fill="white" fill-opacity="0.02" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.0811 25.0189L35.9154 24.9846L14.0811 25.0189ZM24.981 14.0845L25.0153 35.9188L24.981 14.0845Z" fill="white" />
                                <path d="M14.0811 25.0189L35.9154 24.9846M24.981 14.0845L25.0153 35.9188" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h5 className="mainhead">I&apos;m new here!</h5>
                            <p className="mainpara">A new DOP wallet and a Secret Recovery Phrase will be created for you.</p>
                            <Link onClick={() => setLoader(true)} href="/createwallet" className="w-100">
                                <button className="common-btnone">Create Wallet</button>
                            </Link>
                        </div>
                        <div className="mainwallet">
                            <svg xmlns="http://www.w3.org/2000/svg" width="51" height="50" viewBox="0 0 51 50" fill="none">
                                <path d="M25.6006 46.9758C37.6818 46.9758 47.4756 37.182 47.4756 25.1008C47.4756 13.0196 37.6818 3.22581 25.6006 3.22581C13.5194 3.22581 3.72559 13.0196 3.72559 25.1008C3.72559 37.182 13.5194 46.9758 25.6006 46.9758Z" fill="white" fill-opacity="0.02" />
                                <path d="M15.8223 33.871L34.3707 15.3226" stroke="white" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15.8223 19.9597V33.871H29.7336" stroke="white" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <h5 className="mainhead">Already have one?</h5>
                            <p className="mainpara">Import your existing DOP wallet using the Secret Recovery Phrase.</p>
                            <Link onClick={() => setLoader(true)} href="/importwallet" className="w-100">
                                <button className="secondary-btnone">Import Wallet</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
                
                </>
            }

           

            <Modal className="modal-showstart newdesclaimermodal" show={showdisclaimer1} onHide={handleClosedisclaimer1} centered backdrop="static"
                keyboard={false}>
                <Modal.Header>
                    <Modal.Title>
                        DOP Testnet Terms & Conditions</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="w-100" >
                        <div className="mainmodalstartpara forscroll">
                            <h6 className="termshead">Terms & Conditions</h6>
                            <p className="mainmodalinnerpara">
                                THE CORE TEAM, INCLUSIVE OF ITS AFFILIATES AND REPRESENTATIVES, HEREBY PROVIDES NOTICE THAT ANY FUNDS, CONSIDERATIONS, CONTRIBUTIONS, INCOME, PAYMENT, OR OTHER FINANCIAL BENEFITS DERIVED FROM THE SALE OF DOP TOKENS, WHETHER FROM A PRIVATE SALE, PUBLIC SALE, OR ANY OTHER MEANS (&quot;RECEIVED FUNDS&quot;), MAY BE UTILIZED AT THE ABSOLUTE DISCRETION OF THE CORE TEAM WITHOUT ANY RESTRICTION
                            </p>
                            <p className="mainmodalinnerpara">
                                FOR CLARITY, THIS INCLUDES, BUT IS NOT LIMITED TO, THE USE OF RECEIVED FUNDS FOR NONBUSINESS-RELATED ENDEAVORS. NO REPRESENTATION, WARRANTY, OR ASSURANCE IS MADE BY THE CORE TEAM REGARDING THE SPECIFIC ALLOCATION OR UTILIZATION OF THE RECEIVED FUNDS FOR ANY PARTICULAR PURPOSE, INCLUDING ANY BUSINESS-RELATED OBJECTIVES. ANY PARTY PURCHASING DOP TOKENS ACKNOWLEDGES AND AGREES THAT THE CORE TEAM RESERVES FULL DISCRETION OVER THE USAGE OF THE RECEIVED FUNDS. SUCH PURCHASERS EXPRESSLY WAIVE AND RELINQUISH ANY RIGHT TO RAISE CLAIMS AGAINST THE CORE TEAM, ITS REPRESENTATIVES, SHAREHOLDERS, DIRECTORS, EMPLOYEES, SERVICE PROVIDERS, AFFILIATES, AND ANY RELATED PARTIES CONCERNING THE ALLOCATION OR UTILIZATION OF THE RECEIVED FUNDS.
                            </p>
                        </div>
                        <div className="material-textfield" style={{ margin: '30px 0px' }}>
                            <input placeholder="Enter your email address"
                                type="text"
                            />
                            <label>Enter your email address</label>
                        </div>
                        <div className="checkboxmain">
                            <div className="content">
                                <label className="checkBox">
                                    <input type="checkbox" id="ch1" />
                                    <div className="transition"></div>
                                </label>
                            </div>
                            <p className="checkboxpara">I have read and understood the terms and conditions.</p>
                        </div>
                        <button type="submit" className='continuebutton'>
                            continue
                        </button>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Home
