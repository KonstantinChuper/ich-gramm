import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Container({ children, maxWidth = "900px" }: ContainerProps) {
  return (
    <div className="pl-[245px] w-full">
      <div
        className="mx-auto px-4"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
