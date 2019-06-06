-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema apollonprojectdb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema apollonprojectdb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `apollonprojectdb` DEFAULT CHARACTER SET utf8 ;
USE `apollonprojectdb` ;

-- -----------------------------------------------------
-- Table `apollonprojectdb`.`luogo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`luogo` (
  `idluogo` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `luogo_idluogo` INT NULL,
  PRIMARY KEY (`idluogo`),
  INDEX `fk_luogo_luogo_idx` (`luogo_idluogo` ASC),
  CONSTRAINT `fk_luogo_luogo`
    FOREIGN KEY (`luogo_idluogo`)
    REFERENCES `apollonprojectdb`.`luogo` (`idluogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`persona`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`persona` (
  `idpersona` INT NOT NULL AUTO_INCREMENT,
  `codice_fiscale` VARCHAR(45) NOT NULL,
  `nome` VARCHAR(200) NOT NULL,
  `cognome` VARCHAR(200) NOT NULL,
  `data_nascita` DATE NOT NULL,
  `numero_telefono` VARCHAR(45) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `luogo_idluogo` INT NOT NULL,
  PRIMARY KEY (`idpersona`),
  INDEX `fk_persona_luogo1_idx` (`luogo_idluogo` ASC),
  CONSTRAINT `fk_persona_luogo1`
    FOREIGN KEY (`luogo_idluogo`)
    REFERENCES `apollonprojectdb`.`luogo` (`idluogo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`produttore`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`produttore` (
  `idproduttore` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`idproduttore`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`modello`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`modello` (
  `idmodello` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `produttore_idproduttore` INT NOT NULL,
  PRIMARY KEY (`idmodello`),
  INDEX `fk_modello_produttore1_idx` (`produttore_idproduttore` ASC),
  CONSTRAINT `fk_modello_produttore1`
    FOREIGN KEY (`produttore_idproduttore`)
    REFERENCES `apollonprojectdb`.`produttore` (`idproduttore`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`smartphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`smartphone` (
  `idsmartphone` INT NOT NULL AUTO_INCREMENT,
  `imei` VARCHAR(45) NOT NULL,
  `modello_idmodello` INT NOT NULL,
  PRIMARY KEY (`idsmartphone`),
  INDEX `fk_smartphone_modello1_idx` (`modello_idmodello` ASC),
  CONSTRAINT `fk_smartphone_modello1`
    FOREIGN KEY (`modello_idmodello`)
    REFERENCES `apollonprojectdb`.`modello` (`idmodello`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`persona_has_smartphone`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`persona_has_smartphone` (
  `persona_idpersona` INT NOT NULL,
  `smartphone_idsmartphone` INT NOT NULL,
  PRIMARY KEY (`persona_idpersona`, `smartphone_idsmartphone`),
  INDEX `fk_persona_has_smartphone_smartphone1_idx` (`smartphone_idsmartphone` ASC),
  INDEX `fk_persona_has_smartphone_persona1_idx` (`persona_idpersona` ASC),
  CONSTRAINT `fk_persona_has_smartphone_persona1`
    FOREIGN KEY (`persona_idpersona`)
    REFERENCES `apollonprojectdb`.`persona` (`idpersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_persona_has_smartphone_smartphone1`
    FOREIGN KEY (`smartphone_idsmartphone`)
    REFERENCES `apollonprojectdb`.`smartphone` (`idsmartphone`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`misurazione_gps`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`misurazione_gps` (
  `idmisurazione_gps` INT NOT NULL AUTO_INCREMENT,
  `latitudine` DOUBLE NOT NULL,
  `longitudine` DOUBLE NOT NULL,
  PRIMARY KEY (`idmisurazione_gps`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`report` (
  `idreport` INT NOT NULL AUTO_INCREMENT,
  `data_report` DATETIME NOT NULL,
  `data_localizzazione` DATETIME NOT NULL,
  `smartphone_idsmartphone` INT NOT NULL,
  `misurazione_gps_idmisurazione_gps` INT NOT NULL,
  `persona_idpersona` INT NOT NULL,
  PRIMARY KEY (`idreport`),
  INDEX `fk_report_smartphone1_idx` (`smartphone_idsmartphone` ASC),
  INDEX `fk_report_misurazione_gps1_idx` (`misurazione_gps_idmisurazione_gps` ASC),
  INDEX `fk_report_persona1_idx` (`persona_idpersona` ASC),
  CONSTRAINT `fk_report_smartphone1`
    FOREIGN KEY (`smartphone_idsmartphone`)
    REFERENCES `apollonprojectdb`.`smartphone` (`idsmartphone`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_report_misurazione_gps1`
    FOREIGN KEY (`misurazione_gps_idmisurazione_gps`)
    REFERENCES `apollonprojectdb`.`misurazione_gps` (`idmisurazione_gps`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_report_persona1`
    FOREIGN KEY (`persona_idpersona`)
    REFERENCES `apollonprojectdb`.`persona` (`idpersona`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`gestore`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`gestore` (
  `idgestore` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgestore`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`unita_misura`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`unita_misura` (
  `idunita_misura` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idunita_misura`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`misurazione_rete_cellulare`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`misurazione_rete_cellulare` (
  `idmisurazione_rete_cellulare` INT NOT NULL AUTO_INCREMENT,
  `valore` FLOAT NOT NULL,
  `stato_rete_dati` VARCHAR(45) NOT NULL,
  `unita_misura_idunita_misura` INT NOT NULL,
  `gestore_idgestore` INT NOT NULL,
  `report_idreport` INT NOT NULL,
  PRIMARY KEY (`idmisurazione_rete_cellulare`, `report_idreport`),
  INDEX `fk_misurazione_rete_cellulare_gestore1_idx` (`gestore_idgestore` ASC),
  INDEX `fk_misurazione_rete_cellulare_report1_idx` (`report_idreport` ASC),
  INDEX `fk_misurazione_rete_cellulare_unita_misura1_idx` (`unita_misura_idunita_misura` ASC),
  CONSTRAINT `fk_misurazione_rete_cellulare_gestore1`
    FOREIGN KEY (`gestore_idgestore`)
    REFERENCES `apollonprojectdb`.`gestore` (`idgestore`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_misurazione_rete_cellulare_report1`
    FOREIGN KEY (`report_idreport`)
    REFERENCES `apollonprojectdb`.`report` (`idreport`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_misurazione_rete_cellulare_unita_misura1`
    FOREIGN KEY (`unita_misura_idunita_misura`)
    REFERENCES `apollonprojectdb`.`unita_misura` (`idunita_misura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`generazione`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`generazione` (
  `idgenerazione` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idgenerazione`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`rete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`rete` (
  `idrete` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `generazione_idgenerazione` INT NOT NULL,
  PRIMARY KEY (`idrete`),
  INDEX `fk_rete_generazione1_idx` (`generazione_idgenerazione` ASC),
  CONSTRAINT `fk_rete_generazione1`
    FOREIGN KEY (`generazione_idgenerazione`)
    REFERENCES `apollonprojectdb`.`generazione` (`idgenerazione`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`tipo_rete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`tipo_rete` (
  `idtipo_rete` INT NOT NULL AUTO_INCREMENT,
  `descrizione` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtipo_rete`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`misurazione_rete_cellulare_has_rete`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`misurazione_rete_cellulare_has_rete` (
  `misurazione_rete_cellulare_idmisurazione_rete_cellulare` INT NOT NULL,
  `rete_idrete` INT NOT NULL,
  `tipo_rete_idtipo_rete` INT NOT NULL,
  PRIMARY KEY (`misurazione_rete_cellulare_idmisurazione_rete_cellulare`, `rete_idrete`, `tipo_rete_idtipo_rete`),
  INDEX `fk_misurazione_rete_cellulare_has_rete_rete1_idx` (`rete_idrete` ASC),
  INDEX `fk_misurazione_rete_cellulare_has_rete_misurazione_rete_cel_idx` (`misurazione_rete_cellulare_idmisurazione_rete_cellulare` ASC),
  INDEX `fk_misurazione_rete_cellulare_has_rete_tipo_rete1_idx` (`tipo_rete_idtipo_rete` ASC),
  CONSTRAINT `fk_misurazione_rete_cellulare_has_rete_misurazione_rete_cellu1`
    FOREIGN KEY (`misurazione_rete_cellulare_idmisurazione_rete_cellulare`)
    REFERENCES `apollonprojectdb`.`misurazione_rete_cellulare` (`idmisurazione_rete_cellulare`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_misurazione_rete_cellulare_has_rete_rete1`
    FOREIGN KEY (`rete_idrete`)
    REFERENCES `apollonprojectdb`.`rete` (`idrete`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_misurazione_rete_cellulare_has_rete_tipo_rete1`
    FOREIGN KEY (`tipo_rete_idtipo_rete`)
    REFERENCES `apollonprojectdb`.`tipo_rete` (`idtipo_rete`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`misurazione_wifi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`misurazione_wifi` (
  `idmisurazione_wifi` INT NOT NULL AUTO_INCREMENT,
  `stato_antenna` TINYINT NOT NULL,
  `report_idreport` INT NOT NULL,
  PRIMARY KEY (`idmisurazione_wifi`, `report_idreport`),
  INDEX `fk_misurazione_wifi_report1_idx` (`report_idreport` ASC),
  CONSTRAINT `fk_misurazione_wifi_report1`
    FOREIGN KEY (`report_idreport`)
    REFERENCES `apollonprojectdb`.`report` (`idreport`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`frequenza`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`frequenza` (
  `idfrequenza` INT NOT NULL AUTO_INCREMENT,
  `valore` FLOAT NOT NULL,
  `canale` INT NOT NULL,
  `unita_misura_idunita_misura` INT NOT NULL,
  PRIMARY KEY (`idfrequenza`),
  INDEX `fk_frequenza_unita_misura1_idx` (`unita_misura_idunita_misura` ASC),
  CONSTRAINT `fk_frequenza_unita_misura1`
    FOREIGN KEY (`unita_misura_idunita_misura`)
    REFERENCES `apollonprojectdb`.`unita_misura` (`idunita_misura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`rete_wifi`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`rete_wifi` (
  `idrete_wifi` INT NOT NULL AUTO_INCREMENT,
  `SSID` VARCHAR(200) NOT NULL,
  `valore` FLOAT NOT NULL,
  `unita_misura_idunita_misura` INT NOT NULL,
  `frequenza_idfrequenza` INT NOT NULL,
  `misurazione_wifi_idmisurazione_wifi` INT NOT NULL,
  PRIMARY KEY (`idrete_wifi`, `misurazione_wifi_idmisurazione_wifi`),
  INDEX `fk_rete_wifi_frequenza1_idx` (`frequenza_idfrequenza` ASC),
  INDEX `fk_rete_wifi_misurazione_wifi1_idx` (`misurazione_wifi_idmisurazione_wifi` ASC),
  INDEX `fk_rete_wifi_unita_misura1_idx` (`unita_misura_idunita_misura` ASC),
  CONSTRAINT `fk_rete_wifi_frequenza1`
    FOREIGN KEY (`frequenza_idfrequenza`)
    REFERENCES `apollonprojectdb`.`frequenza` (`idfrequenza`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rete_wifi_misurazione_wifi1`
    FOREIGN KEY (`misurazione_wifi_idmisurazione_wifi`)
    REFERENCES `apollonprojectdb`.`misurazione_wifi` (`idmisurazione_wifi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_rete_wifi_unita_misura1`
    FOREIGN KEY (`unita_misura_idunita_misura`)
    REFERENCES `apollonprojectdb`.`unita_misura` (`idunita_misura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `apollonprojectdb`.`misurazione_campo_magnetico`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`misurazione_campo_magnetico` (
  `idmisurazione_campo_magnetico` INT NOT NULL AUTO_INCREMENT,
  `valore` DOUBLE NOT NULL,
  `unita_misura_idunita_misura` INT NOT NULL,
  `report_idreport` INT NOT NULL,
  PRIMARY KEY (`idmisurazione_campo_magnetico`, `report_idreport`),
  INDEX `fk_misurazione_campo_magnetico_report1_idx` (`report_idreport` ASC),
  INDEX `fk_misurazione_campo_magnetico_unita_misura1_idx` (`unita_misura_idunita_misura` ASC),
  CONSTRAINT `fk_misurazione_campo_magnetico_report1`
    FOREIGN KEY (`report_idreport`)
    REFERENCES `apollonprojectdb`.`report` (`idreport`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_misurazione_campo_magnetico_unita_misura1`
    FOREIGN KEY (`unita_misura_idunita_misura`)
    REFERENCES `apollonprojectdb`.`unita_misura` (`idunita_misura`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

USE `apollonprojectdb` ;

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`coordinate_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`coordinate_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`coordinate_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`coordinate_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`coordinate_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`coordinate_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`coordinate_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`coordinate_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_ora_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_ora_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_ora_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_ora_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_ora_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_ora_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_ora_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_ora_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_giorno_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_giorno_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_giorno_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_giorno_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_giorno_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_giorno_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_giorno_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_giorno_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_mese_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_mese_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_mese_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_mese_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_mese_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_mese_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_mese_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_mese_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_anno_zoom1`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_anno_zoom1` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_anno_zoom2`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_anno_zoom2` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_anno_zoom3`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_anno_zoom3` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- Placeholder table for view `apollonprojectdb`.`media_anno_zoom4`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `apollonprojectdb`.`media_anno_zoom4` (`idmisurazione_gps` INT, `latitudine` INT, `longitudine` INT, `media` INT, `weight` INT, `data` INT);

-- -----------------------------------------------------
-- View `apollonprojectdb`.`coordinate_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`coordinate_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `coordinate_zoom1` AS
    SELECT 
        `misurazione_gps`.`idmisurazione_gps` AS `idmisurazione_gps`,
        ROUND(`misurazione_gps`.`latitudine`, -1) AS `latitudine`,
        ROUND(`misurazione_gps`.`longitudine`, -1) AS `longitudine`
    FROM
        `misurazione_gps`
    WHERE
        `misurazione_gps`.`idmisurazione_gps` IN (SELECT 
                MIN(`misurazione_gps`.`idmisurazione_gps`)
            FROM
                `misurazione_gps`
            GROUP BY ROUND(`misurazione_gps`.`latitudine`, -1) , ROUND(`misurazione_gps`.`longitudine`, -1));

-- -----------------------------------------------------
-- View `apollonprojectdb`.`coordinate_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`coordinate_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `coordinate_zoom2` AS
    SELECT 
        `misurazione_gps`.`idmisurazione_gps` AS `idmisurazione_gps`,
        ROUND(`misurazione_gps`.`latitudine`, 1) AS `latitudine`,
        ROUND(`misurazione_gps`.`longitudine`, 1) AS `longitudine`
    FROM
        `misurazione_gps`
    WHERE
        `misurazione_gps`.`idmisurazione_gps` IN (SELECT 
                MIN(`misurazione_gps`.`idmisurazione_gps`)
            FROM
                `misurazione_gps`
            GROUP BY ROUND(`misurazione_gps`.`latitudine`, 1) , ROUND(`misurazione_gps`.`longitudine`, 1));

-- -----------------------------------------------------
-- View `apollonprojectdb`.`coordinate_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`coordinate_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `coordinate_zoom3` AS
    SELECT 
        `misurazione_gps`.`idmisurazione_gps` AS `idmisurazione_gps`,
        ROUND(`misurazione_gps`.`latitudine`, 3) AS `latitudine`,
        ROUND(`misurazione_gps`.`longitudine`, 3) AS `longitudine`
    FROM
        `misurazione_gps`
    WHERE
        `misurazione_gps`.`idmisurazione_gps` IN (SELECT 
                MIN(`misurazione_gps`.`idmisurazione_gps`)
            FROM
                `misurazione_gps`
            GROUP BY ROUND(`misurazione_gps`.`latitudine`, 3) , ROUND(`misurazione_gps`.`longitudine`, 3));

-- -----------------------------------------------------
-- View `apollonprojectdb`.`coordinate_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`coordinate_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `coordinate_zoom4` AS
    SELECT 
        `misurazione_gps`.`idmisurazione_gps` AS `idmisurazione_gps`,
        ROUND(`misurazione_gps`.`latitudine`, 5) AS `latitudine`,
        ROUND(`misurazione_gps`.`longitudine`, 5) AS `longitudine`
    FROM
        `misurazione_gps`
    WHERE
        `misurazione_gps`.`idmisurazione_gps` IN (SELECT 
                MIN(`misurazione_gps`.`idmisurazione_gps`)
            FROM
                `misurazione_gps`
            GROUP BY ROUND(`misurazione_gps`.`latitudine`, 5) , ROUND(`misurazione_gps`.`longitudine`, 5));

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_zoom4` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`
    FROM
        (SELECT 
            coordinate_zoom4.idmisurazione_gps,
                coordinate_zoom4.latitudine,
                coordinate_zoom4.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`
        FROM
            coordinate_zoom4, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 5) = coordinate_zoom4.latitudine
                AND ROUND(misurazione_gps.longitudine, 5) = coordinate_zoom4.longitudine
        GROUP BY latitudine , longitudine) AS `View`;

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_zoom3` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`
    FROM
        (SELECT 
        coordinate_zoom3.idmisurazione_gps,
        coordinate_zoom3.latitudine,
        coordinate_zoom3.longitudine,
        AVG(misurazione_rete_cellulare.valore) AS `media`
    FROM
        coordinate_zoom3,
        misurazione_gps,
        misurazione_rete_cellulare,
        report
    WHERE
        report.idreport = misurazione_rete_cellulare.report_idreport
            AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
            AND ROUND(misurazione_gps.latitudine, 3) = coordinate_zoom3.latitudine
            AND ROUND(misurazione_gps.longitudine, 3) = coordinate_zoom3.longitudine
    GROUP BY latitudine , longitudine
    ) AS `View`;

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_zoom2` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`
    FROM
        (SELECT 
            coordinate_zoom2.idmisurazione_gps,
                coordinate_zoom2.latitudine,
                coordinate_zoom2.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`
        FROM
            coordinate_zoom2, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 1) = coordinate_zoom2.latitudine
                AND ROUND(misurazione_gps.longitudine, 1) = coordinate_zoom2.longitudine
        GROUP BY latitudine , longitudine) AS `View`;

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_zoom1` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`
    FROM
        (SELECT 
            coordinate_zoom1.idmisurazione_gps,
                coordinate_zoom1.latitudine,
                coordinate_zoom1.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`
        FROM
            coordinate_zoom1, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, - 1) = coordinate_zoom1.latitudine
                AND ROUND(misurazione_gps.longitudine, - 1) = coordinate_zoom1.longitudine
        GROUP BY latitudine , longitudine) AS `View`;

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_ora_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_ora_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_ora_zoom1` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom1.idmisurazione_gps,
                coordinate_zoom1.latitudine,
                coordinate_zoom1.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d %k:00:00') AS `data`
        FROM
            coordinate_zoom1, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, - 1) = coordinate_zoom1.latitudine
                AND ROUND(misurazione_gps.longitudine, - 1) = coordinate_zoom1.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d %k') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d %H:%i:%S');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_ora_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_ora_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_ora_zoom2` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom2.idmisurazione_gps,
                coordinate_zoom2.latitudine,
                coordinate_zoom2.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d %k:00:00') AS `data`
        FROM
            coordinate_zoom2, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 1) = coordinate_zoom2.latitudine
                AND ROUND(misurazione_gps.longitudine, 1) = coordinate_zoom2.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d %k') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d %H:%i:%S');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_ora_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_ora_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_ora_zoom3` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom3.idmisurazione_gps,
                coordinate_zoom3.latitudine,
                coordinate_zoom3.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d %k:00:00') AS `data`
        FROM
            coordinate_zoom3, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 3) = coordinate_zoom3.latitudine
                AND ROUND(misurazione_gps.longitudine, 3) = coordinate_zoom3.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d %k') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d %H:%i:%S');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_ora_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_ora_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_ora_zoom4` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom4.idmisurazione_gps,
                coordinate_zoom4.latitudine,
                coordinate_zoom4.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d %k:00:00') AS `data`
        FROM
            coordinate_zoom4, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 5) = coordinate_zoom4.latitudine
                AND ROUND(misurazione_gps.longitudine, 5) = coordinate_zoom4.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d %k') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d %H:%i:%S');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_giorno_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_giorno_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_giorno_zoom1` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom1.idmisurazione_gps,
                coordinate_zoom1.latitudine,
                coordinate_zoom1.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d') AS `data`
        FROM
            coordinate_zoom1, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, - 1) = coordinate_zoom1.latitudine
                AND ROUND(misurazione_gps.longitudine, - 1) = coordinate_zoom1.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_giorno_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_giorno_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_giorno_zoom2` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom2.idmisurazione_gps,
                coordinate_zoom2.latitudine,
                coordinate_zoom2.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d') AS `data`
        FROM
            coordinate_zoom2, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 1) = coordinate_zoom2.latitudine
                AND ROUND(misurazione_gps.longitudine, 1) = coordinate_zoom2.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_giorno_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_giorno_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_giorno_zoom3` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom3.idmisurazione_gps,
                coordinate_zoom3.latitudine,
                coordinate_zoom3.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d') AS `data`
        FROM
            coordinate_zoom3, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 3) = coordinate_zoom3.latitudine
                AND ROUND(misurazione_gps.longitudine, 3) = coordinate_zoom3.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_giorno_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_giorno_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_giorno_zoom4` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom4.idmisurazione_gps,
                coordinate_zoom4.latitudine,
                coordinate_zoom4.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m-%d') AS `data`
        FROM
            coordinate_zoom4, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 5) = coordinate_zoom4.latitudine
                AND ROUND(misurazione_gps.longitudine, 5) = coordinate_zoom4.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m-%d') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m-%d');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_mese_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_mese_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_mese_zoom1` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom1.idmisurazione_gps,
                coordinate_zoom1.latitudine,
                coordinate_zoom1.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m') AS `data`
        FROM
            coordinate_zoom1, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, - 1) = coordinate_zoom1.latitudine
                AND ROUND(misurazione_gps.longitudine, - 1) = coordinate_zoom1.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_mese_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_mese_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_mese_zoom2` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom2.idmisurazione_gps,
                coordinate_zoom2.latitudine,
                coordinate_zoom2.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m') AS `data`
        FROM
            coordinate_zoom2, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 1) = coordinate_zoom2.latitudine
                AND ROUND(misurazione_gps.longitudine, 1) = coordinate_zoom2.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_mese_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_mese_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_mese_zoom3` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom3.idmisurazione_gps,
                coordinate_zoom3.latitudine,
                coordinate_zoom3.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m') AS `data`
        FROM
            coordinate_zoom3, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 3) = coordinate_zoom3.latitudine
                AND ROUND(misurazione_gps.longitudine, 3) = coordinate_zoom3.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_mese_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_mese_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_mese_zoom4` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom4.idmisurazione_gps,
                coordinate_zoom4.latitudine,
                coordinate_zoom4.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y-%m') AS `data`
        FROM
            coordinate_zoom4, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 5) = coordinate_zoom4.latitudine
                AND ROUND(misurazione_gps.longitudine, 5) = coordinate_zoom4.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y-%m') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y-%m');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_anno_zoom1`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_anno_zoom1`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_anno_zoom1` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom1.idmisurazione_gps,
                coordinate_zoom1.latitudine,
                coordinate_zoom1.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y') AS `data`
        FROM
            coordinate_zoom1, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, - 1) = coordinate_zoom1.latitudine
                AND ROUND(misurazione_gps.longitudine, - 1) = coordinate_zoom1.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y') , latitudine , longitudine) AS `view`
    ORDER BY DATE_FORMAT(data, '%Y');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_anno_zoom2`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_anno_zoom2`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_anno_zoom2` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom2.idmisurazione_gps,
                coordinate_zoom2.latitudine,
                coordinate_zoom2.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y') AS `data`
        FROM
            coordinate_zoom2, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 1) = coordinate_zoom2.latitudine
                AND ROUND(misurazione_gps.longitudine, 1) = coordinate_zoom2.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_anno_zoom3`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_anno_zoom3`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_anno_zoom3` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom3.idmisurazione_gps,
                coordinate_zoom3.latitudine,
                coordinate_zoom3.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y') AS `data`
        FROM
            coordinate_zoom3, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 3) = coordinate_zoom3.latitudine
                AND ROUND(misurazione_gps.longitudine, 3) = coordinate_zoom3.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y');

-- -----------------------------------------------------
-- View `apollonprojectdb`.`media_anno_zoom4`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `apollonprojectdb`.`media_anno_zoom4`;
USE `apollonprojectdb`;
CREATE  OR REPLACE VIEW `media_anno_zoom4` AS
    SELECT 
        idmisurazione_gps,
        latitudine,
        longitudine,
        media,
        (ROUND((media + 110) / 40, 2)) AS `weight`,
        data
    FROM
        (SELECT 
            coordinate_zoom4.idmisurazione_gps,
                coordinate_zoom4.latitudine,
                coordinate_zoom4.longitudine,
                AVG(misurazione_rete_cellulare.valore) AS `media`,
                DATE_FORMAT(report.data_report, '%Y') AS `data`
        FROM
            coordinate_zoom4, misurazione_gps, misurazione_rete_cellulare, report
        WHERE
            report.idreport = misurazione_rete_cellulare.report_idreport
                AND report.misurazione_gps_idmisurazione_gps = misurazione_gps.idmisurazione_gps
                AND ROUND(misurazione_gps.latitudine, 5) = coordinate_zoom4.latitudine
                AND ROUND(misurazione_gps.longitudine, 5) = coordinate_zoom4.longitudine
        GROUP BY DATE_FORMAT(report.data_report, '%Y') , latitudine , longitudine) AS `View`
    ORDER BY DATE_FORMAT(data, '%Y');

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `apollonprojectdb`.`tipo_rete`
-- -----------------------------------------------------
START TRANSACTION;
USE `apollonprojectdb`;
INSERT INTO `apollonprojectdb`.`tipo_rete` (`idtipo_rete`, `descrizione`) VALUES (1, 'Voce');
INSERT INTO `apollonprojectdb`.`tipo_rete` (`idtipo_rete`, `descrizione`) VALUES (2, 'Dati');

COMMIT;

