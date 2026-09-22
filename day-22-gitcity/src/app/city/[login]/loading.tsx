export default function CityLoading() {
  return (
    <main className="technical-grid relative min-h-screen overflow-hidden bg-[#0b0d10] text-[#e9e7e2]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(68,243,169,0.06),transparent_48%)]" />
      <header className="relative z-10 flex h-14 items-center justify-between border-b border-[#252a31] bg-[#111419]/90 px-5 md:px-10">
        <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[#918b82]">← BACK TO INDEX</div>
        <div className="font-[family-name:var(--font-display)] tracking-[0.18em]">GITCITY</div>
        <div className="font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[#44f3a9]">BUILDING</div>
      </header>
      <section className="relative mx-auto flex min-h-[calc(100vh-56px)] max-w-[1500px] flex-col justify-between p-5 md:p-8">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_290px]">
          <div className="grid grid-cols-2 border border-[#2a3038] bg-[#111419]/90 sm:grid-cols-5">
            {Array.from({ length: 5 }, (_, index) => <div key={index} className="h-20 animate-pulse border-r border-b border-[#2a3038] bg-[#151a20] last:border-r-0" />)}
          </div>
          <div className="h-48 animate-pulse border border-[#2a3038] bg-[#111419]/90" />
        </div>
        <div className="relative flex flex-1 items-center justify-center py-10">
          <div className="absolute h-[420px] w-[720px] rotate-[30deg] border border-[#1f252c] bg-[#0e1115]/30" />
          <div className="relative flex items-end gap-2 opacity-80">
            {[34, 72, 48, 112, 64, 92, 42, 132, 76, 56, 102].map((height, index) => <div key={index} className="w-8 animate-pulse bg-[#273038]" style={{ height }} />)}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-[#1d2229] pt-4 font-[family-name:var(--font-mono)] text-[9px] tracking-[0.16em] text-[#918b82]">
          <span className="text-[#44f3a9]">CALIBRATING CONTRIBUTION GRID</span>
          <span>FETCHING YEAR · PLACING LOTS · LIGHTING WINDOWS</span>
        </div>
      </section>
    </main>
  );
}
