---
layout: post
title: "group_concat scences to be used"
date: 2020-03-13 15:44:47 +0800
comments: true
categories: mysql
tags: [mysql,groupby,group_concat]
statement: true
keywords: groupby, mysql, group_concat
---


group_concat 只能与groupby连用，分组查询常用场景


场景一：

用户角色关系， 用户表，角色表，用户角色表。 用户可以拥有多个角色。查询所有用户并附带出他们所属的角色。


场景二：

文章标签关系，文章表，标签表，文章标签关系表。查询所有文章并附带出他们所属的标签。


<!--more -->

下面以场景一举例


创建用户表

```sql
CREATE TABLE `bs_user` (
  `id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `user_name` varchar(20) NOT NULL,
  `password` varchar(32) NOT NULL,
  `name` varchar(40) NOT NULL,
  `mail` varchar(40) DEFAULT NULL,
  `tel` varchar(11) DEFAULT NULL,
  `sex` varchar(1) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

创建角色表

```sql
CREATE TABLE `bs_role` (
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_name` varchar(10) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `creator_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `modified_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `modified_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `is_del` int(1) DEFAULT '0',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

创建用户角色关系表

```sql
CREATE TABLE `bs_user_role` (
  `user_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `role_id` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `created_at` datetime NOT NULL,
  `modified_at` datetime NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `role_id` (`role_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```


## 查询所有用户并附带出他们所属的角色

分解 

 - 查询 所有用户
 - 查询 所有用户角色
 - 联合 

```sql
select a.id as user_id, a.user_name, a.name, 
    group_concat(s.role_id) AS role_id, 
    group_concat(s.role_name) AS role_name, 
    group_concat(s.description) AS description from bs_user a
left outer join (
	select  b.user_id user_id, b.role_id role_id, c.role_name role_name, c.description description from bs_user_role b  
	left  join bs_role c on b.role_id=c.role_id
 ) AS s on s.user_id = a.id
where a.is_del=0
group by user_id
order by created_at desc limit 0, 10;
```

结果

![Result]({%asset posts/mysql/group_concat.png @path %})



