import React from "react";

const Input = ({ className, ...props }) => (
  <input className={`p-2 border border-solid ${className}`} {...props} />
);

export default Input;
