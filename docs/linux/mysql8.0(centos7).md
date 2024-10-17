## MySQL8.0安装(centos7)

## 0 安装前的准备

把可能遗留的`mariadb`卸载掉，然后在下载`libaio-devel`依赖库，防止后续出现报错。

```bash
cd /opt/
yum install -y libncurses*
yum install -y libaio-devel
yum remove -y mariabd-libs
yum install wget -y
```

## 1 下载

官网链接 https://dev.mysql.com/downloads/mysql/ 下载到本地，传到云服务器上

也可以直接在服务器上wget

```bash
cd /opt/
wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
ll

[root@cs opt]# wget https://dev.mysql.com/get/Downloads/MySQL-8.0/mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
[root@cs opt]# ll
-rw-r--r--. 1 root root 614964216 Jun  9 17:56 mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
```

## 2 安装

### 2.1 创建用户

```bash
useradd mysql
```

### 2.2 创建数据存储的目录并给权限

```bash
cd /opt/
mkdir -p /data/mysql8/3306/data
chown -R mysql.mysql /data/mysql8

[root@cs opt]# mkdir -p /data/mysql8/3306/data
[root@cs opt]# chown -R mysql.mysql /data/mysql8
```

### 2.3  解压缩安装包

```bash
cd /opt/
tar xf mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
ll


[root@cs opt]# pwd
/opt
[root@cs opt]# tar xf mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
[root@cs opt]# ll
total 628800
drwxr-xr-x. 9 root root       129 Jun 11 11:23 mysql-8.0.33-linux-glibc2.12-x86_64
-rw-r--r--. 1 root root 614964216 Jun  9 17:56 mysql-8.0.33-linux-glibc2.12-x86_64.tar.xz
-rw-r--r--. 1 root root  26071329 Jun  9 19:37 Python-3.10.10.tgz
-rw-r--r--. 1 root root   2848144 Jun  9 19:34 tengine-2.3.3.tar.gz
[root@cs opt]# ls mysql-8.0.33-linux-glibc2.12-x86_64
bin  docs  include  lib  LICENSE  man  README  share  support-files
```

### 2.4 将安装包所在目录做一个软连接到`/usr/local/mysql`

```bash
cd /opt/
ln -s /opt/mysql-8.0.33-linux-glibc2.12-x86_64 /usr/local/mysql
ls -ltr /usr/local/mysql

[root@cs opt]# ln -s /opt/mysql-8.0.33-linux-glibc2.12-x86_64 /usr/local/mysql
[root@cs opt]# ls -ltr /usr/local/mysql   # 这里就能看到建立软链接之后的指向关系了
lrwxrwxrwx. 1 root root 40 Dec  3 21:38 /usr/local/mysql -> /opt/mysql-8.0.33-linux-glibc2.12-x86_64
```

### 2.5 将`/usr/local/mysql`添加到环境变量

```bash
cd /opt/
echo "export PATH=/usr/local/mysql/bin:\$PATH" >> /etc/profile
source /etc/profile
mysql -V

[root@cs opt]# mysql -V
mysql  Ver 8.0.33 for Linux on x86_64 (MySQL Community Server - GPL)
```

**注：如果输入`mysql -V`没有返回版本号，则尝试删除软连接并且重新建立软连接的动作。**

### 2.6 创建MySQL配置文件

```bash
[root@cs opt]# vim /etc/my.cnf

cat >/etc/my.cnf<<EOF

[mysqld]
user=mysql
port=3306
server_id=51
basedir=/usr/local/mysql
datadir=/data/mysql8/3306/data
socket=/tmp/mysql.sock

# 服务端字符集
character-set-server=utf8mb4
collation-server=utf8mb4_unicode_ci
init_connect='SET NAMES utf8mb4;'

[mysql]
# 客户端字符集
default-character-set=utf8mb4
socket=/tmp/mysql.sock

EOF
```

### 2.7 初始化

```bash
cd /opt/
mysqld --initialize-insecure --user=mysql --basedir=/usr/local/mysql --datadir=/data/mysql8/3306/data


[root@cs opt]# pwd
/opt
[root@cs opt]# mysqld --initialize-insecure --user=mysql --basedir=/usr/local/mysql --datadir=/data/mysql8/3306/data
2023-06-11T07:12:21.118771Z 0 [System] [MY-013169] [Server] /opt/mysql-8.0.33-linux-glibc2.12-x86_64/bin/mysqld (mysqld 8.0.33) initializing of server in progress as process 4910
2023-06-11T07:12:21.131867Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2023-06-11T07:12:21.583086Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2023-06-11T07:12:22.871684Z 6 [Warning] [MY-010453] [Server] root@localhost is created with an empty password ! Please consider switching off the --initialize-insecure option.
```

**注：只要初始化过程中没有`ERROR`级别的错误，就说明初始化成功了。**

### 2.8 启动测试

现在可以在任意目录下执行如下命令启动MySQL服务。

