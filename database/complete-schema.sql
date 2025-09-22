-- Complete Supabase Database Schema for CitiZen Application
-- Run this in Supabase SQL Editor

-- =============================================
-- STEP 1: Enable Required Extensions
-- =============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for geospatial features
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable statistics for performance monitoring
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- =============================================
-- STEP 2: Create Custom Types
-- =============================================

-- Issue status enum
CREATE TYPE issue_status AS ENUM (
    'open',
    'in_progress', 
    'resolved',
    'closed'
);

-- Issue priority enum
CREATE TYPE issue_priority AS ENUM (
    'low',
    'medium', 
    'high',
    'urgent'
);

-- Issue category enum
CREATE TYPE issue_category AS ENUM (
    'infrastructure',
    'sanitation',
    'transportation',
    'safety',
    'environment',
    'utilities',
    'other'
);

-- User role enum
CREATE TYPE user_role AS ENUM (
    'citizen',
    'worker',
    'admin',
    'department_head'
);

-- Vote type enum
CREATE TYPE vote_type AS ENUM (
    'upvote',
    'downvote'
);

-- Notification type enum
CREATE TYPE notification_type AS ENUM (
    'issue_created',
    'issue_updated',
    'issue_resolved',
    'comment_added',
    'vote_received',
    'assignment_received',
    'reminder',
    'system'
);

-- =============================================
-- STEP 3: Create Tables
-- =============================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    role user_role DEFAULT 'citizen',
    department_id UUID,
    is_verified BOOLEAN DEFAULT false,
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    ward_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Departments table
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    head_user_id UUID REFERENCES public.users(id),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    address TEXT,
    location GEOGRAPHY(POINT, 4326),
    coverage_area GEOGRAPHY(POLYGON, 4326),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key for department in users table
ALTER TABLE public.users 
ADD CONSTRAINT fk_users_department 
FOREIGN KEY (department_id) REFERENCES public.departments(id);

-- Issues table
CREATE TABLE public.issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category issue_category NOT NULL,
    priority issue_priority DEFAULT 'medium',
    status issue_status DEFAULT 'open',
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.users(id),
    department_id UUID REFERENCES public.departments(id),
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    address TEXT NOT NULL,
    ward_number INTEGER,
    image_urls TEXT[],
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT false,
    verified_by UUID REFERENCES public.users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue comments table
CREATE TABLE public.issue_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_official BOOLEAN DEFAULT false,
    parent_comment_id UUID REFERENCES public.issue_comments(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue votes table
CREATE TABLE public.issue_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vote_type vote_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(issue_id, user_id)
);

-- Workers table
CREATE TABLE public.workers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES public.departments(id),
    employee_id VARCHAR(50) UNIQUE,
    designation VARCHAR(255),
    specializations TEXT[],
    is_available BOOLEAN DEFAULT true,
    current_location GEOGRAPHY(POINT, 4326),
    service_area GEOGRAPHY(POLYGON, 4326),
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_assignments INTEGER DEFAULT 0,
    completed_assignments INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Issue assignments table
CREATE TABLE public.issue_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    issue_id UUID NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
    worker_id UUID NOT NULL REFERENCES public.workers(id),
    assigned_by UUID NOT NULL REFERENCES public.users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    is_active BOOLEAN DEFAULT true
);

-- Notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type notification_type NOT NULL,
    related_issue_id UUID REFERENCES public.issues(id),
    related_user_id UUID REFERENCES public.users(id),
    is_read BOOLEAN DEFAULT false,
    is_sent BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL,
    user_id UUID REFERENCES public.users(id),
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ward boundaries table (for Mumbai wards)
CREATE TABLE public.ward_boundaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ward_number INTEGER UNIQUE NOT NULL,
    ward_name VARCHAR(255) NOT NULL,
    boundary GEOGRAPHY(POLYGON, 4326) NOT NULL,
    area_sq_km DECIMAL(10,2),
    population INTEGER,
    administrative_office_location GEOGRAPHY(POINT, 4326),
    contact_details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- STEP 4: Create Indexes for Performance
-- =============================================

-- Spatial indexes
CREATE INDEX idx_users_location ON public.users USING GIST (location);
CREATE INDEX idx_issues_location ON public.issues USING GIST (location);
CREATE INDEX idx_departments_location ON public.departments USING GIST (location);
CREATE INDEX idx_departments_coverage ON public.departments USING GIST (coverage_area);
CREATE INDEX idx_workers_current_location ON public.workers USING GIST (current_location);
CREATE INDEX idx_workers_service_area ON public.workers USING GIST (service_area);
CREATE INDEX idx_ward_boundaries_boundary ON public.ward_boundaries USING GIST (boundary);

