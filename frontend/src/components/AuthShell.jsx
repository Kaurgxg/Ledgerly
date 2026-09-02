export default function AuthShell({ portal, onPortalChange, children }) {
  const isAdmin = portal === 'admin';

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-paper overflow-hidden">
      {/* Left panel */}
      <div
        className="flex-[1.15] relative overflow-hidden text-white px-7 py-10 md:px-14 md:py-16 flex flex-col justify-between border-b border-white/10 lg:border-b-0 lg:border-r"
        style={{
          background:
            'linear-gradient(135deg, #0B0B0B 0%, #15100D 55%, #0B0B0B 100%)',
        }}
      >
        {/* Ambient glow */}
        <div className="ambient-glow absolute -top-32 -left-24 w-[470px] h-[470px] rounded-full bg-[#FF6A00]/[.15] blur-[105px] pointer-events-none" />

        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
          }}
        />

        {/* Growth graph */}
        <svg
          className="auth-visual absolute right-[-6%] bottom-[-4%] w-[78%] max-w-[560px] opacity-90 pointer-events-none hidden sm:block"
          viewBox="0 0 480 300"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            <linearGradient
              id="growthGradient"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor="#C79A3C" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#C79A3C" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            className="area-fill"
            d="M0,260 L40,235 L95,245 L150,190 L205,205 L260,140 L320,155 L380,90 L440,60 L480,40 L480,300 L0,300 Z"
          />

          <path
            className="growth-path"
            d="M0,260 L40,235 L95,245 L150,190 L205,205 L260,140 L320,155 L380,90 L440,60 L480,40"
          />

          <circle
            className="lead-dot"
            cx="480"
            cy="40"
            r="5"
            fill="#EADFC3"
          />

          <circle
            className="tick-dot"
            cx="150"
            cy="190"
            r="3.5"
            fill="#8FB89D"
          />

          <circle
            className="tick-dot"
            cx="260"
            cy="140"
            r="3.5"
            fill="#8FB89D"
          />

          <circle
            className="tick-dot"
            cx="380"
            cy="90"
            r="3.5"
            fill="#8FB89D"
          />

          <circle
            className="tick-dot"
            cx="440"
            cy="60"
            r="3.5"
            fill="#8FB89D"
          />
        </svg>

        {/* Logo */}
        <div className="flex items-center gap-3 font-serif text-[22px] font-bold z-10 tracking-[-.04em]">
          <span className="w-3 h-3 bg-brass rounded-sm rotate-45 inline-block shadow-[0_0_20px_#FF6A00]" />
          Ledgerly
        </div>

        {/* Hero content */}
        <div className="z-10 max-w-[560px] py-10 lg:py-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/10 px-3 py-1.5 text-[10px] uppercase tracking-[.18em] text-orange-200 font-bold mb-7">
            Your money, in focus
          </div>

          {isAdmin ? (
            <>
              {/* Admin heading */}
              <h1 className="font-serif text-[42px] md:text-[62px] font-bold tracking-[-.065em] leading-[.98] mb-8">
                Lead every
                <br />
                <span className="text-brass">financial</span> decision.
              </h1>

              <p className="text-[16px] leading-relaxed text-zinc-400 mb-9 max-w-[470px]">
                Manage user accounts, monitor engagement across the platform,
                respond to feedback and complaints, and export analytics
                reports.
              </p>
            </>
          ) : (
            <>
              {/* User heading */}
              <h1 className="font-serif text-[42px] md:text-[62px] font-bold tracking-[-.065em] leading-[.98] mb-8">
                Money clarity.
                <br />

                {/* Animated hero phrase */}
                <span className="text-brass relative inline-block min-w-[280px] h-[1.25em] whitespace-nowrap align-bottom overflow-visible">
                  <span className="hero-word">More control.</span>
                  <span className="hero-word">More freedom.</span>
                  <span className="hero-word">Better habits.</span>
                </span>
              </h1>

              {/* Description */}
              <p className="text-[16px] leading-relaxed text-zinc-400 mb-9 max-w-[470px]">
                Track income, expenses, savings goals and daily money habits in
                one simple ledger.
              </p>
            </>
          )}

          {/* CTA */}
          <a
            href="#auth-panel"
            className="inline-flex items-center gap-2 bg-brass hover:bg-[#FF7A1A] text-white font-bold text-[13px] px-5 py-3 rounded-xl shadow-[0_12px_35px_rgba(255,106,0,.25)] transition-transform hover:-translate-y-0.5"
          >
            Start with Ledgerly
            <span>→</span>
          </a>
        </div>

        {/* Footer tagline */}
        <div className="z-10 text-[10px] uppercase tracking-[.18em] text-zinc-600">
          Private · purposeful · built for progress
        </div>
      </div>

      {/* Right panel */}
      <div
        id="auth-panel"
        className="flex-[0.85] flex items-center justify-center p-6 md:p-10 bg-[#0B0B0B]"
      >
        <div className="w-full max-w-[390px] reveal-up">
          {/* Portal switcher */}
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => onPortalChange('user')}
              className={`flex-1 flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[12px] font-bold transition-colors
                ${
                  portal === 'user'
                    ? 'bg-brass border-brass text-white shadow-[0_8px_20px_rgba(255,106,0,.2)]'
                    : 'bg-[#151515] border-line text-inksoft hover:text-white'
                }`}
            >
              👤 User Portal
            </button>

            <button
              type="button"
              onClick={() => onPortalChange('admin')}
              className={`flex-1 flex items-center justify-center gap-1.5 border rounded-xl py-2.5 text-[12px] font-bold transition-colors
                ${
                  portal === 'admin'
                    ? 'bg-brass border-brass text-white shadow-[0_8px_20px_rgba(255,106,0,.2)]'
                    : 'bg-[#151515] border-line text-inksoft hover:text-white'
                }`}
            >
              ⚙ Admin Portal
            </button>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}