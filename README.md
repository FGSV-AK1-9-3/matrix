# Was ist SCENIC?

„Simulation Check for Events and Infrastructure Complexity” ist ein webbasiertes Werkzeug zur Bewertung von Veranstaltungen.
Mit wenigen Klicks und in kaum mehr als fünf Minuten könnt ihr eine Veranstaltung erfassen und einschätzen, ob der Einsatz einer Besuchersimulation sinnvoll gewesen wäre.

# Weiterentwicklen

Bevor du Änderungen einreichst, solltest du den Code formatieren und die End-to-End-Tests durchlaufen lassen.

## Code formatieren

Abhängigkeiten installieren und den Formatter ausführen:

```bash
npm ci
npm run format
```

## E2E-Tests

Für die End-to-End-Tests wird Playwright verwendet.
Nach der Installation der Abhängigkeiten muss Chromium einmalig eingerichtet werden, bevor die Tests gestartet werden können:

```bash
npm ci
npx playwright install chromium --with-deps

npx playwright test
```
