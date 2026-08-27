import { useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import VisualEffects from "./components/VisualEffects.jsx";
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Shell() {
  return (
    <div className="min-h-screen">
      <VisualEffects />
      <header className="relative z-10 flex items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/images/logo.webp"
            alt="Phantasm crest"
            width={36}
            height={36}
            className="h-9 w-9 object-contain mix-blend-screen"
          />
          <span>
            <span className="block font-serif text-lg tracking-[0.32em] text-sky-100">
              PHANTASM
            </span>
            <span className="block text-[10px] tracking-[0.4em] text-sky-400/70">
              THE FEST
            </span>
          </span>
        </Link>
        
      </header>

      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="relative z-10 border-t border-sky-400/10 py-6 text-center text-[10px] uppercase tracking-[0.3em] text-sky-400/40">
        Phantasm 2026 · 
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <main className="relative min-h-screen bg-[#02040a] text-sky-50">
      <ScrollToTop />
      <Shell />
    </main>
  );
}
