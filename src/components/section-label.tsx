export function SectionLabel({
  index,
  label,
}: {
  index: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <span className="label text-acid">{index}</span>
      <span className="h-px w-10 bg-line-strong" />
      <span className="label text-ash">{label}</span>
    </div>
  );
}
