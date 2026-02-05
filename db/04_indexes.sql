CREATE INDEX idx_loans_active_due ON loans(due_at) 
WHERE returned_at IS NULL;


CREATE INDEX idx_fines_paid_status ON fines(paid_at);


CREATE INDEX idx_copies_status ON copies(status);


CREATE INDEX idx_loans_member_id ON loans(member_id);
CREATE INDEX idx_loans_copy_id ON loans(copy_id);
CREATE INDEX idx_copies_book_id ON copies(book_id);