interface WordCounterProps {
  currentLength: number;
  maxLength: number;
  className?: string;
}

export default function WordCounter({
  currentLength,
  maxLength,
  className = "",
}: WordCounterProps) {
  return (
    <p className={`text-sm text-gray-500 absolute bottom-3 right-4 ${className}`}>
      {currentLength}/{maxLength}
    </p>
  );
}
