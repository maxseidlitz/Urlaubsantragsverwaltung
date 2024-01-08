# Urlaubsantragsverwaltung

Die Urlaubsantragsverwaltung ist eine einfache Webanwendung zur Verwaltung von Urlaubsanträgen für Mitarbeiter. Sie ermöglicht das Einreichen, Bearbeiten und Prüfen von Urlaubsanträgen.

## Technologien

- **Programmiersprache:** SQL, JavaScript, HTML

- **Datenbank:** PostgreSQL

- **Frontend:** HTML, CSS, JavaScript, (Bootstrap)

- **Webframework (optional):** später eventuell Flutter

## Funktionen

- Antrag stellen: Mitarbeiter können Urlaubsanträge mit den folgenden Informationen einreichen:
  - Personalnummer
  - Startdatum Urlaub
  - Enddatum Urlaub
  - Summe Urlaubstage (automatisch berechnet)
  - Art des Urlaubs (Bildungsurlaub, Umzug, Normaler Urlaub,...)
- Antrag prüfen: Vorgesetzte oder Administratoren können eingereichte Urlaubsanträge überprüfen, genehmigen oder ablehnen.
- Registrieren neuer Mitarbeitender
- Übersicht für Vorgesetzte (Erstprüfung des Urlaubsantrags -> erste Stufe der Freigabe)
  - Mitteilung an Antragsteller über Status des Antrags
  - Ansicht aller Anträge des Teams (inkl. Filterung nach Team bei mehr Abt. je Fürungskraft
- Überischt für das HR (Zweitprüfung des Urlaubsantrags -> zweite Stufe der Freigabe)
[Anwendungsfälle und Projektkoordination](https://mseid.notion.site/Urlaubsantragsverwaltung-OpenSource-f3835e6b4d8a4f819534d816b497f6ac?pvs=4)

### Nutzertypen
1. User
2. Manager
3. HR
4. (Admin)

## Verwendung

1. Klonen Sie das Repository auf Ihren lokalen Computer:
   ```shell
   git clone https://github.com/IhrBenutzername/urlaubsantragsverwaltung.git

2. Öffnen Sie das Projekt in einem geeigneten Editor.
3. Erstellen Sie sich eine .env-Datei mit den erforderlichen Parametern. (kann beim Repository-Owner angefragt werden)
4. Führen Sie den Befehlt ``npm i`` im Terminal aus um notwendige Pakete der Middleware zu installieren
5. Passen Sie die Parameter der ``db.js``an die ihrer erstellten PostgreSQL-Datenbank an. (Die Datenbankeinrichtung kann beim Repository-Owner angefragt werden) 
6. Führen Sie ``npm run devStart`` aus um die Anwendung zu starten.
7. Öffnen Sie die Port-Adresse in einem geeigneten Webbrowser (empfohlen: Firefox).
