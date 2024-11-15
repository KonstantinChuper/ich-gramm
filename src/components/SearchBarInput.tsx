import React, { useState } from "react";
import closeIcon from "@/assets/close-icon.svg";
import Image from "next/image";

export default function SearchBarInput({ mt }: { mt: string }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleClearClick = () => {
    setInputValue("");
  };

  return (
    <div className="w-full relative" style={{ marginTop: mt }}>
      <input
        type="text"
        placeholder="Search"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full bg-inputColor text-base font-light text-textGrayColor pl-4 pr-8 py-[10px] rounded-lg !border-0 !ring-0 !outline-none focus:!outline-none focus:!ring-2 focus:!ring-zinc-500 dark:!bg-inputColor"
      />
      {inputValue && (
        <button className="absolute right-3 top-[12px]" onClick={handleClearClick}>
          <Image src={closeIcon} alt="close icon" />
        </button>
      )}
    </div>
  );
}
