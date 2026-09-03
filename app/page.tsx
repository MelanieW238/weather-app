import { getCityWeather } from "./lib/weather";
import WeatherApp from "./weather-app";

export default async function Home() {
  const weather = await getCityWeather("Berlin");

  return <WeatherApp initial={weather} />;
}