```bash
mysqld &


[root@cs opt]# pwd
/opt
[root@cs opt]# mysqld &
[1] 4973
[root@cs opt]# 2023-06-11T07:15:29.006200Z 0 [System] [MY-010116] [Server] /opt/mysql-8.0.33-linux-glibc2.12-x86_64/bin/mysqld (mysqld 8.0.33) starting as process 4973
2023-06-11T07:15:29.043920Z 1 [System] [MY-013576] [InnoDB] InnoDB initialization has started.
2023-06-11T07:15:29.465207Z 1 [System] [MY-013577] [InnoDB] InnoDB initialization has ended.
2023-06-11T07:15:29.979636Z 0 [Warning] [MY-010068] [Server] CA certificate ca.pem is self signed.
2023-06-11T07:15:29.979658Z 0 [System] [MY-013602] [Server] Channel mysql_main configured to support TLS. Encrypted connections are now supported for this channel.
2023-06-11T07:15:30.001981Z 0 [System] [MY-011323] [Server] X Plugin ready for connections. Bind-address: '::' port: 33060, socket: /tmp/mysqlx.sock
2023-06-11T07:15:30.002015Z 0 [System] [MY-010931] [Server] /opt/mysql-8.0.33-linux-glibc2.12-x86_64/bin/mysqld: ready for connections. Version: '8.0.33'  socket: '/tmp/mysql.sock'  port: 3306  MySQL Community Server - GPL.

[root@cs opt]# mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.33 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| sys                |
+--------------------+
4 rows in set (0.01 sec)

mysql> exit;
Bye
[root@cs opt]# 
```

### 2.9 通过`systemctl`来管理MySQL服务

```bash
cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
systemctl enable mysql
systemctl daemon-reload
systemctl restart mysql
systemctl status mysql

[root@cs opt]# cp /usr/local/mysql/support-files/mysql.server /etc/init.d/mysqld
[root@cs opt]# 通过下面的命令基于原来service命令中的msyqld转换systemctl的启动MySQL的脚本文件
[root@cs opt]# systemctl enable mysql
mysqld.service is not a native service, redirecting to /sbin/chkconfig.
Executing /sbin/chkconfig mysqld on
[root@cs opt]# systemctl restart mysql
[root@cs opt]# systemctl status mysql
● mysqld.service - LSB: start and stop MySQL
   Loaded: loaded (/etc/rc.d/init.d/mysqld; bad; vendor preset: disabled)
   Active: active (exited) since Sun 2023-06-11 15:32:21 CST; 10s ago
     Docs: man:systemd-sysv-generator(8)
  Process: 6146 ExecStart=/etc/rc.d/init.d/mysqld start (code=exited, status=0/SUCCESS)

Jun 11 15:32:21 cs systemd[1]: Starting LSB: start and stop MySQL...
Jun 11 15:32:21 cs mysqld[6146]: Starting MySQL SUCCESS!
Jun 11 15:32:21 cs systemd[1]: Started LSB: start and stop MySQL.
Jun 11 15:32:21 cs mysqld[6146]: 2023-06-11T07:32:21.904793Z mysqld_...s
Hint: Some lines were ellipsized, use -l to show in full.
```

### 2.10 用户管理

初始化成功之后，MySQL默认创建了一个本地用户`root`用户，且该用户是无密码的，所以我们要为这个用户添加密码。
而且这个root用户通常只能管理员登录到服务器中才能使用的，你的应用程序要单独创建一个普通权限的用户。
所以，我们要做两件事，为root用户添加密码，并且以后都通过该用户来管理其它用户和权限。

```bash
mysql

alter user root@"localhost" identified with mysql_native_password by "123";
create user liuzhuyi@'%' identified with mysql_native_password by "123";
grant all on *.* to liuzhuyi@"%";


[root@cs opt]# mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
Server version: 8.0.33 MySQL Community Server - GPL

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> -- 为root账号添加密码
mysql> alter user root@"localhost" identified with mysql_native_password by "123";
Query OK, 0 rows affected (0.01 sec)

mysql> -- 创建一个普通用户
mysql> create user liuzhuyi@'%' identified with mysql_native_password by "123";
Query OK, 0 rows affected (0.01 sec)

mysql> select user,host,authentication_string,plugin from mysql.user;
+------------------+-----------+------------------------------------------------------------------------+-----------------------+
| user             | host      | authentication_string                                                  | plugin                |
+------------------+-----------+------------------------------------------------------------------------+-----------------------+
| liuzhuyi         | %         | *23AE809DDACAF96AF0FD78ED04B6A265E05AA257                              | mysql_native_password |
| mysql.infoschema | localhost | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password |
| mysql.session    | localhost | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password |
| mysql.sys        | localhost | $A$005$THISISACOMBINATIONOFINVALIDSALTANDPASSWORDTHATMUSTNEVERBRBEUSED | caching_sha2_password |
| root             | localhost | *23AE809DDACAF96AF0FD78ED04B6A265E05AA257                              | mysql_native_password |
+------------------+-----------+------------------------------------------------------------------------+-----------------------+
5 rows in set (0.00 sec)

mysql> -- 默认的创建的普通用户没啥权限，我们要给这个用户授权，允许该用户可以本地和远程登录，并且能够操作所有数据库中的所有表，这个权限已经不小了
mysql> grant all on *.* to liuzhuyi@"%";
Query OK, 0 rows affected (0.01 sec)

mysql> exit;
Bye
```





