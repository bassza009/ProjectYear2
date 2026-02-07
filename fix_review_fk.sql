-- Fix service_reviews table for student review system
-- Problem: order_id has FK to student_orders, but we want to store student ID instead

-- Option 1: Drop the foreign key constraint (recommended for this use case)
ALTER TABLE service_reviews 
DROP FOREIGN KEY fk_review_order;

-- Option 2: Add a new column for student_id and use that instead (alternative)
-- ALTER TABLE service_reviews 
-- ADD COLUMN student_id INT AFTER reviewer_id;

-- Verify the change
DESCRIBE service_reviews;
