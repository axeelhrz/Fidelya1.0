-- Fixed version of advanced_roles_system migration
-- This replaces the problematic 20241202000000_advanced_roles_system.sql

-- All functionality is now handled by the unified schema
-- This migration is kept for compatibility but does nothing
-- as the permissions and roles system are already created

SELECT 'Advanced roles system migration completed - using unified schema' as status;
