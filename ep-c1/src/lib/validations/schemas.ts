import { z } from 'zod';

export const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const overdueFilterSchema = searchParamsSchema.extend({
  minDays: z.coerce.number().min(0).optional(),
});

export const dateRangeSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const viralBookSchema = z.object({
  book_id: z.number(),
  title: z.string(),
  author: z.string(),
  category_name: z.string(),
  total_loans: z.number(),
  category_rank: z.number(),
  global_rank: z.number(),
});

export const overdueLoanSchema = z.object({
  loan_id: z.number(),
  member_name: z.string(),
  email: z.string().email(),
  book_title: z.string(),
  due_at: z.date(),
  days_overdue: z.number(),
  risk_level: z.string(),
  estimated_fine: z.string().transform((val) => parseFloat(val)),
});

export const financeSchema = z.object({
  month_year: z.string(),
  total_fines_issued: z.string().transform(Number),
  total_amount_generated: z.string().transform((val) => parseFloat(val)),
  total_collected: z.string().transform((val) => parseFloat(val)),
  outstanding_debt: z.string().transform((val) => parseFloat(val)),
  collection_rate_pct: z.string().transform((val) => parseFloat(val)),
});

export const memberActivitySchema = z.object({
  member_id: z.number(),
  name: z.string(),
  email: z.string(),
  member_type: z.string(),
  total_loans: z.string().transform(Number),
  last_loan_date: z.date(),
  late_returns: z.string().transform(Number),
  delinquency_rate: z.string().transform((val) => parseFloat(val)),
  member_status: z.string(),
});

export const inventoryHealthSchema = z.object({
  category: z.string(),
  total_copies: z.string().transform(Number),
  in_shelf: z.string().transform(Number),
  checked_out: z.string().transform(Number),
  utilization_rate_pct: z.string().transform((val) => parseFloat(val)),
  currently_borrowed_titles_sample: z.string(),
});