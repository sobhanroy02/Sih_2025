-- Sample data for testing the CitiZen application

-- Insert sample departments
INSERT INTO departments (id, name, description, contact_email, contact_phone, address, is_active) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'Public Works Department',
  'Responsible for road maintenance, water supply, and infrastructure',
  'publicworks@mumbai.gov.in',
  '+91-22-1234-5678',
  'Municipal Building, Mumbai',
  true
),
(
  '22222222-2222-2222-2222-222222222222',
  'Health Department',
  'Public health, sanitation, and waste management',
  'health@mumbai.gov.in',
  '+91-22-2345-6789',
  'Health Office, Mumbai',
  true
),
(
  '33333333-3333-3333-3333-333333333333',
  'Traffic Police',
  'Traffic management and road safety',
  'traffic@mumbai.gov.in',
  '+91-22-3456-7890',
  'Traffic Control Room, Mumbai',
  true
);

-- Insert sample users
INSERT INTO users (id, email, full_name, phone, role, ward_number, location, is_verified) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'citizen1@example.com',
  'Raj Sharma',
  '+91-9876543210',
  'citizen',
  12,
  ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326), -- Mumbai coordinates
  true
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'citizen2@example.com',
  'Priya Patel',
  '+91-9876543211',
  'citizen',
  15,
  ST_SetSRID(ST_MakePoint(72.8820, 19.0822), 4326),
  true
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'worker1@mumbai.gov.in',
  'Suresh Kumar',
  '+91-9876543212',
  'worker',
  12,
  ST_SetSRID(ST_MakePoint(72.8785, 19.0765), 4326),
  true
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'worker2@mumbai.gov.in',
  'Anita Singh',
  '+91-9876543213',
  'worker',
  15,
  ST_SetSRID(ST_MakePoint(72.8830, 19.0830), 4326),
  true
),
(
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'admin@mumbai.gov.in',
  'Administrative Officer',
  '+91-9876543214',
  'admin',
  NULL,
  ST_SetSRID(ST_MakePoint(72.8820, 19.0760), 4326),
  true
);

-- Insert sample workers
INSERT INTO workers (id, user_id, employee_id, department_id, current_location, specializations, is_available, rating, total_assignments, completed_assignments) VALUES
(
  'wwwwww11-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'PW001',
  '11111111-1111-1111-1111-111111111111',
  ST_SetSRID(ST_MakePoint(72.8785, 19.0765), 4326),
  ARRAY['road_repair', 'water_supply', 'electrical_work'],
  true,
  4.3,
  50,
  45
),
(
  'wwwwww22-2222-2222-2222-222222222222',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'HD001',
  '22222222-2222-2222-2222-222222222222',
  ST_SetSRID(ST_MakePoint(72.8830, 19.0830), 4326),
  ARRAY['waste_management', 'sanitation', 'health_inspection'],
  true,
  4.6,
  35,
  32
);

-- Insert sample issues
INSERT INTO issues (id, title, description, category, priority, status, location, address, user_id, assigned_to, department_id, upvotes, view_count) VALUES
(
  'iiiiiiii-1111-1111-1111-111111111111',
  'Pothole on Main Road',
  'There is a large pothole on the main road near the bus stop. It''s causing trouble for vehicles and pedestrians.',
  'infrastructure',
  'high',
  'in_progress',
  ST_SetSRID(ST_MakePoint(72.8780, 19.0762), 4326),
  'Main Road, Near Bus Stop, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  15,
  87
),
(
  'iiiiiiii-2222-2222-2222-222222222222',
  'Overflowing Garbage Bin',
  'The garbage bin at the corner of Street A and Street B has been overflowing for 3 days. It''s attracting stray animals and creating unhygienic conditions.',
  'sanitation',
  'medium',
  'open',
  ST_SetSRID(ST_MakePoint(72.8825, 19.0825), 4326),
  'Corner of Street A & Street B, Ward 15, Mumbai',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NULL,
  '22222222-2222-2222-2222-222222222222',
  8,
  34
),
(
  'iiiiiiii-3333-3333-3333-333333333333',
  'Street Light Not Working',
  'The street light on Park Avenue has not been working for a week. The area becomes very dark at night, making it unsafe for pedestrians.',
  'utilities',
  'medium',
  'in_progress',
  ST_SetSRID(ST_MakePoint(72.8790, 19.0770), 4326),
  'Park Avenue, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '11111111-1111-1111-1111-111111111111',
  12,
  56
),
(
  'iiiiiiii-4444-4444-4444-444444444444',
  'Water Supply Disruption',
  'No water supply in our building for the past 2 days. The entire area seems to be affected. Please fix urgently.',
  'utilities',
  'urgent',
  'open',
  ST_SetSRID(ST_MakePoint(72.8815, 19.0815), 4326),
  'Residential Complex, Sector 7, Ward 15, Mumbai',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NULL,
  '11111111-1111-1111-1111-111111111111',
  25,
  142
),
(
  'iiiiiiii-5555-5555-5555-555555555555',
  'Illegal Parking on Footpath',
  'Vehicles are constantly parked on the footpath making it difficult for pedestrians to walk. Need traffic police intervention.',
  'transportation',
  'low',
  'resolved',
  ST_SetSRID(ST_MakePoint(72.8795, 19.0775), 4326),
  'Commercial Street, Ward 12, Mumbai',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  NULL,
  '33333333-3333-3333-3333-333333333333',
  5,
  23
);

