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
-- Table structure for table `subcategorias`
--

DROP TABLE IF EXISTS `subcategorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subcategorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `categoria_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_categoria_id` (`categoria_id`),
  CONSTRAINT `fk_categoria_id` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subcategorias`
--

LOCK TABLES `subcategorias` WRITE;
/*!40000 ALTER TABLE `subcategorias` DISABLE KEYS */;
INSERT INTO `subcategorias` VALUES (1,'Electricidad',1),(2,'Fontanería',1),(3,'Reparación de electrodomésticos',1),(4,'Carpintería',1),(5,'Pintura y decoración',1),(6,'Limpieza de hogares',2),(7,'Limpieza de oficinas',2),(8,'Limpieza de ventanas',2),(9,'Limpieza de alfombras',2),(10,'Servicios de desinfección',2),(11,'Mantenimiento de jardines',3),(12,'Diseño de paisajes',3),(13,'Instalación de sistemas de riego',3),(14,'Poda de árboles',3),(15,'Decoración con plantas',3),(16,'Cuidado de ancianos',4),(17,'Cuidado de niños (niñeras)',4),(18,'Servicios de fisioterapia',4),(19,'Masajes a domicilio',4),(20,'Entrenadores personales',4),(21,'Peluquería a domicilio',5),(22,'Maquillaje para eventos',5),(23,'Manicura y pedicura',5),(24,'Depilación',5),(25,'Servicios de spa',5),(26,'Transporte de mercancías',6),(27,'Mudanzas y fletes',6),(28,'Renta de vehículos',6),(29,'Servicios de chofer privado',6),(30,'Transporte de mascotas',6),(31,'Clases particulares (matemáticas, idiomas, etc.)',7),(32,'Entrenamiento de habilidades técnicas (programación, diseño)',7),(33,'Servicios de tutoría',7),(34,'Preparación de exámenes',7),(35,'Clases de música',7),(36,'Organización de eventos',8),(37,'Catering',8),(38,'Fotografía y videografía',8),(39,'DJ y entretenimiento',8),(40,'Decoración de eventos',8),(41,'Consultoría financiera',9),(42,'Consultoría legal',9),(43,'Consultoría de marketing',9),(44,'Asesoría en recursos humanos',9),(45,'Coaching personal',9),(46,'Diseño gráfico',10),(47,'Desarrollo web y aplicaciones',10),(48,'Edición de videos y fotos',10),(49,'Gestión de redes sociales',10),(50,'Servicios de SEO y marketing digital',10),(51,'Paseo de perros',11),(52,'Cuidado y alimentación de mascotas',11),(53,'Entrenamiento de mascotas',11),(54,'Estética y peluquería para mascotas',11),(55,'Consultas veterinarias a domicilio',11);
/*!40000 ALTER TABLE `subcategorias` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-08 20:10:47
