# TODO

## UI/UX

- [ ] Nie wiem jak jeszcze zrobić układ w UI

## Możliwość zamknięcia BookingPanel

- [x] Chcę by była możliwość zamknięcia booking-panel za pomocą przycisku w prawym górnym rogu panelu.
- [x] Chcę by booking-panel się zamykał po akcji kliknięcia w zajętą cabanę sam po 3 sekundach
- [x] Chcę by booking-panel się zamykał po akcji zarezerwowania cabany sam po 3 sekundach

## E2E

- [ ] Usuń `click({ force: true })` z testów E2E i napraw stojące za tym problemy UI/UX. Testy z wymuszonym kliknięciem omijają standardowe sprawdzenia Playwrighta dla realnej interakcji użytkownika. Dotyczy to `e2e/booking-flow.spec.ts` oraz `e2e/mobile.spec.ts`.

## Links

- <https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/forms_and_events/>
- <https://adamsilver.io/blog/where-to-put-buttons-on-forms/>
