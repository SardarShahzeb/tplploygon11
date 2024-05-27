import React, { useState } from "react";

function Loader1({ text }) {

  return (
    <>
      <div className="">
        <div
          className="mainLoader newloaderforoffcsnvas"
          style={{
            zIndex: 1100000000000,
            // marginTop: -200,
            marginLeft: 0,
          }}
        >
          <div className="h-100 d-flex align-items-center justify-content-center">
            <div className="d-flex flex-wrap align-items-center justify-content-center">
              <img width={200} className="mt-n4 set-dark" src="\introdoploader_white.gif" alt="" />
              <img width={200} className="mt-n4 set-light d-none" src="\introdoploader_black.gif" alt="" />
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
export default Loader1;