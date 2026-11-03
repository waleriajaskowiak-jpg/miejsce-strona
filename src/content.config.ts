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

const eventy = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/eventy" }),
  schema: z.object({
    title: z.string(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    tag: z.string(),
    lead: z.string(),
    opis_seo: z.string(),
    przestrzen: z.string(),
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

const realizacje = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/realizacje" }),
  schema: z.object({
    title: z.string(),
    adres_url: z.string(),
    kolejnosc: z.number(),
    szkic: z.boolean().default(true),
    typ: z.string(),
    meta: z.string(),
    lead: z.string(),
    opis_seo: z.string(),
    przestrzenie: z.string(),
    jedzenie: z.string(),
    bar: z.string(),
    atrakcje: z.string(),
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
  }),
});

const ustawienia = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/ustawienia" }),
});

export const collections = {
  przestrzenie,
  eventy,
  realizacje,
  artykuly,
  faq,
  ustawienia,
};
