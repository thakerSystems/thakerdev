USE `nooshow`;
DROP procedure IF EXISTS `setAudienceForPoll`;
DELIMITER //
CREATE PROCEDURE `setAudienceForPoll` (IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to assign audience to a poll'
BEGIN
DECLARE userId int;
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
INSERT INTO audience_poll_map (user_id, poll_id) VALUES (userId, pollId);
END//
DELIMITER ;