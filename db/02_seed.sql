INSERT INTO member_type (rank) VALUES 
('Estudiante'), 
('Profesor'), 
('Investigador');

INSERT INTO categories (name, description) VALUES 
('Tecnología', 'Desarrollo de software, bases de datos y sistemas'),
('Ciencia Ficción', 'Novelas futuristas, distopías y viajes espaciales'),
('Matemáticas', 'Cálculo diferencial, álgebra y estadística');


INSERT INTO members (name, email, member_type_id, joined_at) VALUES 
('Ana García', 'ana.garcia@uni.edu', 1, NOW() - INTERVAL '6 months'),
('Carlos López', 'carlos.lopez@uni.edu', 1, NOW() - INTERVAL '5 months'),
('Dra. Elena Ruiz', 'elena.ruiz@uni.edu', 2, NOW() - INTERVAL '1 year'),
('Miguel Torres', 'miguel.torres@uni.edu', 1, NOW() - INTERVAL '3 months'),
('Sofia Diaz', 'sofia.diaz@uni.edu', 3, NOW() - INTERVAL '1 month'),
('Roberto Null', 'roberto.null@uni.edu', 1, NOW() - INTERVAL '2 days');


INSERT INTO books (title, author, category_id, isbn) VALUES
('Clean Code', 'Robert C. Martin', 1, '9780132350884'),
('The Pragmatic Programmer', 'Andy Hunt', 1, '9780201616224'),
('Dune', 'Frank Herbert', 2, '9780441172719'),
('Calculus Early Transcendentals', 'James Stewart', 3, '9781285740621'),
('Design Patterns', 'Erich Gamma', 1, '9780201633610');


INSERT INTO copies (book_id, barcode, status) VALUES 
(1, 'CC-001', true),  
(1, 'CC-002', false), 
(1, 'CC-003', false); 


INSERT INTO copies (book_id, barcode, status) VALUES 
(3, 'DN-001', true),
(3, 'DN-002', true);

INSERT INTO copies (book_id, barcode, status) VALUES 
(4, 'MT-001', false);

INSERT INTO copies (book_id, barcode, status) VALUES 
(5, 'DP-001', true);

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(1, 1, NOW() - INTERVAL '60 days', NOW() - INTERVAL '53 days', NOW() - INTERVAL '55 days');

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(1, 2, NOW() - INTERVAL '40 days', NOW() - INTERVAL '33 days', NOW() - INTERVAL '30 days');

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(3, 3, NOW() - INTERVAL '2 days', NOW() + INTERVAL '5 days', NULL);

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(2, 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '3 days', NULL);

INSERT INTO loans (copy_id, member_id, loaned_at, due_at, returned_at) VALUES
(5, 4, NOW() - INTERVAL '30 days', NOW() - INTERVAL '23 days', NULL);

INSERT INTO fines (loan_id, amount, paid_at) VALUES
(2, 15.50, NOW() - INTERVAL '30 days');

INSERT INTO fines (loan_id, amount, paid_at) VALUES
(5, 50.00, NULL);