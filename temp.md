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
