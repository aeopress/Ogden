import { z } from 'zod';

export const CATEGORIES = [
  'operations',
  'general_things',
  'picturable_things',
  'qualities_general',
  'qualities_opposites',
] as const;

export const CategorySchema = z.enum(CATEGORIES);
export type Category = z.infer<typeof CategorySchema>;

export const CATEGORY_META: Record<
  Category,
  { label_en: string; label_zh: string; expected: number }
> = {
  operations: { label_en: 'Operations', label_zh: '功能詞', expected: 100 },
  general_things: { label_en: 'General Things', label_zh: '一般名詞', expected: 400 },
  picturable_things: { label_en: 'Picturable Things', label_zh: '具象名詞', expected: 200 },
  qualities_general: { label_en: 'Qualities', label_zh: '形容詞', expected: 100 },
  qualities_opposites: { label_en: 'Opposites', label_zh: '反義詞', expected: 50 },
};

export const WordSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9_]*$/, 'id must be lowercase slug'),
  headword: z.string().min(1),
  spelling_uk: z.string().min(1),
  spelling_us: z.string().min(1),
  category: CategorySchema,
  is_18_operators: z.boolean(),
  definition_en: z.string(),
  gloss_zh_tw: z.string(),
  example_en: z.string(),
  example_zh_tw: z.string(),
  synonyms: z.array(z.string()),
  notes: z.string().optional(),
});

export type Word = z.infer<typeof WordSchema>;

export const SeedWordSchema = WordSchema.pick({
  id: true,
  headword: true,
  spelling_uk: true,
  spelling_us: true,
  category: true,
  is_18_operators: true,
});

export type SeedWord = z.infer<typeof SeedWordSchema>;
