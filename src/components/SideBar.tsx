import React from "react";

interface Props {
  children: React.ReactNode;
  toggleSidebar: boolean;
  onClose: () => void;
}

export default function SideBar({ children, toggleSidebar, onClose }: Props) {
  return (
    <>
      {toggleSidebar && <div className="fixed inset-0 bg-black/65 z-30" onClick={onClose} />}
      <div
        className={`fixed top-0 left-0 sm:left-16 md:left-[245px] z-40 bg-primary w-[400px] h-full transition-all duration-300 rounded-e-xl ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
