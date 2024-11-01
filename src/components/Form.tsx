import React, { ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit }: FormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="w-[350px] h-full shrink border border-borderColor px-[40px] pt-[30px] flex flex-col items-center justify-between rounded-[1px]"
    >
      {children}
    </form>
  );
}
