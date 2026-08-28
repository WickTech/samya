import { MARQUEE_WORDS } from "@/lib/site";

export function MarqueeStrip() {
  const run = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  return (
    <div className="overflow-hidden border-y border-plum-deep/20 bg-plum-deep py-3.5 text-cream">
      <div className="mask-fade-x flex w-max animate-marquee gap-12 whitespace-nowrap text-xs uppercase tracking-eyebrow">
        {run.map((word, i) => (
          <span key={i} className="flex items-center gap-12">
            {word}
            <span className="text-lilac" aria-hidden>
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
