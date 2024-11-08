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
-- Table structure for table `servicios`
--

DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servicios` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `profesional_id` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `precio` decimal(10,2) DEFAULT NULL,
  `calificacion` int DEFAULT NULL,
  `sub_categoria` int DEFAULT NULL,
  `provincia` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `localidad` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `servicios`
--

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,1,'Electricidad','Instalación y reparación de sistemas eléctricos.',185.45,1,1,'Buenos Aires','General Pueyrredon','Mar del Plata'),(2,2,'Fontanería','Reparación de tuberías y sistemas de agua.',150.00,2,2,'Buenos Aires','General Pueyrredon','Mar del Plata'),(3,3,'Reparación de electrodomésticos','Servicio técnico para electrodomésticos.',200.00,3,3,'Buenos Aires','General Pueyrredon','Mar del Plata'),(4,4,'Carpintería','Fabricación y reparación de muebles.',175.00,4,4,'Buenos Aires','General Pueyrredon','Mar del Plata'),(5,5,'Pintura y decoración','Servicios de pintura y decoración de interiores.',220.00,5,5,'Buenos Aires','General Pueyrredon','Mar del Plata'),(6,1,'Electricidad','Instalación y reparación de sistemas eléctricos.',185.45,1,1,'Buenos Aires','General Pueyrredon','Mar del Plata'),(7,2,'Fontanería','Reparación de tuberías y sistemas de agua.',150.00,2,2,'Buenos Aires','General Pueyrredon','Mar del Plata'),(8,3,'Reparación de electrodomésticos','Servicio técnico para electrodomésticos.',200.00,3,3,'Buenos Aires','General Pueyrredon','Mar del Plata'),(9,4,'Carpintería','Fabricación y reparación de muebles.',175.00,4,4,'Buenos Aires','General Pueyrredon','Mar del Plata'),(10,5,'Pintura y decoración','Servicios de pintura y decoración de interiores.',220.00,5,5,'Buenos Aires','General Pueyrredon','Mar del Plata'),(11,6,'Limpieza de hogares','Limpieza profunda y mantenimiento del hogar.',100.00,4,6,'Buenos Aires','General Pueyrredon','Mar del Plata'),(12,7,'Limpieza de oficinas','Servicios de limpieza para oficinas.',120.00,3,7,'Buenos Aires','General Pueyrredon','Mar del Plata'),(13,8,'Limpieza de ventanas','Limpieza profesional de ventanas.',90.00,5,8,'Buenos Aires','General Pueyrredon','Mar del Plata'),(14,9,'Limpieza de alfombras','Limpieza y mantenimiento de alfombras.',110.00,4,9,'Buenos Aires','General Pueyrredon','Mar del Plata'),(15,10,'Servicios de desinfección','Desinfección de espacios contra virus y bacterias.',130.00,5,10,'Buenos Aires','General Pueyrredon','Mar del Plata'),(16,11,'Mantenimiento de jardines','Cuidado y mantenimiento de jardines.',140.00,3,11,'Buenos Aires','General Pueyrredon','Mar del Plata'),(17,12,'Diseño de paisajes','Diseño y planificación de paisajes.',160.00,4,12,'Buenos Aires','General Pueyrredon','Mar del Plata'),(18,13,'Instalación de sistemas de riego','Instalación y mantenimiento de sistemas de riego.',180.00,5,13,'Buenos Aires','General Pueyrredon','Mar del Plata'),(19,14,'Poda de árboles','Poda y mantenimiento de árboles.',190.00,3,14,'Buenos Aires','General Pueyrredon','Mar del Plata'),(20,15,'Decoración con plantas','Decoración interior con plantas.',170.00,4,15,'Buenos Aires','General Pueyrredon','Mar del Plata'),(21,16,'Cuidado de ancianos','Cuidado y asistencia para personas mayores.',210.00,5,16,'Buenos Aires','General Pueyrredon','Mar del Plata'),(22,17,'Cuidado de niños (niñeras)','Cuidado profesional para niños.',220.00,3,17,'Buenos Aires','General Pueyrredon','Mar del Plata'),(23,18,'Servicios de fisioterapia','Sesiones de fisioterapia a domicilio.',230.00,4,18,'Buenos Aires','General Pueyrredon','Mar del Plata'),(24,19,'Masajes a domicilio','Servicios de masajes relajantes a domicilio.',240.00,5,19,'Buenos Aires','General Pueyrredon','Mar del Plata'),(25,20,'Entrenadores personales','Entrenamiento físico personalizado.',250.00,3,20,'Buenos Aires','General Pueyrredon','Mar del Plata'),(26,21,'Peluquería a domicilio','Servicios de peluquería en casa.',260.00,4,21,'Buenos Aires','General Pueyrredon','Mar del Plata'),(27,22,'Maquillaje para eventos','Maquillaje profesional para eventos especiales.',270.00,5,22,'Buenos Aires','General Pueyrredon','Mar del Plata'),(28,23,'Manicura y pedicura','Servicios de manicura y pedicura a domicilio.',280.00,3,23,'Buenos Aires','General Pueyrredon','Mar del Plata'),(29,24,'Depilación','Servicios profesionales de depilación.',290.00,4,24,'Buenos Aires','General Pueyrredon','Mar del Plata'),(30,25,'Servicios de spa','Tratamientos relajantes en casa.',300.00,5,25,'Buenos Aires','General Pueyrredon','Mar del Plata'),(31,26,'Transporte de mercancías','Transporte seguro de mercancías.',310.00,3,26,'Buenos Aires','General Pueyrredon','Mar del Plata'),(32,27,'Mudanzas y fletes','Servicios completos de mudanza.',320.00,4,27,'Buenos Aires','General Pueyrredon','Mar del Plata'),(33,28,'Renta de vehículos','Alquiler de vehículos para transporte.',330.00,5,28,'Buenos Aires','General Pueyrredon','Mar del Plata'),(34,29,'Servicios de chofer privado','Chofer privado para transporte personal.',340.00,3,29,'Buenos Aires','General Pueyrredon','Mar del Plata'),(35,30,'Transporte de mascotas','Transporte seguro para mascotas.',350.00,4,30,'Buenos Aires','General Pueyrredon','Mar del Plata'),(36,31,'Clases particulares (matemáticas, idiomas, etc.)','Clases particulares en diversas materias.',360.00,5,31,'Buenos Aires','General Pueyrredon','Mar del Plata'),(37,32,'Entrenamiento de habilidades técnicas (programación, diseño)','Entrenamiento en habilidades técnicas específicas.',370.00,3,32,'Buenos Aires','General Pueyrredon','Mar del Plata'),(38,33,'Servicios de tutoría','Tutoría personalizada para estudiantes.',380.00,4,33,'Buenos Aires','General Pueyrredon','Mar del Plata'),(39,34,'Preparación de exámenes','Preparación intensiva para exámenes importantes.',390.00,5,34,'Buenos Aires','General Pueyrredon','Mar del Plata'),(40,35,'Clases de música','Clases particulares de música e instrumentos.',400.00,3,35,'Buenos Aires','General Pueyrredon','Mar del Plata'),(41,36,'Organización de eventos','Planificación y organización completa de eventos.',410.00,4,36,'Buenos Aires','General Pueyrredon','Mar del Plata'),(42,37,'Catering','Servicios completos de catering para eventos.',420.00,5,37,'Buenos Aires','General Pueyrredon','Mar del Plata');
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-08 20:10:46
