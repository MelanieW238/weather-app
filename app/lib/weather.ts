// WMO weather codes -> human-readable label + emoji
// https://open-meteo.com/en/docs#weathervariables
const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Klarer Himmel", icon: "☀️" },
  1: { label: "Überwiegend klar", icon: "🌤️" },
  2: { label: "Teilweise bewölkt", icon: "⛅" },
  3: { label: "Bewölkt", icon: "☁️" },
  45: { label: "Nebel", icon: "🌫️" },
  48: { label: "Reifnebel", icon: "🌫️" },
  51: { label: "Leichter Nieselregen", icon: "🌦️" },
  53: { label: "Nieselregen", icon: "🌦️" },
  55: { label: "Starker Nieselregen", icon: "🌧️" },
  61: { label: "Leichter Regen", icon: "🌦️" },
  63: { label: "Regen", icon: "🌧️" },
  65: { label: "Starker Regen", icon: "🌧️" },
  71: { label: "Leichter Schneefall", icon: "🌨️" },
  73: { label: "Schneefall", icon: "🌨️" },
  75: { label: "Starker Schneefall", icon: "❄️" },
  80: { label: "Regenschauer", icon: "🌦️" },
  81: { label: "Regenschauer", icon: "🌧️" },
  82: { label: "Heftige Regenschauer", icon: "⛈️" },
  95: { label: "Gewitter", icon: "⛈️" },
  96: { label: "Gewitter mit Hagel", icon: "⛈️" },
  99: { label: "Gewitter mit starkem Hagel", icon: "⛈️" },
};

function describe(code: number) {
  return WEATHER_CODES[code] ?? { label: "Unbekannt", icon: "❓" };
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
  current: CurrentWeather;
  daily: DayForecast[];
};

export type GeocodeResult = {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

export async function geocodeCity(query: string): Promise<GeocodeResult | null> {
  const params = new URLSearchParams({
    name: query,
    count: "1",
    language: "de",
    format: "json",
  });

  const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`Geocoding request failed: ${res.status}`);
  }

  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return null;

  return {
    name: result.name,
    country: result.country ?? "",
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
  };
}

function weekdayLabel(dateStr: string, index: number) {
  if (index === 0) return "Heute";
  if (index === 1) return "Morgen";
  const date = new Date(`${dateStr}T00:00:00`);
  return new Intl.DateTimeFormat("de-DE", { weekday: "short" }).format(date);
}

export async function getWeather(
  latitude: number,
  longitude: number,
  timezone: string
): Promise<{ current: CurrentWeather; daily: DayForecast[] }> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    forecast_days: "3",
    timezone,
  });

  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`Open-Meteo request failed: ${res.status}`);
  }

  const data = await res.json();
  const current = data.current;
  const weather = describe(current.weather_code);

  const daily: DayForecast[] = data.daily.time.map((date: string, i: number) => {
    const dayWeather = describe(data.daily.weather_code[i]);
    return {
      date,
      weekday: weekdayLabel(date, i),
      tempMax: data.daily.temperature_2m_max[i],
      tempMin: data.daily.temperature_2m_min[i],
      label: dayWeather.label,
      icon: dayWeather.icon,
    };
  });

  return {
    current: {
      temperature: current.temperature_2m,
      feelsLike: current.apparent_temperature,
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      label: weather.label,
      icon: weather.icon,
      updatedAt: current.time,
    },
    daily,
  };
}

export async function getCityWeather(query: string): Promise<CityWeather> {
  const location = await geocodeCity(query);
  if (!location) {
    throw new Error(`Stadt "${query}" wurde nicht gefunden.`);
  }

  const { current, daily } = await getWeather(
    location.latitude,
    location.longitude,
    location.timezone
  );

  return {
    city: location.name,
    country: location.country,
    current,
    daily,
  };
}
