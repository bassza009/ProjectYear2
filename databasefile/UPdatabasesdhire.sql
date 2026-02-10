-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.13.0.7147
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for sdhire
DROP DATABASE IF EXISTS `sdhire`;
CREATE DATABASE IF NOT EXISTS `sdhire` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `sdhire`;

-- Dumping structure for table sdhire.general_orders
DROP TABLE IF EXISTS `general_orders`;
CREATE TABLE IF NOT EXISTS `general_orders` (
  `order_ID` int(11) NOT NULL AUTO_INCREMENT,
  `orderType` enum('Coding','Graphic','Writing','Translation','Tutor','Photo','Music','Document','Mechanic','Moo','รับจ้างทั่วไป','เขียนโปรแกรม','กราฟิกดีไซน์','ตัดต่อวิดีโอ','แปลภาษา','การศึกษา','ถ่ายภาพ','ดนตรีและเสียง','เอกสาร','ซ่อมแซม','สายมู','อื่นๆ') DEFAULT NULL,
  `budjet` decimal(10,0) DEFAULT NULL,
  `post_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `deadline` timestamp NULL DEFAULT NULL,
  `title` varchar(250) DEFAULT NULL,
  `general_id` int(11) DEFAULT NULL,
  `des_cript` text DEFAULT NULL,
  PRIMARY KEY (`order_ID`),
  KEY `general_id` (`general_id`),
  CONSTRAINT `general_orders_ibfk_1` FOREIGN KEY (`general_id`) REFERENCES `userdata` (`ID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.general_orders: ~4 rows (approximately)
DELETE FROM `general_orders`;
INSERT INTO `general_orders` (`order_ID`, `orderType`, `budjet`, `post_date`, `deadline`, `title`, `general_id`, `des_cript`) VALUES
	(1, 'เขียนโปรแกรม', 1000, '2026-02-01 19:09:06', '2026-02-02 19:09:08', 'หาคนเขียนweb', 55, NULL),
	(6, 'เขียนโปรแกรม', 100, '2026-02-03 22:20:10', '2026-02-09 03:00:00', 'qq', 58, 'qq'),
	(7, 'อื่นๆ', 800, '2026-02-10 05:44:51', '0000-00-00 00:00:00', 'oreo', 64, 'buy oreo pls'),
	(8, 'เขียนโปรแกรม', 500, '2026-02-10 06:45:32', '2026-02-12 17:00:00', 'หาคนสร้างเว็บขายสินค้า', 66, 'เว็บทั่วไปขายพวกสินค้าออนไลน์');

-- Dumping structure for table sdhire.post_comments
DROP TABLE IF EXISTS `post_comments`;
CREATE TABLE IF NOT EXISTS `post_comments` (
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.post_comments: ~3 rows (approximately)
DELETE FROM `post_comments`;
INSERT INTO `post_comments` (`comment_id`, `order_id`, `user_id`, `comment_text`, `created_at`) VALUES
	(1, 6, 58, 'สวัสดี', '2026-02-07 15:59:02'),
	(2, 1, 48, 'ผมสนใจครับ', '2026-02-08 11:22:28'),
	(3, 8, 63, 'สนใจครับ', '2026-02-10 14:21:12');

-- Dumping structure for table sdhire.review_likes
DROP TABLE IF EXISTS `review_likes`;
CREATE TABLE IF NOT EXISTS `review_likes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`review_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `review_likes_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `service_reviews` (`review_id`) ON DELETE CASCADE,
  CONSTRAINT `review_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `userdata` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.review_likes: ~1 rows (approximately)
DELETE FROM `review_likes`;
INSERT INTO `review_likes` (`id`, `review_id`, `user_id`, `created_at`) VALUES
	(2, 6, 58, '2026-02-08 13:01:50'),
	(3, 7, 63, '2026-02-10 07:21:19');

-- Dumping structure for table sdhire.service_reviews
DROP TABLE IF EXISTS `service_reviews`;
CREATE TABLE IF NOT EXISTS `service_reviews` (
  `review_id` int(11) NOT NULL AUTO_INCREMENT,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `reviewer_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `review_image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `FK_service_reviews_reviewer` (`reviewer_id`),
  KEY `FK_service_reviews_student` (`student_id`),
  CONSTRAINT `FK_service_reviews_reviewer` FOREIGN KEY (`reviewer_id`) REFERENCES `userdata` (`ID`),
  CONSTRAINT `FK_service_reviews_student` FOREIGN KEY (`student_id`) REFERENCES `userdata` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.service_reviews: ~3 rows (approximately)
DELETE FROM `service_reviews`;
INSERT INTO `service_reviews` (`review_id`, `rating`, `comment`, `review_date`, `reviewer_id`, `student_id`, `review_image`) VALUES
	(5, 2, 'sadasd', '2026-02-07 20:55:54', 58, 58, NULL),
	(6, 4, 'test reveiw', '2026-02-07 20:58:15', 37, 48, NULL),
	(7, 5, 'ทำงานดีมากครับ👍', '2026-02-10 06:42:48', 66, 63, NULL);

-- Dumping structure for table sdhire.studentdata
DROP TABLE IF EXISTS `studentdata`;
CREATE TABLE IF NOT EXISTS `studentdata` (
  `studentID` int(11) NOT NULL,
  `facebook` varchar(250) DEFAULT NULL,
  `firstname` varchar(250) DEFAULT NULL,
  `lastname` varchar(250) DEFAULT NULL,
  `instagram` varchar(250) DEFAULT NULL,
  `line` varchar(250) DEFAULT NULL,
  `URL` varchar(250) DEFAULT NULL,
  `des_cription` text DEFAULT NULL,
  `Sgroup` enum('คณะเกษตรศาสตร์และทรัพยากรธรรมชาติ','คณะเทคโนโลยีสารสนเทศและการสื่อสาร','คณะนิติศาสตร์','คณะบริหารธุรกิจและนิเทศศาสตร์','คณะพยาบาลศาสตร์','คณะพลังงานและสิ่งแวดล้อม','คณะแพทยศาสตร์','คณะเภสัชศาสตร์','คณะรัฐศาสตร์และสังคมศาสตร์','คณะวิทยาศาสตร์','คณะวิทยาศาสตร์การแพทย์','คณะวิศวกรรมศาสตร์','คณะศิลปศาสตร์','คณะสถาปัตยกรรมศาสตร์และศิลปกรรมศาสตร์','คณะสหเวชศาสตร์','คณะสาธารณสุขศาสตร์','คณะทันตแพทยศาสตร์','วิทยาลัยการศึกษา') DEFAULT NULL,
  `email` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  KEY `email` (`email`),
  CONSTRAINT `studentdata_ibfk_1` FOREIGN KEY (`email`) REFERENCES `userdata` (`email`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.studentdata: ~7 rows (approximately)
DELETE FROM `studentdata`;
INSERT INTO `studentdata` (`studentID`, `facebook`, `firstname`, `lastname`, `instagram`, `line`, `URL`, `des_cription`, `Sgroup`, `email`) VALUES
	(67021714, NULL, 'NUTHAPAT', 'SUKUNTAMALA', NULL, NULL, NULL, NULL, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67021714@up.ac.th'),
	(67021905, NULL, 'PORAMET', 'PHANCHAI', NULL, NULL, NULL, NULL, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67021905@up.ac.th'),
	(67022063, 'facebooik', 'PAWAT', 'PAKKRET', 'asdasda', 'sadsad', 'link', 'hello,world', 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67022063@up.ac.th'),
	(67022064, 'facebooik', 'keawei', 'makmak', 'ig', 'line', 'lindk', 'hello,worlddd', 'คณะนิติศาสตร์', '67022064@up.ac.th'),
	(67022164, NULL, 'WARISARA', 'CHANKAEW', NULL, NULL, NULL, NULL, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67022164@up.ac.th'),
	(67022221, NULL, 'SIRISAK', 'NGAMAEKAUDOMPHONG', NULL, NULL, NULL, NULL, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67022221@up.ac.th'),
	(67026304, NULL, 'WARANYU', 'KHAMNOI', NULL, NULL, NULL, NULL, 'คณะเทคโนโลยีสารสนเทศและการสื่อสาร', '67026304@up.ac.th');

-- Dumping structure for table sdhire.user_job
DROP TABLE IF EXISTS `user_job`;
CREATE TABLE IF NOT EXISTS `user_job` (
  `job_id` int(11) NOT NULL AUTO_INCREMENT,
  `ID` int(11) NOT NULL,
  `job` varchar(255) NOT NULL,
  `user_number` int(11) DEFAULT NULL,
  `job_type` enum('รับจ้างทั่วไป','เขียนโปรแกรม','กราฟิกดีไซน์','ตัดต่อวิดีโอ','แปลภาษา','การศึกษา','ถ่ายภาพ','ดนตรีและเสียง','เอกสาร','ซ่อมแซม','อื่นๆ','สายมู') DEFAULT NULL,
  `title` varchar(250) DEFAULT NULL,
  `budjet` decimal(10,2) DEFAULT NULL,
  `des_Cription` text DEFAULT NULL,
  `job_create` tinyint(4) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `service_image` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`job_id`),
  KEY `fk_user_job_id` (`ID`),
  CONSTRAINT `fk_user_job_id` FOREIGN KEY (`ID`) REFERENCES `userdata` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.user_job: ~3 rows (approximately)
DELETE FROM `user_job`;
INSERT INTO `user_job` (`job_id`, `ID`, `job`, `user_number`, `job_type`, `title`, `budjet`, `des_Cription`, `job_create`, `created_at`, `service_image`) VALUES
	(7, 48, '', NULL, 'กราฟิกดีไซน์', 'dfd', 12.00, 'myt', 1, '2026-02-02 14:26:03', '1770092763530-0+RobloxScreenShot20251211_160748857.png'),
	(14, 48, '', NULL, 'รับจ้างทั่วไป', 'sdasda', 1234.00, 'sadasd', 1, '2026-02-08 04:53:34', '1770551614854-0+download.jpg'),
	(16, 63, '', NULL, 'กราฟิกดีไซน์', 'วาดภาพ', 500.00, '', 1, '2026-02-10 02:52:26', '1770691946680-0+à¸à¸.jpg'),
	(17, 65, '', NULL, 'แปลภาษา', 'yyy', 250.00, 'yyy to thai', 1, '2026-02-10 06:34:10', '1770705250132-0+background_logo_SDhire.jpg');

-- Dumping structure for table sdhire.userdata
DROP TABLE IF EXISTS `userdata`;
CREATE TABLE IF NOT EXISTS `userdata` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `userPhoneNumber` varchar(15) DEFAULT NULL,
  `pass_word` varchar(255) NOT NULL,
  `profile_image` varchar(255) DEFAULT 'default_profile.png',
  `roles` enum('student','general','admin','dev') NOT NULL,
  `register_date` date DEFAULT curdate(),
  `line` varchar(250) DEFAULT NULL,
  `instagram` varchar(250) DEFAULT NULL,
  `facebook` varchar(250) DEFAULT NULL,
  `url` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table sdhire.userdata: ~12 rows (approximately)
DELETE FROM `userdata`;
INSERT INTO `userdata` (`ID`, `username`, `email`, `userPhoneNumber`, `pass_word`, `profile_image`, `roles`, `register_date`, `line`, `instagram`, `facebook`, `url`) VALUES
	(37, 'asdsadsada', '67022064@up.ac.th', '1111111', '$2b$10$5cbslRdPj1Mk4Q9XhKQ7rO.Hc8Hoes9pH9ll6hWW2JjbQlV9nzQC6', '', 'student', '2026-02-01', NULL, NULL, NULL, NULL),
	(48, 'pawatza', '67022063@up.ac.th', '08916964551111', '$2b$10$CRLaM..D7HyzfPXGrh/c0umcLQX/qEPKeDSgtmHyyZ19NXl4H1/dG', '1770108530457-0+fba6e0db-67a1-4d6c-87f7-622c7f46f023.jpg', 'student', '2026-02-02', NULL, NULL, NULL, NULL),
	(55, 'keawei', 'keaweiwa@gmail.com', '0891696455', '$2b$10$ZQkSsJyT2S39n3XM93YpYuFHjfh3OcKjlDxvhcLOxHEH8F.HKf10e', '1770020261118-0+fba6e0db-67a1-4d6c-87f7-622c7f46f023.jpg', 'general', '2026-02-02', NULL, NULL, NULL, NULL),
	(58, 'Ren', 'opkm776@gmail.com', '084 368 6580', '$2b$10$K/y.trsoxCwLVPuFvUPNHOOEm8c4NJh9j96B4BVE.I9EB3/GSsnIe', '1770190527346-0+NSHM_PHOTO_2025_12_31_20_11_10.jpg', 'general', '2026-02-03', NULL, NULL, NULL, NULL),
	(61, 'pawatgen', 'bsspawat@gmail.com', '0807454997', '$2b$10$OFvwBvuAzy.La/Do8PHk6uwgH0tNM866YGFz15c7rX06Lml8dvTL2', '1770551462699-0+fba6e0db-67a1-4d6c-87f7-622c7f46f023.jpg', 'general', '2026-02-08', '09866933632', 'p.pawat_bass2', 'pawatza2', 'sadas2'),
	(63, 'Poramet', '67021905@up.ac.th', '0631584850', '$2b$10$5MjbBxLo5P1YwZlw7EJNV.f.6Yb2QTiTTDTOv70m478yTtq7KyOZ2', '1770708091433-0+Kitaro on TikTok.jpg', 'student', '2026-02-10', '-', 'prxmtr_xr', 'Poramet Phanchai', ''),
	(64, '52XR0', 'icannotanswer154@gmail.com', '0875945142', '$2b$10$KtFWkPa7zj30D.0Wam2bzuH0yfK8A4aRd68IY4jeXekXbqw6HeS1y', '1770702181699-0+sheepy pp.jpg', 'general', '2026-02-10', 'fivezagttv', 'five555154', 'ณัฐภัทร สุคันธมาลา', ''),
	(65, '5toXRZero', '67021714@up.ac.th', '0875945142', '$2b$10$bSILV1//IV9hvXAS1mUVcuk2IXwuHd77RmL6uedBvy2znwWRVx8hm', '1770708237671-0+download (2).jpg', 'student', '2026-02-10', '', '', 'ณัฐภัทร สุคันธมาลา', ''),
	(66, 'Zeqarix', 'porametq7@gmail.com', '0631584850', '$2b$10$sFrq51/S3DVUaXsbNc2JNukqlNyljsT97RN5tOwdbT2aJ02ZU1EGa', '1770705736255-0+3.jpg', 'general', '2026-02-10', '-', 'prxmtr_xr', 'Poramet Phanchai', ''),
	(67, 'Waranyu', '67026304@up.ac.th', '0919909971', '$2b$10$lgV9N8LQpddKgLKbiEOxRuezOcP1iNg7XTCi778OdZoqFKKqy7Oqm', '1770714183156-0+ëë.jpg', 'student', '2026-02-10', '-', '-', '-', '-'),
	(68, 'Xszz19', '67022164@up.ac.th', '0987863611', '$2b$10$ZN5mnnMLeLc2IC6Il3iVt.OJ6zlH9DkdAL.dcBIxfQQVSgHli2f9S', '1770714544357-0+download (1).jpg', 'student', '2026-02-10', '', '', '', ''),
	(69, 'Kafew', '67022221@up.ac.th', '0969696969', '$2b$10$QfacADxBhd/cjkQo/k758.hmUiCc7qxY5whKJ2sqy/UE3YecsoTeS', '1770714817268-0+download (6).jpg', 'student', '2026-02-10', '-', '-', '-', '-');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
