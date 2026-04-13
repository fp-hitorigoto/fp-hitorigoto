import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    category: z.enum([
      '税務・税制改正',
      '社会保険・年金',
      'NISA・iDeCo',
      '不動産・住宅',
      '金融機関の動向',
      'FP試験情報',
    ]),
    source: z.string(),
    sourceUrl: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    excerpt: z.string(),
  }),
});

export const collections = { articles };
