-- MySQL dump 10.13  Distrib 5.7.31, for Linux (x86_64)
--
-- Host: localhost    Database: chatgpt
-- ------------------------------------------------------
-- Server version	5.7.31-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin_menus`
--

DROP TABLE IF EXISTS `admin_menus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_menus` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上级菜单',
  `type` char(2) NOT NULL DEFAULT '' COMMENT '权限类型: M=目录，C=菜单，A=按钮',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '菜单名称',
  `icon` varchar(100) NOT NULL DEFAULT '' COMMENT '菜单图标',
  `sort` smallint(5) unsigned NOT NULL DEFAULT '0' COMMENT '菜单排序',
  `perms` varchar(100) NOT NULL DEFAULT '' COMMENT '权限标识',
  `paths` varchar(100) NOT NULL DEFAULT '' COMMENT '路由地址',
  `component` varchar(200) NOT NULL DEFAULT '' COMMENT '前端组件',
  `selected` varchar(200) NOT NULL DEFAULT '' COMMENT '选中路径',
  `params` varchar(200) NOT NULL DEFAULT '' COMMENT '路由参数',
  `is_cache` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否缓存: 0=否, 1=是',
  `is_show` tinyint(1) unsigned NOT NULL DEFAULT '1' COMMENT '是否显示: 0=否, 1=是',
  `is_disable` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否禁用: 0=否, 1=是',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `auth_menu_pid_index` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='系统菜单管理表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_menus`
--

