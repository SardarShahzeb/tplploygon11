import React from 'react'
import Navbar from '../../components/primaryNavbar'

const Verifyphrases = () => {
    return (
        <>
            <Navbar />
            <section className="secret-recovery">
                <div className="custom-container">
                    <div className="secret-recover-div">
                        <div className="upper-heading ">
                            {/* <img src="\assets\import-assets\arrow-left.svg" alt="img" className='img-fluid' /> */}
                            <h6>Verify your Secret Phrase</h6>
                        </div>
                        <div className="bottom-content">
                            <p className="para">
                                Select the words in the correct order to ensure you have kept the correct phrase.
                            </p>
                            <div className="phrase-content">
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                                <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>  <button className="single-phrase" >
                                    <span>1.</span>
                                    <p>first</p>
                                </button>
                            </div>
                            <div className="twice-btn">
                                <button className='btn-verify done-btn w-100'>Ok, i’m Done</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Verifyphrases
