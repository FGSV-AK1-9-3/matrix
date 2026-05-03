# Antwort-Codes Mapping

Der an MS Forms übermittelte String hat folgendes Format:

```
n=<Personenzahl>, 1a, 2b, 3c, ..., E=<Ergebnis>
```

- **n=** Personenzahl (Zahl)
- **E=** Berechnetes Ergebnis (Dezimalzahl)

---

## Fragenkürzel

| Nr. | Frage (Select-ID)                          | Kürzel | Volltext (Antwort)                                                                                                                                                        |
| --- | ------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | veranstaltungsgelaende_flaechenverhaeltnis | 1a     | Die für Besuchenden zugängliche Fläche entspricht der erwarteten Besucherzahl bei einer Belegungsdichte von 2 Personen pro Quadratmeter; geordneter Personenfluss. (×1,0) |
|     |                                            | 1b     | Die zugängliche Fläche ist um mehr als 20 % größer als die bei 2 Pers./m² erforderliche Fläche; mehr Bewegungsfreiheit, weniger Verdichtung. (×0,9)                       |
| 2   | veranstaltungsgelaende_verkehrsstaerke     | 2a     | Die erwartete spezifische Personenverkehrsstärke (qs) beträgt ≤ 0,7 Pers./ms. Überwiegend störungsfrei. (×0,9)                                                            |
|     |                                            | 2b     | Die erwartete spezifische Personenverkehrsstärke (qs) beträgt ≤ 1,3 Pers./ms. Normale bis leicht erhöhte Auslastung. (×1,0)                                               |
|     |                                            | 2c     | Die erwartete spezifische Personenverkehrsstärke (qs) überschreitet 1,3 Pers./ms. Temporäre Verdichtungen möglich. (×1,1)                                                 |
| 3   | veranstaltungsgelaende_stoerungen          | 3a     | Störungen (z. B. gegenläufige Ströme, parallele Nutzungen) sind wahrscheinlich. (×1,2)                                                                                    |
|     |                                            | 3b     | Störungen auf den Flucht‑ und Rettungswegen sind unwahrscheinlich. (×1,0)                                                                                                 |
| 4   | veranstaltungsgelaende_wegfuehrung         | 4a     | Bauliche Anlagen und/oder topografische Gegebenheiten bedingen eine unübersichtliche Wegführung; Orientierung erschwert. (×1,2)                                           |
|     |                                            | 4b     | Bauliche Anlagen und/oder topografische Gegebenheiten erlauben eine übersichtliche Wegführung; gute Orientierung. (×1,0)                                                  |
| 5   | veranstaltungsgelaende_einlass_auslass     | 5a     | Ein‑ und Auslass sind räumlich getrennt; klare Strömungsrichtungen. (×1,0)                                                                                                |
|     |                                            | 5b     | Ein‑ und Auslass sind räumlich nicht getrennt; Begegnungsströme möglich. (×1,1)                                                                                           |
| 6   | gestalt_grundform                          | 6a     | Muster: Szenen‑/Attraktionsfläche und Publikumsfläche sind getrennt. (×1,0)                                                                                               |
|     |                                            | 6b     | Vieleck: mehrere Szenen/Attraktionen mit wechselnden Besucherströmen. (×1,1)                                                                                              |
|     |                                            | 6c     | Aufzug: veränderliche Szenenfläche bei überwiegend statischer Publikumsfläche. (×1,2)                                                                                     |
|     |                                            | 6d     | Marktplatz: keine Trennung von Szenen‑/Attraktionsfläche und Publikumsfläche. (×1,3)                                                                                      |
| 7   | beschaffenheit_entlastungsflaechen         | 7a     | Es bestehen Möglichkeiten zur Einrichtung von Entlastungsflächen. (×1,0)                                                                                                  |
|     |                                            | 7b     | Es bestehen keine realistischen Möglichkeiten für Entlastungsflächen. (×1,1)                                                                                              |
| 8   | beschaffenheit_befestigung                 | 8a     | Der Untergrund ist befestigt und befahrbar. (×1,0)                                                                                                                        |
|     |                                            | 8b     | Der Untergrund ist nicht befestigt; Mobilität kann eingeschränkt sein. (×1,1)                                                                                             |
| 9   | beschaffenheit_wetterlage                  | 9a     | Die Wetterlage kann die Nutzbarkeit des Geländes stark beeinflussen. (×1,3)                                                                                               |
|     |                                            | 9b     | Die Wetterlage beeinflusst die Nutzbarkeit des Geländes nicht in relevantem Maß. (×1,0)                                                                                   |
| 10  | veranstaltungsverlauf_einlasskontrolle     | 10a    | Es erfolgt keine Einlasskontrolle; der Zugang ist frei und unreguliert. (×1,3)                                                                                            |
|     |                                            | 10b    | Es erfolgt eine Einlasskontrolle; der Eintritt ist geordnet. (×1,0)                                                                                                       |
| 11  | veranstaltungsverlauf_zuablauf             | 11a    | Der Zu‑ und Ablauf erfolgt kontinuierlich; gleichmäßige Personenströme. (×1,0)                                                                                            |
|     |                                            | 11b    | Der Zu‑ und Ablauf erfolgt in Schüben; zeitweise Verdichtungen möglich. (×1,3)                                                                                            |
| 12  | veranstaltungsverlauf_attraktionen         | 12a    | Es existieren mehrere Attraktionen bzw. Bühnen; Ströme verteilen sich dynamisch. (×1,2)                                                                                   |
|     |                                            | 12b    | Es existiert nur eine Attraktion bzw. Bühne; Personenfluss konzentriert. (×1,0)                                                                                           |
| 13  | wiederkehrende_veranstaltung_erfahrung     | 13a    | Wiederkehrende Veranstaltung; Veranstaltende, Ort und Ablauf gleichbleibend. (+1,0)                                                                                       |
|     |                                            | 13b    | Erstmalig an diesem Ort; Veranstaltende haben Erfahrung mit Vergleichbarem. (+5,0)                                                                                        |
|     |                                            | 13c    | Erstmalig an diesem Ort; keine vergleichbare Erfahrung der Veranstaltenden. (+10,0)                                                                                       |
| 14  | wiederkehrende_veranstaltung_stoerungen    | 14a    | Keine dokumentierten Störungen bei früheren Veranstaltungen. (+0,0)                                                                                                       |
|     |                                            | 14b    | Dokumentierte Störungen bei früheren Veranstaltungen. (+5,0)                                                                                                              |
| 15  | besuchendenverhalten_ort_ablauf            | 15a    | Mehrheit ortskundig; Veranstaltungsablauf bekannt. (×0,8)                                                                                                                 |
|     |                                            | 15b    | Mehrheit ortsunkundig. (×1,2)                                                                                                                                             |
|     |                                            | 15c    | Mehrheit ortskundig; Veranstaltungsablauf unbekannt. (×1,3)                                                                                                               |
| 16  | besuchendenverhalten_involvement           | 16a    | Größerer Anteil mit hohem Involvement; aktivere Teilnahme/Bewegung möglich. (×1,2)                                                                                        |
|     |                                            | 16b    | Kleiner Anteil mit hohem Involvement; Gesamtverhalten eher ruhig. (×1,0)                                                                                                  |
| 17  | besuchendenverhalten_soziale_gruppen       | 17a    | Besondere soziale Gruppen erwartet (Jugendgruppen, Senior:innen, Familien). (×1,2)                                                                                        |
|     |                                            | 17b    | Keine besonderen sozialen Gruppen erwartet; normale Bewegungsgeschwindigkeit. (×1,0)                                                                                      |
