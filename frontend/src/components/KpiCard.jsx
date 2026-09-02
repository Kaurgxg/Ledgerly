import { useEffect, useState } from 'react';

function CountUp({ value }) {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const source = String(value);
    const match = source.match(/-?[\d,]+(?:\.\d+)?/);
    if (!match) return undefined;
    const target = Number(match[0].replace(/,/g, ''));
    const decimals = (match[0].split('.')[1] || '').length;
    let frame;
    let start;
    const animate = (now) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / 700, 1);
      const next = target * (1 - Math.pow(1 - progress, 3));
      setDisplay(source.replace(match[0], next.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return display;
}

export default function KpiCard({ label, value, delta, deltaTone = 'up' }) {
  return (
    <div className="premium-card reveal-up border p-5 md:p-6">
      <div className="text-[10px] uppercase tracking-[.16em] text-inksoft font-bold mb-3">{label}</div>
      <div className="font-mono text-[25px] md:text-[29px] font-semibold mono-nums tracking-[-.06em]"><CountUp value={value} /></div>
      {delta && (
        <div className={`text-xs mt-1.5 font-semibold ${deltaTone === 'up' ? 'text-sage' : 'text-rust'}`}>
          {delta}
        </div>
      )}
    </div>
  );
}