-- Insert sample issue comments
INSERT INTO issue_comments (id, issue_id, user_id, content) VALUES
(
  'cccccccc-1111-1111-1111-111111111111',
  'iiiiiiii-1111-1111-1111-111111111111',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'I have inspected the pothole. It requires immediate attention. I will start the repair work tomorrow morning.'
),
(
  'cccccccc-2222-2222-2222-222222222222',
  'iiiiiiii-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Thank you for the quick response! The area is indeed very dangerous for vehicles.'
),
(
  'cccccccc-3333-3333-3333-333333333333',
  'iiiiiiii-2222-2222-2222-222222222222',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'The situation has worsened. Now there are rats and flies around the area.'
),
(
  'cccccccc-4444-4444-4444-444444444444',
  'iiiiiiii-4444-4444-4444-444444444444',
  'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
  'Water department has been notified. Emergency repair team is being dispatched.'
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
INSERT INTO notifications (id, user_id, title, message, type, related_issue_id, is_read) VALUES
(
  'nnnnnnnn-1111-1111-1111-111111111111',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Issue Update',
  'Your reported pothole issue has been assigned to a worker and work will begin soon.',
  'issue_updated',
  'iiiiiiii-1111-1111-1111-111111111111',
  false
),
(
  'nnnnnnnn-2222-2222-2222-222222222222',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'New Assignment',
  'You have been assigned a new issue: Pothole on Main Road',
  'assignment_received',
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
  'issue_updated',
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
  '{"category": "infrastructure", "priority": "high", "location": [72.8780, 19.0762]}'
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
  '{"assigned_to": "cccccccc-cccc-cccc-cccc-cccccccccccc", "assignment_time": 300}'
),
(
  'aaaaaaaa-aaaa-4444-4444-444444444444',
  'user_login',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'user',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '{"login_method": "email", "device": "mobile", "location": [72.8777, 19.0760]}'
);

-- Insert Mumbai ward boundaries (sample data for key wards)
INSERT INTO ward_boundaries (id, ward_number, ward_name, boundary, area_sq_km, population) VALUES
(
  'ward-0001-0001-0001-000000000001',
  1,
  'A Ward - Colaba',
  ST_GeogFromText('POLYGON((72.8200 18.9000, 72.8500 18.9000, 72.8500 18.9300, 72.8200 18.9300, 72.8200 18.9000))'),
  18.5,
  65000
),
(
  'ward-0002-0002-0002-000000000002',
  2,
  'B Ward - Dongri',
  ST_GeogFromText('POLYGON((72.8300 18.9500, 72.8600 18.9500, 72.8600 18.9800, 72.8300 18.9800, 72.8300 18.9500))'),
  12.3,
  95000
),
(
  'ward-0012-0012-0012-000000000012',
  12,
  'G/N Ward - Dadar',
  ST_GeogFromText('POLYGON((72.8700 19.0700, 72.8900 19.0700, 72.8900 19.0900, 72.8700 19.0900, 72.8700 19.0700))'),
  22.1,
  180000
),
(
  'ward-0015-0015-0015-000000000015',
  15,
  'H/W Ward - Bandra West',
  ST_GeogFromText('POLYGON((72.8750 19.0750, 72.8950 19.0750, 72.8950 19.0950, 72.8750 19.0950, 72.8750 19.0750))'),
  15.8,
  250000
),
(
  'ward-0020-0020-0020-000000000020',
  20,
  'R/C Ward - Borivali',
  ST_GeogFromText('POLYGON((72.8500 19.2000, 72.9000 19.2000, 72.9000 19.2500, 72.8500 19.2500, 72.8500 19.2000))'),
  45.2,
  320000
);

-- Update department head assignments
UPDATE departments SET head_user_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE departments SET head_user_id = 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' WHERE id = '22222222-2222-2222-2222-222222222222';

-- Update user department assignments
UPDATE users SET department_id = '11111111-1111-1111-1111-111111111111' WHERE id = 'cccccccc-cccc-cccc-cccc-cccccccccccc';
UPDATE users SET department_id = '22222222-2222-2222-2222-222222222222' WHERE id = 'dddddddd-dddd-dddd-dddd-dddddddddddd';