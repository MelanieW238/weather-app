# Weather app

A weather app with city search, current conditions and a 3-day forecast, using live data from OpenWeatherMap.

**Status:** completed bootcamp exercise. Live at [weather-qc1jyc2v4-bootcamp16.vercel.app](https://weather-qc1jyc2v4-bootcamp16.vercel.app/). The UI is in German.

## What I wanted to learn

I wanted to go beyond no-code tools and understand how a real project is set up from scratch: how to call an external API, how to keep an API key secret and how to put something live.

## What I built

- Weather for Berlin on start, any other city through the search
- Current conditions and a 3-day forecast, shown in the city's local time
- A dark "Noir" design
- Imprint and privacy pages for the public deployment
- The API key stays on the server: the browser calls the app's own API route (`app/api/weather`), which then calls OpenWeatherMap

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, OpenWeatherMap API, Vercel.

## What I learned

<!-- TODO: Melanie, please review. Taken from your portfolio text. -->

- Setting up a new project is a skill of its own.
- How environment variables work, and why an API key never belongs in client code.
- How to read API documentation to shape the requests.
- Deploying to Vercel made the result feel real. It also showed that a build can work locally and still hang on Vercel (fixed by pinning the Node version and changing how a page is prerendered).

## Running it locally

```bash
npm install
echo "OPENWEATHER_API_KEY=your-key" > .env.local   # free key from openweathermap.org
npm run dev                                        # http://localhost:3000
```

## How it was built

Built with Claude Code during a 10-week vibe coding bootcamp.

## Contact

Melanie Weber · [Portfolio](https://melaniew238githubio.vercel.app) · [LinkedIn](https://linkedin.com/in/melanie-weber-7b7620181)
