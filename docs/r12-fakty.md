# Fakty ustawione w rundzie 12

Plik źródłowy: `src/content/ustawienia/fakty.json` i `src/content/ustawienia/cennik.json`.

Prototyp HTML klienta nie był w tym środowisku, więc żadnej liczby nie wzięto z makiety. Zostają wartości już opublikowane w repozytorium. Brak liczby na układ albo na deszcz jest zapisany jako `null` i na stronie czyta się „zapytaj o wariant na niepogodę”.

| Fakt | Wartość | Źródło |
| --- | --- | --- |
| Duże Miejsce, bankiet, zima | 120 | `fakty.json` → `przestrzenie.duze.zima_liczba` |
| Duże Miejsce, bankiet, lato | brak | nie ma potwierdzonej liczby letniej |
| Duże Miejsce, teatr i stojąco | brak | prototypu nie było, nie dopisujemy pojemności |
| Duże Miejsce, metraż | 80 m² + 120 m² tarasu | `fakty.json`, wariant 250 m² nadal niepublikowany |
| Duże Miejsce, wynajem 5 h | od 5 000 zł netto | `cennik.json` |
| Małe Miejsce, bankiet | 70, lato i zima | `fakty.json` → `przestrzenie.male.gosci` |
| Małe Miejsce, teatr | brak | nie ma osobnej liczby |
| Małe Miejsce, metraż | 108 m² + 50 m² tarasu | `fakty.json` |
| Małe Miejsce, wynajem 5 h | od 3 000 zł netto | `cennik.json` |
| Miejscowy Ogród, sezon | ok. 100, maj–wrzesień | dotychczasowa liczba, niepotwierdzona przez Maćka |
| Miejscowy Ogród, zima i deszcz | brak | ogród nie działa poza sezonem |
| Miejscowy Ogród, metraż | ok. 300 m² | `fakty.json` |
| Miejscowy Ogród, wynajem | indywidualnie | `fakty.json` |
| Całe Miejsce, lato i deszcz | 350 | `fakty.json` → `cale.maks_osob`, także w deszczu |
| Całe Miejsce, wynajem | indywidualnie | `cennik.json` |
| Menu | 180 / 220 / 250 zł netto za osobę | `cennik.json` |
| Open bar, 5 h | 150 / 190 / 230 zł netto za osobę | `cennik.json` |
| Serwis | +10%, obok ceny | `fakty.json` |

350 gości dotyczy Całego Miejsca. Nie dotyczy każdej barki i każdego układu stołów.

## Hero

Główne zdjęcie strony to wiosenny kadr barek w Porcie Czerniakowskim, pole `hero_zdjecie` w `src/content/ustawienia/strona.json` (`/img/hero/barki.jpg`). W panelu jest to „Hero — zdjęcie”. Przy trybie slider ten plik jest pierwszym slajdem.

Plik dostarczony z tą notatką ma 1600×1066 px. Żaden wariant nie jest od niego szerszy: 640, 1024 i 1600 px, każdy jako AVIF, WebP i JPG. Przeglądarka na ekranie 1920 i tak powiększa ten kadr. Pełnowymiarowy oryginał jest nadal potrzebny od klienta.
