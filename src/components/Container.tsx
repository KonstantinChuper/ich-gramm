interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

export default function Container({ children, className, maxWidth = "550px" }: ContainerProps) {
  return (
    <div className={`aside-margin 2xl:mr-[245px] flex justify-center ${className}`}>
      <div className={`px-4 flex-1`} style={{ maxWidth: maxWidth }}>
        {children}
      </div>
    </div>
  );
}
