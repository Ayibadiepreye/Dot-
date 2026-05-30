-- Add hasPaid field to users table
ALTER TABLE `users` ADD COLUMN `has_paid` boolean DEFAULT false AFTER `email_verified`;
