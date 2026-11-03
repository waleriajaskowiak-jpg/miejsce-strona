# MIEJSCE — strona miejsce.to

Wielostronicowa strona eventowa MIEJSCA (barki i ogród w Porcie Czerniakowskim). Astro, statyczny build, treść w plikach Markdown i JSON, panel edycji pod `/admin`.

Stary szkic na Netlify (`ornate-sunburst-5895d8.netlify.app`) zostaje nietknięty. To repozytorium wdraża się jako **nową** witrynę.

## Uruchomienie lokalne

Wymagany Node.js 22.

```bash
npm install
npm run dev
```

Strona: http://localhost:4321

```bash
npm run build      # wynik w dist/
npm run preview    # podgląd buildu
npm run test:budzet
```

## Deploy na Netlify (nowa witryna)

1. W Netlify: **Add new site → Import an existing project** i wskaż to repozytorium na GitHubie. Nie zmieniaj ustawień istniejącego szkicu.
2. Ustawienia buildu są w `netlify.toml`:
   - komenda: `npm run build`
   - katalog: `dist`
   - Node 22
3. Po pierwszym deployu Netlify wykryje formularz `brief` (Netlify Forms). W **Forms → brief → Form notifications** ustaw mail na `eventy@miejsce.to`.
4. Domena `miejsce.to` — podłącz ją do tej nowej witryny dopiero, gdy treść i formularz są sprawdzone. Do tego czasu strona żyje pod adresem `*.netlify.app`.

## Panel treści `/admin`

