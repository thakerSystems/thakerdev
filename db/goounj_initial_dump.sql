-- MySQL dump 10.13  Distrib 5.6.19, for osx10.7 (i386)
--
-- Host: 127.0.0.1    Database: nooshow
-- ------------------------------------------------------
-- Server version	5.6.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- -----------------------------------------------------
-- Schema nooshow
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `nooshow`;
CREATE SCHEMA IF NOT EXISTS `nooshow` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `nooshow` ;

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `answer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `question_id` int(11) NOT NULL,
  `question_options_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_answer_question1_idx` (`question_id`),
  KEY `fk_answer_question_options1_idx` (`question_options_id`),
  KEY `fk_answer_user1_idx` (`user_id`),
  CONSTRAINT `fk_answer_question1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_question_options1` FOREIGN KEY (`question_options_id`) REFERENCES `question_options` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_answer_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `answer`
--

LOCK TABLES `answer` WRITE;
/*!40000 ALTER TABLE `answer` DISABLE KEYS */;
/*!40000 ALTER TABLE `answer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `association`
--

DROP TABLE IF EXISTS `association`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `association` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `admin_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_association_user1_idx` (`admin_id`),
  CONSTRAINT `fk_association_user1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `association`
--

LOCK TABLES `association` WRITE;
/*!40000 ALTER TABLE `association` DISABLE KEYS */;
/*!40000 ALTER TABLE `association` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `association_user_map`
--

DROP TABLE IF EXISTS `association_user_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `association_user_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `association_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_association_user_map_user1_idx` (`user_id`),
  KEY `fk_association_user_map_association1_idx` (`association_id`),
  CONSTRAINT `fk_association_user_map_association1` FOREIGN KEY (`association_id`) REFERENCES `association` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_association_user_map_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `association_user_map`
--

LOCK TABLES `association_user_map` WRITE;
/*!40000 ALTER TABLE `association_user_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `association_user_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audience_poll_map`
--

DROP TABLE IF EXISTS `audience_poll_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audience_poll_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `poll_id` int(11) NOT NULL,
  `is_skipped` tinyint(1) DEFAULT '0',
  `poll_answered_time` datetime DEFAULT NULL,
  `is_answered` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_user_poll_map_user1_idx` (`user_id`),
  KEY `fk_user_poll_map_poll1_idx` (`poll_id`),
  CONSTRAINT `fk_user_poll_map_poll1` FOREIGN KEY (`poll_id`) REFERENCES `poll` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_poll_map_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audience_poll_map`
--

LOCK TABLES `audience_poll_map` WRITE;
/*!40000 ALTER TABLE `audience_poll_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `audience_poll_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_type`
--

DROP TABLE IF EXISTS `auth_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auth_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_type`
--

