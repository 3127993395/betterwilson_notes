# 本地项目准备

## 1 从MySQL中备份数据库

```bash
mysqldump -uroot -p --default-character-set=utf8 -B 要备份的数据库 >要保存的数据文件名.sql

mysqldump -uroot -p --default-character-set=utf8 -B dahe >dahe_data.sql
```



## 2 本地项目包依赖

```bash
pip freeze > requirements.txt
```









# 线上项目准备

## 3 放开云服务器安全组

![image-20240215230155324](assets\image-20240215230155324.png)