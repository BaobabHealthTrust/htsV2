DROP TABLE IF EXISTS `hts_valid_usernames`;

CREATE TABLE `hts_valid_usernames` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