LOCK TABLES `auth_type` WRITE;
/*!40000 ALTER TABLE `auth_type` DISABLE KEYS */;
INSERT INTO `auth_type` VALUES (1,'login'),(2,'facebook'),(3,'twitter');
/*!40000 ALTER TABLE `auth_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidate`
--

DROP TABLE IF EXISTS `candidate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `candidate` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  `is_accepted` tinyint(1) DEFAULT '0',
  `name` varchar(45) DEFAULT NULL,
  `nick_name` varchar(45) DEFAULT NULL,
  `about` varchar(150) DEFAULT NULL,
  `manifesto` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_nominee_user1_idx` (`user_id`),
  KEY `fk_nominee_election1_idx` (`election_id`),
  CONSTRAINT `fk_nominee_election1` FOREIGN KEY (`election_id`) REFERENCES `election` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_nominee_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidate`
--

LOCK TABLES `candidate` WRITE;
/*!40000 ALTER TABLE `candidate` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Art & Culture'),(2,'Education'),(3,'Entertainment'),(4,'Sports'),(5,'Science & Technology'),(6,'Neighbourhood & Society'),(7,'People'),(8,'Philosophy & Thinking'),(9,'Religion & Belief System'),(10,'Nature & Wild Life'),(11,'History & Events'),(12,'Geography & Places'),(13,'Lifestyle & Shopping'),(14,'Health & Fitness'),(15,'General Reference'),(16,'Latest Trends'),(17,'Mathematics & Logic'),(18,'Travel & Tourism'),(19,'Photography'),(20,'Food & Beverages'),(21,'Beauty & Personal Care'),(22,'Life & Concepts'),(23,'Others');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_poll_map`
--

DROP TABLE IF EXISTS `category_poll_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_poll_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `poll_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_poll_map_poll1_idx` (`poll_id`),
  KEY `fk_category_poll_map_category1_idx` (`category_id`),
  CONSTRAINT `fk_category_poll_map_category1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_poll_map_poll1` FOREIGN KEY (`poll_id`) REFERENCES `poll` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_poll_map`
--

LOCK TABLES `category_poll_map` WRITE;
/*!40000 ALTER TABLE `category_poll_map` DISABLE KEYS */;
INSERT INTO `category_poll_map` VALUES (1,1,4);
/*!40000 ALTER TABLE `category_poll_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category_user_map`
--

DROP TABLE IF EXISTS `category_user_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category_user_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_category_user_map_user1_idx` (`user_id`),
  KEY `fk_category_user_map_category1_idx` (`category_id`),
  CONSTRAINT `fk_category_user_map_category1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_category_user_map_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category_user_map`
--

LOCK TABLES `category_user_map` WRITE;
/*!40000 ALTER TABLE `category_user_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `category_user_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election`
--

DROP TABLE IF EXISTS `election`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `election` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `created_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `nomination_end_date` datetime DEFAULT NULL,
  `vigilance_user_id` int(11) NOT NULL,
  `association_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_election_user1_idx` (`vigilance_user_id`),
  KEY `fk_election_association1_idx` (`association_id`),
  CONSTRAINT `fk_election_association1` FOREIGN KEY (`association_id`) REFERENCES `association` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_election_user1` FOREIGN KEY (`vigilance_user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election`
--

LOCK TABLES `election` WRITE;
/*!40000 ALTER TABLE `election` DISABLE KEYS */;
/*!40000 ALTER TABLE `election` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `election_vigilance_map`
--

DROP TABLE IF EXISTS `election_vigilance_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `election_vigilance_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `election_vigilance_map`
--

LOCK TABLES `election_vigilance_map` WRITE;
/*!40000 ALTER TABLE `election_vigilance_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `election_vigilance_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poll`
--

DROP TABLE IF EXISTS `poll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `poll` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `poll_name` varchar(45) NOT NULL,
  `is_boost` tinyint(1) DEFAULT '0',
  `visibility_type_id` int(11) NOT NULL,
  `reward_type_id` int(11) NOT NULL,
  `created_user_id` int(11) NOT NULL,
  `poll_type_id` int(11) NOT NULL,
  `is_active` tinyint(1) unsigned DEFAULT '1',
  `is_generic` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_poll_visibility_type1_idx` (`visibility_type_id`),
  KEY `fk_poll_reward_type1_idx` (`reward_type_id`),
  KEY `fk_poll_user1_idx` (`created_user_id`),
  KEY `fk_poll_poll_type1_idx` (`poll_type_id`),
  CONSTRAINT `fk_poll_poll_type1` FOREIGN KEY (`poll_type_id`) REFERENCES `poll_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_reward_type1` FOREIGN KEY (`reward_type_id`) REFERENCES `reward_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_user1` FOREIGN KEY (`created_user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_poll_visibility_type1` FOREIGN KEY (`visibility_type_id`) REFERENCES `visibility_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poll`
--

LOCK TABLES `poll` WRITE;
/*!40000 ALTER TABLE `poll` DISABLE KEYS */;
INSERT INTO `poll` VALUES (1,'2015-10-31 09:16:02','2018-10-31 09:16:02','Best Footballer',0,1,1,1,1,1,1);
/*!40000 ALTER TABLE `poll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `poll_type`
--

DROP TABLE IF EXISTS `poll_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `poll_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `poll_type`
--

LOCK TABLES `poll_type` WRITE;
/*!40000 ALTER TABLE `poll_type` DISABLE KEYS */;
INSERT INTO `poll_type` VALUES (1,'quick'),(2,'opinion'),(3,'survey');
/*!40000 ALTER TABLE `poll_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase`
--

DROP TABLE IF EXISTS `purchase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `purchase_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_subscription_map_user1_idx` (`user_id`),
  KEY `fk_user_subscription_map_subscription1_idx` (`subscription_id`),
  CONSTRAINT `fk_user_subscription_map_subscription1` FOREIGN KEY (`subscription_id`) REFERENCES `subscription` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_subscription_map_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase`
--

LOCK TABLES `purchase` WRITE;
/*!40000 ALTER TABLE `purchase` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `question` varchar(255) NOT NULL,
  `question_type_id` int(11) NOT NULL,
  `poll_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_question_type1_idx` (`question_type_id`),
  KEY `fk_question_poll1_idx` (`poll_id`),
  CONSTRAINT `fk_question_poll1` FOREIGN KEY (`poll_id`) REFERENCES `poll` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_question_question_type1` FOREIGN KEY (`question_type_id`) REFERENCES `question_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question`
--

LOCK TABLES `question` WRITE;
/*!40000 ALTER TABLE `question` DISABLE KEYS */;
INSERT INTO `question` VALUES (1,'Who is the best footballer?',1,1),(2,'Who is the top goal scorer?',1,1);
/*!40000 ALTER TABLE `question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_options` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `option` varchar(255) NOT NULL,
  `question_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_question_options_question1_idx` (`question_id`),
  CONSTRAINT `fk_question_options_question1` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
INSERT INTO `question_options` VALUES (1,'Messi',1),(2,'Ronaldo',1),(3,'Ibrahimovic',1),(4,'Messi',2),(5,'Ronaldo',2),(6,'Lewandoski',2);
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_type`
--

DROP TABLE IF EXISTS `question_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `question_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_type`
--

LOCK TABLES `question_type` WRITE;
/*!40000 ALTER TABLE `question_type` DISABLE KEYS */;
INSERT INTO `question_type` VALUES (1,'text'),(2,'image'),(3,'audio'),(4,'video');
/*!40000 ALTER TABLE `question_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_type`
--

DROP TABLE IF EXISTS `reward_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reward_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  `points` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_type`
--

LOCK TABLES `reward_type` WRITE;
/*!40000 ALTER TABLE `reward_type` DISABLE KEYS */;
INSERT INTO `reward_type` VALUES (1,'free',0);
/*!40000 ALTER TABLE `reward_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'user'),(2,'customer'),(3,'admin');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plan_name` varchar(45) NOT NULL,
  `indian_pricing` int(11) NOT NULL,
  `intl_pricing` int(11) NOT NULL,
  `ideal_for` varchar(45) NOT NULL,
  `poll_count` varchar(45) NOT NULL,
  `responce_count` varchar(45) NOT NULL,
  `poll_database` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription_usage`
--

DROP TABLE IF EXISTS `subscription_usage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription_usage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `updated_date` datetime NOT NULL,
  `poll_count` int(11) DEFAULT NULL,
  `response_count` int(11) DEFAULT NULL,
  `used_poll_count` int(11) DEFAULT NULL,
  `used_response_count` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_subscription_usage_user1_idx` (`user_id`),
  CONSTRAINT `fk_subscription_usage_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription_usage`
--

LOCK TABLES `subscription_usage` WRITE;
/*!40000 ALTER TABLE `subscription_usage` DISABLE KEYS */;
/*!40000 ALTER TABLE `subscription_usage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `two_step_verification`
--

DROP TABLE IF EXISTS `two_step_verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `two_step_verification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `auth_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_two_step_verification_user1_idx` (`user_id`),
  CONSTRAINT `fk_two_step_verification_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `two_step_verification`
--

LOCK TABLES `two_step_verification` WRITE;
/*!40000 ALTER TABLE `two_step_verification` DISABLE KEYS */;
/*!40000 ALTER TABLE `two_step_verification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  `phone` varchar(45) NOT NULL,
  `password` varchar(120) DEFAULT NULL,
  `public_key` varchar(120) DEFAULT NULL,
  `secret_key` varchar(200) DEFAULT NULL,
  `gender` varchar(45) DEFAULT NULL,
  `dob` varchar(45) DEFAULT NULL,
  `access_time` datetime DEFAULT NULL,
  `created_time` datetime DEFAULT NULL,
  `updated_time` datetime DEFAULT NULL,
  `is_verified` tinyint(1) unsigned DEFAULT '1',
  `auth_code` varchar(45) DEFAULT NULL,
  `role_id` int(11) NOT NULL,
  `auth_type_id` int(11) NOT NULL,
  `country` varchar(45) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `country_code` int(11) DEFAULT NULL,
  `device_id` varchar(120) DEFAULT NULL,
  `device_token` varchar(200) DEFAULT NULL,
  `os_type` varchar(45) DEFAULT NULL,
  `os_version` varchar(45) DEFAULT NULL,
  `is_active` tinyint(1) unsigned DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`),
  KEY `fk_user_role_idx` (`role_id`),
  KEY `fk_user_auth_type1_idx` (`auth_type_id`),
  CONSTRAINT `fk_user_auth_type1` FOREIGN KEY (`auth_type_id`) REFERENCES `auth_type` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'nooshow','Bvocal','admin@bvocal.in','1234567890',NULL,'cfb84fad6d3f906872a2a7eba8e7a23acdfc3daee02ccf94f2360384879464de','9b454de447e83dd75b338254d5b7d415034d2565528b2b874f3aa6000cad3dfc114a12a932bd44000699da8369297d7b96ab08f82f25ead2313d75dcd1156675',NULL,NULL,'2015-10-31 02:25:17','2015-10-31 02:25:17','2015-10-31 02:25:17',1,'3436',1,1,'India','Chennai',91,'1234567890','de123vice123tok123en','Android','4.4',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `visibility_type`
--

DROP TABLE IF EXISTS `visibility_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `visibility_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `visibility_type`
--

LOCK TABLES `visibility_type` WRITE;
/*!40000 ALTER TABLE `visibility_type` DISABLE KEYS */;
INSERT INTO `visibility_type` VALUES (1,'visible'),(2,'hidden');
/*!40000 ALTER TABLE `visibility_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vote`
--

DROP TABLE IF EXISTS `vote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime DEFAULT NULL,
  `nominee_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `election_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vote_nominee1_idx` (`nominee_id`),
  KEY `fk_vote_user1_idx` (`user_id`),
  KEY `fk_vote_election1_idx` (`election_id`),
  CONSTRAINT `fk_vote_election1` FOREIGN KEY (`election_id`) REFERENCES `election` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vote_nominee1` FOREIGN KEY (`nominee_id`) REFERENCES `candidate` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vote_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vote`
--

LOCK TABLES `vote` WRITE;
/*!40000 ALTER TABLE `vote` DISABLE KEYS */;
/*!40000 ALTER TABLE `vote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voter_election_map`
--

DROP TABLE IF EXISTS `voter_election_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voter_election_map` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `voted_time` datetime DEFAULT NULL,
  `election_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_voter_election_map_election1_idx` (`election_id`),
  KEY `fk_voter_election_map_user1_idx` (`user_id`),
  CONSTRAINT `fk_voter_election_map_election1` FOREIGN KEY (`election_id`) REFERENCES `election` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_voter_election_map_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voter_election_map`
--

LOCK TABLES `voter_election_map` WRITE;
/*!40000 ALTER TABLE `voter_election_map` DISABLE KEYS */;
/*!40000 ALTER TABLE `voter_election_map` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'nooshow'
--
/*!50003 DROP PROCEDURE IF EXISTS `deletePoll` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deletePoll`(IN pollId int(45))
    DETERMINISTIC
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
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `deleteUser` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `deleteUser`(IN userId INT(45))
    DETERMINISTIC
    COMMENT 'Procedure to delete an user'
BEGIN
DECLARE pollId int;
SET pollId := (SELECT id FROM poll WHERE created_user_id = userId LIMIT 1);
WHILE (pollId IS NOT NULL) DO
	CALL deletePoll(pollId);
    SET pollId := (SELECT id FROM poll WHERE created_user_id = userId LIMIT 1);
END WHILE;
IF pollId IS NULL THEN
		DELETE FROM user WHERE id = userId;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setAudienceForPoll` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setAudienceForPoll`(IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45))
    DETERMINISTIC
    COMMENT 'Procedure to assign audience to a poll'
BEGIN
DECLARE userId int;
SET userId := (SELECT id FROM user WHERE phone = phoneNumber LIMIT 1);
IF userId IS NULL THEN
    INSERT IGNORE INTO user (phone, role_id, auth_type_id) VALUES (phoneNumber, '1', '1');
    SET userId := LAST_INSERT_ID(); -- LAST_INSERT_ID() can give you the real, surrogate key
END IF;
INSERT INTO audience_poll_map (user_id, poll_id) VALUES (userId, pollId);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `setAudienceForSurvey` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `setAudienceForSurvey`(IN phoneNumber VARCHAR(45), IN pollId VARCHAR(45), IN utcTimeStamp DATETIME, IN fname VARCHAR(45), IN lname VARCHAR(45), OUT userId INT(11))
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

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateAuthCode` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8 */ ;
/*!50003 SET character_set_results = utf8 */ ;
/*!50003 SET collation_connection  = utf8_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `updateAuthCode`(IN authCode VARCHAR(45), IN phoneNumber VARCHAR(45), IN userVerified TINYINT(1), OUT publicKey VARCHAR(120), OUT secretKey VARCHAR(200), OUT userId VARCHAR(45))
    DETERMINISTIC
    COMMENT 'Procedure to create a new user'
BEGIN
UPDATE user SET auth_code = authCode, is_verified = userVerified WHERE phone = phoneNumber;
SELECT secret_key, public_key, id
INTO secretKey, publicKey, userId
FROM user
WHERE phone = phoneNumber;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-01-07 21:52:57
