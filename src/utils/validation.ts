import { z } from 'zod';

function isValidDateInput(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const parsedDate = new Date(year, month - 1, day);

  return (
    parsedDate.getFullYear() === year &&
    parsedDate.getMonth() === month - 1 &&
    parsedDate.getDate() === day
  );
}

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Please enter your email.')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Please enter your password.'),
});

export const signupSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Please enter your full name.')
      .min(2, 'Enter your full name.'),
    email: z
      .string()
      .trim()
      .min(1, 'Please enter your email.')
      .email('Enter a valid email address'),
    password: z
      .string()
      .min(6, 'Use at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must match.',
    path: ['confirmPassword'],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;

export const transactionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Please enter a title.'),
  amount: z
    .string()
    .trim()
    .min(1, 'Please enter an amount.')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) > 0, {
      message: 'Enter a valid amount greater than 0.',
    }),
  category: z
    .string()
    .trim()
    .min(1, 'Please choose a category.'),
  type: z.enum(['income', 'expense'], {
    error: 'Please choose a transaction type.',
  }),
  date: z
    .string()
    .trim()
    .min(1, 'Please enter a date.')
    .refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Use the YYYY-MM-DD format.',
    })
    .refine((value) => isValidDateInput(value), {
      message: 'Enter a valid calendar date.',
    }),
  notes: z.string().trim().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionSchema>;
