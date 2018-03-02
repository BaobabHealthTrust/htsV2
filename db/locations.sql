INSERT INTO location_tag (name, description, creator, date_created, uuid) 
VALUES ("HTS", "HTS Locations", (SELECT user_id FROM users WHERE username = 
	'CP6K' LIMIT 1), NOW(), (SELECT UUID()));
	
INSERT INTO location (name, description, creator, date_created, uuid) VALUES 
("Room 1", "HTS location", (SELECT user_id FROM users WHERE username = 'CP6K' LIMIT 1), NOW(), (SELECT UUID())),
("Room 2", "HTS location", (SELECT user_id FROM users WHERE username = 'CP6K' LIMIT 1), NOW(), (SELECT UUID())),
("Room 3", "HTS location", (SELECT user_id FROM users WHERE username = 'CP6K' LIMIT 1), NOW(), (SELECT UUID())),
("Room 4", "HTS location", (SELECT user_id FROM users WHERE username = 'CP6K' LIMIT 1), NOW(), (SELECT UUID()));

INSERT INTO location_tag_map (location_id, location_tag_id) SELECT location_id, (SELECT location_tag_id FROM 
	location_tag WHERE name = 'HTS' LIMIT 1) FROM location WHERE description = 'HTS location';


