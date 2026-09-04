import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "../legal-layout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung – Wetter Berlin",
};

export default function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklärung">
      <p className="text-[.85rem] text-[#62626E] italic">
        Diese Erklärung wurde mit KI-Unterstützung erstellt und ersetzt keine
        Rechtsberatung. Bei kommerzieller Nutzung oder Zweifelsfällen sollte sie von
        einer fachkundigen Person geprüft werden.
      </p>

      <LegalSection heading="1. Verantwortlicher">
        <p>
          Melanie Weber
          <br />
          Schnetzenhauser Str. 39
          <br />
          88048 Friedrichshafen
          <br />
          E-Mail:{" "}
          <a
            href="mailto:weber.melanie.fn@gmail.com"
            className="text-[#5EEAD4] hover:underline"
          >
            weber.melanie.fn@gmail.com
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="2. Allgemeines zur Datenverarbeitung">
        <p>
          Diese Website verarbeitet personenbezogene Daten ausschließlich im Umfang,
          der zum Betrieb der Seite und zur Bereitstellung der Wetteranzeige
          erforderlich ist. Es findet keine Analyse Ihres Nutzungsverhaltens, kein
          Tracking und keine Werbung statt. Es werden keine Cookies gesetzt.
        </p>
      </LegalSection>

      <LegalSection heading="3. Hosting und Server-Logfiles">
        <p>
          Diese Website wird bei Vercel Inc. (USA) gehostet. Beim Aufruf der Seite
          verarbeitet Vercel als Auftragsverarbeiter automatisch technische Daten in
          sogenannten Server-Logfiles, insbesondere: IP-Adresse, Datum und Uhrzeit der
          Anfrage, aufgerufene Seite, Browsertyp und Betriebssystem.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an
          einem stabilen und sicheren Betrieb der Website). Da Vercel Daten auch in
          den USA verarbeiten kann, erfolgt die Übermittlung auf Grundlage von
          EU-Standardvertragsklauseln. Die Speicherdauer richtet sich nach den
          Angaben von Vercel.
        </p>
      </LegalSection>

      <LegalSection heading="4. Wetterabfrage über OpenWeatherMap">
        <p>
          Wenn Sie eine Stadt suchen, wird Ihre Eingabe von unserem Server an die
          Schnittstelle von OpenWeather Ltd. (&bdquo;OpenWeatherMap&ldquo;)
          übermittelt, um die Wetterdaten abzurufen. Ihre Sucheingabe verlässt dabei
          nicht direkt Ihren Browser – die Anfrage an OpenWeatherMap erfolgt
          serverseitig, sodass Ihre IP-Adresse nicht an OpenWeatherMap übertragen
          wird.
        </p>
        <p>
          Wir speichern Ihre Sucheingaben nicht dauerhaft. Rechtsgrundlage ist Art. 6
          Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung der von
          Ihnen angefragten Funktion). Weitere Informationen:{" "}
          <a
            href="https://openweather.co.uk/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#5EEAD4] hover:underline"
          >
            Datenschutzerklärung von OpenWeatherMap
          </a>
          .
        </p>
      </LegalSection>

      <LegalSection heading="5. Cookies">
        <p>
          Diese Website setzt selbst keine Cookies und verwendet keine
          Analyse-Tools. Sollte sich dies zukünftig ändern, werden wir vorab Ihre
          Einwilligung einholen, soweit gesetzlich erforderlich.
        </p>
      </LegalSection>

      <LegalSection heading="6. Google Fonts">
        <p>
          Diese Website nutzt die Schriftarten &bdquo;Geist&ldquo; und &bdquo;Space
          Grotesk&ldquo; von Google Fonts. Die Schriftdateien werden beim Bauen der
          Website eingebunden und lokal auf unserem eigenen Server ausgeliefert. Es
          findet keine Verbindung zu Servern von Google statt und es werden keine
          Daten an Google übermittelt.
        </p>
      </LegalSection>

      <LegalSection heading="7. Ihre Rechte">
        <p>
          Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16
          DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18
          DSGVO), Datenübertragbarkeit (Art. 20 DSGVO) sowie Widerspruch gegen die
          Verarbeitung (Art. 21 DSGVO) bezüglich der Sie betreffenden
          personenbezogenen Daten. Wenden Sie sich hierzu an die oben genannte
          Kontakt-E-Mail-Adresse.
        </p>
      </LegalSection>

      <LegalSection heading="8. Beschwerderecht">
        <p>
          Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde über die
          Verarbeitung Ihrer personenbezogenen Daten durch uns zu beschweren, z. B.
          beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit
          Baden-Württemberg.
        </p>
      </LegalSection>

      <LegalSection heading="9. Änderungen dieser Erklärung">
        <p>
          Wir passen diese Datenschutzerklärung an, sobald sich die Funktionen dieser
          Website ändern. Stand: September 2026.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
