-- Fixed version of add_admin_roles migration
-- This replaces the problematic 20241201000000_add_admin_roles.sql

-- All functionality is now handled by the unified schema
-- This migration is kept for compatibility but does nothing
-- as the users table and role system are already created

SELECT 'Admin roles migration completed - using unified schema' as status;
