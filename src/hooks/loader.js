import React, { useState } from "react";

function Loader({ text }) {

  return (
    <>
      <div className="">
        <div
          className="position-fixed w-100 mainLoader"
          style={{
            zIndex: 1100000000000,
            // marginTop: -200,
            height: '100%',
            marginLeft: 0,
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(20px)",
            top: '0px',
            left: '0px'
          }}
        >
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="d-flex flex-wrap align-items-center justify-content-center">
              <img width={200} className="mt-n4 dark" src="\introdoploader_white.gif" alt="" />
              {/* <img width={200} className="mt-n4 white" src="\LightThemeLoader.svg" alt="" /> */}
              <h2
                className="fortextstyle w-100 text-center mt-4"
              >
                {text}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Loader;