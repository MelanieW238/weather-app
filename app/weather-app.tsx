"use client";

import { useState } from "react";
import type { CityWeather } from "./lib/weather";

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

  return (
    <main className="flex w-full max-w-sm flex-col items-center gap-6 rounded-3xl bg-white px-10 py-12 text-center shadow-sm dark:bg-zinc-900">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Stadt suchen…"
          className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-black outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-black dark:text-zinc-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "…" : "Suchen"}
        </button>
      </form>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div>
        <h1 className="text-xl font-semibold text-black dark:text-zinc-50">
          {weather.city}
          {weather.country && (
            <span className="text-zinc-400 dark:text-zinc-500">, {weather.country}</span>
          )}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Stand: {updated} Uhr</p>
      </div>

      <div className="text-6xl">{weather.current.icon}</div>

      <div className="text-5xl font-semibold tabular-nums text-black dark:text-zinc-50">
        {Math.round(weather.current.temperature)}°C
      </div>
      <p className="text-zinc-600 dark:text-zinc-400">{weather.current.label}</p>

      <div className="grid w-full grid-cols-2 gap-4 rounded-2xl bg-zinc-50 p-4 text-sm dark:bg-black">
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">Gefühlt</p>
          <p className="font-medium text-black dark:text-zinc-50">
            {Math.round(weather.current.feelsLike)}°C
          </p>
        </div>
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">Luftfeuchtigkeit</p>
          <p className="font-medium text-black dark:text-zinc-50">
            {weather.current.humidity}%
          </p>
        </div>
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">Wind</p>
          <p className="font-medium text-black dark:text-zinc-50">
            {weather.current.windSpeed} km/h
          </p>
        </div>
        <div>
          <p className="text-zinc-500 dark:text-zinc-400">Quelle</p>
          <p className="font-medium text-black dark:text-zinc-50">Open-Meteo</p>
        </div>
      </div>

      <div className="grid w-full grid-cols-3 gap-2">
        {weather.daily.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center gap-1 rounded-2xl bg-zinc-50 p-3 dark:bg-black"
          >
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              {day.weekday}
            </p>
            <p className="text-2xl">{day.icon}</p>
            <p className="text-sm font-medium text-black dark:text-zinc-50">
              {Math.round(day.tempMax)}°
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {Math.round(day.tempMin)}°
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
