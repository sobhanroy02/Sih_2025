-- Sample data for testing the CitiZen application

-- Insert sample departments
INSERT INTO departments (id, name, description, municipality, contact_info, working_hours, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Public Works Department',
  'Responsible for road maintenance, water supply, and infrastructure',
  'Mumbai Municipal Corporation',
  '{"email": "publicworks@mumbai.gov.in", "phone": "+91-22-1234-5678", "address": "Municipal Building, Mumbai"}',
  '{"monday": "09:00-18:00", "tuesday": "09:00-18:00", "wednesday": "09:00-18:00", "thursday": "09:00-18:00", "friday": "09:00-18:00", "saturday": "09:00-13:00"}',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Health Department',
  'Public health, sanitation, and waste management',
  'Mumbai Municipal Corporation',
  '{"email": "health@mumbai.gov.in", "phone": "+91-22-2345-6789", "address": "Health Office, Mumbai"}',
  '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "08:00-16:00", "sunday": "10:00-14:00"}',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Traffic Police',
  'Traffic management and road safety',
  'Mumbai Municipal Corporation',
  '{"email": "traffic@mumbai.gov.in", "phone": "+91-22-3456-7890", "address": "Traffic Control Room, Mumbai"}',
  '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}',
  true
);

-- Insert sample users
INSERT INTO users (id, email, name, phone, user_type, municipality, city, ward_number, location, is_verified, is_active) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'citizen1@example.com',
  'Raj Sharma',
  '+91-9876543210',
  'citizen',
  'Mumbai Municipal Corporation',
  'Mumbai',
  'Ward 12',
  ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), -- Mumbai coordinates
  true,
  true
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'citizen2@example.com',
  'Priya Patel',
  '+91-9876543211',
  'citizen',
  'Mumbai Municipal Corporation',
  'Mumbai',
  'Ward 15',
  ST_SetSRID(ST_MakePoint(72.8820, 19.0822), 4326),
  true,
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'worker1@mumbai.gov.in',
  'Suresh Kumar',
  '+91-9876543212',
  'worker',
  'Mumbai Municipal Corporation',
  'Mumbai',
  'Ward 12',
  ST_SetSRID(ST_MakePoint(72.8785, 19.0765), 4326),
  true,
  true
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'worker2@mumbai.gov.in',
  'Anita Singh',
  '+91-9876543213',
  'worker',
  'Mumbai Municipal Corporation',
  'Mumbai',
  'Ward 15',
  ST_SetSRID(ST_MakePoint(72.8830, 19.0830), 4326),
  true,
  true
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'admin@mumbai.gov.in',
  'Administrative Officer',
  '+91-9876543214',
  'admin',
  'Mumbai Municipal Corporation',
  'Mumbai',
  NULL,
  ST_SetSRID(ST_MakePoint(72.8820, 19.0760), 4326),
  true,
  true
);

-- Insert sample workers
INSERT INTO workers (id, user_id, worker_id, department_id, current_location, skills, availability_status, shift_schedule, performance_metrics) VALUES
(
  'wwwwww11-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'PW001',
  '11111111-1111-1111-1111-111111111111',
  ST_SetSRID(ST_MakePoint(72.8785, 19.0765), 4326),
  '["road_repair", "water_supply", "electrical_work"]',
  'available',
  '{"start_time": "09:00", "end_time": "18:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]}',
  '{"issues_resolved": 45, "average_resolution_time": 2.5, "citizen_rating": 4.3}'
),
(
  'wwwwww22-2222-2222-2222-222222222222',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'HD001',
  '22222222-2222-2222-2222-222222222222',
  ST_SetSRID(ST_MakePoint(72.8830, 19.0830), 4326),
  '["waste_management", "sanitation", "health_inspection"]',
  'available',
  '{"start_time": "08:00", "end_time": "20:00", "days": ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]}',
  '{"issues_resolved": 32, "average_resolution_time": 1.8, "citizen_rating": 4.6}'
);

