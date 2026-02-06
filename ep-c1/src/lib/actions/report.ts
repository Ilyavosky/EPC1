'use server';

import { query } from '@/lib/db/db';
import { 
  viralBookSchema, 
  overdueLoanSchema, 
  financeSchema, 
  memberActivitySchema, 
  inventoryHealthSchema,
  searchParamsSchema,
  overdueFilterSchema,
  dateRangeSchema
} from '@/lib/validations/schemas';
import { z } from 'zod';

export async function getViralBooks(input: z.infer<typeof searchParamsSchema>) {
  const params = searchParamsSchema.parse(input);
  const offset = (params.page - 1) * params.limit;

  let queryText = `SELECT * FROM vw_most_borrowed_books`;
  const queryParams: (string | number)[] = [params.limit, offset];
  
  if (params.search) {
    queryText += ` WHERE title ILIKE $3 OR author ILIKE $3`;
    queryParams.push(`%${params.search}%`);
  }

  queryText += ` ORDER BY global_rank ASC LIMIT $1 OFFSET $2`;

  try {
    const result = await query(queryText, queryParams);
    return z.array(viralBookSchema).parse(result.rows);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching viral books');
  }
}

export async function getOverdueLoans(input: z.infer<typeof overdueFilterSchema>) {
  const params = overdueFilterSchema.parse(input);
  const offset = (params.page - 1) * params.limit;

  let queryText = `SELECT * FROM vw_overdue_loans`;
  const queryParams: (string | number)[] = [params.limit, offset];
  const whereClauses: string[] = [];

  if (params.minDays) {
    whereClauses.push(`days_overdue >= $3`);
    queryParams.push(params.minDays);
  }

  if (whereClauses.length > 0) {
    queryText += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  queryText += ` ORDER BY days_overdue DESC LIMIT $1 OFFSET $2`;

  try {
    const result = await query(queryText, queryParams);
    return z.array(overdueLoanSchema).parse(result.rows);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching overdue loans');
  }
}

export async function getFinanceSummary(input?: z.infer<typeof dateRangeSchema>) {
  let queryText = `SELECT * FROM vw_fines_summary`;
  const queryParams: (string | number)[] = [];

  if (input?.startDate && input?.endDate) {
    queryText += ` WHERE month_year BETWEEN $1 AND $2`;
    queryParams.push(input.startDate.substring(0, 7));
    queryParams.push(input.endDate.substring(0, 7));
  }

  queryText += ` ORDER BY month_year DESC`;

  try {
    const result = await query(queryText, queryParams);
    return z.array(financeSchema).parse(result.rows);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching finance summary');
  }
}

export async function getMemberActivity() {
  try {
    const result = await query(
      'SELECT * FROM vw_member_activity ORDER BY delinquency_rate ASC LIMIT 100'
    );
    return z.array(memberActivitySchema).parse(result.rows);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching member activity');
  }
}

export async function getInventoryHealth() {
  try {
    const result = await query(
      'SELECT * FROM vw_inventory_health ORDER BY utilization_rate_pct DESC'
    );
    return z.array(inventoryHealthSchema).parse(result.rows);
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching inventory health');
  }
}