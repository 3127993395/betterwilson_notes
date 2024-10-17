## 多台服务器无密码传输数据

这里演示的是免密传输`redis`及其配置文件

```bash
# 关闭防火墙和下载一些可能用到的工具
systemctl stop firewalld.service
systemctl disable firewalld.service
systemctl status firewalld.service
sed -i.ori 's#SELINUX=enforcing#SELINUX=disabled#g' /etc/selinux/config
yum update -y
yum install vim
yum -y install gcc automake autoconf libtool make
yum -y install net-tools vim wget lrzsz

# 生成类型rsa免密的公钥私钥，下面的命令执行完，一路回车即可
ssh-keygen

[root@cs ~]# ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:jRH3eoOMBgLjk4JT5ii5YluscvuSHg8+/dPVSOCLOo8 root@cs
The key's randomart image is:
+---[RSA 2048]----+
|  =     . .      |
|.B +    .o .     |
|B = . ....  .    |
|.+.. . ..*.o     |
|o. o   .So=oo    |
|o +   ... o...   |
|.o+o . . .       |
|.o+=+.. .        |
| .++E+o.         |
+----[SHA256]-----+


# 将公钥拷贝到目标机器上
ssh-copy-id 目标ip

ssh-copy-id 192.168.43.128

[root@cs ~]# ssh-copy-id 192.168.43.128
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/root/.ssh/id_rsa.pub"
The authenticity of host '192.168.43.128 (192.168.43.128)' can't be established.
ECDSA key fingerprint is SHA256:IpkQ09hlQlGw6zgKwI8tVRbme+jRTATj6vnOv9a1JaQ.
ECDSA key fingerprint is MD5:7d:8b:62:ca:c2:d0:6a:f5:d0:06:08:22:22:b2:65:d0.
Are you sure you want to continue connecting (yes/no)? yes					# 提示这里输入yes
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
root@192.168.10.150's password:   				# 输入目标机器的登录密码

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh '192.168.43.128'"
and check to make sure that only the key(s) you wanted were added.
[root@cs ~]# 
```

接下来，两台机器就可以无密码传输数据了。

这里用到了`rsync`工具，`rsync`（remote synchronize）是Liunx/Unix下的一个远程数据同步工具。

```bash
rsync -avz 192.168.43.128:/opt/redis* /opt/
rsync -avz 192.168.43.128:/usr/local/bin/redis* /usr/local/bin/
rsync -avz 192.168.43.128:/usr/lib/systemd/system/redis.service /usr/lib/systemd/system/
mkdir -p /data/redis6379
# -u和-g选项表示同时添加具有特定UID和GID的用户
# -M创建一个没有主目录的用户
# -s表示当前创建的当前用户无法用来登录系统
# chown -R redis:redis表示指定目录以及内部的文件所有用户属组归于redis:redis
# groupdel redis
# cat /etc/group |grep redis
groupadd redis -g 1000
# userdel redis
useradd redis -u 1000 -g 1000 -M -s /sbin/nologin
chown -R redis:redis /opt/redis*
chown -R redis:redis /data/redis*
systemctl daemon-reload
systemctl start redis
redis-cli PING
```

