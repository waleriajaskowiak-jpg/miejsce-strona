import nawigacja from "../content/ustawienia/nawigacja.json";
import stopka from "../content/ustawienia/stopka.json";
import etykiety from "../content/ustawienia/etykiety.json";
import sekcje from "../content/ustawienia/strona-sekcje.json";
import podstrony from "../content/ustawienia/podstrony.json";

export function crumb(href) {
  if (href === "/") return etykiety.sciezka;
  const direct = {
    "/eventy/": nawigacja.wydarzenia,
    "/przestrzenie/": nawigacja.przestrzenie,
    "/ceny/": nawigacja.ceny,
    "/realizacje/": nawigacja.realizacje,
    "/kontakt/": nawigacja.kontakt,
  }[href];
  if (direct) return direct;
  const links = [...stopka.miejsce_linki, ...stopka.plan_linki, ...stopka.kontakt_linki];
  return links.find((item) => item.href === href)?.etykieta || href;
}

export { nawigacja, stopka, etykiety, sekcje, podstrony };
