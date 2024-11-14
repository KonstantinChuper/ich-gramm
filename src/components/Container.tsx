import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return (
    <div className={`ml-[245px] 2xl:mr-[245px] flex justify-center ${className}`}>
      <div className={`px-4`}>
        {children}
      </div>
    </div>
  );
}