LOCK TABLES `admin_menus` WRITE;
/*!40000 ALTER TABLE `admin_menus` DISABLE KEYS */;
INSERT INTO `admin_menus` VALUES (1,0,'C','工作台','el-icon-Monitor',100,'','workbench','workbench/index','','',0,1,0,'2023-05-20 17:25:21','2023-04-20 17:25:35'),(2,0,'M','系统设置','el-icon-Setting',0,'','setting','','','',0,1,0,NULL,NULL),(3,2,'M','网站设置','el-icon-Basketball',0,'','website','setting/website/information','setting','',0,1,0,NULL,NULL);
/*!40000 ALTER TABLE `admin_menus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_roles`
--

DROP TABLE IF EXISTS `admin_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_roles` (
  `admin_id` int(10) NOT NULL COMMENT '管理员id',
  `role_id` int(10) NOT NULL COMMENT '角色id',
  PRIMARY KEY (`admin_id`,`role_id`),
  KEY `admin_id_index` (`admin_id`),
  KEY `role_id_index` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色关联表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_roles`
--

LOCK TABLES `admin_roles` WRITE;
/*!40000 ALTER TABLE `admin_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admin_sessions`
--

DROP TABLE IF EXISTS `admin_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin_sessions` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `admin_id` int(11) unsigned NOT NULL COMMENT '用户id',
  `device` tinyint(1) NOT NULL DEFAULT '1' COMMENT '设备类型：1-pc管理后台 2-mobile手机管理后台',
  `token` varchar(32) NOT NULL COMMENT '令牌',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  `expired_at` datetime NOT NULL COMMENT '到期时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_id_client` (`admin_id`,`device`) COMMENT '一个用户在一个终端只有一个token',
  UNIQUE KEY `token` (`token`) COMMENT 'token是唯一的'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员会话表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin_sessions`
--

LOCK TABLES `admin_sessions` WRITE;
/*!40000 ALTER TABLE `admin_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admins` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `root` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否超级管理员 0-否 1-是',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '名称',
  `avatar` varchar(255) NOT NULL DEFAULT '' COMMENT '用户头像',
  `account` varchar(32) NOT NULL DEFAULT '' COMMENT '账号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  `login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `login_ip` varchar(15) DEFAULT '' COMMENT '最后登录ip',
  `multipoint_login` tinyint(1) unsigned DEFAULT '1' COMMENT '是否支持多处登录：1-是；0-否；',
  `disable` tinyint(1) unsigned DEFAULT '0' COMMENT '是否禁用：0-否；1-是；',
  `created_at` datetime NOT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `deleted_at` datetime DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `account_index` (`account`),
  KEY `root_index` (`root`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COMMENT='管理员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,1,'系统管理员','https://ts1.cn.mm.bing.net/th/id/R-C.4f43e981a9b42c22ea03ce530a634128?rik=IKW%2b9KJhR5voJA&riu=http%3a%2f%2fwww.gx8899.com%2fuploads%2fallimg%2f2017111809%2ff4oddxomekf.jpg&ehk=9N8vuIUJ214TsTIAmRblv2G6zxjk2aOCxQVONgbsreA%3d&risl=&pid=ImgRaw&r=0','245629560@qq.com','$argon2id$v=19$m=65536,t=4,p=1$gVS7ynB0kaEilzDSdVJpVw$3bD3Mz856NgGqVY8bpgXEQX2osQ28oWAeyT4+CQ0Ves',NULL,'',1,0,'2023-03-16 00:00:00','2023-04-14 22:14:19',NULL);
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card_orders`
--

DROP TABLE IF EXISTS `card_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `card_orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type_id` int(11) DEFAULT '0' COMMENT '套餐id',
  `type_name` varchar(50) DEFAULT NULL COMMENT '套餐名',
  `user_id` int(11) DEFAULT '0' COMMENT '用户id',
  `card_no` varchar(250) DEFAULT NULL COMMENT '卡密号',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `ask_times` int(11) DEFAULT '0' COMMENT '提问次数',
  `is_active` tinyint(4) DEFAULT '0' COMMENT '是否已激活',
  `binded_at` datetime DEFAULT NULL COMMENT '绑定时间',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `card_orders_type_id_index` (`type_id`),
  KEY `card_orders_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `card_types`
--

DROP TABLE IF EXISTS `card_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `card_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(250) DEFAULT NULL COMMENT '卡券名',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `desc` text COMMENT '描述,支持html',
  `ask_times` int(11) DEFAULT '0' COMMENT '可提问次数',
  `sort` int(11) DEFAULT '0' COMMENT '排序，靠大越靠前',
  `is_disable` tinyint(4) NOT NULL DEFAULT '0' COMMENT '使用禁用',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cards_id_uindex` (`id`),
  KEY `cards_name_index` (`name`),
  KEY `cards_ask_times_index` (`ask_times`),
  KEY `cards_price_index` (`price`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card_types`
--

LOCK TABLES `card_types` WRITE;
/*!40000 ALTER TABLE `card_types` DISABLE KEYS */;
INSERT INTO `card_types` VALUES (1,'100次卡',5.00,' ',100,0,0,NULL,'2023-04-06 12:08:58',NULL),(2,'210次卡',10.00,'不限次数',210,100,0,NULL,'2023-03-30 20:17:40',NULL),(3,'320次卡',15.00,'无使用期限',320,200,0,NULL,'2023-03-30 20:17:49',NULL),(4,'430次卡',20.00,'不限时间',430,300,0,NULL,'2023-03-30 20:17:17',NULL),(5,'650次卡',30.00,'不限时间',650,400,0,NULL,'2023-03-30 20:11:34',NULL),(6,'1500次卡',50.00,'不限时间',1500,500,0,NULL,'2023-03-30 20:11:14',NULL),(7,'1500次卡11',50.00,'11',1500,0,0,'2023-03-28 17:10:05','2023-03-28 17:10:05','2023-03-28 17:11:24'),(8,'1500次卡',50.00,'11',1500,100,0,'2023-03-28 17:11:17','2023-03-28 17:11:17','2023-03-28 21:39:56'),(9,'1500次卡33',50.00,'11',1500,100,0,'2023-03-28 17:11:30','2023-03-28 17:11:30','2023-03-28 21:40:17'),(10,'1500次卡3366',50.00,'11',1500,100,0,'2023-03-28 17:11:37','2023-03-28 17:11:37','2023-03-28 21:40:14'),(11,'1500次卡3366',50.00,'11',1500,100,0,'2023-03-28 17:13:20','2023-03-28 17:13:20','2023-03-28 21:40:10'),(12,'1500次卡3366',50.00,'11',1500,100,0,'2023-03-28 17:14:48','2023-03-28 17:14:48','2023-03-28 21:40:07'),(13,'1500次卡77',50.00,'11',1500,100,0,'2023-03-28 17:30:04','2023-03-28 17:30:04','2023-03-28 21:40:05'),(14,'1500次卡88',50.00,'11',1500,100,0,'2023-03-28 17:30:25','2023-03-28 17:30:25','2023-03-28 21:40:02'),(15,'1500次卡100',50.00,'1133',1500,100,1,'2023-03-28 21:27:55','2023-03-28 21:37:31','2023-03-28 21:39:59');
/*!40000 ALTER TABLE `card_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_session`
--

DROP TABLE IF EXISTS `chat_session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chat_session` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `session_uuid` varchar(64) NOT NULL,
  `chat_id` int(10) unsigned NOT NULL,
  `parent_message_id` varchar(64) NOT NULL DEFAULT '',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_session_uuid` (`session_uuid`),
  KEY `chat_session_chat_id_index` (`chat_id`),
  KEY `chat_session_parent_message_id_index` (`parent_message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_session`
--


DROP TABLE IF EXISTS `chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `chats` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NOT NULL DEFAULT '0' COMMENT '父级id',
  `user_id` int(11) DEFAULT '0' COMMENT '用户id',
  `key_id` int(11) NOT NULL DEFAULT '0' COMMENT 'key池id',
  `model` varchar(20) NOT NULL COMMENT '所用模型',
  `prompt` varchar(250) NOT NULL COMMENT '问题',
  `content` text COMMENT '回答',
  `prompt_tokens` int(11) NOT NULL DEFAULT '0',
  `completion_tokens` int(11) DEFAULT '0',
  `total_tokens` int(11) NOT NULL DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chats_parent_id_index` (`parent_id`),
  KEY `chats_user_id_index` (`user_id`),
  KEY `chats_key_id_index` (`key_id`)
) ENGINE=InnoDB AUTO_INCREMENT=296 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `configs`
--

DROP TABLE IF EXISTS `configs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(30) DEFAULT NULL,
  `name` varchar(60) DEFAULT NULL,
  `value` text,
  `created_at` int(10) unsigned DEFAULT NULL,
  `updated_at` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `type_index` (`type`),
  KEY `name_index` (`name`),
  KEY `type_name_index` (`type`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COMMENT='配置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configs`
--

LOCK TABLES `configs` WRITE;
/*!40000 ALTER TABLE `configs` DISABLE KEYS */;
INSERT INTO `configs` VALUES (1,'storage','default','local',1660620367,1662620927),(2,'storage','local','{\"name\":\"本地存储\"}',1660620367,1662620927),(3,'storage','qiniu','{\"name\":\"七牛云存储\",\"bucket\":\"\",\"secretKey\":\"\",\"accessKey\":\"\",\"domain\":\"\"}',1660620367,1660620367),(4,'storage','aliyun','{\"name\":\"阿里云存储\",\"bucket\":\"\",\"secretKey\":\"\",\"accessKey\":\"\",\"domain\":\"\"}',1660620367,1662620071),(5,'storage','qcloud','{\"name\":\"腾讯云存储\",\"bucket\":\"\",\"secretKey\":\"\",\"accessKey\":\"\",\"domain\":\"\",\"region\":\"\"}',1660620367,1660620367),(6,'sms','default','aliyun',1660620367,1660620367),(7,'sms','aliyun','{\"name\":\"阿里云短信\",\"alias\":\"aliyun\",\"sign\":\"\",\"appKey\":\"\",\"secretKey\":\"\"}',1660620367,1660620367),(8,'sms','tencent','{\"name\":\"腾讯云短信\",\"alias\":\"tencent\",\"sign\":\"\",\"appId\":\"\",\"secretId\":\"\",\"secretKey\":\"\"}',1660620367,1660620367),(9,'sms','huawei','{\"name\":\"华为云短信\",\"alias\":\"huawei\"}',1660620367,1660620367),(10,'website','name','管理系统',1660620367,1679191955),(11,'website','logo','/api/static/backend_logo.png',1660620367,1679191955),(12,'website','favicon','/api/static/backend_favicon.ico',1660620367,1679191955),(13,'website','backdrop','/api/static/backend_backdrop.png',1660620367,1679191955),(14,'website','copyright','[{\"name\":\"LikeAdmin开源系统\",\"link\":\"http://www.beian.gov.cn\"}]',1660620367,1660620367),(15,'website','aiName','chatGPT',1631255140,1679191955),(16,'website','aiLogo','/api/static/shop_logo.png',1631255140,1679191955),(74,'login','autoLoginAuth','1,2',1660620367,1662538771),(80,'user','defaultAvatar','/api/static/default_avatar.png',1660620367,1662535156),(81,'chatgpt','baseUrl','https://open2.aiproxy.xyz',NULL,NULL),(82,'chatgpt','proxyUrl','',NULL,NULL),(83,'chatgpt','isSerial','1',NULL,NULL),(84,'chatgpt','timeout','60',NULL,NULL),(85,'chatgpt','model','gpt-3.5-turbo',NULL,NULL),(86,'chatgpt','memoryMemo','5',NULL,NULL),(87,'chatgpt','topP','0.2',NULL,NULL),(88,'website','qq','245629560',NULL,NULL),(89,'website','tongji','<script>\nvar _hmt = _hmt || [];\n(function() {\n  var hm = document.createElement(\"script\");\n  hm.src = \"https://hm.baidu.com/hm.js?daf0d8924deff98ade7d56994ec572d8\";\n  var s = document.getElementsByTagName(\"script\")[0]; \n  s.parentNode.insertBefore(hm, s);\n})();\n</script>\n',NULL,NULL),(90,'register','reg_way','email',NULL,NULL),(91,'register','free_times','5',NULL,NULL),(92,'register','free_period','once',NULL,NULL),(94,'register','invite_code','68823095',NULL,NULL),(95,'register','default_avatar',NULL,NULL,NULL);
/*!40000 ALTER TABLE `configs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `diy_reply`
--

DROP TABLE IF EXISTS `diy_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `diy_reply` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keywords` varchar(50) NOT NULL,
  `content` text,
  `is_disable` tinyint(4) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `diy_reply_keywords_uindex` (`keywords`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `diy_reply`
--

LOCK TABLES `diy_reply` WRITE;
/*!40000 ALTER TABLE `diy_reply` DISABLE KEYS */;
INSERT INTO `diy_reply` VALUES (3,'你是谁','我是一个聊天机器人，被用来与用户交互并回答各种问题。我使用自然语言处理技术来理解用户的问题，并尽可能准确和有用地回答它们。我可以讨论各种主题，包括科学、历史、文化、娱乐等等。',0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `diy_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `keys`
--

DROP TABLE IF EXISTS `keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `keys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(250) NOT NULL,
  `is_plus` tinyint(2) DEFAULT '0' COMMENT '是否是plus{0:否, 1:是}',
  `status` tinyint(3) NOT NULL DEFAULT '10' COMMENT '状态{10:正常, 20:余额不足, 30:被封禁}',
  `is_disable` tinyint(4) NOT NULL DEFAULT '0' COMMENT '是否禁用 {0:否,1:是}',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `keys_id_uindex` (`id`),
  KEY `type_index` (`is_plus`),
  KEY `keys_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `prompts`
--

DROP TABLE IF EXISTS `prompts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `prompts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `key` varchar(50) NOT NULL COMMENT 'prompt提示词',
  `value` text NOT NULL COMMENT 'prompt内容',
  `is_disable` tinyint(1) NOT NULL DEFAULT '0',
  `sort` int(11) DEFAULT '0' COMMENT '权重，越大越靠前',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prompts_id_uindex` (`id`),
  KEY `prompts_status_index` (`is_disable`),
  KEY `prompts_sort_index` (`sort`),
  KEY `is_disable_index` (`is_disable`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prompts`
--

LOCK TABLES `prompts` WRITE;
/*!40000 ALTER TABLE `prompts` DISABLE KEYS */;
INSERT INTO `prompts` VALUES (1,'担任歌曲推荐人','我想让你担任歌曲推荐人。我将为您提供一首歌曲，您将创建一个包含 10 首与给定歌曲相似的歌曲的播放列表。您将为播放列表提供播放列表名称和描述。不要选择同名或同名歌手的歌曲。不要写任何解释或其他文字，只需回复播放列表名称、描述和歌曲。我的第一首歌是“Other Lives - Epic”',0,100,'0000-00-00 00:00:00','2023-03-24 06:00:13','2023-03-27 07:08:53'),(2,'充当 Linux 终端','充当 Linux 终端\",\"value\":\"我想让你充当 Linux 终端。我将输入命令，您将回复终端应显示的内容。我希望您只在一个唯一的代码块内回复终端输出，而不是其他任何内容。不要写解释。除非我指示您这样做，否则不要键入命令。当我需要用英语告诉你一些事情时，我会把文字放在中括号内[就像这样]。我的第一个命令是 pwd',0,101,'0000-00-00 00:00:00','2023-03-27 10:07:07',NULL);
/*!40000 ALTER TABLE `prompts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sensitive_words`
--

DROP TABLE IF EXISTS `sensitive_words`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sensitive_words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `keywords` varchar(250) DEFAULT NULL COMMENT '敏感词',
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `is_disable` tinyint(2) DEFAULT '0' COMMENT '是否禁用 {0:否,1:是}',
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sensitive_words_keywords_index` (`keywords`),
  KEY `sensitive_words_deleted_at_index` (`deleted_at`),
  KEY `sensitive_words_is_disable_index` (`is_disable`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensitive_words`
--

LOCK TABLES `sensitive_words` WRITE;
/*!40000 ALTER TABLE `sensitive_words` DISABLE KEYS */;
INSERT INTO `sensitive_words` VALUES (1,'新冠病毒','2023-03-27 14:43:57','2023-03-27 21:51:03',1,NULL),(2,'苍井空','2023-03-27 17:42:32','2023-03-27 21:50:54',0,NULL),(3,'毛泽东','2023-03-27 17:42:53','2023-03-28 10:14:47',0,NULL);
/*!40000 ALTER TABLE `sensitive_words` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_times`
--

DROP TABLE IF EXISTS `user_times`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_times` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `free_total_times` int(11) DEFAULT '0' COMMENT '免费次数',
  `free_remaining_times` int(11) DEFAULT '0' COMMENT '免费剩余次数',
  `card_total_times` int(11) DEFAULT '0' COMMENT '卡券内总次数',
  `card_remaining_times` int(11) DEFAULT NULL COMMENT '卡券内剩余次数',
  `share_total_times` int(11) DEFAULT '0' COMMENT '分享获得的次数',
  `share_remaining_times` int(11) DEFAULT '0' COMMENT '分享获得的剩余次数',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_times_id_uindex` (`id`),
  UNIQUE KEY `user_times_user_id_uindex` (`user_id`),
  KEY `user_times_free_remaining_times_index` (`free_remaining_times`)
) ENGINE=InnoDB AUTO_INCREMENT=84 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `no` varchar(100) DEFAULT NULL COMMENT '编号',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `avatar` varchar(250) DEFAULT NULL,
  `status` tinyint(2) DEFAULT '0',
  `level` int(3) NOT NULL DEFAULT '10' COMMENT '会员等级',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_id_uindex` (`id`),
  KEY `users_status_index` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=122 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'chatgpt'
--

--
-- Dumping routines for database 'chatgpt'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-15 17:39:09
