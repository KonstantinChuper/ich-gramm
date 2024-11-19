import React, { useRef, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  toggleSidebar: boolean;
  onClose: () => void;
}

export default function SideBar({ children, toggleSidebar, onClose }: Props) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (toggleSidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleSidebar, onClose]);

  return (
    <>
      {toggleSidebar && <div className="fixed inset-0 bg-black/65 z-30" onClick={onClose} />}
      <div
        ref={sidebarRef}
        className={`z-40 bg-primary w-[400px] h-full transition-all duration-300 fixed top-0 left-[245px] rounded-e-xl ${
          toggleSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {children}
      </div>
    </>
  );
}
