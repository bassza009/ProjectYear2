-- Add reviewer_id and review_image columns to service_reviews table
ALTER TABLE service_reviews 
ADD COLUMN reviewer_id INT AFTER review_id,
ADD COLUMN review_image VARCHAR(255) AFTER comment;

-- Optional: Add foreign key constraint
-- ALTER TABLE service_reviews 
-- ADD CONSTRAINT fk_reviewer 
-- FOREIGN KEY (reviewer_id) REFERENCES userdata(ID);
