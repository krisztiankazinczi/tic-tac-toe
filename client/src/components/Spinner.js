import React from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";

const Spinner = () => {
  return (
    <Loader
      type="Watch"
      color="#9500ae"
      height={100}
      width={100}
      timeout={60000}
    />
  );
}

export default Spinner