-- Insert sample issues
INSERT INTO issues (id, title, description, category, priority, status, location, address, user_id, assigned_worker_id, department_id, ai_confidence, ai_category, upvotes, views) VALUES
(
  'iiiiiiii-1111-1111-1111-111111111111',
  'Pothole on Main Road',
  'There is a large pothole on the main road near the bus stop. It''s causing trouble for vehicles and pedestrians.',
  'Road & Infrastructure',
  'high',
  'assigned',
  ST_SetSRID(ST_MakePoint(72.8780, 19.0762), 4326),
  'Main Road, Near Bus Stop, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'wwwwww11-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  0.95,
  'infrastructure',
  15,
  87
),
(
  'iiiiiiii-2222-2222-2222-222222222222',
  'Overflowing Garbage Bin',
  'The garbage bin at the corner of Street A and Street B has been overflowing for 3 days. It''s attracting stray animals and creating unhygienic conditions.',
  'Waste Management',
  'medium',
  'open',
  ST_SetSRID(ST_MakePoint(72.8825, 19.0825), 4326),
  'Corner of Street A & Street B, Ward 15, Mumbai',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NULL,
  '22222222-2222-2222-2222-222222222222',
  0.89,
  'waste_management',
  8,
  34
),
(
  'iiiiiiii-3333-3333-3333-333333333333',
  'Street Light Not Working',
  'The street light on Park Avenue has not been working for a week. The area becomes very dark at night, making it unsafe for pedestrians.',
  'Utilities',
  'medium',
  'in_progress',
  ST_SetSRID(ST_MakePoint(72.8790, 19.0770), 4326),
  'Park Avenue, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'wwwwww11-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  0.92,
  'utilities',
  12,
  56
),
(
  'iiiiiiii-4444-4444-4444-444444444444',
  'Water Supply Disruption',
  'No water supply in our building for the past 2 days. The entire area seems to be affected. Please fix urgently.',
  'Water Supply',
  'critical',
  'open',
  ST_SetSRID(ST_MakePoint(72.8815, 19.0815), 4326),
  'Residential Complex, Sector 7, Ward 15, Mumbai',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  0.98,
  'water_supply',
  25,
  142
),
(
  'iiiiiiii-5555-5555-5555-555555555555',
  'Illegal Parking on Footpath',
  'Vehicles are constantly parked on the footpath making it difficult for pedestrians to walk. Need traffic police intervention.',
  'Traffic & Parking',
  'low',
  'resolved',
  ST_SetSRID(ST_MakePoint(72.8795, 19.0775), 4326),
  'Commercial Street, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  '33333333-3333-3333-3333-333333333333',
  0.87,
  'traffic',
  5,
  23
);

-- Insert sample issue attachments
INSERT INTO issue_attachments (id, issue_id, file_url, file_type, file_size, metadata) VALUES
(
  'aaaaaaaa-1111-1111-1111-111111111111',
  'iiiiiiii-1111-1111-1111-111111111111',
  'https://storage.supabase.co/v1/object/public/issue-attachments/pothole_image_1.jpg',
  'image',
  245760,
  '{"originalName": "pothole_image_1.jpg", "uploadedBy": "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", "description": "Close-up view of the pothole"}'
),
(
  'aaaaaaaa-2222-2222-2222-222222222222',
  'iiiiiiii-2222-2222-2222-222222222222',
  'https://storage.supabase.co/v1/object/public/issue-attachments/garbage_overflow.jpg',
  'image',
  187453,
  '{"originalName": "garbage_overflow.jpg", "uploadedBy": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "description": "Overflowing garbage bin"}'
),
(
  'aaaaaaaa-3333-3333-3333-333333333333',
  'iiiiiiii-4444-4444-4444-444444444444',
  'https://storage.supabase.co/v1/object/public/issue-attachments/water_issue_video.mp4',
  'video',
  2456789,
  '{"originalName": "water_issue_video.mp4", "uploadedBy": "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "description": "Video showing dry taps in the building"}'
);

