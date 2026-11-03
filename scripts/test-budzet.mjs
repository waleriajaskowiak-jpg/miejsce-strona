import { readFileSync } from "node:fs";
import { ocen, wybierzPrzestrzen } from "../src/lib/budzet.js";

const cennik = JSON.parse(readFileSync(new URL("../src/content/ustawienia/cennik.json", import.meta.url), "utf8"));
let failed = 0;

function check(name, cond) {
  if (!cond) {
    failed += 1;
    console.error("FAIL", name);
  } else {
    console.log("ok", name);
  }
}

const przyklad = ocen({ typ: "firmowy", osoby: 80, dzien: "czw", miesiac: 6, budzet: 40000 }, cennik);
check("brief 80 os. / 40 000 / czerwiec → B", przyklad.ok && przyklad.kod === "B");
check("odpowiedź bez kwoty", przyklad.ok && !/\d/.test(przyklad.tytul) && !/39\s?723/.test(przyklad.tresc));

const luzno = ocen({ typ: "konferencja", osoby: 30, dzien: "wt", miesiac: 3, budzet: 80000 }, cennik);
check("mała konferencja z zapasem → A", luzno.ok && luzno.kod === "A");

const ciasno = ocen({ typ: "garden-party", osoby: 300, dzien: "sb", miesiac: 7, budzet: 20000 }, cennik);
check("duży garden party przy małym budżecie → C", ciasno.ok && ciasno.kod === "C");

check("pusta liczba osób", ocen({ typ: "firmowy", osoby: "", dzien: "pn", miesiac: 1, budzet: 10000 }, cennik).ok === false);

const heur = cennik.heurystyka;
check("konferencja 50 → nowe", wybierzPrzestrzen("konferencja", 50, 3, heur) === "nowe");
check("firmowy 80 → duze", wybierzPrzestrzen("firmowy", 80, 6, heur) === "duze");
check("garden party 150 → cale", wybierzPrzestrzen("garden-party", 150, 6, heur) === "cale");
check("200 osób → cale", wybierzPrzestrzen("integracja", 200, 1, heur) === "cale");

const drozej = structuredClone(cennik);
drozej.catering.find((p) => p.id === "podstawa").cena = 900;
drozej.catering.find((p) => p.id === "srodek").cena = 900;
const poZmianie = ocen({ typ: "firmowy", osoby: 80, dzien: "czw", miesiac: 6, budzet: 40000 }, drozej);
check("wyższa cena w CMS zmienia wynik na C", poZmianie.ok && poZmianie.kod === "C");

if (failed) {
  console.error(`${failed} testów nie przeszło`);
  process.exit(1);
}
console.log("wszystkie testy budżetu przeszły");
