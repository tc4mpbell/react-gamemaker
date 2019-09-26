import React from "react";

const H5 = ({ className, ...props }) => (
  <h5 className={`text-sm font-bold uppercase ${className}`} {...props} />
);

export { H5 };
