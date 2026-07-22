# TODOs v0.4.0 18.07.2026

• Jesteśmy bardzo blisko zamknięcia 0.4.0, powiedziałbym 85-90%.

Z roadmapy 0.4.0 mamy już:

- Fetch map data from API: zrobione w resort-map-client.tsx.
- Render map as tile grid: zrobione w map-grid.tsx.
- Use assets from public/assets: zrobione.
- Visually distinguish available/booked cabanas: zrobione po stronie stylów.
- Map legend: zrobione.
- Loading/API error states: zrobione.
- Frontend nie hardcoduje layoutu: zrobione, layout idzie z /api/map.
- Available cabanas clickable: zrobione, można zaznaczyć cabanę.
- Booked cabanas visually distinct: zrobione, disabled + inny styl.

Dodatkowo ponad pierwotny minimalny zakres 0.4.0:

- rozbiliśmy komponenty tak, żeby "use client" było tylko w resort-map-client.tsx;
- dodaliśmy dobór assetów ścieżek po sąsiadach: proste, zakręty, końcówki, split, crossing;
- poprawiliśmy kafle na faktyczne kwadraty.

Co bym jeszcze zrobił przed uznaniem 0.4.0 za gotowe:

- uruchomić widok lokalnie i wizualnie sprawdzić mapę po ostatniej zmianie kwadratów i rotacji ścieżek;
- ewentualnie dodać screenshot pomocniczy, choć formalnie screenshot.png jest dopiero w 0.7.0;
- zrobić krótkie code review aktualnego diffu;
- odpalić finalnie format:check, lint, test:ci, build.

Na teraz branch feature/map-view zawiera implementację 0.4.0, ale jeszcze nie traktowałbym go jako finalnie zreviewowanego/zamkniętego.
