import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "../legal-layout";

export const metadata: Metadata = {
  title: "Impressum – Wetter Berlin",
};

export default function ImpressumPage() {
  return (
    <LegalLayout title="Impressum">
      <LegalSection heading="Angaben gemäß § 5 TMG / § 5 DDG">
        <p>
          Melanie Weber
          <br />
          Schnetzenhauser Str. 39
          <br />
          88048 Friedrichshafen
          <br />
          Deutschland
        </p>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <p>
          E-Mail:{" "}
          <a
            href="mailto:weber.melanie.fn@gmail.com"
            className="text-[#5EEAD4] hover:underline"
          >
            weber.melanie.fn@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
        <p>Melanie Weber (Anschrift wie oben)</p>
      </LegalSection>

      <LegalSection heading="Hinweis">
        <p>
          Diese Website ist ein privates, nicht-kommerzielles Projekt zur Anzeige aktueller
          Wetterdaten. Die Wetterdaten werden über die Schnittstelle von{" "}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5EEAD4] hover:underline"
          >
            OpenWeatherMap
          </a>{" "}
          bezogen.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
