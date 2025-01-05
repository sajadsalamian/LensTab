import { cva } from "class-variance-authority";
import React from "react";
import { twMerge } from "tailwind-merge";

const labelStyle = cva("", {
  variants: {
    variant: {
      primary: ["block text-sm font-medium leading-6 text-gray-900 text-white"],
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

function Label({
  label = "",
  variant = "primary",
  required = false,
  className = "",
}) {
  return (
    <label className={twMerge(labelStyle({ variant }), className)}>
      {required && <span className="text-red-800">*</span>} {label}
    </label>
  );
}

export default Label;
