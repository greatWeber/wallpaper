-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.7.20-log - MySQL Community Server (GPL)
-- 服务器操作系统:                      Win64
-- HeidiSQL 版本:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- 导出 wallpaper 的数据库结构
CREATE DATABASE IF NOT EXISTS `wallpaper` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `wallpaper`;

-- 导出  表 wallpaper.tokens 结构
CREATE TABLE IF NOT EXISTS `tokens` (
  `id` varchar(60) NOT NULL,
  `uid` varchar(60) NOT NULL,
  `token_key` varchar(100) NOT NULL,
  `last_time` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  wallpaper.tokens 的数据：~2 rows (大约)
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;

/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;

-- 导出  表 wallpaper.users 结构
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(60) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `is_admin` tinyint(1) NOT NULL,
  `is_del` tinyint(1) NOT NULL,
  `name` varchar(50) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `image` varchar(500) NOT NULL,
  `created_time` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_created_time` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  wallpaper.users 的数据：~1 rows (大约)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

CREATE TABLE IF NOT EXISTS `cates` (cates
  `id` varchar(60) NOT NULL,
  `is_del` tinyint(1) NOT NULL,
  `name` varchar(50) NOT NULL,
  `cate` tinyint(10) NOT NULL,
  `created_time` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_created_time` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;