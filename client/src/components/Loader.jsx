import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = ({ size = 50, color = "#3b82f6", loading = true }) => {
  return (
    <div className="flex justify-center items-center">
      <ClipLoader size={size} color={color} loading={loading} />
    </div>
  );
};

export default Loader;
