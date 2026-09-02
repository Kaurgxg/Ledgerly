export default function PageHead({ eyebrow, title }) {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  return (
    <div className="flex items-baseline justify-between flex-wrap gap-2.5 mb-6">
      <div>
        <div className="text-[10px] uppercase tracking-[.18em] text-brass font-bold mb-2">{eyebrow}</div>
        <h1 className="font-serif text-[30px] md:text-[38px] font-bold tracking-[-.055em] m-0">{title}</h1>
      </div>
      <div className="text-[11px] text-inksoft font-mono border border-line rounded-full px-3 py-1.5">{today}</div>
    </div>
  );
}
