import EventCatalog from "../components/EventCatalog.jsx";

export default function Events() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pt-10 pb-20 sm:px-10">
      <div className="text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-sky-300/80">
          Phantasm 2026
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-[0.2em] text-sky-50 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
          All Quests
        </h1>
        <p className="mt-3 max-w-lg mx-auto text-sm text-sky-200/70">
          Solo events are ₹150 each. Team events are ₹250 per registering
          student. Events in the same row run at the same time.
        </p>
      </div>
      <div className="mt-10">
        <EventCatalog />
      </div>
    </section>
  );
}
