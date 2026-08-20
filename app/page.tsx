import { getCityWeather } from "./lib/weather";
import WeatherApp from "./weather-app";

export default async function Home() {
  const weather = await getCityWeather("Berlin");

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <WeatherApp initial={weather} />
    </div>
  );
}
