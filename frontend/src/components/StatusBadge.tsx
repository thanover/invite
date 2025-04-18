export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  return (
    <span className="bg-[var(--color-blue)] rounded-3xl pl-6 pr-6 p-1 text-xs text-[var(--color-night)]">
      {status}
    </span>
  );
};
