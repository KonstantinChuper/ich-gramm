interface DividerProps {
  children: string;
}

export default function Divider({ children }: DividerProps) {
  return (
    <div className="flex gap-[18px] justify-center items-center pt-[22px] w-full">
      <div className="bg-borderColor h-[1px] w-full"></div>
      <p className="text-textGrayColor font-semibold text-[13px] uppercase">{children}</p>
      <div className="bg-borderColor h-[1px] w-full"></div>
    </div>
  );
}
