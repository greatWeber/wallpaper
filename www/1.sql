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

-- 导出  表 wallpaper.cates 结构
CREATE TABLE IF NOT EXISTS `cates` (
  `id` varchar(60) NOT NULL,
  `is_del` tinyint(1) NOT NULL COMMENT '是否删除',
  `name` varchar(50) NOT NULL COMMENT '分类名字',
  `created_time` varchar(50) NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_created_time` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  wallpaper.cates 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `cates` DISABLE KEYS */;
INSERT INTO `cates` (`id`, `is_del`, `name`, `created_time`) VALUES
	('001535080657200236747d4-9736-4ebc-ac4f-3ae1dbb868a7000', 0, '风景', '2018-08-24');
/*!40000 ALTER TABLE `cates` ENABLE KEYS */;

-- 导出  表 wallpaper.labels 结构
CREATE TABLE IF NOT EXISTS `labels` (
  `id` varchar(60) NOT NULL,
  `name` varchar(50) NOT NULL,
  `is_del` tinyint(1) NOT NULL,
  `created_time` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `create_time` (`created_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签表';

-- 正在导出表  wallpaper.labels 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `labels` DISABLE KEYS */;
INSERT INTO `labels` (`id`, `name`, `is_del`, `created_time`) VALUES
	('00153536209448576e47812-e38b-4544-94b7-049253d210f9000', '一拳超人', 0, '2018-08-27'),
	('001535420352569d7da8b0f-c46d-49a2-a786-82ad027c4454000', '工作细胞', 0, '2018-08-28');
/*!40000 ALTER TABLE `labels` ENABLE KEYS */;

-- 导出  表 wallpaper.pic 结构
CREATE TABLE IF NOT EXISTS `pic` (
  `id` varchar(60) NOT NULL,
  `title` varchar(60) NOT NULL COMMENT '图片名称',
  `author` varchar(60) NOT NULL COMMENT '图片作者',
  `source` varchar(60) NOT NULL COMMENT '图片来源',
  `labels` varchar(500) NOT NULL COMMENT '标签(id,id,id)',
  `cate` varchar(60) NOT NULL COMMENT '分类id',
  `path` varchar(60) NOT NULL COMMENT '图片路径',
  `is_del` tinyint(1) DEFAULT NULL COMMENT '是否删除',
  `created_time` varchar(50) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='图片';

-- 正在导出表  wallpaper.pic 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `pic` DISABLE KEYS */;
/*!40000 ALTER TABLE `pic` ENABLE KEYS */;

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
INSERT INTO `tokens` (`id`, `uid`, `token_key`, `last_time`) VALUES
	('001533266146879199d1716-b7ee-434c-8b84-9e288a2ea2b1000', '001533266146834e45c4d24-5384-48f4-a441-d86413797595000', '857a948375deccd6cd21cb124f3b070e68b0ad1e', 1533266023.7939),
	('001533266290197bbaf1808-e3e6-401d-9628-76201ba78c2e000', '001533266290167c06e0f36-6329-4571-a5b4-060a0d0f0d91000', 'dd79bd63ba468636b11f281aa29203998b367edd', 1535419299.721);
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

-- 正在导出表  wallpaper.users 的数据：~0 rows (大约)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `email`, `password`, `is_admin`, `is_del`, `name`, `nickname`, `image`, `created_time`) VALUES
	('001533266290167c06e0f36-6329-4571-a5b4-060a0d0f0d91000', '', '3c9d551330f47502ed1e12865c6e5d3746293d00', 0, 0, '我贼帅', '', '', 1533266023.7939);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
