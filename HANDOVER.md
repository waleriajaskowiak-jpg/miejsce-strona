# MIEJSCE — przekazanie strony

Strona `https://miejsce.to`. Statyczny serwis wydarzeń (dwie barki i ogród w Porcie Czerniakowskim) oraz panel, w którym da się zmieniać teksty i zdjęcia bez ruszania kodu.

To nie jest instrukcja wdrożenia na konkretny serwer. Hosting wybiera DevOps. Poniżej jest to, czego strona potrzebuje, żeby wstać i żeby edycja treści działała.

## Co to jest

- **Astro**, budowane do zwykłych plików HTML. Na serwerze produkcyjnym nie ma Node.
- **Sveltia CMS** pod adresem `/admin`. Zapis w panelu robi commit na GitHubie, na gałęzi `main`.
- Teksty są w `src/content` (ustawienia strony, przestrzenie, kategorie wydarzeń, scenariusze, realizacje, poradnik, FAQ).
- Zdjęcia są w `public/img`. To jest katalog mediów panelu (`media_folder` w `public/admin/config.yml`).
- Pliki wrzucane osobno, na przykład PDF menu, lądują w `public/uploads` (menu: `public/uploads/menu`).
- Każdy widoczny tekst i każde zdjęcie da się zmienić w `/admin`. Kolejność slajdów na stronie głównej też.

Panel nie wysyła maili i nie trzyma haseł. Logowanie idzie przez GitHub.

## Uruchomienie i build na własnym komputerze

Potrzebny **Node.js 22**.

```bash
npm ci
npm run dev
```

Strona: `http://localhost:4321`. Panel lokalnie: `http://localhost:4321/admin`. Przy `local_backend: true` w `config.yml` da się pracować na plikach z dysku, bez logowania do GitHuba.

```bash
npm run build
```

Wynik ląduje w `dist/`. Ten build jest podglądem: strony dostają `noindex`.

Podgląd zbudowanych plików:

```bash
npm run preview
```

## Build produkcyjny

Jedyna zmienna środowiskowa, którą czyta kod strony, to **`SITE_ENV`**.

Ustawiona na dokładnie `production`:

- `src/lib/env.js` traktuje build jako produkcyjny. Meta `robots` zostaje taka, jaka jest na stronie (zwykle `index,follow`), a nie jest nadpisywana na `noindex,nofollow`.
- `integrations/env-headers.mjs` **nie** dopisuje do `dist/_headers` nagłówka `X-Robots-Tag: noindex, nofollow`.

Bez tej zmiennej oba mechanizmy zostawiają podgląd poza Google. Dotyczy to też `netlify.toml`: komenda tam jest `npm run build`, więc sam import na Netlify, bez zmiany komendy albo bez zmiennej, opublikuje stronę z `noindex`.

Innych zmiennych kod nie czyta. Nie ma kluczy API w repozytorium.

Komenda produkcyjna:

```bash
npm run build:prod
```

To to samo co `SITE_ENV=production npm run build`. Na hoście ustaw albo komendę `npm run build:prod`, albo zmienną `SITE_ENV=production` przy komendzie `npm run build`.

Szkice (pole „Szkic” przy realizacji i artykule), strona podziękowania i 404 zostają `noindex` także na produkcji. Tak ma być.

Jest jeszcze jeden bezpiecznik, w przeglądarce: jeśli adres strony nie kończy się na `miejsce.to`, skrypt w layoucie ustawia `noindex`. Podgląd na `*.netlify.app` albo `*.pages.dev` nie wejdzie do Google. Właściwa domena musi być `miejsce.to` (albo subdomena, na przykład `www.miejsce.to`).

## Hosting

Na serwer wgrywa się zawartość `dist/`. Node na produkcji nie jest potrzebny.

Adresy są z ukośnikiem na końcu (`/kontakt/`). Astro składa katalogi z `index.html`. Strona 404 to `dist/404.html`.

### nginx

```nginx
server {
    listen 80;
    server_name miejsce.to www.miejsce.to;
    return 301 https://miejsce.to$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name www.miejsce.to;
    # certyfikat tej domeny
    return 301 https://miejsce.to$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name miejsce.to;
    root /var/www/miejsce/dist;
    index index.html;

    # /kontakt -> /kontakt/
    rewrite ^([^.]*[^/])$ $1/ permanent;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;
    location = /404.html {
        internal;
    }
}
```

Certyfikat: Let’s Encrypt albo certyfikat hosta. Port 80 tylko przekierowuje na HTTPS.

Plik `public/_redirects` (stare adresy, między innymi `/oferta/` i poprzedni adres premier) jest w formacie Netlify. Cloudflare Pages go rozumie. nginx go nie czyta. Na nginx te same reguły trzeba przenieść do konfiguracji, inaczej stare linki zwrócą 404.

### Netlify, Cloudflare Pages, Vercel

Każdy z nich może budować z tego repozytorium.

