import React from "react";

const Button = ({ children, className, disabled, onClick, ...props }) => {
  return (
    <a
      onClick={e => {
        if (!disabled && onClick) onClick(e);
      }}
      className={`block text-center shadow border rounded p-2 bg-white ${className}`}
      {...props}
    >
      {children || "Untitled"}
    </a>
  );
};

export default Button;
