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
    <div className="relative flex h-dvh w-full flex-col items-center justify-center gap-2 overflow-hidden bg-[#050505] px-4 py-2">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[220px] -left-[180px] h-[640px] w-[640px] rounded-full bg-[#7C6CF0] opacity-[.13] blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[200px] -bottom-[260px] h-[680px] w-[680px] rounded-full bg-[#2DD4BF] opacity-[.08] blur-[150px]"
      />

      <div className="relative w-full max-w-[400px] rounded-[1.75rem] border border-white/10 bg-white/[.04] p-1.5 sm:max-w-[412px] sm:rounded-[2.25rem]">
        <div className="flex flex-col gap-2 overflow-hidden rounded-[1.4rem] bg-[#0C0C0E] px-4 py-3 shadow-[inset_0_1px_1px_rgba(255,255,255,.06)] sm:gap-3 sm:rounded-[1.9rem] sm:px-5 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-[6px] w-[6px] animate-[noir-pulse_2.4s_ease-in-out_infinite] rounded-full bg-[#5EEAD4]" />
              <span className="font-mono text-[.58rem] font-medium tracking-[.2em] text-[#9C9CA6] uppercase">
                Live · Stand {updated} Uhr
              </span>
            </div>
            <span className="font-display text-[.9rem] font-semibold tracking-[-.02em] text-[#62626E]">
              wttr
            </span>
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <div className="flex flex-1 items-center gap-2.5 rounded-full border border-white/10 bg-white/[.03] px-3.5 py-1.5 focus-within:border-white/20 sm:py-2">
              <span className="text-[.85rem] text-[#62626E]">⌕</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Stadt suchen…"
                className="min-w-0 flex-1 bg-transparent text-[.88rem] text-[#F2F2F0] outline-none placeholder:text-[#62626E]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              aria-label="Suchen"
              className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-white/[.16] bg-white/5 text-[.9rem] text-[#F2F2F0] transition-[transform,border-color] duration-300 hover:-translate-y-0.5 hover:border-white/[.34] active:scale-95 disabled:opacity-50 sm:h-10 sm:w-10"
            >
              {loading ? "…" : "→"}
            </button>
          </form>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="flex flex-col gap-[.1rem]">
            <h1 className="font-display text-[1.5rem] leading-[1.05] font-semibold tracking-[-.025em] text-[#F2F2F0] sm:text-[1.9rem]">
              {weather.city}
            </h1>
            <p className="font-mono text-[.58rem] font-medium tracking-[.2em] text-[#62626E] uppercase">
              {weather.country ? `${weather.country} · ` : ""}
              {coordLabel(weather.latitude, weather.longitude)}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start">
              <span className="bg-gradient-to-r from-[#8B7CF6] to-[#5EEAD4] bg-clip-text font-display text-[3.4rem] leading-[.86] font-medium tracking-[-.04em] text-transparent sm:text-[4.6rem]">
                {Math.round(weather.current.temperature)}
              </span>
              <span className="mt-1 font-display text-[1rem] leading-none font-medium tracking-[-.02em] text-[#62626E] sm:text-[1.2rem]">
                °C
              </span>
            </div>
            <div
              aria-hidden
              className="animate-[noir-drift_7s_ease-in-out_infinite] text-4xl sm:text-5xl"
            >
              {weather.current.icon}
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-[.5rem]">
            <p className="font-display text-[1rem] font-medium tracking-[-.02em] text-[#F2F2F0] sm:text-[1.1rem]">
              {weather.current.label}
            </p>
            <p className="text-[.8rem] text-[#9C9CA6]">
              Gefühlt wie {Math.round(weather.current.feelsLike)}°C
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {metrics.map((m) => (
              <div
                key={m.label}
                className="flex flex-col gap-[.3rem] rounded-[.9rem] border border-white/10 bg-white/[.035] px-[.65rem] py-[.5rem] shadow-[inset_0_1px_1px_rgba(255,255,255,.06)] sm:rounded-[1.1rem] sm:py-[.65rem]"
              >
                <span className="font-mono text-[.52rem] font-medium tracking-[.18em] text-[#62626E] uppercase">
                  {m.label}
                </span>
                <span className="font-display text-[1rem] font-medium tracking-[-.025em] text-[#F2F2F0] sm:text-[1.1rem]">
                  {m.value}
                </span>
                <span className="font-mono text-[.5rem] tracking-[.1em] text-[#8B7CF6]">
                  {m.unit}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[.15rem]">
            <span className="font-mono text-[.58rem] font-medium tracking-[.2em] text-[#62626E] uppercase">
              Drei Tage
            </span>
            {weather.daily.map((day) => {
              const from = ((day.tempMin - lo) / range) * 100;
              const span = ((day.tempMax - day.tempMin) / range) * 100;
              return (
                <div
                  key={day.date}
                  className="grid grid-cols-[3.6rem_1fr_auto] items-center gap-[.7rem] border-b border-white/10 py-[.4rem] last:border-b-0"
                >
                  <span className="font-display text-[.85rem] font-medium tracking-[-.02em] text-[#F2F2F0]">
                    {day.weekday}
                  </span>
                  <div className="flex items-center gap-[.5rem]">
                    <span className="text-[.95rem] leading-none">{day.icon}</span>
                    <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                      <span
                        className="absolute inset-y-0 rounded-full bg-gradient-to-r from-[#8B7CF6] to-[#5EEAD4]"
                        style={{ left: `${from}%`, width: `${span}%` }}
                      />
                    </span>
                  </div>
                  <span className="font-mono text-[.7rem] tracking-[.06em] whitespace-nowrap">
                    <span className="text-[#F2F2F0]">{Math.round(day.tempMax)}°</span>
                    <span className="text-[#62626E]"> / {Math.round(day.tempMin)}°</span>
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center font-mono text-[.5rem] tracking-[.18em] text-[#62626E] uppercase">
            Quelle: OpenWeatherMap
          </p>
        </div>
      </div>

      <nav className="relative flex items-center gap-3 font-mono text-[.5rem] tracking-[.18em] text-[#62626E] uppercase">
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
