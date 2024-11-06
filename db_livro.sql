/*
SQLyog Ultimate v9.30 
MySQL - 5.7.18-log : Database - db_livros
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`db_livros` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `db_livros`;

/*Table structure for table `assunto` */

DROP TABLE IF EXISTS `assunto`;

CREATE TABLE `assunto` (
  `CodAs` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(20) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`CodAs`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Table structure for table `autor` */

DROP TABLE IF EXISTS `autor`;

CREATE TABLE `autor` (
  `CodAu` int(11) NOT NULL AUTO_INCREMENT,
  `Nome` varchar(40) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`CodAu`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Table structure for table `livro` */

DROP TABLE IF EXISTS `livro`;

CREATE TABLE `livro` (
  `Codl` int(11) NOT NULL AUTO_INCREMENT,
  `Titulo` varchar(40) NOT NULL,
  `Editora` varchar(40) NOT NULL,
  `AnoPublicacao` varchar(4) NOT NULL,
  `ValorUnitario` decimal(11,2) NOT NULL,
  `EstoqueInicial` int(11) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`Codl`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `livro_assunto` */

DROP TABLE IF EXISTS `livro_assunto`;

CREATE TABLE `livro_assunto` (
  `Livro_Codl` int(11) NOT NULL,
  `Assunto_CodAs` int(11) NOT NULL,
  PRIMARY KEY (`Livro_Codl`,`Assunto_CodAs`),
  KEY `Livro_Assunto_FKIndex2_idx` (`Assunto_CodAs`),
  CONSTRAINT `Livro_Assunto_FKIndex1` FOREIGN KEY (`Livro_Codl`) REFERENCES `livro` (`Codl`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Livro_Assunto_FKIndex2` FOREIGN KEY (`Assunto_CodAs`) REFERENCES `assunto` (`CodAs`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `livro_autor` */

DROP TABLE IF EXISTS `livro_autor`;

CREATE TABLE `livro_autor` (
  `Livro_Codl` int(11) NOT NULL,
  `Autor_CodAu` int(11) NOT NULL,
  PRIMARY KEY (`Livro_Codl`,`Autor_CodAu`),
  KEY `Livro_Autor_FKIndex2_idx` (`Autor_CodAu`),
  CONSTRAINT `Livro_Autor_FKIndex1` FOREIGN KEY (`Livro_Codl`) REFERENCES `livro` (`Codl`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Livro_Autor_FKIndex2` FOREIGN KEY (`Autor_CodAu`) REFERENCES `autor` (`CodAu`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `tipo_venda` */

DROP TABLE IF EXISTS `tipo_venda`;

CREATE TABLE `tipo_venda` (
  `CodTv` int(11) NOT NULL AUTO_INCREMENT,
  `Descricao` varchar(20) NOT NULL,
  `PorcentagemDesconto` decimal(5,2) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`CodTv`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Table structure for table `venda` */

DROP TABLE IF EXISTS `venda`;

CREATE TABLE `venda` (
  `CodV` int(11) NOT NULL AUTO_INCREMENT,
  `Cliente` varchar(50) NOT NULL,
  `DataVenda` datetime NOT NULL,
  `Tipo_Venda_CodTv` int(11) NOT NULL,
  `consumidorFinal` tinyint(1) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`CodV`),
  KEY `venda_FKIndex1_idx` (`Tipo_Venda_CodTv`),
  CONSTRAINT `venda_FKIndex1` FOREIGN KEY (`Tipo_Venda_CodTv`) REFERENCES `tipo_venda` (`CodTv`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `venda_livro` */

DROP TABLE IF EXISTS `venda_livro`;

CREATE TABLE `venda_livro` (
  `CodVl` int(11) NOT NULL AUTO_INCREMENT,
  `Livro_Codl` int(11) NOT NULL,
  `Venda_CodV` int(11) NOT NULL,
  `Quantidade` int(11) NOT NULL,
  `ValorUnitario` decimal(11,2) NOT NULL,
  `ValorDesconto` decimal(11,2) NOT NULL,
  `ValorTotal` decimal(15,2) NOT NULL,
  `Ativo` tinyint(1) NOT NULL,
  PRIMARY KEY (`CodVl`),
  KEY `Venda_Livro_FKIndex1_idx` (`Livro_Codl`),
  KEY `Venda_Livro_FKIndex2_idx` (`Venda_CodV`),
  CONSTRAINT `Venda_Livro_FKIndex1` FOREIGN KEY (`Livro_Codl`) REFERENCES `livro` (`Codl`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `Venda_Livro_FKIndex2` FOREIGN KEY (`Venda_CodV`) REFERENCES `venda` (`CodV`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `viewrelatoriolivrosdoautor` */

DROP TABLE IF EXISTS `viewrelatoriolivrosdoautor`;

/*!50001 DROP VIEW IF EXISTS `viewrelatoriolivrosdoautor` */;
/*!50001 DROP TABLE IF EXISTS `viewrelatoriolivrosdoautor` */;

/*!50001 CREATE TABLE  `viewrelatoriolivrosdoautor`(
 `AutorId` int(11) ,
 `NomeAutor` varchar(40) ,
 `LivrosAnoPublicacaoComAssuntos` text ,
 `Editoras` text 
)*/;

/*View structure for view viewrelatoriolivrosdoautor */

/*!50001 DROP TABLE IF EXISTS `viewrelatoriolivrosdoautor` */;
/*!50001 DROP VIEW IF EXISTS `viewrelatoriolivrosdoautor` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `viewrelatoriolivrosdoautor` AS select `a`.`CodAu` AS `AutorId`,`a`.`Nome` AS `NomeAutor`,group_concat(distinct concat(`l`.`Titulo`,concat(' - ',`l`.`AnoPublicacao`,' - '),' (',(select group_concat(`a2`.`Descricao` order by `a2`.`Descricao` ASC separator ', ') from (`livro_assunto` `la2` join `assunto` `a2` on((`la2`.`Assunto_CodAs` = `a2`.`CodAs`))) where ((`la2`.`Livro_Codl` = `l`.`Codl`) and `a2`.`Ativo`)),')') order by `l`.`Titulo` ASC separator ', ') AS `LivrosAnoPublicacaoComAssuntos`,group_concat(distinct `l`.`Editora` order by `l`.`Editora` ASC separator ', ') AS `Editoras` from ((`autor` `a` join `livro_autor` `la` on((`a`.`CodAu` = `la`.`Autor_CodAu`))) join `livro` `l` on((`la`.`Livro_Codl` = `l`.`Codl`))) where (`a`.`Ativo` and `l`.`Ativo`) group by `a`.`CodAu`,`a`.`Nome` */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
