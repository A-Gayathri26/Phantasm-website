import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function Hero() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });
      tl.fromTo(
        "[data-hero='eyebrow']",
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
      )
        .fromTo(
          "[data-hero='title']",
          { y: 44, opacity: 0, letterSpacing: "0.4em" },
          { y: 0, opacity: 1, letterSpacing: "0.15em", duration: 0.9 },
          "-=0.25",
        )
        .fromTo(
          "[data-hero='sub']",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 },
          "-=0.45",
        )
        .fromTo(
          "[data-hero='cta']",
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6 },
          "-=0.35",
        );

      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 44, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          },
        );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-4 pb-12 sm:px-10">
      <div
        ref={rootRef}
        className="relative overflow-hidden rounded-3xl border border-sky-400/20 shadow-[0_0_50px_rgba(56,189,248,0.14)]"
      >
        <div
            className="relative min-h-[400px] bg-cover bg-center bg-no-repeat brightness-110 contrast-110 saturate-125 sm:min-h-[520px]"
            style={{
              backgroundImage: "url('/images/backgroung.webp')",
  }}
>
          <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/55 via-[#02040a]/55 to-[#02040a]/90" />

          

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p
              data-hero="eyebrow"
              className="text-[10px] font-semibold uppercase tracking-[0.5em] text-sky-300/80 opacity-0"
            >
              National Fest · 2026
            </p>
            <h1
              data-hero="title"
              className="mt-4 font-serif text-[clamp(2.6rem,9vw,5.5rem)] tracking-[0.15em] text-sky-50 opacity-0 drop-shadow-[0_0_28px_rgba(56,189,248,0.5)]"
            >
              QUESTS
            </h1>
            <p
              data-hero="sub"
              className="mt-3 max-w-lg text-sm opacity-0 text-sky-200/85 sm:text-base"
            >
              Step through the archway. Claim your quests. Etch your name into
              the ledger of Phantasm.
            </p>
            <a
              data-hero="cta"
              href="#register"
              className="mt-8 rounded-full border border-sky-400/50 bg-sky-500/10 px-8 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-sky-100 opacity-0 shadow-[0_0_24px_rgba(56,189,248,0.25)] backdrop-blur transition hover:bg-sky-500/25"
            >
              Enter the Gate
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-7 flex max-w-3xl items-center justify-between px-2 text-[10px] uppercase tracking-[0.3em] text-sky-400/60">
        {["Gate", "Choose", "Details", "Team", "Seal"].map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <span
              className={`grid h-6 w-6 place-items-center rounded-full border ${
                i === 0
                  ? "border-sky-400/60 bg-sky-400/20 text-sky-200"
                  : "border-sky-400/20 text-sky-400/50"
              }`}
            >
              {i + 1}
            </span>
            <span className="hidden sm:inline">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
