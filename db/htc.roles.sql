INSERT INTO person_attribute_type (name, description, creator, date_created, retired, uuid) VALUES ("HTS Provider ID", "HTS service provider clinic code", 1, NOW(), 0, (SELECT UUID()));

-- INSERT INTO role (role, description, uuid) VALUES ("Counselor", "HTS Counselor role", (SELECT UUID())), ("HTS Coordinator", "HTS Clinic Supervisor role", (SELECT UUID())), ("Admin", "HTS System Administrator role", (SELECT UUID()));

-- START TRANSACTION;

-- SELECT user_id INTO @user_id FROM users WHERE username = 'CP6K';

-- DELETE FROM user_role WHERE user_id = @user_id;

-- INSERT INTO user_role VALUES (@user_id, "Admin"), (@user_id, "HTS Coordinator"), (@user_id, "Counselor");

-- INSERT INTO role (role, description, uuid) VALUES ('Supervisor', 'User with supervisory role', (SELECT UUID()));

-- COMMIT;