Używamy [Sveltia CMS](https://github.com/sveltia/sveltia-cms) 0.257.0 (zgodny z konfiguracją Decap). Backend to GitHub, bez Netlify Identity.

Pliki: `public/admin/index.html`, `public/admin/config.yml`, skrypt `public/admin/sveltia-cms.js`.
Repozytorium w konfiguracji: `waleriajaskowiak-jpg/miejsce-strona`, gałąź `main`.

Zapis w panelu robi commit na `main` i wyzwala kolejny build Netlify. Osoba edytująca potrzebuje uprawnienia do zapisu w repozytorium.

### Logowanie — token (najszybciej, dla właściciela)

1. Otwórz `/admin`.
2. **Sign in using access token**.
3. GitHub → Settings → Developer settings → Personal access tokens.
   - Token klasyczny: zakres `repo`.
   - Token szczegółowy: to repozytorium, uprawnienie **Contents: Read and write**.
4. Wklej token. Zostaje w przeglądarce tej osoby.

### Logowanie — GitHub dla klienta (bez wklejania tokenu)

Identity w Netlify jest wyłączone z użycia. OAuth ustawia się osobno:

1. GitHub → Settings → Developer settings → **OAuth Apps** → New OAuth App.
   - Homepage URL: adres nowej witryny Netlify (albo `https://miejsce.to`, gdy domena już wskazuje tu).
   - Authorization callback URL: `https://api.netlify.com/auth/done`
2. Skopiuj Client ID, wygeneruj Client Secret.
3. Netlify, **ta nowa witryna** → Project configuration → **Security → OAuth** (to nie jest zakładka Identity).
4. Authentication providers → Install provider → **GitHub** → wklej Client ID i Client Secret.
5. W `public/admin/config.yml` nie ustawiaj `base_url`. Sveltia domyślnie używa wtedy Netlify jako pośrednika OAuth.
6. Klient otwiera `https://ADRES-NOWEJ-WITRYNY/admin` i klika **Sign in with GitHub**. Konto GitHub musi mieć zapis do tego repozytorium.

Lokalnie, przy `npm run dev`, na ekranie logowania jest też **Work with local repository** — wskazuje się katalog repozytorium na dysku, bez OAuth.

### Co da się edytować

- strona główna, kontakt, cennik i progi modułu budżetu, teksty jedzenia, logotypy, kolejka poradnika
- cztery przestrzenie, sześć scenariuszy
- realizacje i artykuły poradnika (nowe wpisy: pole „Adres URL” bez spacji i polskich znaków, np. `konferencja-dla-60-osob`)
- pytania „Warto wiedzieć”
- zdjęcia: biblioteka wskazuje `public/img` (są tam też zdjęcia z poprzedniej strony). Nowe pliki lądują w tym samym katalogu.

Pole **Szkic** przy realizacji i artykule chowa stronę przed Google (`noindex`) i wyjmuje ją z `sitemap.xml`. Po napisaniu tekstu odznacz szkic i opublikuj.

## Moduł „Mam budżet”

Jest na stronie głównej (krótki) i na `/ceny/` (ze zdaniem, jak liczy). Nie pokazuje kwoty. Zwraca jedną z trzech odpowiedzi z briefu (A / B / C).

Porównanie, edytowalne w CMS w „Ceny i budżet → Progi modułu budżetu”:

- wynajem „od”: NOWE 3 000 / DUŻE 6 000 / CAŁE 12 000
- wersja oszczędna: ten wynajem + osoby × (catering 180 + bar 150)
- wersja środkowa: ten wynajem + osoby × (catering 220 + bar 190)
- powyżej 130 osób, albo garden party powyżej 100 osób → cały kompleks; konferencja lub szkolenie do 70 osób → NOWE MIEJSCE; reszta do 130 osób → DUŻE MIEJSCE
- piątek, sobota, niedziela albo maj, czerwiec, wrzesień, październik mnożą widełki przez 1,05. To nie jest dopłata z cennika, tylko ostrożniejsze porównanie. Współczynnik można zmienić albo ustawić na `1`
- A, gdy budżet jest co najmniej 12% powyżej wersji środkowej; B, gdy mieści się wersja oszczędna; inaczej C
- obsługa, DJ i AV nie wchodzą do porównania, bo nie mają tu stałej ceny

Przykład z briefu (event firmowy, 80 osób, czwartek, czerwiec, 40 000 zł) daje odpowiedź B. Przycisk **Wyślij nam ten brief** otwiera `/kontakt/` z uzupełnionym formularzem.

Logika: `src/lib/budzet.js`. Test: `npm run test:budzet`.

## Formularz

Jeden formularz Netlify o nazwie `brief`, na `/kontakt/`. Pola: rodzaj wydarzenia, data, liczba osób, budżet, telefon, e-mail, wiadomość, oraz ukryte `wynik` i `przestrzen` z modułu budżetu. Po wysłaniu: `/dziekujemy/`.

## Język

Strona jest po polsku. Przełącznika PL/EN nie ma: nowa mapa strony i copy z briefu są po polsku, a tłumaczenie całości nie było gotowe w materiałach. Angielskie teksty zostały na starym szkicu.

## Mapa adresów

`/`, `/przestrzenie/` i cztery podstrony, `/eventy/` i sześć scenariuszy, `/ceny/`, `/jedzenie-i-bar/`, `/realizacje/` i strony realizacji, `/warto-wiedziec/`, `/poradnik/` i artykuły, `/kontakt/`.

`sitemap.xml` pomija szkice, `/admin` i `/dziekujemy/`.

## Do uzupełnienia przez MIEJSCE

Bez tych rzeczy nie dopisujemy liczb ani nazw z domysłu:

- **Realizacje (szkice, `noindex`):** Pezet × Spotify, SADVA × Kołodka, Wesele nad Wisłą (wrzesień 2026). Znane są typ, przestrzeń i podpisy zdjęć ze starej strony. Brakuje liczby gości, menu, baru i krótkiego opisu. Docelowo ok. 10 realizacji.
- **Poradnik:** trzy szkice (`noindex`) — „Ile kosztuje event firmowy dla 100 osób w Warszawie?”, „Event plenerowy i deszcz…”, „Checklist organizatora eventu.”. Dwanaście kolejnych tytułów z briefu jest na `/poradnik/` jako „w kolejce”, bez pustych URL-i.
- **FAQ:** godzina końca eventu, liczba miejsc parkingowych, numery linii komunikacji i dostępność dla osób z niepełnosprawnościami są opisane jako „potwierdzimy pod termin”, bo nie ma tego w ofercie.
- **PDF:** na stronie jest `public/pdf/MIEJSCE-oferta-2026-PL.pdf`. Osobnego pliku „menu eventowe” w materiałach nie było. Jak powstanie, wrzućcie go do `public/pdf` i podmieńcie ścieżkę w CMS.
- **Ogród** nie ma ceny „od”. W ofercie są tylko trzy progi wynajmu.
- Współczynnik 5% na weekend i sezon warto potwierdzić albo wyzerować w CMS.
- Godzin biura nie publikujemy.

## Zdjęcia

Archiwum ze szkicu jest w `public/img/` (galerie, miniatury, plan, logotyp, zdjęcia z oferty). Na stronach użyty jest wybór kadrów. Reszta zostaje w repozytorium, żeby dało się ją wziąć w CMS.
