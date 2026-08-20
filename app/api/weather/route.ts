import { getCityWeather } from "@/app/lib/weather";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim() || "Berlin";

  try {
    const weather = await getCityWeather(city);
    return Response.json(weather);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unbekannter Fehler";
    return Response.json({ error: message }, { status: 404 });
  }
}