-- Insert sample issue comments
INSERT INTO issue_comments (id, issue_id, user_id, content, is_private) VALUES
(
  'cccccccc-1111-1111-1111-111111111111',
  'iiiiiiii-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'I have inspected the pothole. It requires immediate attention. I will start the repair work tomorrow morning.',
  false
),
(
  'cccccccc-2222-2222-2222-222222222222',
  'iiiiiiii-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Thank you for the quick response! The area is indeed very dangerous for vehicles.',
  false
),
(
  'cccccccc-3333-3333-3333-333333333333',
  'iiiiiiii-2222-2222-2222-222222222222',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'The situation has worsened. Now there are rats and flies around the area.',
  false
),
(
  'cccccccc-4444-4444-4444-444444444444',
  'iiiiiiii-4444-4444-4444-444444444444',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Water department has been notified. Emergency repair team is being dispatched.',
  false
);

-- Insert sample issue votes
INSERT INTO issue_votes (id, issue_id, user_id, vote_type) VALUES
(
  'vvvvvvvv-1111-1111-1111-111111111111',
  'iiiiiiii-1111-1111-1111-111111111111',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'upvote'
),
(
  'vvvvvvvv-2222-2222-2222-222222222222',
  'iiiiiiii-2222-2222-2222-222222222222',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'upvote'
),
(
  'vvvvvvvv-3333-3333-3333-333333333333',
  'iiiiiiii-4444-4444-4444-444444444444',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'upvote'
);

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, reference_id, is_read) VALUES
(
  'nnnnnnnn-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Issue Update',
  'Your reported pothole issue has been assigned to a worker and work will begin soon.',
  'issue_update',
  'iiiiiiii-1111-1111-1111-111111111111',
  false
),
(
  'nnnnnnnn-2222-2222-2222-222222222222',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'New Assignment',
  'You have been assigned a new issue: Pothole on Main Road',
  'assignment',
  'iiiiiiii-1111-1111-1111-111111111111',
  true
),
(
  'nnnnnnnn-3333-3333-3333-333333333333',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Issue Acknowledgment',
  'Thank you for reporting the garbage overflow issue. We are working on it.',
  'system',
  'iiiiiiii-2222-2222-2222-222222222222',
  false
),
(
  'nnnnnnnn-4444-4444-4444-444444444444',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Critical Issue Alert',
  'Your water supply issue has been marked as critical priority. Emergency team dispatched.',
  'issue_update',
  'iiiiiiii-4444-4444-4444-444444444444',
  false
);

-- Insert sample analytics data
INSERT INTO analytics (id, event_type, user_id, entity_type, entity_id, metadata) VALUES
(
  'aaaaaaaa-aaaa-1111-1111-111111111111',
  'issue_created',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'issue',
  'iiiiiiii-1111-1111-1111-111111111111',
  '{"category": "Road & Infrastructure", "priority": "high", "location": [72.8780, 19.0762]}'
),
(
  'aaaaaaaa-aaaa-2222-2222-222222222222',
  'issue_viewed',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'issue',
  'iiiiiiii-1111-1111-1111-111111111111',
  '{"view_duration": 45, "user_agent": "mobile"}'
),
(
  'aaaaaaaa-aaaa-3333-3333-333333333333',
  'issue_assigned',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'issue',
  'iiiiiiii-1111-1111-1111-111111111111',
  '{"assigned_to": "wwwwww11-1111-1111-1111-111111111111", "assignment_time": 300}'
),
(
  'aaaaaaaa-aaaa-4444-4444-444444444444',
  'user_login',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'user',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '{"login_method": "email", "device": "mobile", "location": [72.8777, 19.0760]}'
);

-- Update issues with correct upvote counts based on votes
UPDATE issues SET upvotes = (
  SELECT COUNT(*) FROM issue_votes 
  WHERE issue_votes.issue_id = issues.id AND vote_type = 'upvote'
);

-- Update view counts for issues
UPDATE issues SET views = CASE 
  WHEN id = 'iiiiiiii-1111-1111-1111-111111111111' THEN 87
  WHEN id = 'iiiiiiii-2222-2222-2222-222222222222' THEN 34
  WHEN id = 'iiiiiiii-3333-3333-3333-333333333333' THEN 56
  WHEN id = 'iiiiiiii-4444-4444-4444-444444444444' THEN 142
  WHEN id = 'iiiiiiii-5555-5555-5555-555555555555' THEN 23
  ELSE views
END;