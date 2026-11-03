/**
 * Heurystyka budżetu MIEJSCE.
 *
 * To nie jest wycena i funkcja nie zwraca kwoty do pokazania gościowi.
 * Porównuje budżet z dwoma zestawami cen z CMS (cennik.json):
 *
 *   min      = wynajem „od” + osoby × (catering_min + bar_min)
 *   komfort  = wynajem „od” + osoby × (catering_komfort + bar_komfort)
 *
 * Wynajem wybierają reguły `heurystyka.reguly` (pierwsza pasująca):
 *   osoby_powyzej            — liczba osób większa niż próg
 *   typ_i_osoby_powyzej      — typ jest na liście i osób jest więcej niż próg
 *   typ_sezon_i_osoby_powyzej — jak wyżej, ale tylko w miesiącach sezonu
 *   typ_i_osoby_do           — typ jest na liście i osób jest nie więcej niż próg
 *   osoby_do                 — osób jest nie więcej niż próg
 *   zawsze                   — łapie resztę
 *
 * Domyślnie: powyżej 130 osób → cały kompleks (12 000),
 * garden party powyżej 100 → cały kompleks,
 * konferencja/szkolenie do 70 → NOWE MIEJSCE (3 000),
 * do 130 osób → DUŻE MIEJSCE (6 000).
 *
 * Weekend (pt–nd) albo miesiąc z `miesiace_sezonu` (domyślnie 5, 6, 9, 10)
 * mnoży widełki przez `wspolczynnik_terminu` (domyślnie 1.05).
 * To nie jest dopłata z cennika, tylko ostrożniejsze porównanie.
 * Obsługa, DJ i AV nie wchodzą do rachunku — nie mają tu stałej ceny.
 *
 * Wynik A, gdy budżet ≥ komfort × prog_a (domyślnie 1.12 — jest zapas).
 * Wynik B, gdy budżet ≥ min × prog_b (domyślnie 1 — mieści się wersja oszczędna).
 * Wynik C w pozostałych przypadkach.
 *
 * Przykład z briefu: firmowy, 80 osób, czwartek, czerwiec, 40 000 zł → B.
 */

function kwota(row) {
  const n = row?.cena_od ?? row?.cena;
  return typeof n === "number" && Number.isFinite(n) ? n : null;
}

function znajdz(lista, id) {
  return (lista || []).find((row) => row.id === id) || null;
}

function parseLiczbe(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const digits = String(value ?? "").replace(/[^\d]/g, "");
  if (!digits) return NaN;
  const n = Number(digits);
  return Number.isFinite(n) ? n : NaN;
}

export function wybierzPrzestrzen(typ, osoby, miesiac, heur) {
  const reguly = heur?.reguly || [];
  const sezon = (heur?.miesiace_sezonu || []).map(Number);
  for (const r of reguly) {
    const wartosc = Number(r.wartosc);
    const typy = r.typy || [];
    if (r.gdy === "osoby_powyzej" && Number.isFinite(wartosc) && osoby > wartosc) return r.przestrzen;
    if (r.gdy === "typ_i_osoby_powyzej" && typy.includes(typ) && Number.isFinite(wartosc) && osoby > wartosc) {
      return r.przestrzen;
    }
    if (
      r.gdy === "typ_sezon_i_osoby_powyzej" &&
      typy.includes(typ) &&
      sezon.includes(Number(miesiac)) &&
      Number.isFinite(wartosc) &&
      osoby > wartosc
    ) {
      return r.przestrzen;
    }
    if (r.gdy === "typ_i_osoby_do" && typy.includes(typ) && Number.isFinite(wartosc) && osoby <= wartosc) {
      return r.przestrzen;
    }
    if (r.gdy === "osoby_do" && Number.isFinite(wartosc) && osoby <= wartosc) return r.przestrzen;
    if (r.gdy === "zawsze" && r.przestrzen) return r.przestrzen;
  }
  return "duze";
}

export function ocen(input, cennik) {
  const heur = cennik?.heurystyka || {};
  const osoby = parseLiczbe(input?.osoby);
  const budzet = parseLiczbe(input?.budzet);
  const typ = String(input?.typ || "");
  const dzien = String(input?.dzien || "");
  const miesiac = Number(input?.miesiac);

  const typy = new Set((cennik?.typy_eventu || []).map((t) => t.id));
  const dni = new Set((cennik?.dni || []).map((d) => d.id));

  if (!typy.has(typ)) return { ok: false, error: "Wybierz rodzaj wydarzenia." };
  if (!Number.isFinite(osoby) || osoby < 1 || osoby > 2000) {
    return { ok: false, error: "Podaj liczbę osób." };
  }
  if (!dni.has(dzien)) return { ok: false, error: "Wybierz dzień tygodnia." };
  if (!Number.isFinite(miesiac) || miesiac < 1 || miesiac > 12) {
    return { ok: false, error: "Wybierz miesiąc." };
  }
  if (!Number.isFinite(budzet) || budzet <= 0 || budzet > 1_000_000_000) {
    return { ok: false, error: "Podaj budżet w złotych." };
  }

  const przestrzenId = wybierzPrzestrzen(typ, osoby, miesiac, heur);
  const przestrzen = znajdz(cennik.wynajem, przestrzenId);
  const cenaPrzestrzeni = kwota(przestrzen);
  const catMin = kwota(znajdz(cennik.catering, heur.catering_min));
  const catKom = kwota(znajdz(cennik.catering, heur.catering_komfort));
  const barMin = kwota(znajdz(cennik.open_bar, heur.bar_min));
  const barKom = kwota(znajdz(cennik.open_bar, heur.bar_komfort));

  if ([cenaPrzestrzeni, catMin, catKom, barMin, barKom].some((n) => n == null)) {
    return { ok: false, error: "Brakuje cen w konfiguracji. Uzupełnij cennik w CMS." };
  }

  let min = cenaPrzestrzeni + osoby * (catMin + barMin);
  let komfort = cenaPrzestrzeni + osoby * (catKom + barKom);
  const sezon = (heur.miesiace_sezonu || []).map(Number).includes(miesiac);
  const weekend = (heur.dni_weekendu || []).includes(dzien);
  const wsp = sezon || weekend ? Number(heur.wspolczynnik_terminu) || 1 : 1;
  min *= wsp;
  komfort *= wsp;

  const progA = Number(heur.prog_a) || 1;
  const progB = Number(heur.prog_b) || 1;
  let kod = "C";
  if (budzet >= komfort * progA) kod = "A";
  else if (budzet >= min * progB) kod = "B";

  const wynik = cennik?.wyniki?.[kod];
  if (!wynik?.tytul || !wynik?.tresc) {
    return { ok: false, error: "Brakuje treści odpowiedzi w CMS." };
  }

  return {
    ok: true,
    kod,
    tytul: wynik.tytul,
    tresc: wynik.tresc,
    przestrzen: przestrzen?.dopisek || przestrzen?.nazwa || przestrzenId,
  };
}
