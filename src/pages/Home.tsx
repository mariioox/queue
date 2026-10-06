import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock, Smartphone, Zap, Ticket } from "lucide-react";
import { buttonClasses } from "../components/ui";

const STEPS = [
  {
    num: "01",
    icon: Smartphone,
    title: "Find your shop",
    text: "Browse barbers, clinics, food spots and more near you.",
  },
  {
    num: "02",
    icon: Ticket,
    title: "Join in one tap",
    text: "Grab your spot in line from wherever you are. No paper tickets.",
  },
  {
    num: "03",
    icon: Clock,
    title: "Show up on time",
    text: "Watch your position move live and arrive right when it's your turn.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas text-ink">
      {/* --- HERO --- */}
      <section className="relative pt-16 pb-20 md:pt-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 border border-dashed border-accent text-accent px-3 py-1.5 rounded mb-7">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-accent" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] font-bold">
                Live queues, right now
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[0.95] mb-6">
              Stop waiting.
              <br />
              <span className="text-accent">Start living.</span>
            </h1>

            <p className="max-w-lg text-lg text-ink-muted font-medium mb-9 leading-relaxed">
              The digital queue for busy people. Join lines from your phone,
              track your spot in real time, and show up exactly when it's your
              turn.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/explore")}
                className={buttonClasses("primary", "lg")}
              >
                Find a shop <ArrowRight size={16} />
              </button>
              <button
                onClick={() => navigate("/login")}
                className={buttonClasses("outline", "lg")}
              >
                For business
              </button>
            </div>
          </div>

          {/* Decorative ticket stub */}
          <div className="relative hidden md:block">
            <div className="relative bg-card border-2 border-ink rounded-xl shadow-[8px_8px_0_0_var(--ink)] rotate-2 max-w-sm mx-auto">
              <div className="p-7">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                      Q-LINE Ticket
                    </p>
                    <p className="text-3xl font-extrabold tracking-tight mt-1">
                      Admit One
                    </p>
                  </div>
                  <span className="bg-highlight text-ink font-mono text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded rotate-3">
                    Live
                  </span>
                </div>
                <div className="flex justify-between font-mono text-sm text-ink-muted">
                  <span>POSITION</span>
                  <span className="text-ink font-bold">#04</span>
                </div>
                <div className="flex justify-between font-mono text-sm text-ink-muted mt-1">
                  <span>EST. WAIT</span>
                  <span className="text-ink font-bold">12 MIN</span>
                </div>
              </div>
              <div className="ticket-march h-[2px] mx-4" />
              <div className="p-5 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  Downtown Barber Co.
                </span>
                <span className="w-9 h-9 bg-accent text-on-accent rounded flex items-center justify-center">
                  <Zap size={16} fill="currentColor" />
                </span>
              </div>
            </div>

            {/* Stamp */}
            <div className="absolute -bottom-6 -left-4 w-28 h-28 border-2 border-accent rounded-full flex items-center justify-center -rotate-12">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] font-bold text-accent text-center leading-tight">
                No
                <br />
                waiting
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section className="py-20 px-6 bg-surface border-y-2 border-ink">
        <div className="max-w-6xl mx-auto">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent font-bold mb-3">
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-12">
            Three steps. Zero standing around.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map(({ num, icon: Icon, title, text }) => (
              <div
                key={num}
                className="bg-card p-8 rounded-xl border border-line hover:border-ink transition-colors group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-mono text-2xl font-bold text-ink-muted/50 group-hover:text-accent transition-colors">
                    {num}
                  </span>
                  <Icon size={22} className="text-accent" />
                </div>
                <h3 className="text-xl font-extrabold tracking-tight mb-2">
                  {title}
                </h3>
                <p className="text-ink-muted font-medium leading-relaxed text-sm">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- VALUE STRIP --- */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start justify-between gap-10">
          <div className="max-w-md">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
              Built for places where lines get long.
            </h2>
            <p className="text-ink-muted font-medium">
              Barbershops, clinics, laundromats, food joints — if people queue
              for it, Q-LINE runs it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "Real-time positions" },
              { icon: Smartphone, label: "One-tap joining" },
              { icon: Clock, label: "Accurate wait times" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 border border-line bg-card rounded-lg px-4 py-4"
              >
                <span className="text-accent">
                  <Icon size={18} />
                </span>
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] font-bold">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto bg-accent rounded-2xl p-10 md:p-16 text-center text-on-accent border-2 border-ink shadow-[8px_8px_0_0_var(--ink)] relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-6">
              Ready to skip the line?
            </h2>
            <button
              onClick={() => navigate("/explore")}
              className="bg-on-accent text-accent px-8 py-4 rounded-lg font-mono text-sm uppercase tracking-[0.16em] font-bold border-2 border-ink shadow-[4px_4px_0_0_var(--ink)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)] transition-all"
            >
              Get started now
            </button>
          </div>
          {/* Ticket punch holes */}
          <span className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-canvas" />
          <span className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-canvas" />
        </div>
      </section>
    </div>
  );
};

export default Home;
