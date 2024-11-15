import React from "react";
import SearchBarInput from "./SearchBarInput";

export default function SearchSideBar() {
  return (
    <div className="p-6 bg-primary">
      <p className="text-2xl font-semibold">Search</p>
      <SearchBarInput mt={"40px"} />
      <p className="pt-[46px] text-base font-semibold">Recent</p>
    </div>
  );
}
