import React from "react";

const Button = ({ children, className, ...props }) => {
  return (
    <a
      className={`block text-center shadow border rounded p-2 bg-white ${className}`}
      {...props}
    >
      {children || "Untitled"}
    </a>
  );
};

export default Button;
