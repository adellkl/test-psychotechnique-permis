-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create admin_logs table if it doesn't exist
-- This fixes the "Could not find the table 'public.admin_logs' in the schema cache" error
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID,
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_email ON public.admin_logs(admin_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON public.admin_logs(action);

-- Insert a test log entry to verify the table works
INSERT INTO public.admin_logs (admin_email, action, details) 
VALUES ('system@test.com', 'TABLE_CREATED', 'Admin logs table created successfully');

-- Verify the table was created successfully
SELECT 'admin_logs table created successfully' as status;
