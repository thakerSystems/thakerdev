USE `nooshow`;
DROP procedure IF EXISTS `deletePoll`;
DELIMITER //
CREATE PROCEDURE `deletePoll`(IN pollId int(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to delete a poll'
BEGIN
DECLARE questionId int;
SET questionId := (SELECT id FROM question WHERE poll_id = pollId LIMIT 1);
WHILE (questionId IS NOT NULL) DO
    DELETE FROM answer WHERE question_id = questionId;
	DELETE FROM question_options WHERE question_id = questionId;
DELETE FROM question 
WHERE
    id = questionId;
    SET questionId := (SELECT id FROM question WHERE poll_id = pollId LIMIT 1);
END WHILE;
DELETE FROM audience_poll_map 
WHERE
    poll_id = pollId;
DELETE FROM category_poll_map 
WHERE
    poll_id = pollId;
DELETE FROM poll 
WHERE
    id = pollId;
END//
DELIMITER ;