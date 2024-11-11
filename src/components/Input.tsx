import React from "react";
import { FloatingLabel } from "flowbite-react";

type InputProps = {
  variant?: "outlined" | "floating";
  type?: string;
  placeholder?: string;
  value?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ type, placeholder, value, name, onChange }: InputProps) {
  return (
    <FloatingLabel
      variant="outlined"
      label={placeholder || ""}
      name={name}
      type={type || "text"}
      value={value}
      onChange={onChange}
      className="!bg-[#FAFAFA] 
    [&>label]:!bg-[#FAFAFA] focus:!border-primaryColor 
    [&_.peer-focus~label]:!bg-[#FAFAFA]
    [&_.peer~label]:!bg-[#FAFAFA]
    [&_.peer-focus:not(:placeholder-shown)~label]:!bg-[#FAFAFA]
    [&_.peer:not(:placeholder-shown)~label]:!bg-[#FAFAFA] [&>input:-webkit-autofill]:!bg-[#FAFAFA]
    [&>input:-webkit-autofill~label]:!bg-[#FAFAFA]
      [&>input:-webkit-autofill]:![transition-delay:9999s]
      [&>input:-webkit-autofill]:![transition-property:background-color]"
      style={{
        padding: "8px 14px",
        borderRadius: "3px",
      }}
    />
  );
}
