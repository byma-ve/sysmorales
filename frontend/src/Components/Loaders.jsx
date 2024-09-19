import React from "react";

const Loaders = ({ isVisible }) => {
  if (!isVisible) return null;
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[99]">
        <div className="loader2">
          <div className="form1">
            <div className="square"></div>
            <div className="square"></div>
          </div>
          <div className="form2">
            <div className="square"></div>
            <div className="square"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loaders;
