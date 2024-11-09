-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: laburappdb
-- ------------------------------------------------------
-- Server version	8.0.40

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `contacto` varchar(255) DEFAULT NULL,
  `ciudad` varchar(255) DEFAULT NULL,
  `calificacion_promedio` decimal(3,2) DEFAULT NULL,
  `nacimiento` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'mwall@example.com','E41)Cdzt@I','Connie','Barton','+1-386-748-5464x8451','Angelafurt',3.99,NULL),(2,'suzannemendoza@example.org','cGT37K@w%%','Rodney','Johnson','715-677-7277','Ramseyhaven',1.96,NULL),(3,'potterkenneth@example.com','KC4oA2zrU!','Joshua','Carrillo','477-749-0374x035','New James',2.40,NULL),(4,'mcdowellrachel@example.com','@eP8mKyeC0','John','Hale','001-652-669-8790x2864','Port Earl',1.82,NULL),(5,'schultzsamuel@example.org','#89iRApBBi','Joshua','Hernandez','001-461-640-4780x07305','Port Kelsey',3.26,NULL),(6,'stewarteric@example.net','1LX7olli*V','Emily','Phillips','+1-433-989-8387x0814','North Christine',4.05,NULL),(7,'jonathonperez@example.com','j6ym51Nu(w','Sean','Edwards','935-866-0533','Colemanside',4.36,NULL),(8,'meghan36@example.org','_ThlzS4rp9','Bruce','Medina','906-615-8268x00369','Johnsonhaven',4.28,NULL),(9,'susanjones@example.org','+2U4vsAnoi','Stephen','Rogers','7573736456','North Bernard',3.10,NULL),(10,'sarahmay@example.org','^2B7V^Dz_M','Kelly','Erickson','+1-587-406-2856x21302','North Christinebury',2.75,NULL),(11,'pzimmerman@example.com','*P28Adse2m','Andrea','Barber','865.997.9714','Jacksonstad',4.49,NULL),(12,'charles32@example.com','+@8vN&x*bb','James','Adams','823-884-6941x0196','North Jamie',4.05,NULL),(13,'hannahmeyers@example.com','D2wX%AFr#&','Danny','Baker','001-954-221-5925x615','Haynesshire',4.11,NULL),(14,'gcarter@example.org','5%0xKGg58L','Darrell','Lopez','924-776-5598x0995','South Erica',2.36,NULL),(15,'ellislisa@example.org','^vBYvKPwO3','Spencer','Allen','5756418633','Port Miketon',2.55,NULL),(16,'wolsen@example.net','j+4_0Gcfu@','Michael','Davis','265-502-4188','Port Christina',1.92,NULL),(17,'hornangela@example.net','b9!J7Yif)y','Kathryn','Kim','(294)490-5541x60221','North Gabriellaborough',1.53,NULL),(18,'howardmark@example.com','!sLBCUvN49','Wendy','Roach','4556810741','East Sarah',4.02,NULL),(19,'sullivanmelissa@example.net','17W^9DfFM!','Claire','Gordon','815-857-7034','Melissashire',3.71,NULL),(20,'blake47@example.org',')9oaa9Yl)L','Stephanie','Anderson','265-297-3474x765','South Briannaton',3.73,NULL),(21,'theresawatts@example.org','$3btVj+rGT','Melanie','Reese','559.540.7785x5649','West Douglas',2.74,NULL),(22,'ericowens@example.com','&s%2JxUI$^','Steven','Gallagher','+1-655-333-9343x28477','Sharonchester',2.37,NULL),(23,'millsolivia@example.com','AtBZl%7m!6','Denise','Maynard','947-769-4419x5813','North Emma',3.36,NULL),(24,'trobinson@example.net','^8QyOwWocU','Katrina','Lee','+1-911-925-4738x06355','Port Kendraville',2.54,NULL),(25,'victor66@example.org','mcz%4Jwo4r','Thomas','Crawford','(980)953-6526x3539','Port Heidichester',3.83,NULL),(26,'andrea57@example.net','3YS6rC!p&^','Beverly','Irwin','5499068311','Robertbury',4.60,NULL),(27,'barnesangela@example.net','ts7I&9FzoV','Paula','Short','(927)724-3542x8356','West Katherinechester',3.34,NULL),(28,'jasminechung@example.com','G6AIHXwy(W','Andre','Cole','(745)312-2559x27479','Molinaland',1.73,NULL),(29,'greenandrew@example.net','+8hYfXm9+2','Zachary','Hurst','428.814.9385','Port Kimberly',1.18,NULL),(30,'william23@example.com',')9M^SoeK%L','Michelle','Kelly','217-882-6927x0582','West Tamarafurt',4.76,NULL),(31,'xholmes@example.net','_rWQvTitT2','Eric','Lawson','669.947.6628','North Jonathan',3.25,NULL),(32,'daniel00@example.com','L8QspQzr*6','Jonathan','Garza','843.636.9772x13689','Meganmouth',2.63,NULL),(33,'sarahmiller@example.org','x+1+PpWgab','Lucas','Nelson','498-901-5609x3646','South Michellehaven',3.63,NULL),(34,'allisonjames@example.com','A(j+*3CPTg','Michael','Ayala','001-633-538-2053x9980','Ryanborough',3.94,NULL),(35,'sullivanlinda@example.org','%cF_DQpg0e','John','Mcintosh','9354378177','New Matthew',1.61,NULL),(36,'kenneth27@example.org','(853ZJokiy','Cheryl','Robinson','(653)863-5247x488','Lake Nicholas',4.35,NULL),(37,'patriciacochran@example.net','5jcIBX*w$5','Tracey','Blanchard','212.663.7516','Michaelshire',3.04,NULL),(38,'hnixon@example.com','%JwDcQFt45','Eugene','Ray','863-603-2000','West Linda',1.94,NULL),(39,'jonjohnson@example.net','W7_15Iad2$','Thomas','Gates','7452745669','North Jennaview',1.26,NULL),(40,'wbrown@example.com','@baU$rS1*6','Vincent','Hopkins','648-295-8025x36644','Currybury',1.96,NULL),(41,'zsims@example.org','n7)MipIw)A','Richard','Hall','001-848-200-3104x578','Emilymouth',2.89,NULL),(42,'ashley96@example.net','78O6Qdf2&8','Anna','Leach','+1-880-700-9864','Cookborough',2.81,NULL),(43,'glenanderson@example.com','epOH(%rf*7','Patrick','Stone','355-820-3519x0006','Katrinaview',1.19,NULL),(44,'vincentjohnson@example.com','+1A2CLqH5^','Cheyenne','Meadows','795-783-7331','Millerfort',4.14,NULL),(45,'harrisondevin@example.com','l!2Jy5p17_','David','Barry','2732852825','Lake Kathrynland',4.37,NULL),(46,'mark93@example.org','3s#F6aAs0(','Vanessa','Barr','322-989-2655x5037','Lake Alicia',2.32,NULL),(47,'hmartinez@example.net','^k09Z+awU1','Jeffery','Hunt','+1-353-495-5645x033','Lake Elizabeth',3.52,NULL),(48,'shawjose@example.org','^k21QFO^^4','Barbara','Adams','+1-434-968-1516x0663','West Amber',4.54,NULL),(49,'cannonamanda@example.net','*2sWIr++^Q','Lisa','Graves','882.349.5029x280','Royland',3.09,NULL),(50,'lmccann@example.org','_5BBohB+S6','April','Welch','228.833.3827','West Sara',4.78,NULL),(51,'sh@sh.sh','123123',NULL,NULL,NULL,NULL,NULL,NULL),(52,'agus@ser.com','123123',NULL,NULL,NULL,NULL,NULL,NULL),(53,'pepe@s.s','$2b$12$3HWnc.dUQzKHLjUKmllbl.3ZNpJiFIkf4kETGM3XWyhcCuXj/vSqa',NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-08 20:10:49
