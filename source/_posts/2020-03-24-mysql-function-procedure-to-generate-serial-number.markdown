---
layout: post
title: "mysql function procedure trigger to generate serial number"
date: 2020-03-24 22:27:44 +0800
comments: true
categories: mysql
tags: [mysql,function,procedure]
statement: true
keywords: procedure, mysql, function, trigger
---


Today, we show some useful mysql code about procedure, function and trigger.


## 1. generate serial number by table name using `function`
  
rule: prefix + timestr + sequence number


<!--more -->


```sql

DROP function IF EXISTS nextNo;

delimiter ;; 

CREATE function nextNo(tableType char(20)) returns char(20) 
reads sql data
commit '表单号'
begin 
    declare prefix char(2);
    -- declare table_prefix char(3);
    -- set table_prefix = 'bs_';
    select prefix=
        case tableType
            when 'role' then 'ro'
        end

    declare timestr INT;

    SET timestr = round(date_format(now(),'%Y%m%d%H%m%s') * 1.72); 
    -- len 14

	declare lastval int; 
	select lastval = 
        case  tableType
            when 'role' then (select right(max(role_no), 4) from `bs_role`)
        end
	if lastval is null set lastval = prefix + '0001';
	return prefix + timestr + right('000' + convert(varchar(10),lastval + 1),4)
end
;;
delimiter ;


select nextNo('role');

```

## 2. generate sequence number using `procedure`

rule:  timestr + ordersn

```sql

DROP PROCEDURE IF EXISTS usp_seqnum;
delimiter ;; 
CREATE PROCEDURE usp_seqnum()
    reads sql data
    comment '序列号'
BEGIN
    -- 定义变量并获取相关值
    DECLARE v_cnt INT;
    DECLARE v_timestr INT;
    SET v_timestr = DATE_FORMAT(NOW(),'%Y%m%d');
    SELECT ROUND(RAND()*100,0)+1 INTO v_cnt;
    -- 新建表
    DROP TABLE IF EXISTS im_orderseq;
    CREATE TABLE  im_orderseq(
        timestr NVARCHAR(8) NOT NULL ,
        ordersn INT(3)
    );
    START TRANSACTION;
		-- 更新表的最值
		UPDATE im_orderseq SET ordersn = ordersn + v_cnt WHERE timestr = v_timestr;
		IF ROW_COUNT() = 0 THEN
			-- 插入数据
			INSERT INTO im_orderseq(timestr,ordersn) VALUES(v_timestr,v_cnt);
		END IF;
		SELECT CONCAT(v_timestr,LPAD(ordersn,7,0))AS ordersn
		FROM im_orderseq WHERE timestr = v_timestr;
    COMMIT;
END;
;; 
delimiter ;


CALL usp_seqnum();
SELECT * FROM im_orderseq;

```


## 3. tree data using `function` or `PROCEDURE`


first, initialize table structure and insert demo data.

```sql
DROP TABLE IF EXISTS `tree_node`;
CREATE TABLE `tree_node`(
	`id` INT   COMMENT "登录日志ID"  ,
    `pid` INT NULL,
    `name` VARCHAR(5),
    `sort` INT NULL,
	PRIMARY KEY (`id`)
	
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='树形结构表';

insert into tree_node values(1,0,"A",0);
insert into tree_node values(7,0,"G",2);
insert into tree_node values(2,1,"B",3);
insert into tree_node values(3,1,"C",4);
insert into tree_node values(4,1,"D",5);
insert into tree_node values(5,4,"E",6);
insert into tree_node values(6,4,"F",7);

insert into tree_node values(8,7,"H",8);
insert into tree_node values(9,7,"I",9);
insert into tree_node values(10,7,"J",10);
insert into tree_node values(11,10,"K",11);
insert into tree_node values(12,10,"L",12);
insert into tree_node values(13,11,"M",13);
insert into tree_node values(14,11,"N",14);


```


get all the children ids by parent id


```sql
DROP function IF EXISTS getTreeChild;
delimiter ;; 
CREATE function getTreeChild( rootid int) RETURNS VARCHAR(5000)
COMMENT '树形节点ID'  
reads sql data
BEGIN
	DECLARE sTemp VARCHAR(200);  
	DECLARE sTempChd VARCHAR(200);  
	SET sTemp = '$';
	SET sTempChd = cast(rootid as char);  
	WHILE sTempChd is not NULL DO  
		SET sTemp = concat(sTemp,',',sTempChd);  
		SELECT group_concat(id) INTO sTempChd FROM tree_node where find_in_set(pid,sTempChd)>0;  
	END WHILE;  
	return sTemp;  
END
;;

delimiter ;  

-- -----------------------------------------

select getTreeChild(0)

```

get tree order data

```sql
  
DROP PROCEDURE IF EXISTS `createChildLst`;  
delimiter ;;  
CREATE PROCEDURE `createChildLst`(IN pidin INT,IN nDepth INT)  
COMMENT '入口过程'  
BEGIN  
    DECLARE done INT DEFAULT 0;  
    DECLARE b INT;  
    DECLARE cur1 CURSOR FOR SELECT id FROM tree_node where pid=pidin order by sort;  
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1; 
      
    OPEN cur1;  
  
    FETCH cur1 INTO b;  
    INSERT INTO tmpLst VALUES (NULL,pidin,nDepth,done);  
      
    WHILE done=0 DO  
         CALL createChildLst(b,nDepth+1);  
         
         FETCH cur1 INTO b;  
           
    END WHILE;  
  
    CLOSE cur1;  
 END  
 ;;  
delimiter ;  
  
-- ----------------------------  
--  Procedure structure for `showChildLst`  
-- ----------------------------  
DROP PROCEDURE IF EXISTS `showChildLst`;  
delimiter ;;  
CREATE PROCEDURE `showChildLst`(IN pid INT)  
    COMMENT '递归过程'  
BEGIN  
    CREATE TEMPORARY TABLE IF NOT EXISTS tmpLst(sno int primary key auto_increment,id int,depth int,isLeaf int);  
    DELETE FROM tmpLst;  
  
    CALL createChildLst(pid,0);  
    select tmpLst.*,tree_node.* from tmpLst,tree_node where tmpLst.id=tree_node.id order by tmpLst.sno;  
END  
 ;;  
delimiter ;  

-- ----------------------------------------

set max_sp_recursion_depth=255;  
call showChildLst(1);  


```


## 4. Can I use a function for a default value in MySql? 

[question link](https://stackoverflow.com/questions/270309/can-i-use-a-function-for-a-default-value-in-mysql)


```sql
create table app_users
(
    app_user_id smallint(6) not null auto_increment primary key,
    api_key     char(36) not null default uuid()
);

```


use `Trigger`


```sql
CREATE TRIGGER before_insert_app_users
BEFORE INSERT ON app_users
FOR EACH ROW
  IF new.api_key IS NULL
  THEN
    SET new.api_key = uuid();
  END IF;
```
You still have to update previously existing rows, like this:


```sql

UPDATE app_users SET api_key = (SELECT uuid());
```



## Reference

- [Can I use a function for a default value in MySql?](https://stackoverflow.com/questions/270309/can-i-use-a-function-for-a-default-value-in-mysql)
- [What are the advantages and disadvantages of using MySQL stored procedures?](https://www.tutorialspoint.com/What-are-the-advantages-and-disadvantages-of-using-MySQL-stored-procedures)
- [Why MySQL Stored Procedures, Functions, and Triggers Are Bad for Performance](https://dzone.com/articles/why-mysql-stored-procedures-functions-and-triggers)
