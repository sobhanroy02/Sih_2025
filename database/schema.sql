-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  user_type VARCHAR CHECK (user_type IN ('citizen', 'admin', 'worker')) NOT NULL DEFAULT 'citizen',
  municipality VARCHAR,
  city VARCHAR,
  ward_number VARCHAR,
  location GEOMETRY(Point, 4326),
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create departments table
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  municipality VARCHAR NOT NULL,
  coverage_area GEOMETRY(Polygon, 4326),
  contact_info JSONB,
  working_hours JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workers table
CREATE TABLE workers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  worker_id VARCHAR UNIQUE NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  current_location GEOMETRY(Point, 4326),
  skills JSONB,
  availability_status VARCHAR CHECK (availability_status IN ('available', 'busy', 'offline', 'on_break')) DEFAULT 'offline',
  shift_schedule JSONB,
  performance_metrics JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issues table
CREATE TABLE issues (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR NOT NULL,
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  status VARCHAR CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  location GEOMETRY(Point, 4326) NOT NULL,
  address TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  assigned_worker_id UUID REFERENCES workers(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  ai_confidence DECIMAL(3,2),
  ai_category VARCHAR,
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  estimated_resolution_time INTERVAL,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_attachments table
CREATE TABLE issue_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  file_url VARCHAR NOT NULL,
  file_type VARCHAR CHECK (file_type IN ('image', 'video', 'document')) NOT NULL,
  file_size BIGINT,
  metadata JSONB,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_comments table
CREATE TABLE issue_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_updates table
CREATE TABLE issue_updates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  updated_by UUID REFERENCES users(id),
  field_name VARCHAR NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create issue_votes table
CREATE TABLE issue_votes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issue_id UUID REFERENCES issues(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vote_type VARCHAR CHECK (vote_type IN ('upvote', 'downvote')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(issue_id, user_id)
);

-- Create notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR CHECK (type IN ('issue_update', 'assignment', 'system', 'feedback')) NOT NULL,
  reference_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_type VARCHAR NOT NULL,
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR,
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial indexes for better geospatial performance
CREATE INDEX idx_users_location ON users USING GIST (location);
CREATE INDEX idx_issues_location ON issues USING GIST (location);
CREATE INDEX idx_workers_location ON workers USING GIST (current_location);
CREATE INDEX idx_departments_coverage ON departments USING GIST (coverage_area);

-- Create regular indexes for common queries
CREATE INDEX idx_issues_status ON issues (status);
CREATE INDEX idx_issues_category ON issues (category);
CREATE INDEX idx_issues_priority ON issues (priority);
CREATE INDEX idx_issues_user_id ON issues (user_id);
CREATE INDEX idx_issues_assigned_worker ON issues (assigned_worker_id);
CREATE INDEX idx_issues_department ON issues (department_id);
CREATE INDEX idx_issues_created_at ON issues (created_at);

CREATE INDEX idx_workers_department ON workers (department_id);
CREATE INDEX idx_workers_availability ON workers (availability_status);

CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read);
CREATE INDEX idx_analytics_event_type ON analytics (event_type);
CREATE INDEX idx_analytics_created_at ON analytics (created_at);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION calculate_distance(lat1 FLOAT, lon1 FLOAT, lat2 FLOAT, lon2 FLOAT)
RETURNS FLOAT AS $$
BEGIN
  RETURN ST_Distance(
    ST_SetSRID(ST_MakePoint(lon1, lat1), 4326),
    ST_SetSRID(ST_MakePoint(lon2, lat2), 4326)
  );
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby workers
CREATE OR REPLACE FUNCTION find_nearby_workers(
  issue_lat FLOAT,
  issue_lon FLOAT,
  max_distance_meters FLOAT DEFAULT 5000
)
RETURNS TABLE (
  worker_id UUID,
  user_id UUID,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    w.id,
    w.user_id,
    ST_Distance(
      w.current_location,
      ST_SetSRID(ST_MakePoint(issue_lon, issue_lat), 4326)
    ) as distance
  FROM workers w
  WHERE w.availability_status = 'available'
    AND w.current_location IS NOT NULL
    AND ST_DWithin(
      w.current_location,
      ST_SetSRID(ST_MakePoint(issue_lon, issue_lat), 4326),
      max_distance_meters
    )
  ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign issues to workers
CREATE OR REPLACE FUNCTION auto_assign_issue()
RETURNS TRIGGER AS $$
DECLARE
  nearest_worker UUID;
  issue_lat FLOAT;
  issue_lon FLOAT;
BEGIN
  -- Extract coordinates from the location point
  issue_lat := ST_Y(NEW.location);
  issue_lon := ST_X(NEW.location);
  
  -- Find the nearest available worker
  SELECT worker_id INTO nearest_worker
  FROM find_nearby_workers(issue_lat, issue_lon, 5000)
  LIMIT 1;
  
  -- If a worker is found, assign the issue
  IF nearest_worker IS NOT NULL THEN
    NEW.assigned_worker_id := nearest_worker;
    NEW.status := 'assigned';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-assignment (optional - can be enabled/disabled)
-- CREATE TRIGGER auto_assign_new_issues
--   BEFORE INSERT ON issues
--   FOR EACH ROW
--   EXECUTE FUNCTION auto_assign_issue();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE issue_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Citizens can view all issues
CREATE POLICY "Citizens can view issues" ON issues
  FOR SELECT USING (true);

-- Users can create issues
CREATE POLICY "Users can create issues" ON issues
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own issues
CREATE POLICY "Users can update own issues" ON issues
  FOR UPDATE USING (auth.uid() = user_id);

-- Workers can update assigned issues
CREATE POLICY "Workers can update assigned issues" ON issues
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM workers WHERE id = issues.assigned_worker_id
    )
  );

-- Users can view attachments for issues they can see
CREATE POLICY "Users can view issue attachments" ON issue_attachments
  FOR SELECT USING (
    issue_id IN (
      SELECT id FROM issues WHERE auth.uid() = user_id
      OR true -- All users can see all issues (adjust as needed)
    )
  );

-- Users can add attachments to their issues
CREATE POLICY "Users can add attachments to own issues" ON issue_attachments
  FOR INSERT WITH CHECK (
    issue_id IN (
      SELECT id FROM issues WHERE auth.uid() = user_id
    )
  );

-- Users can view comments on issues they can see
CREATE POLICY "Users can view issue comments" ON issue_comments
  FOR SELECT USING (
    issue_id IN (
      SELECT id FROM issues WHERE auth.uid() = user_id
      OR true -- All users can see all issues (adjust as needed)
    )
  );

-- Users can add comments to issues
CREATE POLICY "Users can add comments to issues" ON issue_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Storage bucket policies
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-attachments', 'issue-attachments', true);

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'issue-attachments' AND auth.role() = 'authenticated');

-- Allow users to view all files (adjust as needed for privacy)
CREATE POLICY "Anyone can view files" ON storage.objects
  FOR SELECT USING (bucket_id = 'issue-attachments');

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files" ON storage.objects
  FOR DELETE USING (bucket_id = 'issue-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);