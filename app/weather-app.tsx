"use client";

import Link from "next/link";
import { useState } from "react";
import type { CityWeather } from "./lib/weather";

function coordLabel(latitude: number, longitude: number) {
  const lat = `${Math.abs(latitude).toFixed(2)}° ${latitude >= 0 ? "N" : "S"}`;
  const lon = `${Math.abs(longitude).toFixed(2)}° ${longitude >= 0 ? "E" : "W"}`;
  return `${lat}, ${lon}`;
}

export default function WeatherApp({ initial }: { initial: CityWeather }) {
  const [weather, setWeather] = useState(initial);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Stadt konnte nicht geladen werden.");
      }

      setWeather(data);
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  const updated = new Date(weather.current.updatedAt).toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const metrics = [
    { label: "Gefühlt", value: `${Math.round(weather.current.feelsLike)}°`, unit: "Celsius" },
    { label: "Luftfeuchte", value: String(weather.current.humidity), unit: "% relativ" },
    { label: "Wind", value: String(weather.current.windSpeed), unit: "km/h" },
  ];

  const lo = Math.min(...weather.daily.map((d) => d.tempMin));
  const hi = Math.max(...weather.daily.map((d) => d.tempMax));
  const range = hi - lo || 1;

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center gap-5 overflow-hidden bg-[#050505] px-5 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[220px] -left-[180px] h-[640px] w-[640px] rounded-full bg-[#7C6CF0] opacity-[.13] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[200px] -bottom-[260px] h-[680px] w-[680px] rounded-full bg-[#2DD4BF] opacity-[.08] blur-[150px]"
      />

      <div className="relative w-full max-w-[412px] rounded-[2.25rem] border border-white/10 bg-white/[.04] p-1.5">
        <div className="flex flex-col gap-6 overflow-hidden rounded-[1.9rem] bg-[#0C0C0E] px-5 py-6 shadow-[inset_0_1px_1px_rgba(255,255,255,.06)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-[7px] w-[7px] animate-[noir-pulse_2.4s_ease-in-out_infinite] rounded-full bg-[#5EEAD4]" />
              <span className="font-mono text-[.62rem] font-medium tracking-[.22em] text-[#9C9CA6] uppercase">
                Live · Stand {updated} Uhr
              </span>
            </div>
            <span className="font-display text-[.95rem] font-semibold tracking-[-.02em] text-[#62626E]">
              wttr
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2.5 rounded-full border border-white/10 bg-white/[.03] px-4 py-2.5 focus-within:border-white/20">
              <span className="text-[.9rem] text-[#62626E]">⌕</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Stadt suchen…"
                className="min-w-0 flex-1 bg-transparent text-[.95rem] text-[#F2F2F0] outline-none placeholder:text-[#62626E]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-label="Suchen"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-white/[.16] bg-white/5 text-[1rem] text-[#F2F2F0] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/[.34] active:scale-95 disabled:opacity-50"
            >
              {loading ? "…" : "→"}
            </button>
          </form>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-col gap-[.15rem]">
            <h1 className="font-display text-[2.35rem] leading-[1.02] font-semibold tracking-[-.025em] text-[#F2F2F0]">
              {weather.city}
            </h1>
            <p className="font-mono text-[.62rem] font-medium tracking-[.22em] text-[#62626E] uppercase">
              {weather.country ? `${weather.country} · ` : ""}
              {coordLabel(weather.latitude, weather.longitude)}
            </p>
          </div>

          <div className="flex items-start justify-between gap-4 py-1">
            <div className="flex items-start">
              <span className="bg-gradient-to-r from-[#8B7CF6] to-[#5EEAD4] bg-clip-text font-display text-[6.6rem] leading-[.86] font-medium tracking-[-.045em] text-transparent">
                {Math.round(weather.current.temperature)}
              </span>
              <span className="mt-2 font-display text-[1.6rem] leading-none font-medium tracking-[-.02em] text-[#62626E]">
                °C
              </span>
            </div>
            <div
              aria-hidden
              className="mt-4 animate-[noir-drift_7s_ease-in-out_infinite] text-6xl"
            >
              {weather.current.icon}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-[.7rem]">
            <p className="font-display text-[1.35rem] font-medium tracking-[-.02em] text-[#F2F2F0]">
              {weather.current.label}
            </p>
            <p className="text-[.95rem] text-[#9C9CA6]">
              Gefühlt wie {Math.round(weather.current.feelsLike)}°C
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col gap-[.55rem] rounded-[1.25rem] border border-white/10 bg-white/[.035] px-[.8rem] py-[.9rem] shadow-[inset_0_1px_1px_rgba(255,255,255,.06)]"
              >
                <span className="font-mono text-[.57rem] font-medium tracking-[.2em] text-[#62626E] uppercase">
                  {m.label}
                </span>
                <span className="font-display text-[1.25rem] font-medium tracking-[-.025em] text-[#F2F2F0]">
                  {m.value}
                </span>
                <span className="font-mono text-[.57rem] tracking-[.12em] text-[#8B7CF6]">
                  {m.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[.4rem]">
            <span className="font-mono text-[.62rem] font-medium tracking-[.22em] text-[#62626E] uppercase">
              Drei Tage
            </span>
            {weather.daily.map((day) => {
              const from = ((day.tempMin - lo) / range) * 100;
              const span = ((day.tempMax - day.tempMin) / range) * 100;
              return (
                <div
                  key={day.date}
                  className="grid grid-cols-[4.2rem_1fr_auto] items-center gap-[.9rem] border-b border-white/10 py-[.85rem]"
                >
                  <span className="font-display text-base font-medium tracking-[-.02em] text-[#F2F2F0]">
                    {day.weekday}
                  </span>
                  <div className="flex items-center gap-[.6rem]">
                    <span className="text-[1.15rem] leading-none">{day.icon}</span>
                    <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#8B7CF6] to-[#5EEAD4]"
                        style={{ left: `${from}%`, width: `${span}%` }}
                      />
                    </span>
                  </div>
                  <span className="font-mono text-[.78rem] tracking-[.08em] whitespace-nowrap">
                    <span className="text-[#F2F2F0]">{Math.round(day.tempMax)}°</span>
                    <span className="text-[#62626E]"> / {Math.round(day.tempMin)}°</span>
                  </span>
                </div>
              );
            })}
          </div>

          <p className="pt-[.2rem] text-center font-mono text-[.57rem] tracking-[.2em] text-[#62626E] uppercase">
            Quelle: OpenWeatherMap
          </p>
        </div>
      </div>

      <nav className="relative flex items-center gap-4 font-mono text-[.57rem] tracking-[.2em] text-[#62626E] uppercase">
        <Link href="/impressum" className="transition-colors hover:text-[#9C9CA6]">
          Impressum
        </Link>
        <span aria-hidden>·</span>
        <Link href="/datenschutz" className="transition-colors hover:text-[#9C9CA6]">
          Datenschutz
        </Link>
      </nav>
    </div>
  );
}
