# Evaluación Práctica C1. NextJS + BDA

**Alumno:** Ilya Cortés Ruiz  
**Matrícula:** 243710  
**Fecha:** 05/02/2026

## Cómo Usar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Ilyavosky/EPC1.git
```

### 2. Configurar Variables de Entorno

Cree un archivo `.env` en la raíz del proyecto junto con las credenciales envíadas a su correo electrónico:

### 3. Levantar el Proyecto

```bash
docker-compose up --build
```

### 4. Acceder al Dashboard

Abrir el navegador e ir a la dirección: `http://localhost:3000` o `http://localhost:3001/` dependiendo de si el puerto 3000 está en uso.

### 5. Detener y elminar el contendedor del Proyecto

```bash
docker-compose down -v
```

## Justificación de los Índices

### Índice 1: idx_loans_returned_at

**Tabla:** loans

**Columna:** returned_at

**Justificación:**
Este índice es crítico para filtrar préstamos activos (no devueltos). Se usa intensivamente en las vistas:

- vw_overdue_loans (View 2: Reporte de Morosos)
- vw_inventory_health (View 5: Salud de Inventario)

**Qué hace:**
Acelera las consultas que buscan `WHERE returned_at IS NULL`. Sin él, el sistema tendría que revisar todo el historial de préstamos.
**Verificación:**

```sql
EXPLAIN ANALYZE
SELECT * FROM loans
WHERE returned_at IS NULL;

```

Con el índice, utiliza un Index Scan filtrando inmediatamente solo los préstamos vigentes.

---

### Índice 2: idx_books_title

**Tabla:** books

**Columna:** title

**Justificación:**
Este índice optimiza la barra de búsqueda implementada en el Reporte 1.

**Qué hace:**
Permite que la búsqueda por texto parcial (`ILIKE`) sea eficiente.

**Verificación:**

```sql
EXPLAIN ANALYZE
SELECT * FROM books
WHERE title ILIKE '%Clean Code%';

```

Sin el índice, la base de datos debe leer cada título fila por fila para comparar el texto.

---

### Índice 3: idx_loans_member_id

**Tabla:** loans

**Columna:** member_id

**Justificación:**
Este índice optimiza los JOINs entre la tabla de miembros y su historial de préstamos. Usado en:

- vw_member_activity (View 4: Actividad de Miembros)
- vw_overdue_loans (View 2: Para traer el nombre del moroso)

**Qué hace:**
Reduce el uso de memoria al agrupar estadísticas por usuario (total de préstamos, devoluciones tardías).

**Verificación:**

```sql
EXPLAIN ANALYZE
SELECT m.name, COUNT(l.id)
FROM members m
JOIN loans l ON l.member_id = m.id
GROUP BY m.name;

```

Permite a PostgreSQL unir las tablas usando el índice en lugar de hacer un Join costoso sobre tablas completas.

---

## Seguridad Implementada

### Usuario de Aplicación (app_user)

La aplicación Next.js no se conecta como superusuario (postgres). En su lugar utiliza el rol `app_user`:

**Permisos configurados:**

- Solo puede hacer SELECT en las 5 vistas específicas (`vw_most_borrowed_books`, `vw_overdue_loans`, `vw_fines_summary`, `vw_member_activity`, `vw_inventory_health`).
- No puede leer directamente las tablas base (`members`, `loans`, `fines`).
- No puede realizar operaciones INSERT, UPDATE, DELETE ni alterar la estructura.

### Validación con Zod

**Reporte 1 (Libros Virales):**

- Valida que el parámetro `search` sea un string seguro.
- Valida que `page` sea un número entero positivo (mínimo 1).

**Reporte 2 (Filtro de Morosidad):**

- Valida que `minDays` (días de atraso) sea un número positivo, evitando números negativos que romperían la lógica de negocio.

**Reporte 3 (Finanzas):**

- Valida que `startDate` y `endDate` sean strings, previniendo el paso de objetos o arrays maliciosos a la consulta de fechas.

**Queries parametrizadas:**
En `src/lib/actions/report.ts`, todas las consultas utilizan marcadores de posición (`$1`, `$2`, `$3`) y la librería `pg` maneja el escape de los datos:

```typescript
queryText += ` WHERE title ILIKE $3 OR author ILIKE $3`;
```

Esto neutraliza cualquier intento de SQL Injection antes de que llegue a la base de datos.

## Referencias para la realización del trabajo

Carlson, B. (s.f.). Pool. node-postgres. https://node-postgres.com/apis/pool
Chauhan, H. (22 de octubre de 2024). Step-by-Step Guide to Building an Admin Dashboard with Next.js. DEV Community. https://dev.to/hitesh_developer/step-by-step-guide-to-building-an-admin-dashboard-with-nextjs-26e4
DataCamp. (10 de octubre de 2024). The Difference Between WHERE and HAVING in SQL. https://www.datacamp.com/tutorial/difference-between-where-and-having-clause-in-sql
NextJsTemplates. (s.f.). Next.js Dashboard Templates. https://nextjstemplates.com/dashboard
road24mil. (s.f.). The Essential Knowledge: N-Tier Architecture for Full-Stack JavaScript (Node.js) Engineers. Medium. https://medium.com/@road24mil/the-essential-knowledge-n-tier-architecture-for-full-stack-javascript-node-js-engineers-54cdab0adc7e
Saffron Tech. (s.f.). How to Connect Next.js with PostgreSQL. https://www.saffrontech.net/blog/how-to-connect-nextjs-with-postgres-sql
The PostgreSQL Global Development Group. (s.f.). 3.8. Views. PostgreSQL Documentation. https://www.postgresql.org/docs/current/tutorial-views.html
Vercel. (s.f.). Project Structure. Next.js Documentation. https://nextjs.org/docs/app/getting-started/project-structure
W3Schools. (s.f.). SQL CREATE VIEW Statement. https://www.w3schools.com/sql/sql_view.asp
