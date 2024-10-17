# 基于Centos7安装Hadoop3.3.5

安装依赖

```bash
yum update -y
yum -y install gcc automake autoconf libtool make
yum -y install net-tools vim wget lrzsz
```

#### 1 删除已有的jdk安装包，安装JDK1.8

```bash
# 查询当前本机可安装的所有JDK的版本
yum -y list java*

yum install java-1.8.0-openjdk -y
yum install java-1.8.0-openjdk-devel.x86_64 -y

# 检查是否安装成功
[root@cs ~]# java -version
openjdk version "1.8.0_402"
OpenJDK Runtime Environment (build 1.8.0_402-b06)
OpenJDK 64-Bit Server VM (build 25.402-b06, mixed mode)
```

此时我的JDK路径为(记住，后面要用)

```bash
/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.402.b06-1.el7_9.x86_64
```

#### 2 配置java环境目录

```bash
vim /etc/profile

export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.402.b06-1.el7_9.x86_64/jre
export CLASSPATH=.:${JAVA_HOME}/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin

source /etc/profile
```

#### 3 安装Hadoop 3.3.5 ,解压缩并修改配置文件

```bash
wget https://mirrors.ustc.edu.cn/apache/hadoop/common/hadoop-3.3.5/hadoop-3.3.5.tar.gz

tar -zxvf hadoop-3.3.5.tar.gz -C /root/
```

修改配置文件

```sh
vim /root/hadoop-3.3.5/etc/hadoop/hadoop-env.sh


export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.402.b06-1.el7_9.x86_64/jre
export HDFS_NAMENODE_USER=root
export HDFS_DATANODE_USER=root
export HDFS_SECONDARYNAMENODE_USER=root
export YARN_RESOURCEMANAGER_USER=root
export YARN_NODEMANAGER_USER=root

# 检查Hadoop是否配置完成
/root/hadoop-3.3.5/bin/hadoop version
```

![image-20240322193850501](assets\image-20240322193850501.png)

```xml
vim /root/hadoop-3.3.5/etc/hadoop/core-site.xml


<configuration>
	<property>
		<name>f.defaultFS</name>
		<value>hdfs://master:9000/</value>
	</property>
	<property>
		<name>fs.default.name</name>
		<value>hdfs://master:9000</value>
	</property>
</configuration>
```

```xml
vim /root/hadoop-3.3.5/etc/hadoop/hdfs-site.xml

<configuration>
	<property>
		<name>dfs.replication</name>
		<value>1</value>
	</property>
</configuration>
```

```xml
vim /root/hadoop-3.3.5/etc/hadoop/mapred-site.xml

<configuration>
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>
</configuration>
```

```xml
vim /root/hadoop-3.3.5/etc/hadoop/yarn-site.xml

<configuration>
	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>
</configuration>
```

#### 4 ssh免密传输

```bash
ssh-keygen -t rsa

cd ~/.ssh
ls
cat id_rsa.pub >> authorized_keys
ls
```

#### 5 Hadoop初始化

```bash
/root/hadoop-3.3.5/bin/hdfs namenode -format
```

![image-20240322194600213](assets\image-20240322194600213.png)

#### 6 开启关闭Hadoop

```bash
/root/hadoop-3.3.5/sbin/start-all.sh
jps
/root/hadoop-3.3.5/sbin/stop-all.sh
```

![image-20240322200323231](assets\image-20240322200323231.png)

## 报错：master: ssh: Could not resolve hostname master: Name or service not known

这里只显示5核，按照规则应该显示6核

查看报错

```bash
master: ssh: Could not resolve hostname master: Name or service not known
```

此时需要修改`/etc/hosts`文件，主动添加映射关系

其中192.168.43.133为你的master节点ip地址，master节点名称在`/root/hadoop-3.3.5/etc/hadoop/core-site.xml`文件中

```bash
[root@cs ~]# cat /etc/hosts
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6
192.168.43.136	master
```

![image-20240322202945444](assets\image-20240322202945444.png)

















```bash
# workers 添加三个结点的主机名
vim /opt/hadoop-3.3.5/etc/hadoop/workers

cMaster
cSlave0
cSlave1
```









