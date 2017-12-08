USE `nooshow`;
DROP procedure IF EXISTS `updateAuthCode`;
DELIMITER //
CREATE PROCEDURE `updateAuthCode` (IN authCode VARCHAR(45), IN phoneNumber VARCHAR(45), IN userVerified TINYINT(1), OUT publicKey VARCHAR(120), OUT secretKey VARCHAR(200), OUT userId VARCHAR(45))
LANGUAGE SQL
DETERMINISTIC
SQL SECURITY DEFINER
COMMENT 'Procedure to create a new user'
BEGIN
UPDATE user SET auth_code = authCode, is_verified = userVerified WHERE phone = phoneNumber;
SELECT secret_key, public_key, id
INTO secretKey, publicKey, userId
FROM user
WHERE phone = phoneNumber;
END//
DELIMITER ;