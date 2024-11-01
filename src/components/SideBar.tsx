import React from "react";

interface Props {
  children: React.ReactNode;
  toggleSidebar: boolean;
}

export default function SideBar({ children, toggleSidebar }: Props) {
  return (
    <div
      className={`z-30 bg-white w-[400px] h-full transition-all duration-300 fixed top-0 left-[245px] rounded-e-xl ${
        toggleSidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {children}
    </div>
  );
}
