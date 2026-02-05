'use server';

import { pool } from '@/lib/db/db';
import { 
  viralBookSchema, 
  overdueLoanSchema, 
  financeSchema, 
  memberActivitySchema, 
  inventoryHealthSchema 
} from '@/lib/validations/schemas';

import { z } from 'zod';

export async function getViralBooks() {
  try {
    const result = await pool.query(
      'SELECT * FROM vw_most_borrowed_books ORDER BY global_rank ASC LIMIT 50'
    );
    return z.array(viralBookSchema).parse(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener reporte de viralidad');
  }
}

export async function getOverdueLoans() {
  try {
    const result = await pool.query(
      'SELECT * FROM vw_overdue_loans ORDER BY days_overdue DESC'
    );
    return z.array(overdueLoanSchema).parse(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener reporte de morosidad');
  }
}

export async function getFinanceSummary() {
  try {
    const result = await pool.query(
      'SELECT * FROM vw_fines_summary ORDER BY month_year DESC'
    );
    return z.array(financeSchema).parse(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener reporte financiero');
  }
}

export async function getMemberActivity() {
  try {
    const result = await pool.query(
      'SELECT * FROM vw_member_activity ORDER BY delinquency_rate ASC'
    );
    return z.array(memberActivitySchema).parse(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener actividad de miembros');
  }
}

export async function getInventoryHealth() {
  try {
    const result = await pool.query(
      'SELECT * FROM vw_inventory_health ORDER BY utilization_rate_pct DESC'
    );
    return z.array(inventoryHealthSchema).parse(result.rows);
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Error al obtener salud de inventario');
  }
}