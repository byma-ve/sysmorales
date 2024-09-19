import React from "react";
// Importo useRouteError de react-router-dom
import { useRouteError } from "react-router-dom";

function error() {
  const error = useRouteError();
  console.log(error);

  return (
    <>
      <h4 className="titulo-error text-center text-[56px] font-bold">
        Ops !!!! Error {error.status}
      </h4>
      <p className="p-error text-center text-[28px] font-semibold">
        {error.statusText || error.data}
      </p>
    </>
  );
}

export default error;
