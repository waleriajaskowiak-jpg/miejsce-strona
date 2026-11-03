export const NAV = [
  { href: "/przestrzenie/", label: "Przestrzenie" },
  { href: "/eventy/", label: "Eventy" },
  { href: "/ceny/", label: "Ceny" },
  { href: "/jedzenie-i-bar/", label: "Jedzenie i bar" },
  { href: "/realizacje/", label: "Realizacje" },
  { href: "/warto-wiedziec/", label: "Warto wiedzieć" },
  { href: "/poradnik/", label: "Poradnik" },
  { href: "/kontakt/", label: "Kontakt" },
];

export function zloty(n) {
  return `${new Intl.NumberFormat("pl-PL").format(n)}\u00a0zł`;
}

export function sortByOrder(entries) {
  return [...entries].sort((a, b) => (a.data.kolejnosc ?? 0) - (b.data.kolejnosc ?? 0));
}

export function venueJsonLd(kontakt, opis) {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": "https://miejsce.to/#venue",
    name: "MIEJSCE",
    description: opis,
    url: "https://miejsce.to/",
    image: "https://miejsce.to/img/pdf/hero-main.jpg",
    telephone: kontakt.telefon_href,
    email: kontakt.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: kontakt.ulica,
      postalCode: kontakt.kod,
      addressLocality: kontakt.miasto,
      addressCountry: "PL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: kontakt.lat,
      longitude: kontakt.lon,
    },
    maximumAttendeeCapacity: 350,
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