| | |
|---|---|
| Node | 22 |
| Komenda | `npm run build:prod` |
| Katalog wyniku | `dist` |
| Zmienna | `SITE_ENV` = `production`, jeśli komenda to zwykłe `npm run build` |

Po każdym pushu na `main` host buduje od nowa. To jest konieczne, bo panel treści commituje na `main`.

## Build po każdym zapisie w panelu

Sveltia zapisuje treść commitem na `main`. Bez nowego buildu strona się nie zmienia.

Przykład workflow. **Nie jest włączony.** To tylko wzór do wklejenia, jeśli publikacja ma iść z GitHub Actions, a nie z panelu hosta. Nie dodawać tego pliku do `.github/workflows`, dopóki nie ma ustalonego sposobu wgrywania `dist/`.

```yaml
name: Publikacja
on:
  push:
    branches: [main]
permissions:
  contents: read
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build:prod
      # tutaj wgranie dist/ na serwer, na przykład rsync
```

## Logowanie do panelu

Adres: `https://miejsce.to/admin`.

Backend w `public/admin/config.yml`:

```yaml
repo: maciekmiejsce/miejsce-strona
branch: main
```

Komentarz nad tymi liniami mówi, co poprawić, gdy repozytorium zmieni nazwę. Gałąź `main` jest gałęzią, na którą panel commituje.

Edytować może osoba, która na GitHubie ma **zapis** do `maciekmiejsce/miejsce-strona` (collaborator z uprawnieniem Write). Samo konto GitHub bez zapisu do repozytorium nie wystarczy. Zaproszenie: repozytorium → Settings → Collaborators.

Logowanie dla osób, które nie chcą wklejać tokenu, idzie przez [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth), mały skrypt na Cloudflare Workers. Pośredniczy w OAuth z GitHubem. W repozytorium strony nie ma sekretu tej aplikacji.

Kolejność, która się spina:

1. **Worker.** Konto Cloudflare. Wdrożenie przyciskiem „Deploy to Cloudflare Workers” z repozytorium `sveltia/sveltia-cms-auth`, albo lokalnie `wrangler deploy`. Skopiować adres workera, na przykład `https://sveltia-cms-auth.<konto>.workers.dev`.
2. **Aplikacja OAuth na GitHubie.** Settings → Developer settings → OAuth Apps → New OAuth App.
   - Homepage URL: `https://miejsce.to`
   - Authorization callback URL: `https://sveltia-cms-auth.<konto>.workers.dev/callback` (adres workera plus `/callback`)
   - Skopiować Client ID. Wygenerować Client Secret. Secret zostaje tylko w Cloudflare, nie w tym repozytorium i nie w dokumencie.
3. **Sekrety workera.** W Cloudflare, przy tym workerze: Settings → Variables and Secrets.
   - `GITHUB_CLIENT_ID` — Client ID
   - `GITHUB_CLIENT_SECRET` — Client Secret, oznaczony jako secret
   - `ALLOWED_DOMAINS` — warto ustawić: `miejsce.to, www.miejsce.to`. Inaczej obcy serwis mógłby użyć tego workera.
4. **`base_url` w tym repozytorium.** W `public/admin/config.yml`, pod `backend`, dopisać adres workera bez ukośnika na końcu i bez `/callback`:

```yaml
backend:
  name: github
  repo: maciekmiejsce/miejsce-strona
  branch: main
  base_url: https://sveltia-cms-auth.<konto>.workers.dev
```

Commit na `main` i przebudowa strony. Dopiero wtedy „Sign in with GitHub” na `/admin` idzie przez tego workera.

Aktualna dokumentacja sveltia-cms-auth opisuje też wariant z GitHub App zamiast OAuth App (węższe uprawnienia, instalacja tylko na tym repozytorium). OAuth App nadal działa z tym workerem. Callback i `base_url` są takie same. Przy GitHub App Client ID i secret biorą się z aplikacji, a aplikację instaluje się na koncie `maciekmiejsce` z dostępem tylko do `miejsce-strona`.

Bez `base_url` panel nie ma własnego pośrednika OAuth. Token osobisty (GitHub → Developer settings → Personal access token, zakres zapisu do treści tego repozytorium) działa od razu, z ekranu `/admin`, i nadaje się dla osoby technicznej. Nie wklejać tokenu do repozytorium.

## Formularz kontaktowy

Strona **sama nie wysyła maila**. Nie ma tu serwera poczty.

Są dwa formularze. Oba biorą adres z `src/content/ustawienia/kontakt.json` (w panelu: Kontakt):

- `formularz_endpoint` — teraz pusty.
- `formularz_netlify` — teraz `true`.

Gdy endpoint jest pusty i `formularz_netlify` nie jest `false`:

- strona główna wysyła `POST` formularza o nazwie `szybki` (imię, e-mail, telefon, termin, liczba osób);
- `/kontakt/` wysyła `POST` formularza o nazwie `brief` (te same pola plus rodzaj, budżet, netto/brutto, wiadomość; ukryte pole na boty).

