-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema nooshow
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema nooshow
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `nooshow`;
CREATE SCHEMA IF NOT EXISTS `nooshow` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `nooshow` ;

-- -----------------------------------------------------
-- Table `nooshow`.`role`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`auth_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`auth_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `first_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NOT NULL,
  `password` VARCHAR(120) NULL,
  `public_key` VARCHAR(120) NULL,
  `secret_key` VARCHAR(200) NULL,
  `gender` VARCHAR(45) NULL,
  `dob` VARCHAR(45) NULL,
  `access_time` DATETIME NULL,
  `created_time` DATETIME NULL,
  `updated_time` DATETIME NULL,
  `is_verified` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  `auth_code` VARCHAR(45) NULL,
  `role_id` INT NOT NULL,
  `auth_type_id` INT NOT NULL,
  `country` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `country_code` INT NULL,
  `device_id` VARCHAR(120) NULL,
  `device_token` VARCHAR(200) NULL,
  `os_type` VARCHAR(45) NULL,
  `os_version` VARCHAR(45) NULL,
  `is_active` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  INDEX `fk_user_role_idx` (`role_id` ASC),
  INDEX `fk_user_auth_type1_idx` (`auth_type_id` ASC),
  UNIQUE INDEX `phone_UNIQUE` (`phone` ASC),
  CONSTRAINT `fk_user_role`
    FOREIGN KEY (`role_id`)
    REFERENCES `nooshow`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_auth_type1`
    FOREIGN KEY (`auth_type_id`)
    REFERENCES `nooshow`.`auth_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`visibility_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`visibility_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`reward_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`reward_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  `points` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`poll_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`poll_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`poll`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`poll` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start_date` DATETIME NOT NULL,
  `end_date` DATETIME NOT NULL,
  `poll_name` VARCHAR(45) NOT NULL,
  `is_boost` TINYINT(1) NULL DEFAULT '0',
  `visibility_type_id` INT NOT NULL,
  `reward_type_id` INT NOT NULL,
  `created_user_id` INT NOT NULL,
  `poll_type_id` INT NOT NULL,
  `is_active` TINYINT(1) UNSIGNED NULL DEFAULT '1',
  `is_generic` TINYINT(1) UNSIGNED NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  INDEX `fk_poll_visibility_type1_idx` (`visibility_type_id` ASC),
  INDEX `fk_poll_reward_type1_idx` (`reward_type_id` ASC),
  INDEX `fk_poll_user1_idx` (`created_user_id` ASC),
  INDEX `fk_poll_poll_type1_idx` (`poll_type_id` ASC),
  CONSTRAINT `fk_poll_visibility_type1`
    FOREIGN KEY (`visibility_type_id`)
    REFERENCES `nooshow`.`visibility_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_reward_type1`
    FOREIGN KEY (`reward_type_id`)
    REFERENCES `nooshow`.`reward_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_user1`
    FOREIGN KEY (`created_user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_poll_type1`
    FOREIGN KEY (`poll_type_id`)
    REFERENCES `nooshow`.`poll_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`question_type`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`question_type` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `type` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`question`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`question` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `question` VARCHAR(255) NOT NULL,
  `question_type_id` INT NOT NULL,
  `poll_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_question_question_type1_idx` (`question_type_id` ASC),
  INDEX `fk_question_poll1_idx` (`poll_id` ASC),
  CONSTRAINT `fk_question_question_type1`
    FOREIGN KEY (`question_type_id`)
    REFERENCES `nooshow`.`question_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_question_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `nooshow`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`question_options`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`question_options` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `option` VARCHAR(255) NOT NULL,
  `question_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_question_options_question1_idx` (`question_id` ASC),
  CONSTRAINT `fk_question_options_question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `nooshow`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`audience_poll_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`audience_poll_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `poll_id` INT NOT NULL,
  `is_skipped` TINYINT(1) NULL DEFAULT '0',
  `poll_answered_time` DATETIME NULL,
  `is_answered` TINYINT(1) NULL DEFAULT '0',
  INDEX `fk_user_poll_map_user1_idx` (`user_id` ASC),
  INDEX `fk_user_poll_map_poll1_idx` (`poll_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_user_poll_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_poll_map_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `nooshow`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`category` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`category_user_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`category_user_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  INDEX `fk_category_user_map_user1_idx` (`user_id` ASC),
  INDEX `fk_category_user_map_category1_idx` (`category_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_user_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_user_map_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `nooshow`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`category_poll_map`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`category_poll_map` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `poll_id` INT NOT NULL,
  `category_id` INT NOT NULL,
  INDEX `fk_category_poll_map_poll1_idx` (`poll_id` ASC),
  INDEX `fk_category_poll_map_category1_idx` (`category_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_category_poll_map_poll1`
    FOREIGN KEY (`poll_id`)
    REFERENCES `nooshow`.`poll` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_poll_map_category1`
    FOREIGN KEY (`category_id`)
    REFERENCES `nooshow`.`category` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`answer`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`answer` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `time` DATETIME NOT NULL,
  `question_id` INT NOT NULL,
  `question_options_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_answer_question1_idx` (`question_id` ASC),
  INDEX `fk_answer_question_options1_idx` (`question_options_id` ASC),
  INDEX `fk_answer_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_answer_question1`
    FOREIGN KEY (`question_id`)
    REFERENCES `nooshow`.`question` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_question_options1`
    FOREIGN KEY (`question_options_id`)
    REFERENCES `nooshow`.`question_options` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`subscription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`subscription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plan_name` VARCHAR(45) NOT NULL,
  `indian_pricing` INT NOT NULL,
  `intl_pricing` INT NOT NULL,
  `ideal_for` VARCHAR(45) NOT NULL,
  `poll_count` VARCHAR(45) NOT NULL,
  `responce_count` VARCHAR(45) NOT NULL,
  `poll_database` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`purchase`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`purchase` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `subscription_id` INT NOT NULL,
  `purchase_date` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_subscription_map_user1_idx` (`user_id` ASC),
  INDEX `fk_user_subscription_map_subscription1_idx` (`subscription_id` ASC),
  CONSTRAINT `fk_user_subscription_map_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_subscription_map_subscription1`
    FOREIGN KEY (`subscription_id`)
    REFERENCES `nooshow`.`subscription` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `nooshow`.`subscription_usage`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `nooshow`.`subscription_usage` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `updated_date` DATETIME NOT NULL,
  `poll_count` INT NULL,
  `response_count` INT NULL,
  `used_poll_count` INT NULL,
  `used_response_count` INT NULL,
  INDEX `fk_subscription_usage_user1_idx` (`user_id` ASC),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_subscription_usage_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `nooshow`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
