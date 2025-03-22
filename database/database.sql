-- MySQL dump 10.13  Distrib 8.0.40, for Linux (x86_64)
--
-- Host: localhost    Database: VOLUNTEER_MANAGEMENT
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ADMIN`
--

DROP TABLE IF EXISTS `ADMIN`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ADMIN` (
  `email` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ADMIN`
--

LOCK TABLES `ADMIN` WRITE;
/*!40000 ALTER TABLE `ADMIN` DISABLE KEYS */;
INSERT INTO `ADMIN` VALUES (NULL),(NULL),('org+test@gmail.com'),('vollunteer+test@gmail.com'),('nijijiya@gmail.com'),('sujan.baskota77@gmail.com');
/*!40000 ALTER TABLE `ADMIN` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `DONATIONS`
--

DROP TABLE IF EXISTS `DONATIONS`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `DONATIONS` (
  `donation_id` varchar(50) NOT NULL,
  `donor_id` varchar(50) DEFAULT NULL,
  `amount` float NOT NULL,
  `donation_date` date NOT NULL,
  `organization_id` char(36) NOT NULL,
  PRIMARY KEY (`donation_id`),
  KEY `donor_id` (`donor_id`),
  KEY `DONATIONS_ibfk_3` (`organization_id`),
  CONSTRAINT `DONATIONS_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `ORGANIZATION` (`organization_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `DONATIONS`
--

LOCK TABLES `DONATIONS` WRITE;
/*!40000 ALTER TABLE `DONATIONS` DISABLE KEYS */;
INSERT INTO `DONATIONS` VALUES ('5421742e-55d7-4b1d-b3b8-a46e47b0a125','9fa4355d-cb8a-4f8b-9a7f-af0622d466b3',20,'2025-03-01','d833a5ca-25fb-4b42-b143-c9155afba3b7'),('bd261a8c-53a0-4719-9646-a8854139f767','9fa4355d-cb8a-4f8b-9a7f-af0622d466b3',10,'2025-03-01','d833a5ca-25fb-4b42-b143-c9155afba3b7'),('f25b8f9e-3498-41b5-9621-ae97554031ea','9fa4355d-cb8a-4f8b-9a7f-af0622d466b3',10,'2025-03-01','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7');
/*!40000 ALTER TABLE `DONATIONS` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ORGANIZATION`
--

DROP TABLE IF EXISTS `ORGANIZATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ORGANIZATION` (
  `organization_id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `organization_name` varchar(255) NOT NULL,
  `established_date` date NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_phone` varchar(15) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(256) DEFAULT NULL,
  `latitude` decimal(15,10) DEFAULT NULL,
  `longitude` decimal(15,10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`organization_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ORGANIZATION`
--

LOCK TABLES `ORGANIZATION` WRITE;
/*!40000 ALTER TABLE `ORGANIZATION` DISABLE KEYS */;
INSERT INTO `ORGANIZATION` VALUES ('0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','sujan.baskota77@gmail.com','$2a$10$87Q/8yux.xo9SfZWeMh4De9Y5EgV7js94yM6AXYBLZffQXRaHuVoe','MY OWN ORG','2025-01-02','sujan.baskota77@gmail.com','9840030307','2025-01-19 16:03:29',NULL,27.7172000000,85.3240000000,'Kathmandu, Bagmati Province, Nepal'),('13c7d68a-fbe6-4980-aed2-161e6afdb5db','org+test@gmail.com','$2a$10$5sT/upfuPCnpoRjHpvKD/.RaeQQxhzvxjQe/C.tJq9jCWypoUmpTS','Sahayogi','2025-02-03','org_email@gmail.com','9840030307','2025-02-22 13:48:27',NULL,27.6730000000,85.4298000000,'Patan, Lalitpur, Bagmati Province, Nepal'),('1f5bbf53-3d38-4264-bc76-dd9b0fe21f79','org+test2@gmail.com','$2a$10$nNBK2DiNrSnUB8dE5cQbjezKs1oRGbu6TmpEira11uYRTal0iCcky','Sahayogi','2025-02-03','org_email@gmail.com','9840030307','2025-02-22 13:49:01',NULL,27.6841000000,85.2814000000,'Bhaktapur, Bagmati Province, Nepal'),('24963c0e-2d09-4360-8ac7-88370bedd770','org+test3@gmail.com','$2a$10$OZfoMeIjfEbWr0vkwbUVV.AjIad0iG8SZZp.DQaFkW14/IABK76mu','Sahayogi','2025-02-03','org_email@gmail.com','9840030307','2025-02-22 13:50:11',NULL,28.2639000000,83.9721000000,'Pokhara, Gandaki Province, Nepal'),('4f28b73b-20e8-4c86-bb4a-cb5e78f19496','sujan.org@gmail.com','$2a$10$YO7Lc6Qqx2iMKWVqTyIVY.3izHRdCCyzePGus/ZnvaN8eUCTz6JOG','Sujan Org','2024-12-31','sujan.org@gmail.com','9840030307','2025-01-19 16:41:16',NULL,27.5330000000,84.3542000000,'Chitwan, Bagmati Province, Nepal'),('d833a5ca-25fb-4b42-b143-c9155afba3b7','sujan.org2@gmail.com','$2a$10$KIjjFfkXbwHRUzcpE5qmQ.VDd.eRGv8d2OVbsmO4dP2irAyKFDMae','Sujan Org','2025-01-27','sujan.org2@gmail.com','9840030307','2025-02-25 12:18:13','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740837286/volunteer_management/cv6ylgsqlfy5z70ss4sj.jpg',27.4276000000,85.0322000000,'Hetauda, Bagmati Province, Nepal'),('fb7c481c-4215-432e-b6d7-2ba8efabaa1a','org+test4@gmail.com','$2a$10$9XXGjEenpzcTxo72cc8uZeDn2x2ao8JczX21NO0HiZems70ql79pe','Sahayogi Batman','2025-02-01','org+test4@gmail.com','9840030307','2025-02-22 13:50:36','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740366703/volunteer_management/yr6xxzuolqpeo1fcmgm0.jpg',26.6633000000,87.2718000000,'Dharan, Province No. 1, Nepal');
/*!40000 ALTER TABLE `ORGANIZATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `PROGRAMMES`
--

DROP TABLE IF EXISTS `PROGRAMMES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `PROGRAMMES` (
  `programme_id` varchar(50) NOT NULL,
  `organization_id` varchar(50) DEFAULT NULL,
  `programme_name` varchar(255) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `latitude` decimal(15,10) DEFAULT NULL,
  `longitude` decimal(15,10) DEFAULT NULL,
  `address` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`programme_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `PROGRAMMES_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `ORGANIZATION` (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `PROGRAMMES`
--

LOCK TABLES `PROGRAMMES` WRITE;
/*!40000 ALTER TABLE `PROGRAMMES` DISABLE KEYS */;
INSERT INTO `PROGRAMMES` VALUES ('2c1e914b-bdd1-41cb-bb83-aaf175401e43','d833a5ca-25fb-4b42-b143-c9155afba3b7','FROG AWARENESS','FROG AWARENESS','2025-02-26','2025-03-11','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740837207/volunteer_management/okmix2wsztcxm6jzxxmx.jpg',27.7149000000,85.2906000000,'Swayambhunath Stupa, Swayambhu, Kathmandu, Nepal'),('7791f420-fe94-47b7-866f-7db2e4c2f951','fb7c481c-4215-432e-b6d7-2ba8efabaa1a','This','that','2025-02-19','2025-02-14',NULL,27.7215000000,85.3620000000,'Boudhanath Stupa, Boudha, Kathmandu, Nepal'),('a5694a2c-9a71-4712-b47e-3f23fc6f105a','d833a5ca-25fb-4b42-b143-c9155afba3b7','Animal rescue','Rescue programme for endangered species','2025-03-17','2025-03-26','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740843028/volunteer_management/shunnse0ktkp7poafszc.jpg',27.7049000000,85.3076000000,'Kathmandu Durbar Square, Basantapur, Kathmandu, Nepal'),('af5ad7f3-db4a-49e9-8f16-1f317f691e09','d833a5ca-25fb-4b42-b143-c9155afba3b7','Animal rescue','Rescue programme for endangered species','2025-03-17','2025-03-26','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740843028/volunteer_management/wzdd8tmmdi8rf4q1pprz.jpg',27.7136000000,85.3145000000,'Garden of Dreams, Tridevi Marg, Kathmandu, Nepal'),('c3b689a4-6d16-4eca-a683-f9d78a4b99bf','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Blood donation programme','Donate Blood Save lives','2025-03-16','2025-03-20','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1742142594/volunteer_management/xgh9ckts8qquoifrpked.jpg',27.7104000000,85.3489000000,'Pashupatinath Temple, Gaushala, Kathmandu, Nepal'),('programme-1','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','Community Outreach','A programme aimed at improving local community engagement through various events and activities.','2025-02-01','2025-06-01','https://images.pexels.com/photos/1454794/pexels-photo-1454794.jpeg',27.7156000000,85.3123000000,'Thamel, Kathmandu, Nepal'),('programme-10','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Ocean Conservation','Initiatives to reduce plastic pollution in oceans and protect marine ecosystems.','2025-02-20','2025-07-20','https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',27.7044000000,85.3151000000,'Ratna Park, Kathmandu, Nepal'),('programme-2','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Tech for Good','An initiative to use technology for solving social problems and community development.','2025-03-15','2025-09-15','https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg',27.7056000000,85.3106000000,'Indra Chowk, Kathmandu, Nepal'),('programme-3','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','Health Awareness','A health-related programme to raise awareness about common diseases and preventive measures.','2025-04-05','2025-12-01','https://images.pexels.com/photos/4217266/pexels-photo-4217266.jpeg',27.6676000000,85.2774000000,'Kirtipur, Kathmandu, Nepal'),('programme-4','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Educational Support','Providing educational resources and mentorship for underprivileged children.','2025-01-20','2025-08-20','https://images.pexels.com/photos/1597176/pexels-photo-1597176.jpeg',27.6722000000,85.3250000000,'Patan Durbar Square, Lalitpur, Nepal'),('programme-5','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','Clean Energy Advocacy','Promoting renewable energy sources and sustainability practices to reduce environmental impact.','2025-05-01','2025-10-01','https://images.pexels.com/photos/1108441/pexels-photo-1108441.jpeg',27.6710000000,85.4298000000,'Bhaktapur Durbar Square, Bhaktapur, Nepal'),('programme-6','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Wildlife Conservation','Efforts to preserve endangered species and their natural habitats.','2025-06-10','2025-11-30','https://images.pexels.com/photos/2066720/pexels-photo-2066720.jpeg',27.8040000000,85.3636000000,'Shivapuri Nagarjun National Park, Kathmandu, Nepal'),('programme-7','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','Youth Empowerment','A programme designed to empower young individuals with leadership skills and community involvement.','2025-07-01','2025-12-31','https://images.pexels.com/photos/1561943/pexels-photo-1561943.jpeg',27.7936000000,85.3638000000,'Budhanilkantha Temple, Budhanilkantha, Kathmandu, Nepal'),('programme-8','4f28b73b-20e8-4c86-bb4a-cb5e78f19496','Digital Literacy','A programme offering free workshops to teach digital skills to underserved communities.','2025-08-15','2025-12-15','https://images.pexels.com/photos/267202/pexels-photo-267202.jpeg',27.7499000000,85.3701000000,'Kopan Monastery, Kopan, Kathmandu, Nepal'),('programme-9','0b8e0530-bdb9-4c37-b33d-fd2cf9da1bd7','Health and Wellness','Providing fitness programs, nutrition advice, and mental health support for underserved communities.','2025-09-05','2025-12-05','https://images.pexels.com/photos/30885934/pexels-photo-30885934/free-photo-of-wooden-tiles-spelling-health-on-table.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',27.6645000000,85.2712000000,'Taudaha Lake, Kirtipur, Kathmandu, Nepal');
/*!40000 ALTER TABLE `PROGRAMMES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SKILL`
--

DROP TABLE IF EXISTS `SKILL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SKILL` (
  `skill_name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`skill_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SKILL`
--

LOCK TABLES `SKILL` WRITE;
/*!40000 ALTER TABLE `SKILL` DISABLE KEYS */;
INSERT INTO `SKILL` VALUES ('Animal Welfare','Caring for and rescuing animals in need'),('Child Care','Taking care of children in shelters and during events'),('Community Outreach','Engaging with communities to spread awareness and support'),('Cooking','Preparing meals for shelters, events, and the needy'),('Disaster Response','Helping communities affected by natural disasters'),('Elderly Assistance','Supporting senior citizens with daily activities'),('Environmental Cleanup','Cleaning parks, rivers, and public spaces'),('Event Planning','Organizing community service events and fundraisers'),('First Aid','Basic medical assistance and emergency care'),('Fundraising','Collecting donations and organizing charity campaigns'),('Mentoring','Guiding and supporting individuals in personal development'),('Public Speaking','Advocating for causes and spreading awareness'),('Teaching','Educating children and adults in various subjects');
/*!40000 ALTER TABLE `SKILL` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VOLUNTEER`
--

DROP TABLE IF EXISTS `VOLUNTEER`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VOLUNTEER` (
  `volunteer_id` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `phone` varchar(15) NOT NULL,
  `gender` enum('male','female') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `avatar` varchar(255) DEFAULT NULL,
  `latitude` decimal(15,10) DEFAULT NULL,
  `longitude` decimal(15,10) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VOLUNTEER`
--

LOCK TABLES `VOLUNTEER` WRITE;
/*!40000 ALTER TABLE `VOLUNTEER` DISABLE KEYS */;
INSERT INTO `VOLUNTEER` VALUES ('0d1e2f3a-4b5c-6d7e-8f9g-0h1i2j3k4l5m','binita.shrestha@example.com','$2a$10$examplehash10','Binita Shrestha','1994-06-28','9800000010','female','2025-03-22 10:57:36',NULL,27.4276000000,85.0322000000,'Hetauda, Bagmati Province, Nepal'),('1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d','ram.sharma@example.com','$2a$10$examplehash1','Ram Sharma','1990-05-15','9800000001','male','2025-03-22 10:57:36',NULL,27.7172000000,85.3240000000,'Kathmandu, Bagmati Province, Nepal'),('2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e','sita.devi@example.com','$2a$10$examplehash2','Sita Devi','1992-08-20','9800000002','female','2025-03-22 10:57:36',NULL,27.6730000000,85.4298000000,'Patan, Lalitpur, Bagmati Province, Nepal'),('365e06e8-74fe-45b8-b604-febf77cf9b3f','nijijiya@gmail.com','$2a$10$MgO0pultRX8Hwd6YeeRVU.Hm5LncNXcdDKdKoyQtyw4gRq4bKPuxi','nijiya','2025-02-23','9898989898','male','2025-02-22 16:59:41',NULL,NULL,NULL,NULL),('3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f','hari.prasad@example.com','$2a$10$examplehash3','Hari Prasad','1985-12-05','9800000003','male','2025-03-22 10:57:36',NULL,27.6841000000,85.2814000000,'Bhaktapur, Bagmati Province, Nepal'),('42d52664-e7cd-472f-b2ad-021ad7098213','testlocation2@gmail.com','$2a$10$eaKgAQuyl0q29QfLGxZP7.Mg9C9fAHYe7C9Mb0Juu5aD7a.fNiuKC','test','2025-02-27','1231231234','male','2025-03-13 18:15:00',NULL,27.6767460868,85.3100341853,'Right Choice Flower Shop, Damkal-Chakrapath Marg, Jhamsikhel, Dhobighat, Lalitpur-03, Lalitpur, Lalitpur Metropolitan City, Lalitpur, Bagamati Province, 44690, Nepal'),('4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9g','maya.thapa@example.com','$2a$10$examplehash4','Maya Thapa','1995-03-10','9800000004','female','2025-03-22 10:57:36',NULL,28.2639000000,83.9721000000,'Pokhara, Gandaki Province, Nepal'),('5e6f7a8b-9c0d-1e2f-3a4b-5c6d7e8f9g0h','gopal.khadka@example.com','$2a$10$examplehash5','Gopal Khadka','1988-07-22','9800000005','male','2025-03-22 10:57:36',NULL,27.5346000000,83.3673000000,'Bhairahawa, Lumbini Province, Nepal'),('6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9g0h1i','anita.rai@example.com','$2a$10$examplehash6','Anita Rai','1993-11-30','9800000006','female','2025-03-22 10:57:36',NULL,26.8065000000,87.2846000000,'Biratnagar, Province No. 1, Nepal'),('7a8b9c0d-1e2f-3a4b-5c6d-7e8f9g0h1i2j','suman.ghimire@example.com','$2a$10$examplehash7','Suman Ghimire','1991-09-18','9800000007','male','2025-03-22 10:57:36',NULL,27.6820000000,85.2897000000,'Madhyapur Thimi, Bagmati Province, Nepal'),('8b9c0d1e-2f3a-4b5c-6d7e-8f9g0h1i2j3k','rekha.bhandari@example.com','$2a$10$examplehash8','Rekha Bhandari','1996-02-25','9800000008','female','2025-03-22 10:57:36',NULL,27.6187000000,85.5370000000,'Dhulikhel, Bagmati Province, Nepal'),('9c0d1e2f-3a4b-5c6d-7e8f-9g0h1i2j3k4l','pradeep.lama@example.com','$2a$10$examplehash9','Pradeep Lama','1987-04-12','9800000009','male','2025-03-22 10:57:36',NULL,27.5330000000,84.3542000000,'Chitwan, Bagmati Province, Nepal'),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','sujan.baskota77@gmail.com','$2a$10$K.y.zCynrcQhnyJaaqZf9O8quRigGcSxpz0chomr6PrJIoGbrz6H.','Sujan Baskota','2002-11-18','9840030307','male','2025-01-09 18:15:00','https://res.cloudinary.com/dqgwwwbfp/image/upload/v1740398273/volunteer_management/zhc0olbnqxxhgqmirpry.jpg',NULL,NULL,NULL),('a6107216-bf2e-4c14-b4c6-342741323148','thisisnijiya@gmail.com','$2a$10$CxVTc55f3Bu901.tp1hVauAN/bYQE9MVk1jB9PoX3IXAMhPPK38Gu','Nijiya Maharjan','2025-02-17','9898989898','male','2025-02-22 16:51:32',NULL,NULL,NULL,NULL),('fa919eaa-dab8-43e8-a570-2bccb4df285a','vollunteer+test@gmail.com','$2a$10$WFf4lwadqGk/pR8b7moKMOENFF3FMxbH0l2JlQkvMbL5nIgZ4hmCy','Yujal','2025-02-04','1231231234','male','2025-02-22 13:46:18',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `VOLUNTEER` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VOLUNTEER_ORGANIZATION`
--

DROP TABLE IF EXISTS `VOLUNTEER_ORGANIZATION`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VOLUNTEER_ORGANIZATION` (
  `volunteer_id` varchar(50) NOT NULL,
  `organization_id` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`,`organization_id`),
  KEY `organization_id` (`organization_id`),
  CONSTRAINT `VOLUNTEER_ORGANIZATION_ibfk_1` FOREIGN KEY (`volunteer_id`) REFERENCES `VOLUNTEER` (`volunteer_id`),
  CONSTRAINT `VOLUNTEER_ORGANIZATION_ibfk_2` FOREIGN KEY (`organization_id`) REFERENCES `ORGANIZATION` (`organization_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VOLUNTEER_ORGANIZATION`
--

LOCK TABLES `VOLUNTEER_ORGANIZATION` WRITE;
/*!40000 ALTER TABLE `VOLUNTEER_ORGANIZATION` DISABLE KEYS */;
/*!40000 ALTER TABLE `VOLUNTEER_ORGANIZATION` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VOLUNTEER_PROGRAMMES`
--

DROP TABLE IF EXISTS `VOLUNTEER_PROGRAMMES`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VOLUNTEER_PROGRAMMES` (
  `volunteer_id` varchar(50) NOT NULL,
  `programme_id` varchar(50) NOT NULL,
  `registration_date` date NOT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`,`programme_id`),
  KEY `programme_id` (`programme_id`),
  CONSTRAINT `VOLUNTEER_PROGRAMMES_ibfk_1` FOREIGN KEY (`volunteer_id`) REFERENCES `VOLUNTEER` (`volunteer_id`),
  CONSTRAINT `VOLUNTEER_PROGRAMMES_ibfk_2` FOREIGN KEY (`programme_id`) REFERENCES `PROGRAMMES` (`programme_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VOLUNTEER_PROGRAMMES`
--

LOCK TABLES `VOLUNTEER_PROGRAMMES` WRITE;
/*!40000 ALTER TABLE `VOLUNTEER_PROGRAMMES` DISABLE KEYS */;
INSERT INTO `VOLUNTEER_PROGRAMMES` VALUES ('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','2c1e914b-bdd1-41cb-bb83-aaf175401e43','2025-03-01','pending'),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','7791f420-fe94-47b7-866f-7db2e4c2f951','2025-02-26','pending'),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','programme-1','2025-02-26','pending');
/*!40000 ALTER TABLE `VOLUNTEER_PROGRAMMES` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `VOLUNTEER_SKILL`
--

DROP TABLE IF EXISTS `VOLUNTEER_SKILL`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `VOLUNTEER_SKILL` (
  `volunteer_id` char(36) NOT NULL,
  `skill_name` varchar(255) NOT NULL,
  `proficiency_level` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`volunteer_id`,`skill_name`),
  KEY `skill_name` (`skill_name`),
  CONSTRAINT `VOLUNTEER_SKILL_ibfk_1` FOREIGN KEY (`skill_name`) REFERENCES `SKILL` (`skill_name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `VOLUNTEER_SKILL`
--

LOCK TABLES `VOLUNTEER_SKILL` WRITE;
/*!40000 ALTER TABLE `VOLUNTEER_SKILL` DISABLE KEYS */;
INSERT INTO `VOLUNTEER_SKILL` VALUES ('365e06e8-74fe-45b8-b604-febf77cf9b3f','Community Outreach',NULL),('365e06e8-74fe-45b8-b604-febf77cf9b3f','Disaster Response',NULL),('365e06e8-74fe-45b8-b604-febf77cf9b3f','First Aid',NULL),('365e06e8-74fe-45b8-b604-febf77cf9b3f','Fundraising',NULL),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','Community Outreach',NULL),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','Cooking',NULL),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','First Aid',NULL),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','Fundraising',NULL),('9fa4355d-cb8a-4f8b-9a7f-af0622d466b3','Public Speaking',NULL),('a6107216-bf2e-4c14-b4c6-342741323148','Child Care',NULL),('a6107216-bf2e-4c14-b4c6-342741323148','Community Outreach',NULL),('a6107216-bf2e-4c14-b4c6-342741323148','Cooking',NULL),('a6107216-bf2e-4c14-b4c6-342741323148','Elderly Assistance',NULL),('fa919eaa-dab8-43e8-a570-2bccb4df285a','Animal Welfare',NULL),('fa919eaa-dab8-43e8-a570-2bccb4df285a','Cooking',NULL),('fa919eaa-dab8-43e8-a570-2bccb4df285a','Environmental Cleanup',NULL),('fa919eaa-dab8-43e8-a570-2bccb4df285a','First Aid',NULL);
/*!40000 ALTER TABLE `VOLUNTEER_SKILL` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-22 17:05:32
