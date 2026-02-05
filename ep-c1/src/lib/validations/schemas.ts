import { z } from 'zod';

export const viralBookSchema = z.object({
  book_id: z.number(),
  title: z.string(),
  author: z.string(),
  category_name: z.string(),
  total_loans: z.coerce.number(),
  category_rank: z.coerce.number(),
  global_rank: z.coerce.number(),
});

export const overdueLoanSchema = z.object({
  loan_id: z.number(),
  member_name: z.string(),
  email: z.string().email(),
  book_title: z.string(),
  due_at: z.string(),
  days_overdue: z.number(),
  risk_level: z.string(),
  estimated_fine: z.string(),
});

export const financeSchema = z.object({
  month_year: z.string(),
  total_fines_issued: z.coerce.number(),
  total_amount_generated: z.string(),
  total_collected: z.string(),
  outstanding_debt: z.string(),
  collection_rate_pct: z.string().nullable(),
});

export const memberActivitySchema = z.object({
  member_id: z.number(),
  name: z.string(),
  email: z.string().email(),
  member_type: z.string(),
  total_loans: z.coerce.number(),
  last_loan_date: z.string(),
  late_returns: z.coerce.number(),
  delinquency_rate: z.string().nullable(),
  member_status: z.string(),
});

export const inventoryHealthSchema = z.object({
  category: z.string(),
  total_copies: z.coerce.number(),
  in_shelf: z.coerce.number(),
  checked_out: z.coerce.number(),
  utilization_rate_pct: z.string(),
  currently_borrowed_titles_sample: z.string(),
});