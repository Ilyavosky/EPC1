-- Limpiar datos existentes y reiniciar contadores de ID
TRUNCATE TABLE fines, loans, copies, books, members, categories, member_type RESTART IDENTITY CASCADE;

-- 1. Tipos de Miembro
INSERT INTO member_type (rank) VALUES 
('Estudiante'), ('Profesor'), ('Investigador'), ('Externo');

-- 2. Categorías
INSERT INTO categories (name, description) VALUES 
('Frontend', 'Libros sobre desarrollo de interfaces y UX'),
('Backend', 'Arquitectura de servidores, APIs y bases de datos'),
('DevOps', 'Infraestructura, CI/CD y nubes'),
('Soft Skills', 'Liderazgo, gestión de tiempo y comunicación'),
('Database', 'Optimización, modelado y SQL avanzado'),
('Security', 'Ciberseguridad y hacking ético');

-- 3. Miembros (50 usuarios generados)
INSERT INTO members (name, email, member_type_id, joined_at)
SELECT 
    'Usuario ' || i, 
    'user' || i || '@university.edu',
    (FLOOR(RANDOM() * 4) + 1)::INT, -- Tipo aleatorio 1-4
    NOW() - (FLOOR(RANDOM() * 365) || ' days')::INTERVAL -- Se unió hace hasta 1 año
FROM generate_series(1, 50) AS i;

-- Actualizar algunos nombres para que los reconozcas en el Dashboard
UPDATE members SET name = 'Ilya Vosk', email = 'ilya@dev.com', member_type_id = 2 WHERE id = 1;
UPDATE members SET name = 'Juan Pérez', email = 'juan.perez@test.com' WHERE id = 2;
UPDATE members SET name = 'Maria Morosa', email = 'maria.deuda@test.com' WHERE id = 3; -- Esta tendrá multas

-- 4. Libros (20 Títulos variados con autores únicos para respetar tu constraint)
INSERT INTO books (title, author, category_id, isbn) VALUES
('Clean Code', 'Robert C. Martin', 4, '9780132350884'),
('The Pragmatic Programmer', 'Andrew Hunt', 4, '9780201616224'),
('Pro Git', 'Scott Chacon', 3, '9781484200773'),
('React Up and Running', 'Stoyan Stefanov', 1, '9781491931820'),
('Designing Data-Intensive Applications', 'Martin Kleppmann', 2, '9781449373320'),
('You Dont Know JS', 'Kyle Simpson', 1, '9781491904244'),
('Refactoring', 'Martin Fowler', 4, '9780201485677'),
('Docker Deep Dive', 'Nigel Poulton', 3, '9781521822807'),
('PostgreSQL: Up and Running', 'Regina O. Obe', 5, '9781491963418'),
('Modern Operating Systems', 'Andrew S. Tanenbaum', 2, '9780133591620'),
('Introduction to Algorithms', 'Thomas H. Cormen', 2, '9780262033848'),
('The Mythical Man-Month', 'Fred Brooks', 4, '9780201835953'),
('Learning SQL', 'Alan Beaulieu', 5, '9780596520830'),
('Pattern Recognition and Machine Learning', 'Christopher Bishop', 2, '9780387310732'),
('Cracking the Coding Interview', 'Gayle Laakmann', 4, '9780984782857'),
('Kubernetes: Up and Running', 'Kelsey Hightower', 3, '9781491935675'),
('Hacking: The Art of Exploitation', 'Jon Erickson', 6, '9781593271442'),
('Eloquent JavaScript', 'Marijn Haverbeke', 1, '9781593279509'),
('Site Reliability Engineering', 'Betsy Beyer', 3, '9781491929124'),
('Head First Design Patterns', 'Eric Freeman', 2, '9780596007126');

-- 5. Copias (5 copias por libro = 100 copias físicas en total)
INSERT INTO copies (book_id, barcode, status)
SELECT 
    b.id,
    'LIB-' || b.id || '-' || i,
    TRUE
FROM books b
CROSS JOIN generate_series(1, 5) AS i;

-- 6. Generador de Préstamos (La Magia)
-- Esto crea 300 transacciones con lógica de negocio real
DO $$
DECLARE
    r_member RECORD;
    r_copy RECORD;
    v_loan_id INT;
    v_loaned_at TIMESTAMP;
    v_due_at TIMESTAMP;
    v_returned_at TIMESTAMP;
    v_is_returned BOOLEAN;
BEGIN
    FOR i IN 1..300 LOOP
        -- Seleccionar miembro y copia al azar
        SELECT * FROM members ORDER BY RANDOM() LIMIT 1 INTO r_member;
        SELECT * FROM copies ORDER BY RANDOM() LIMIT 1 INTO r_copy;
        
        -- Fecha préstamo: aleatoria en los últimos 4 meses
        v_loaned_at := NOW() - (FLOOR(RANDOM() * 120) || ' days')::INTERVAL;
        -- Vencimiento: 14 días después
        v_due_at := v_loaned_at + INTERVAL '14 days';
        
        -- Decidir si el libro ya fue devuelto (80% sí, 20% sigue prestado)
        v_is_returned := (RANDOM() < 0.8);
        
        IF v_is_returned THEN
            -- Caso: Devuelto. ¿A tiempo o Tarde? (30% tarde)
            IF (RANDOM() < 0.7) THEN
                v_returned_at := v_loaned_at + (FLOOR(RANDOM() * 13) || ' days')::INTERVAL; -- A tiempo
            ELSE
                v_returned_at := v_due_at + (FLOOR(RANDOM() * 10) || ' days')::INTERVAL; -- Tarde
                
                -- Crear Préstamo Tarde
                INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at)
                VALUES (r_copy.id, r_member.id, v_loaned_at, v_due_at, v_returned_at)
                RETURNING id INTO v_loan_id;
                
                -- Crear Multa (algunas pagadas, otras no)
                INSERT INTO fines (loan_id, amount, paid_at)
                VALUES (v_loan_id, 5.00, CASE WHEN RANDOM() < 0.8 THEN NOW() ELSE NULL END);
                
                CONTINUE; -- Siguiente iteración
            END IF;
            
            -- Insertar préstamo normal a tiempo
            INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at)
            VALUES (r_copy.id, r_member.id, v_loaned_at, v_due_at, v_returned_at);
            
        ELSE
            -- Caso: Activo (No devuelto)
            INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at)
            VALUES (r_copy.id, r_member.id, v_loaned_at, v_due_at, NULL);
            
            -- Marcar copia como prestada (status = FALSE)
            UPDATE copies SET status = FALSE WHERE id = r_copy.id;
        END IF;
    END LOOP;
END $$;