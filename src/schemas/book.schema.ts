import { z } from 'zod';

const currentYear = new Date().getFullYear();

const validYear = (val: string) => {
  if (val === '') return true;
  const n = parseInt(val, 10);
  return !isNaN(n) && n >= 1450 && n <= currentYear;
};

export const bookSchema = z.object({
  title: z.string().min(1, 'createBook.validation.titleRequired'),
  author: z.string().min(1, 'createBook.validation.authorRequired'),
  publishedYear: z.string().refine(validYear, {
    message: 'createBook.validation.yearInvalid',
  }),
});

export type BookFormData = z.infer<typeof bookSchema>;
