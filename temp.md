-- Volunteer: Nijiya (365e06e8-74fe-45b8-b604-febf77cf9b3f)
INSERT INTO VOLUNTEER_SKILLS (volunteer_id, skill_id) VALUES
('365e06e8-74fe-45b8-b604-febf77cf9b3f', (SELECT skill_id FROM SKILLS WHERE skill_name = 'First Aid')),
('365e06e8-74fe-45b8-b604-febf77cf9b3f', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Community Outreach')),
('365e06e8-74fe-45b8-b604-febf77cf9b3f', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Fundraising')),
('365e06e8-74fe-45b8-b604-febf77cf9b3f', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Disaster Response'));

-- Volunteer: Sujan Baskota (9fa4355d-cb8a-4f8b-9a7f-af0622d466b3)
INSERT INTO VOLUNTEER_SKILLS (volunteer_id, skill_id) VALUES
('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Teaching')),
('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Event Planning')),
('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Public Speaking')),
('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Mentoring'));

-- Volunteer: Nijiya Maharjan (a6107216-bf2e-4c14-b4c6-342741323148)
INSERT INTO VOLUNTEER_SKILLS (volunteer_id, skill_id) VALUES
('a6107216-bf2e-4c14-b4c6-342741323148', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Cooking')),
('a6107216-bf2e-4c14-b4c6-342741323148', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Community Outreach')),
('a6107216-bf2e-4c14-b4c6-342741323148', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Elderly Assistance')),
('a6107216-bf2e-4c14-b4c6-342741323148', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Child Care'));

-- Volunteer: Yujal (fa919eaa-dab8-43e8-a570-2bccb4df285a)
INSERT INTO VOLUNTEER_SKILLS (volunteer_id, skill_id) VALUES
('fa919eaa-dab8-43e8-a570-2bccb4df285a', (SELECT skill_id FROM SKILLS WHERE skill_name = 'First Aid')),
('fa919eaa-dab8-43e8-a570-2bccb4df285a', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Cooking')),
('fa919eaa-dab8-43e8-a570-2bccb4df285a', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Environmental Cleanup')),
('fa919eaa-dab8-43e8-a570-2bccb4df285a', (SELECT skill_id FROM SKILLS WHERE skill_name = 'Animal Welfare'));



INSERT INTO PROGRAMMES (programme_id, organization_id, programme_name, description, start_date, end_date, image) 
VALUES
  ('7791f420-fe94-47b7-866f-7db2e4c2f951', 'fb7c481c-4215-432e-b6d7-2ba8efabaa1a', 'This', 'that', '2025-02-19', '2025-02-14', NULL),
  ('programme-1', '0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7', 'Community Outreach', 'A programme aimed at improving local community engagement through various events and activities.', '2025-02-01', '2025-06-01', 'https://images.pexels.com/photos/1454794/pexels-photo-1454794.jpeg'),
  ('programme-10', '4f28b73b-20e8-4c86-bb4a-cb5e78f19496', 'Ocean Conservation', 'Initiatives to reduce plastic pollution in oceans and protect marine ecosystems.', '2025-02-20', '2025-07-20', 'https://images.pexels.com/photos/1108549/pexels-photo-1108549.jpeg'),
  ('programme-2', '4f28b73b-20e8-4c86-bb4a-cb5e78f19496', 'Tech for Good', 'An initiative to use technology for solving social problems and community development.', '2025-03-15', '2025-09-15', 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg'),
  ('programme-3', '0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7', 'Health Awareness', 'A health-related programme to raise awareness about common diseases and preventive measures.', '2025-04-05', '2025-12-01', 'https://images.pexels.com/photos/4217266/pexels-photo-4217266.jpeg'),
  ('programme-4', '4f28b73b-20e8-4c86-bb4a-cb5e78f19496', 'Educational Support', 'Providing educational resources and mentorship for underprivileged children.', '2025-01-20', '2025-08-20', 'https://images.pexels.com/photos/1597176/pexels-photo-1597176.jpeg'),
  ('programme-5', '0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7', 'Clean Energy Advocacy', 'Promoting renewable energy sources and sustainability practices to reduce environmental impact.', '2025-05-01', '2025-10-01', 'https://images.pexels.com/photos/1108441/pexels-photo-1108441.jpeg'),
  ('programme-6', '4f28b73b-20e8-4c86-bb4a-cb5e78f19496', 'Wildlife Conservation', 'Efforts to preserve endangered species and their natural habitats.', '2025-06-10', '2025-11-30', 'https://images.pexels.com/photos/2066720/pexels-photo-2066720.jpeg'),
  ('programme-7', '0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7', 'Youth Empowerment', 'A programme designed to empower young individuals with leadership skills and community involvement.', '2025-07-01', '2025-12-31', 'https://images.pexels.com/photos/1561943/pexels-photo-1561943.jpeg'),
  ('programme-8', '4f28b73b-20e8-4c86-bb4a-cb5e78f19496', 'Digital Literacy', 'A programme offering free workshops to teach digital skills to underserved communities.', '2025-08-15', '2025-12-15', 'https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg'),
  ('programme-9', '0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7', 'Health and Wellness', 'Providing fitness programs, nutrition advice, and mental health support for underserved communities.', '2025-09-05', '2025-12-05', 'https://images.pexels.com/photos/905698/pexels-photo-905698.jpeg');
https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1

ss

UPDATE PROGRAMMES
SET image = 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
WHERE programme_id = 'programme-10';  -- Ocean Conservation
UPDATE PROGRAMMES
SET image = 'https://images.pexels.com/photos/30885934/pexels-photo-30885934/free-photo-of-wooden-tiles-spelling-health-on-table.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
WHERE programme_id = 'programme-9';  -- Health and Wellness