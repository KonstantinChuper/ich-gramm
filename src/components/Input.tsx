import React from "react";

type InputProps = {
  type?: string;
  placeholder?: string;
  value?: string;
  name: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Input({ type, placeholder, value, name, onChange }: InputProps) {
  return (
    <input
      name={name}
      type={type || "text"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-borderColor text-textGrayColor px-[8px] py-[6px] bg-[#FAFAFA] w-full rounded-[3px] shrink-0 focus:outline-none focus:ring-2 focus:ring-zinc-500"
    />
  );
}
