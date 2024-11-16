import React from "react";
import SearchBarInput from "./SearchBarInput";

interface SearchSideBarProps {
  onClose: () => void;
}

export default function SearchSideBar({ onClose }: SearchSideBarProps) {
  return (
    <div className="p-6 bg-primary">
      <p className="text-2xl font-semibold">Search</p>
      <SearchBarInput mt={"40px"} onClose={onClose} />
    </div>
  );
}
