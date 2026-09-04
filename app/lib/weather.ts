// OpenWeatherMap icon codes -> emoji
// https://openweathermap.org/weather-conditions
const ICON_CODES: Record<string, string> = {
  "01": "☀️",
  "02": "🌤️",
  "03": "⛅",
  "04": "☁️",
  "09": "🌧️",
  "10": "🌦️",
  "11": "⛈️",
  "13": "❄️",
  "50": "🌫️",
};

function iconToEmoji(icon: string) {
  return ICON_CODES[icon.slice(0, 2)] ?? "❓";
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Formats a UTC timestamp + a city's UTC offset into a naive local
// datetime string (no zone suffix), so the client can display it as-is
// regardless of the viewer's own timezone.
function toLocalNaiveIso(unixSeconds: number, tzOffsetSeconds: number) {
  const d = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}

function localDateKey(unixSeconds: number, tzOffsetSeconds: number) {
  const d = new Date((unixSeconds + tzOffsetSeconds) * 1000);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

function weekdayLabel(dateStr: string, index: number) {
  if (index === 0) return "Heute";
  if (index === 1) return "Morgen";
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date);
}

async function owmFetch(
  path: string,
  params: Record<string, string | number>,
  revalidate: number
) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENWEATHER_API_KEY ist nicht gesetzt.");
  }

  const url = new URL(`https://api.openweathermap.org${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }
  url.searchParams.set("appid", apiKey);

  const res = await fetch(url, { next: { revalidate }, signal: AbortSignal.timeout(10_000) });
  if (!res.ok) {
    throw new Error(`OpenWeatherMap request failed: ${res.status}`);
  }

  return res.json();
}

export type CurrentWeather = {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  label: string;
  icon: string;
  updatedAt: string;
};

export type DayForecast = {
  date: string;
  weekday: string;
  tempMax: number;
  tempMin: number;
  label: string;
  icon: string;
};

export type CityWeather = {
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  current: CurrentWeather;
  daily: DayForecast[];
};

export type GeocodeResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
};

const countryNames = new Intl.DisplayNames("de", { type: "region" });

export async function geocodeCity(query: string): Promise<GeocodeResult | null> {
  const results = await owmFetch("/geo/1.0/direct", { q: query, limit: 1 }, 3600);
  const result = results[0];
  if (!result) return null;

  return {
    name: result.local_names?.de ?? result.name,
    country: result.country ? countryNames.of(result.country) ?? result.country : "",
    latitude: result.lat,
    longitude: result.lon,
  };
}

type ForecastEntry = {
  dt: number;
  main: { temp_max: number; temp_min: number };
  weather: { description: string; icon: string }[];
};

function aggregateDaily(list: ForecastEntry[], tzOffsetSeconds: number): DayForecast[] {
  const groups = new Map<string, ForecastEntry[]>();
  for (const entry of list) {
    const key = localDateKey(entry.dt, tzOffsetSeconds);
    const group = groups.get(key);
    if (group) {
      group.push(entry);
    } else {
      groups.set(key, [entry]);
    }
  }

  return [...groups.entries()].slice(0, 3).map(([date, entries], i) => {
    const tempMax = Math.max(...entries.map((e) => e.main.temp_max));
    const tempMin = Math.min(...entries.map((e) => e.main.temp_min));

    // Use the entry closest to local noon as representative for icon/label.
    const noonEntry = entries.reduce((best, entry) => {
      const hour = (entry.dt + tzOffsetSeconds) / 3600 % 24;
      const bestHour = (best.dt + tzOffsetSeconds) / 3600 % 24;
      return Math.abs(hour - 12) < Math.abs(bestHour - 12) ? entry : best;
    });

    return {
      date,
      weekday: weekdayLabel(date, i),
      tempMax,
      tempMin,
      label: capitalize(noonEntry.weather[0].description),
      icon: iconToEmoji(noonEntry.weather[0].icon),
    };
  });
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<{ current: CurrentWeather; daily: DayForecast[] }> {
  const params = { lat: latitude, lon: longitude, units: "metric", lang: "de" };

  const [current, forecast] = await Promise.all([
    owmFetch("/data/2.5/weather", params, 300),
    owmFetch("/data/2.5/forecast", params, 1800),
  ]);

  const tzOffsetSeconds = current.timezone;

  return {
    current: {
      temperature: current.main.temp,
      feelsLike: current.main.feels_like,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6 * 10) / 10,
      label: capitalize(current.weather[0].description),
      icon: iconToEmoji(current.weather[0].icon),
      updatedAt: toLocalNaiveIso(current.dt, tzOffsetSeconds),
    },
    daily: aggregateDaily(forecast.list, tzOffsetSeconds),
  };
}

export async function getCityWeather(query: string): Promise<CityWeather> {
  const location = await geocodeCity(query);
  if (!location) {
    throw new Error(`Stadt "${query}" wurde nicht gefunden.`);
  }

  const { current, daily } = await getWeather(location.latitude, location.longitude);

  return {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    current,
    daily,
  };
}