-- Regular indexes
CREATE INDEX idx_issues_user_id ON public.issues(user_id);
CREATE INDEX idx_issues_status ON public.issues(status);
CREATE INDEX idx_issues_category ON public.issues(category);
CREATE INDEX idx_issues_ward ON public.issues(ward_number);
CREATE INDEX idx_issues_created_at ON public.issues(created_at);
CREATE INDEX idx_issue_comments_issue_id ON public.issue_comments(issue_id);
CREATE INDEX idx_issue_votes_issue_id ON public.issue_votes(issue_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_unread ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX idx_analytics_created_at ON public.analytics(created_at);

-- =============================================
-- STEP 5: Create Functions and Triggers
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issue_comments_updated_at BEFORE UPDATE ON public.issue_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_workers_updated_at BEFORE UPDATE ON public.workers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically assign ward number based on location
CREATE OR REPLACE FUNCTION assign_ward_number()
RETURNS TRIGGER AS $$
BEGIN
    -- Only assign if location is provided and ward_number is not already set
    IF NEW.location IS NOT NULL AND NEW.ward_number IS NULL THEN
        SELECT ward_number INTO NEW.ward_number
        FROM public.ward_boundaries
        WHERE ST_Contains(boundary::geometry, NEW.location::geometry)
        LIMIT 1;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for automatic ward assignment
CREATE TRIGGER assign_user_ward BEFORE INSERT OR UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION assign_ward_number();
CREATE TRIGGER assign_issue_ward BEFORE INSERT OR UPDATE ON public.issues FOR EACH ROW EXECUTE FUNCTION assign_ward_number();

-- Function to update vote counts
CREATE OR REPLACE FUNCTION update_issue_vote_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF NEW.vote_type = 'upvote' THEN
            UPDATE public.issues SET upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        ELSE
            UPDATE public.issues SET downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        END IF;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.vote_type = 'upvote' AND NEW.vote_type = 'downvote' THEN
            UPDATE public.issues SET upvotes = upvotes - 1, downvotes = downvotes + 1 WHERE id = NEW.issue_id;
        ELSIF OLD.vote_type = 'downvote' AND NEW.vote_type = 'upvote' THEN
            UPDATE public.issues SET downvotes = downvotes - 1, upvotes = upvotes + 1 WHERE id = NEW.issue_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF OLD.vote_type = 'upvote' THEN
            UPDATE public.issues SET upvotes = upvotes - 1 WHERE id = OLD.issue_id;
        ELSE
            UPDATE public.issues SET downvotes = downvotes - 1 WHERE id = OLD.issue_id;
        END IF;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ language 'plpgsql';

-- Trigger for vote count updates
CREATE TRIGGER update_vote_counts AFTER INSERT OR UPDATE OR DELETE ON public.issue_votes FOR EACH ROW EXECUTE FUNCTION update_issue_vote_counts();

-- =============================================
-- STEP 6: Enable Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.issue_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ward_boundaries ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 7: Create RLS Policies
-- =============================================

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Departments policies
CREATE POLICY "Anyone can view departments" ON public.departments FOR SELECT USING (true);
CREATE POLICY "Department heads can update their department" ON public.departments FOR UPDATE USING (head_user_id = auth.uid());

-- Issues policies
CREATE POLICY "Anyone can view issues" ON public.issues FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create issues" ON public.issues FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own issues" ON public.issues FOR UPDATE USING (user_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'department_head', 'worker')
));
CREATE POLICY "Admins can delete issues" ON public.issues FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- Issue comments policies
CREATE POLICY "Anyone can view comments" ON public.issue_comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create comments" ON public.issue_comments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own comments" ON public.issue_comments FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own comments" ON public.issue_comments FOR DELETE USING (user_id = auth.uid());

-- Issue votes policies
CREATE POLICY "Anyone can view votes" ON public.issue_votes FOR SELECT USING (true);
CREATE POLICY "Authenticated users can vote" ON public.issue_votes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own votes" ON public.issue_votes FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own votes" ON public.issue_votes FOR DELETE USING (user_id = auth.uid());

-- Workers policies
CREATE POLICY "Anyone can view workers" ON public.workers FOR SELECT USING (true);
CREATE POLICY "Workers can update own profile" ON public.workers FOR UPDATE USING (user_id = auth.uid());

-- Issue assignments policies
CREATE POLICY "Anyone can view assignments" ON public.issue_assignments FOR SELECT USING (true);
CREATE POLICY "Authorized users can create assignments" ON public.issue_assignments FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role IN ('admin', 'department_head')
));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());

-- Analytics policies
CREATE POLICY "System can insert analytics" ON public.analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view analytics" ON public.analytics FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
));

-- Ward boundaries policies (read-only for most users)
CREATE POLICY "Anyone can view ward boundaries" ON public.ward_boundaries FOR SELECT USING (true);

-- =============================================
-- STEP 8: Create Storage Buckets and Policies
-- =============================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-images', 'issue-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('department-assets', 'department-assets', true);

-- Storage policies for issue images
CREATE POLICY "Users can upload issue images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'issue-images' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view issue images" ON storage.objects
FOR SELECT USING (bucket_id = 'issue-images');

CREATE POLICY "Users can delete own issue images" ON storage.objects
FOR DELETE USING (bucket_id = 'issue-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage policies for avatars
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can update their avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================
-- STEP 9: Enable Real-time
-- =============================================

-- Enable real-time for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.issue_votes;

-- =============================================
-- Database setup complete!
-- Next: Run the sample data script from sample-data.sql
-- =============================================