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
  `categoria` int DEFAULT NULL,
  `descripcion` text,
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
INSERT INTO `servicios` (profesional_id, categoria, descripcion, calificacion, sub_categoria, provincia, departamento, localidad) VALUES
(1, 1, 'Servicio de reparación de electricidad para el hogar', 5, 1, 'Buenos Aires', 'Capital Federal', 'Palermo'),
(2, 1, 'Servicio de fontanería para arreglos urgentes', 4, 2, 'Buenos Aires', 'Capital Federal', 'Recoleta'),
(3, 1, 'Reparación de electrodomésticos a domicilio', 4, 3, 'Córdoba', 'Córdoba Capital', 'Nueva Córdoba'),
(4, 2, 'Limpieza profunda de hogar', 5, 6, 'Buenos Aires', 'La Matanza', 'San Justo'),
(5, 2, 'Servicio de limpieza de oficinas', 4, 7, 'Buenos Aires', 'Morón', 'Castelar'),
(6, 3, 'Mantenimiento de jardines en casas particulares', 5, 11, 'Santa Fe', 'Rosario', 'Centro'),
(7, 3, 'Diseño y paisajismo para jardines', 4, 12, 'Córdoba', 'Córdoba Capital', 'Alta Córdoba'),
(8, 4, 'Cuidados especializados para ancianos a domicilio', 5, 16, 'Buenos Aires', 'Capital Federal', 'Belgrano'),
(9, 5, 'Servicio de peluquería a domicilio', 4, 21, 'Mendoza', 'Mendoza Capital', 'Centro'),
(10, 6, 'Servicio de mudanza completa con embalaje', 5, 27, 'Buenos Aires', 'Quilmes', 'Bernal'),
(11, 7, 'Clases particulares de matemática', 5, 31, 'Buenos Aires', 'Capital Federal', 'Villa Urquiza'),
(12, 8, 'Fotografía profesional para eventos', 5, 38, 'Buenos Aires', 'San Isidro', 'Martínez'),
(13, 9, 'Consultoría financiera para empresas', 5, 41, 'Buenos Aires', 'Capital Federal', 'Microcentro'),
(14, 10, 'Desarrollo web y aplicaciones móviles', 5, 47, 'Santa Fe', 'Rosario', 'Centro'),
(15, 11, 'Paseo y cuidado de perros', 4, 51, 'Buenos Aires', 'Capital Federal', 'Parque Patricios');

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;

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
