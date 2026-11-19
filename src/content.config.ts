import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const przestrzenie = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/przestrzenie" }),
  schema: z.object({
    title: z.string(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    lead: z.string(),
    meta: z.string(),
    opis_seo: z.string(),
    cena_od: z.number().optional(),
    cena_etykieta: z.string().optional(),
    najlepiej: z.array(z.string()),
    w_skrocie: z.array(z.string()),
    cover: z.string(),
    zdjecia: z.array(z.string()),
  }),
});

const scenariusze = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/scenariusze" }),
  schema: z.object({
    title: z.string(),
    h1: z.string().optional(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    szkic: z.boolean().default(false),
    tag: z.string(),
    lead: z.string(),
    opis_seo: z.string(),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    przestrzen: z.string(),
    kategorie: z.array(z.string()).default([]),
    goscie: z.number().optional(),
    typ_budzetu: z.string().optional(),
    program: z.array(
      z.object({
        godzina: z.string(),
        tytul: z.string(),
        opis: z.string(),
      }),
    ),
    zakres: z.array(z.string()),
    cover: z.string(),
    zdjecia: z.array(z.string()),
  }),
});

const kategorie = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/kategorie" }),
  schema: z.object({
    title: z.string(),
    nav_label: z.string(),
    kolejnosc: z.number(),
    szkic: z.boolean().default(true),
    seo_title: z.string(),
    seo_description: z.string(),
    lead: z.string(),
    cta: z.string(),
    kolor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    kolor_tekst: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    tagi: z.array(z.string()),
    co_mozna: z.array(z.string()),
    formaty: z.array(z.object({
      tytul: z.string(),
      opis: z.string(),
      zdjecie: z.string(),
      rodzaj: z.string().optional(),
      fakty: z.array(z.object({
        ikona: z.string(),
        tekst: z.string(),
      })).min(3).max(4),
    })).min(1),
    dla_ilu: z.string(),
    przestrzenie: z.array(z.string()),
    scenariusze: z.array(z.string()),
    jedzenie_bar: z.string(),
    atrakcje: z.string(),
    plan_b: z.string(),
    fakty: z.array(z.object({ wartosc: z.string(), opis: z.string(), liczba: z.number().optional() })),
    korzysci: z.array(z.object({ tytul: z.string(), opis: z.string() })),
    cover: z.string(),
    zdjecia: z.array(z.string()).default([]),
    do_uzupelnienia: z.string().optional(),
  }),
});

const realizacje = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/realizacje" }),
  schema: z.object({
    title: z.string(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    szkic: z.boolean().default(true),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    zaktualizowano: z.string().optional(),
    wyzwanie: z.string().optional(),
    rozwiazanie: z.string().optional(),
    przebieg: z.string().optional(),
    efekt: z.string().optional(),
    kategoria: z.string().optional(),
    typ: z.string(),
    meta: z.string(),
    lead: z.string(),
    opis_seo: z.string(),
    przestrzenie: z.string(),
    jedzenie: z.string(),
    bar: z.string(),
    atrakcje: z.string(),
    goscie: z.number().optional(),
    zakres: z.string().optional(),
    cover: z.string(),
    zdjecia: z.array(z.string()),
  }),
});

const artykuly = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/poradnik" }),
  schema: z.object({
    title: z.string(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    szkic: z.boolean().default(true),
    seo_title: z.string().optional(),
    seo_description: z.string().optional(),
    zaktualizowano: z.string().optional(),
    autor: z.string().optional(),
    opis: z.string(),
    opis_seo: z.string(),
  }),
});

const faq = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/faq" }),
  schema: z.object({
    pytanie: z.string(),
    kolejnosc: z.number(),
    adres_url: z.string(),
    temat: z.string().optional(),
    kategoria: z.string().optional(),
  }),
});

const ustawienia = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/ustawienia" }),
});

export const collections = {
  przestrzenie,
  scenariusze,
  kategorie,
  realizacje,
  artykuly,
  faq,
  ustawienia,
};
