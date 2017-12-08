USE `nooshow`;
DROP procedure IF EXISTS `setAudienceForSurvey`;

DELIMITER //
USE `nooshow`//
CREATE PROCEDURE `setAudienceForSurvey`(IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45), IN utcTimeStamp DATETIME, IN fname VARCHAR(45), IN lname VARCHAR(45), OUT userId INT(11))
    DETERMINISTIC
    COMMENT 'Procedure to assign audience to a survey'
BEGIN
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
UPDATE user SET first_name = fname, last_name = lname WHERE id = userId;
INSERT INTO audience_poll_map (user_id, poll_id, poll_answered_time, is_answered) VALUES (userId, pollId, utcTimeStamp, 1);

END//

DELIMITER ;

