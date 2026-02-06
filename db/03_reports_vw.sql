
-- REPORTE 1: libros mas prestados
-- Usa: Window + Function (RANK), COUNT
-- Busca: Identificar qué libros dominan cada categoría.
CREATE OR REPLACE VIEW vw_most_borrowed_books AS
SELECT 
    b.id AS book_id,
    b.title,
    b.author,
    c.name AS category_name,
    COUNT(l.id)::INTEGER AS total_loans,
    RANK() OVER (PARTITION BY c.name ORDER BY COUNT(l.id) DESC)::INTEGER AS category_rank,
    DENSE_RANK() OVER (ORDER BY COUNT(l.id) DESC)::INTEGER AS global_rank
FROM books b
JOIN categories c ON b.category_id = c.id
JOIN copies cp ON b.id = cp.book_id
LEFT JOIN loans l ON cp.id = l.copy_id
GROUP BY b.id, b.title, b.author, c.name;

-- VERIFY: SELECT * FROM vw_most_borrowed_books WHERE category_rank <= 3;   



-- REPORTE 2: Prestamos vencidos
-- Usa: CTE (Common Table Expression), CASE
-- Busca: Identificar demora de devolución activa y calcular el riesgo de pérdida por libros no devueltos

CREATE OR REPLACE VIEW vw_overdue_loans AS
WITH ActiveOverdue AS (
    SELECT 
        l.id AS loan_id,
        m.name AS member_name,
        m.email,
        b.title AS book_title,
        l.due_at,
        EXTRACT(DAY FROM (NOW() - l.due_at))::INTEGER AS days_overdue
    FROM loans l
    JOIN members m ON l.member_id = m.id
    JOIN copies cp ON l.copy_id = cp.id
    JOIN books b ON cp.book_id = b.id
    WHERE l.returned_at IS NULL AND l.due_at < NOW()
)
SELECT 
    loan_id,
    member_name,
    email,
    book_title,
    due_at,
    days_overdue,
    CASE 
        WHEN days_overdue <= 7 THEN 'Riesgo Bajo'
        WHEN days_overdue <= 30 THEN 'Riesgo Medio'
        ELSE 'Riesgo Alto / Pérdida Probable'
    END AS risk_level,
    (days_overdue * 0.50) AS estimated_fine
FROM ActiveOverdue;

-- VERIFY: SELECT * FROM vw_overdue_loans WHERE risk_level = 'Riesgo Alto / Pérdida Probable';


-- REPORTE 3: Eficiencia de Recaudación (Finanzas)
-- Usa: HAVING, Agregación condicional
-- Busca: Verificar cuánto dinero se ganó este mes y cuánto realmente se cobró

CREATE OR REPLACE VIEW vw_fines_summary AS
SELECT 
    TO_CHAR(l.loaned_at, 'YYYY-MM') AS month_year,
    COUNT(f.id) AS total_fines_issued,
    SUM(f.amount) AS total_amount_generated,
    SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) AS total_collected,
    SUM(CASE WHEN f.paid_at IS NULL THEN f.amount ELSE 0 END) AS outstanding_debt,
    ROUND(
        (SUM(CASE WHEN f.paid_at IS NOT NULL THEN f.amount ELSE 0 END) / NULLIF(SUM(f.amount), 0)) * 100, 
    2) AS collection_rate_pct
FROM fines f
JOIN loans l ON f.loan_id = l.id
GROUP BY TO_CHAR(l.loaned_at, 'YYYY-MM')
HAVING SUM(f.amount) > 0;

-- VERIFY: SELECT * FROM vw_fines_summary ORDER BY month_year DESC;


-- REPORTE 4: Actividad de los miembros
-- Usa: HAVING, CASE, COALESCE
-- Busca: Distinguir usuarios que si retornen los libros a tiempo, de los que no lo hacen

CREATE OR REPLACE VIEW vw_member_activity AS
SELECT 
    m.id AS member_id,
    m.name,
    m.email,
    mt.rank AS member_type,
    COUNT(l.id) AS total_loans,
    COALESCE(MAX(l.loaned_at), '1970-01-01') AS last_loan_date,
    SUM(CASE WHEN l.returned_at > l.due_at THEN 1 ELSE 0 END) AS late_returns,
    ROUND(
        (SUM(CASE WHEN l.returned_at > l.due_at THEN 1 ELSE 0 END)::DECIMAL / NULLIF(COUNT(l.id), 0)) * 100,
    2) AS delinquency_rate,
    CASE 
        WHEN COUNT(l.id) > 5 AND SUM(CASE WHEN l.returned_at > l.due_at THEN 1 ELSE 0 END) = 0 THEN 'Estrella'
        WHEN SUM(CASE WHEN l.returned_at > l.due_at THEN 1 ELSE 0 END) > 2 THEN 'Riesgoso'
        ELSE 'Regular'
    END AS member_status
FROM members m
JOIN member_type mt ON m.member_type_id = mt.id
LEFT JOIN loans l ON m.id = l.member_id
GROUP BY m.id, m.name, m.email, mt.rank
HAVING COUNT(l.id) > 0;

-- VERIFY: SELECT * FROM vw_member_activity WHERE member_status = 'Riesgoso';


-- REPORTE 5: Salud del Inventario (Rotación)
-- Usa: CASE, COALESCE
-- Busca: Es un reporte de Eficiencia de Activos
CREATE OR REPLACE VIEW vw_inventory_health AS
SELECT 
    c.name AS category,
    COUNT(cp.id) AS total_copies,
    SUM(CASE WHEN cp.status = TRUE THEN 1 ELSE 0 END) AS in_shelf,
    SUM(CASE WHEN cp.status = FALSE THEN 1 ELSE 0 END) AS checked_out,
    ROUND(
        (SUM(CASE WHEN cp.status = FALSE THEN 1 ELSE 0 END)::DECIMAL / COUNT(cp.id)) * 100,
    2) AS utilization_rate_pct,
    COALESCE(
        STRING_AGG(DISTINCT b.title, ', ') FILTER (WHERE cp.status = FALSE), 
        'Ninguno'
    ) AS currently_borrowed_titles_sample
FROM copies cp
JOIN books b ON cp.book_id = b.id
JOIN categories c ON b.category_id = c.id
GROUP BY c.name;

-- VERIFY: SELECT * FROM vw_inventory_health;