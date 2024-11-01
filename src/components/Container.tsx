import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({
  children,
  className = "bg-white",
}: ContainerProps) {
  return (
    <div className={`w-full px-[25px] md:px-[10vw] ${className}`}>
      <div className="container mx-auto max-w-[1362px]">{children}</div>
    </div>
  );
}
