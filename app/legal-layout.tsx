import Link from "next/link";
import type { ReactNode } from "react";

export default function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen justify-center overflow-hidden bg-[#050505] px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[220px] -left-[180px] h-[640px] w-[640px] rounded-full bg-[#7C6CF0] opacity-[.13] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[200px] -bottom-[260px] h-[680px] w-[680px] rounded-full bg-[#2DD4BF] opacity-[.08] blur-[150px]"
      />

      <div className="relative w-full max-w-[640px]">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 font-mono text-[.62rem] font-medium tracking-[.22em] text-[#62626E] uppercase transition-colors hover:text-[#9C9CA6]"
        >
          ← Zurück
        </Link>

        <div className="rounded-[1.9rem] border border-white/10 bg-[#0C0C0E] px-6 py-8 shadow-[inset_0_1px_1px_rgba(255,255,255,.06)] sm:px-10 sm:py-10">
          <h1 className="font-display text-[2rem] font-semibold tracking-[-.025em] text-[#F2F2F0]">
            {title}
          </h1>
          <div className="mt-8 flex flex-col gap-7 text-[.95rem] leading-[1.7] text-[#B4B4BC]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="font-mono text-[.62rem] font-medium tracking-[.22em] text-[#62626E] uppercase">
        {heading}
      </h2>
      {children}
    </section>
  );
}
