-- MySQL dump 10.13  Distrib 5.5.58, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: hts
-- ------------------------------------------------------
-- Server version	5.6.33-0ubuntu0.14.04.1-log

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

--
-- Table structure for table `hts_register`
--

DROP TABLE IF EXISTS `hts_register`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hts_register` (
  `register_id` int(11) NOT NULL AUTO_INCREMENT,
  `register_number` int(11) DEFAULT NULL,
  `location_type_id` int(11) NOT NULL,
  `service_delivery_point_id` int(11) NOT NULL,
  `closed` tinyint(4) NOT NULL DEFAULT '0',
  `date_created` datetime NOT NULL,
  `created_by` int(11) NOT NULL,
  `date_closed` datetime DEFAULT NULL,
  `closed_by` int(11) DEFAULT NULL,
  `uuid` char(38) DEFAULT NULL,
  PRIMARY KEY (`register_id`),
  KEY `fk_hts_register_location_type_idx` (`location_type_id`),
  KEY `fk_hts_register_service_delivery_point_idx` (`service_delivery_point_id`),
  KEY `fk_hts_register_created_by_id_idx` (`created_by`),
  KEY `fk_hts_register_closed_by_idx` (`closed_by`),
  KEY `index6` (`closed`),
  CONSTRAINT `fk_hts_register_closed_by` FOREIGN KEY (`closed_by`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hts_register_created_by_id` FOREIGN KEY (`created_by`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hts_register_location_type` FOREIGN KEY (`location_type_id`) REFERENCES `hts_register_location_type` (`location_type_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hts_register_service_delivery_point` FOREIGN KEY (`service_delivery_point_id`) REFERENCES `hts_register_service_delivery_point` (`service_delivery_point_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hts_register`
--

LOCK TABLES `hts_register` WRITE;
/*!40000 ALTER TABLE `hts_register` DISABLE KEYS */;
/*!40000 ALTER TABLE `hts_register` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hts_register_encounter_mapping`
--

DROP TABLE IF EXISTS `hts_register_encounter_mapping`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hts_register_encounter_mapping` (
  `register_encounter_mapping_id` int(11) NOT NULL AUTO_INCREMENT,
  `encounter_id` int(11) NOT NULL,
  `register_id` int(11) NOT NULL,
  PRIMARY KEY (`register_encounter_mapping_id`),
  KEY `fk_hts_register_encounter_mapping_encounter_id_idx` (`encounter_id`),
  KEY `fk_hts_register_encounter_mapping_register_id_idx` (`register_id`),
  CONSTRAINT `fk_hts_register_encounter_mapping_encounter_id` FOREIGN KEY (`encounter_id`) REFERENCES `encounter` (`encounter_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_hts_register_encounter_mapping_register_id` FOREIGN KEY (`register_id`) REFERENCES `hts_register` (`register_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hts_register_encounter_mapping`
--

LOCK TABLES `hts_register_encounter_mapping` WRITE;
/*!40000 ALTER TABLE `hts_register_encounter_mapping` DISABLE KEYS */;
/*!40000 ALTER TABLE `hts_register_encounter_mapping` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hts_register_location_type`
--

DROP TABLE IF EXISTS `hts_register_location_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hts_register_location_type` (
  `location_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`location_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hts_register_location_type`
--

LOCK TABLES `hts_register_location_type` WRITE;
/*!40000 ALTER TABLE `hts_register_location_type` DISABLE KEYS */;
INSERT INTO `hts_register_location_type` VALUES (1,'Health Facility'),(2,'Community'),(3,'Standalone');
/*!40000 ALTER TABLE `hts_register_location_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hts_register_service_delivery_point`
--

DROP TABLE IF EXISTS `hts_register_service_delivery_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `hts_register_service_delivery_point` (
  `service_delivery_point_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`service_delivery_point_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hts_register_service_delivery_point`
--

LOCK TABLES `hts_register_service_delivery_point` WRITE;
/*!40000 ALTER TABLE `hts_register_service_delivery_point` DISABLE KEYS */;
-- INSERT INTO `hts_register_service_delivery_point` VALUES (1,'PITC Inpatient'),(2,'PITC Pediatric'),(3,'PITC Malnutrition Facilities'),(4,'PITC PMTCT (ANC Only)'),(5,'PITC TB Clinics'),(6,'VMMC Services'),(7,'Other PITC'),(8,'VCT'),(9,'Index Testing/Family Referral');
/*!40000 ALTER TABLE `hts_register_service_delivery_point` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-01-15  9:48:04
