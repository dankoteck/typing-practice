export default function UIHeader() {
  return (
    <header className="bg-gray-900 text-white">
      <div className="container flex items-center justify-between py-2">
        <a href="/">
          <h1 className="text-3xl font-bold">Typing Practice</h1>
        </a>

        <nav className="">
          <ul className="flex items-center gap-4 text-white">
            {/* <li>
              <a href="/practice" className="text-lg">
                Practice
              </a>
            </li> */}
            <li>
              <a href="/leaderboard" className="text-lg">
                Leaderboard
              </a>
            </li>
            <li>
              <a
                href="/login"
                className="relative inline-flex h-10 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full min-w-24 cursor-pointer items-center justify-center rounded-full bg-slate-950 px-2 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  Log In
                </span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