Atrybut `action` wskazuje wtedy `/dziekujemy/`, a w HTML jest `data-netlify="true"`. **Tylko Netlify** odbiera taki zapis. Na nginx, Cloudflare Pages i Vercelu przeglądarka otwiera `/dziekujemy/`, a treść formularza przepada. Nikt nie dostaje maila.

Żeby wiadomości dochodziły na `eventy@miejsce.to`:

**Netlify.** Zostawić endpoint pusty i `formularz_netlify: true`. Po deployu, w Site configuration → Forms, są formularze `szybki` i `brief`. Przy obu ustawić powiadomienie e-mail na `eventy@miejsce.to`. Sprawdzić wysyłką testową z obu stron.

**Inny hosting.** W `kontakt.json` (albo w panelu, po czym przebudować stronę) wpisać pełny adres, który przyjmuje `POST` i sam wysyła mail na `eventy@miejsce.to`. Wyłączyć tryb Netlify:

```json
"formularz_endpoint": "https://example.com/formularz",
"formularz_netlify": false
```

Pole musi być prawdziwym adresem usługi (Formspree, własna funkcja, formularz hosta). Placeholder z przykładu nie zadziała. Usługa powinna po przyjęciu zapisu przekierować na `https://miejsce.to/dziekujemy/`. Bez przebudowy zmiana pliku nie wejdzie na stronę.

## Domena miejsce.to

1. U rejestratora DNS wskazać hosting: rekord `A` / `AAAA` albo `CNAME` dla `miejsce.to` i dla `www`, według tego, co podaje host.
2. Włączyć HTTPS. Certyfikat wystawia host albo Let’s Encrypt na nginx.
3. `www` przekierować na `https://miejsce.to` (albo odwrotnie, byle jeden adres był główny).
4. Otworzyć `https://miejsce.to` i w źródle strony sprawdzić, że meta `robots` to `index,follow`, a nie `noindex`. Jeśli jest `noindex`, build poszedł bez `SITE_ENV=production`.

Dopiero po tym Google może indeksować stronę. Podglądy na obcych domenach zostają poza indeksem przez skrypt opisany wyżej.

## Co dalej, po kolei

1. Repozytorium `maciekmiejsce/miejsce-strona` ma domyślną gałąź `main`. W `public/admin/config.yml` pola `repo` i `branch` wskazują właśnie je.
2. Zaprosić osoby, które mają edytować treść. Uprawnienie: Write.
3. Wybrać hosting. Node 22, katalog `dist`, komenda `npm run build:prod` albo `SITE_ENV=production`.
4. Ustawić odbiór formularzy na `eventy@miejsce.to` (powiadomienia Netlify dla `szybki` i `brief`, albo `formularz_endpoint` i nowy build). Wysłać test z obu formularzy.
5. Wdrożyć workera `sveltia-cms-auth`, założyć OAuth App, wpisać sekrety w Cloudflare, dopisać `base_url` i przebudować.
6. Wejść na `/admin` kontem z zapisem do repozytorium. Zmienić jedno słowo, zapisać, sprawdzić, że na `main` jest commit i że hosting zbudował stronę od nowa.
7. Podpiąć DNS `miejsce.to` i `www`, włączyć HTTPS, przekierować `www`.
8. Na `https://miejsce.to` sprawdzić `index,follow` i że stary adres, na przykład `/oferta/`, prowadzi tam, gdzie ma (na nginx reguły z `public/_redirects` trzeba przenieść ręcznie).

---

## English summary

Static Astro site plus Sveltia CMS. Content is in `src/content`, photos in `public/img`, extra uploads such as the menu PDF in `public/uploads`. Editing in `/admin` commits to `main` on `maciekmiejsce/miejsce-strona`.

Node 22. `npm ci`, `npm run dev`, `npm run build` → `dist/` with `noindex`. The only env var the code reads is `SITE_ENV`. Set it to `production` (`npm run build:prod`) so the public site is indexable and `dist/_headers` does not send `X-Robots-Tag: noindex`. Any hostname other than `miejsce.to` is forced to `noindex` in the browser.

Host `dist/` on nginx (trailing slash, `404.html`) or on Netlify, Cloudflare Pages or Vercel: Node 22, output `dist`, build `npm run build:prod`. Rebuild on every push to `main`. The sample GitHub Actions workflow above is documentation only.

CMS login is GitHub. Deploy [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare, create a GitHub OAuth App whose callback is `<worker>/callback`, store the client id and secret on the worker, then set `backend.base_url` to the worker origin. Collaborators with write access can edit.

The site does not send email. With an empty `formularz_endpoint` and `formularz_netlify: true`, only Netlify Forms receives `szybki` and `brief`; point both notifications at `eventy@miejsce.to`. On any other host, set `formularz_endpoint` to a service that delivers to that address, set `formularz_netlify` to false, and rebuild.

Point DNS for `miejsce.to` at the new host and turn on HTTPS.
