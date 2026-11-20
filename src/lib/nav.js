import { etykiety } from "./copy.js";

export const NAV = [
  { href: "/eventy/", label: "Wydarzenia" },
  { href: "/przestrzenie/", label: "Przestrzenie" },
  { href: "/ceny/", label: "Ceny" },
  { href: "/realizacje/", label: "Realizacje" },
  { href: "/poradnik/", label: "Poradnik" },
  { href: "/warto-wiedziec/", label: "Warto wiedzieć" },
];

export const FOOTER_PAGES = [
  { href: "/scenariusze/", label: "Scenariusze" },
  { href: "/jedzenie-i-bar/", label: "Jedzenie i bar" },
  { href: "/galeria/", label: "Galeria" },
  { href: "/warto-wiedziec/", label: "Warto wiedzieć" },
  { href: "/poradnik/", label: "Poradnik" },
  { href: "/mapa-strony/", label: "Mapa strony" },
  { href: "/kontakt/", label: "Kontakt" },
];

export function plNumber(n) {
  const value = Math.round(Number(n));
  if (!Number.isFinite(value)) return "";
  const sign = value < 0 ? "-" : "";
  return sign + String(Math.abs(value)).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

export function zloty(n) {
  return `${plNumber(n)}\u00A0zł`;
}

export function sortByOrder(entries) {
  return [...entries].sort((a, b) => (a.data.kolejnosc ?? 0) - (b.data.kolejnosc ?? 0));
}

export function venueJsonLd(kontakt, opis, fakty) {
  const adres = fakty?.adres || {};
  const venue = {
    "@type": ["LocalBusiness", "EventVenue"],
    "@id": "https://miejsce.to/#venue",
    name: "MIEJSCE",
    description: opis,
    url: "https://miejsce.to/",
    image: [new URL(etykiety.og_obraz, "https://miejsce.to").href],
    telephone: kontakt.telefon_href,
    email: kontakt.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: adres.ulica || kontakt.ulica,
      postalCode: adres.kod || kontakt.kod,
      addressLocality: adres.miasto || kontakt.miasto,
      addressCountry: "PL",
    },
    areaServed: "Warszawa",
    parentOrganization: { "@id": "https://miejsce.to/#org" },
  };
  const org = {
    "@type": "Organization",
    "@id": "https://miejsce.to/#org",
    name: "MIEJSCE",
    url: "https://miejsce.to/",
    logo: "https://miejsce.to/img/wordmark.png",
    email: kontakt.email,
    telephone: kontakt.telefon_href,
  };
  const sameAs = (fakty?.same_as || []).filter(Boolean);
  if (sameAs.length) org.sameAs = sameAs;
  return {
    "@context": "https://schema.org",
    "@graph": [org, venue],
  };
}

export function crumbsJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: new URL(item.href, "https://miejsce.to").href } : {}),
    })),
  };
}
