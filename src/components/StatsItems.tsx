interface StatsItemProps {
  label: string;
  value: number;
}

export default function StatsItem({ label, value }: StatsItemProps): JSX.Element {
  return (
    <span className="flex gap-1">
      <strong>{value.toLocaleString()}</strong> {label}
    </span>
  );
}