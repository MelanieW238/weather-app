import { getCityWeather } from "./lib/weather";
import WeatherApp from "./weather-app";

export const dynamic = "force-dynamic";

export default async function Home() {
  const weather = await getCityWeather("Berlin");

  return <WeatherApp initial={weather} />;
}
