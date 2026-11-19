# Przekazanie strony MIEJSCE

Dokument dla osoby, która stawia stronę na własnym serwerze. Repozytorium jest statyczne. Nie ma tu tokenów, haseł ani danych osobowych.

## English (short)

Astro 7 static site, Node 22. `npm ci && SITE_ENV=production npm run build` writes `dist/`. Serve that directory (nginx example below). Every Sveltia save is a Git commit, so production must rebuild on push to `main`. Forms do not send mail by themselves: set `formularz_endpoint` in `src/content/ustawienia/kontakt.json` to your HTTPS endpoint and set `formularz_netlify` to `false`, then rebuild. Deliver messages to `eventy@miejsce.to`. Without `SITE_ENV=production` the HTML is `noindex`. A small script also forces `noindex` when the hostname is not `miejsce.to`. CMS login is GitHub OAuth through [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth); set `backend.repo`, `backend.branch` and `backend.base_url` in `public/admin/config.yml`. An example workflow lives in `docs/deploy-example.yml` and is not active.

## Stos

- [Astro](https://astro.build) 7, build statyczny (`output` domyślny).
- Treść: Markdown i JSON w `src/content`. Panel: [Sveltia CMS](https://github.com/sveltia/sveltia-cms) pod `/admin` (`public/admin/`).
- Node.js **22**.
- Wynik buildu: katalog `dist/`. Serwer tylko serwuje pliki. Nie ma procesu Node na produkcji.

## Build

```bash
npm ci
SITE_ENV=production npm run build
```

`npm run build` bez `SITE_ENV` jest podglądem: w HTML jest `<meta name="robots" content="noindex,nofollow">`.
`npm run build:prod` ustawia `SITE_ENV=production` i wtedy meta bierze wartość strony (`index,follow`, a szkice zostają `noindex`).

Dodatkowo skrypt w układzie strony ustawia `noindex`, gdy hostname **nie** kończy się na `miejsce.to`. Produkcja musi być pod `miejsce.to` albo `www.miejsce.to`. Staging pod inną domeną zostaje poza indeksem nawet po buildzie produkcyjnym.

Build dopisuje też `dist/_headers` (format Netlify). Na nginx/Apache ten plik nic nie robi. Nie ustawiaj nagłówka `X-Robots-Tag: noindex` na produkcji.

## Serwowanie `dist/`

Astro buduje katalogi z `index.html` i zawsze ze slashem na końcu (`trailingSlash: always`). Strona 404 to `dist/404.html`.

Przykład nginx:

```nginx
server {
    listen 443 ssl;
    server_name miejsce.to www.miejsce.to;
    root /var/www/miejsce/dist;
    index index.html;

    error_page 404 /404.html;

    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }

    location /_astro/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /admin/ {
        add_header X-Robots-Tag "noindex, nofollow" always;
    }
}
```

Apache: `DirectoryIndex index.html`, `FallbackResource` nie jest potrzebny, jeśli `mod_dir` serwuje `index.html`. Dla 404: `ErrorDocument 404 /404.html`.

Stare adresy są w `public/_redirects` (format Netlify: `źródło cel kod`). Trzeba je przenieść do konfiguracji serwera. Przykład:

```nginx
rewrite ^/oferta/?$ /eventy/ permanent;
rewrite ^/eventy/premiery-i-wydarzenia-specjalne/?$ /eventy/premiery-i-eventy-marek/ permanent;
```

Pełna lista jest w tym pliku. Po zmianie treści i tak robicie nowy build, więc reguły serwera trzymajcie obok, nie w generowanym `dist`.

## Zmienne

| Zmienna | Kiedy | Skutek |
| --- | --- | --- |
| `SITE_ENV=production` | tylko przy buildzie | zdejmuje globalny `noindex` |
| brak `SITE_ENV` | podgląd | cały HTML ma `noindex,nofollow` |

Adres kanoniczny jest w `astro.config.mjs`: `site: "https://miejsce.to"`. Jak domena zostanie ta sama, nie zmieniajcie jej.

## Formularz

Strona **nie wysyła maila**. Przeglądarka robi zwykły `POST`.

Dwa formularze, oba czytają `src/content/ustawienia/kontakt.json` (panel: Kontakt):

- `formularz_endpoint` — pełny URL `POST`. Pusty oznacza akcję `/dziekujemy/`.
- `formularz_netlify` — `true` tylko przy pustym endpoincie. Dopisuje wtedy `data-netlify="true"`. To działa wyłącznie na Netlify. Na własnym serwerze ustawcie `false`.

Stan w repozytorium: endpoint pusty, `formularz_netlify: true`. **Na własnym serwerze formularz nie dotrze do skrzynki**, dopóki nie wskażecie endpointu i nie zbudujecie strony od nowa.

Docelowa skrzynka: `eventy@miejsce.to`. Ustawia ją usługa pod `formularz_endpoint` (Formspree, własny endpoint, cokolwiek przyjmie `application/x-www-form-urlencoded` albo `multipart/form-data`). Strona tylko ustawia `action`.

Formularz na stronie głównej, `name="szybki"`:

- `imie`, `email`, `telefon`, `data`, `osoby`
- przy Netlify także ukryte `form-name=szybki`

Formularz na `/kontakt/`, `name="brief"`:

- `imie`, `email`, `telefon`, `data`, `osoby`
- `rodzaj`, `budzet`, `jednostka` (`netto` / `brutto`), `wiadomosc`
- ukryte: `cel`, `wynik`, `przestrzen`, pole-pułapka `bot-field`
- przy Netlify także `form-name=brief`

Po wysłaniu przeglądarka idzie pod `action`. Przy własnym endpoincie przekierowanie na `/dziekujemy/` konfigurujecie po stronie tej usługi. Przy pustym endpoincie akcja to od razu `/dziekujemy/` i **nikt nie dostaje treści**.

## Przebudowa po każdym pushu na `main`

Sveltia zapisuje treść commitem do GitHuba (gałąź z `config.yml`, teraz `main`). Serwer nie widzi zmiany, dopóki ktoś nie zbuduje `dist/` od nowa i go nie podmieni.

Przykładowy workflow jest w `docs/deploy-example.yml`. **Nie jest podpięty.** Żeby zaczął działać, skopiujcie go do `.github/workflows/` i dopiszcie własny krok wdrożenia (`rsync`, `scp`, obraz). W przykładzie build idzie z `SITE_ENV=production`.

## Sveltia CMS

Pliki: `public/admin/index.html`, `public/admin/config.yml`, `public/admin/sveltia-cms.js`.

Logowanie to GitHub OAuth, nie hasło w tym repo. W `public/admin/config.yml`:

```yaml
backend:
  name: github
  repo: waleriajaskowiak-jpg/miejsce-strona   # właściciel/nazwa
  branch: main                                 # gałąź, na którą idą commity treści
  # base_url: https://TWOJ-WORKER.workers.dev  # adres workera OAuth, bez końcowego slasha
```

Osoba edytująca musi mieć zapis do `repo` (Contents: Read and write).

### OAuth (sveltia-cms-auth)

1. GitHub → Settings → Developer settings → OAuth Apps → New.
   - Homepage URL: `https://miejsce.to`
   - Authorization callback URL: `https://TWOJ-WORKER.workers.dev/callback`
2. Wdróż [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) na Cloudflare Workers albo innym hostingu Node. Worker potrzebuje `GITHUB_CLIENT_ID` i `GITHUB_CLIENT_SECRET`.
3. Odkomentuj `base_url` i wstaw adres workera.
4. Wejście dla klienta: `https://miejsce.to/admin`.

Bez `base_url` Sveltia próbuje pośrednika OAuth hostingu (na Netlify działa samo). Na własnym serwerze `base_url` jest wymagane.

### Media

`media_folder: public/img`, `public_folder: /img`. Nowe zdjęcia z panelu lądują w `public/img` i są commitowane. PDF menu, jeśli powstanie, idzie do `public/uploads/menu` (pole „Menu PDF” przy jedzeniu).

## DNS

`miejsce.to` i `www.miejsce.to` mają wskazywać na ten serwer (rekord A/AAAA albo CNAME u rejestratora). Certyfikat TLS wystawiacie po swojej stronie. Dopiero hostname `miejsce.to` zdejmuje awaryjny `noindex` ze skryptu w przeglądarce.
