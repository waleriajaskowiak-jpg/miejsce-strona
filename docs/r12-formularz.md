# Formularz

Skrzynka docelowa: `eventy@miejsce.to`.

Są dwie ścieżki. Na stronie głównej jest pięć pól (imię, e-mail, telefon, termin, liczba osób). Na `/kontakt/` te same pięć pól, a pod „Doprecyzuj brief” reszta: rodzaj, budżet, netto/brutto, wiadomość.

## Przełączenie adresu

W `src/content/ustawienia/kontakt.json`, pola są też w panelu `/admin` przy Kontakt:

- `formularz_endpoint` — pełny adres, na który idzie `POST`. Puste pole zostawia zapis lokalny.
- `formularz_netlify` — `true` tylko gdy adres jest pusty. Wtedy formularz zostaje formularzem Netlify (`data-netlify`).

Przykład Formspree albo własnej funkcji:

```json
"formularz_endpoint": "https://formspree.io/f/XXXX",
"formularz_netlify": false
```

Po zmianie trzeba zbudować stronę od nowa. Ten branch nic nie wdraża.
