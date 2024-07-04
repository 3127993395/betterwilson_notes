# Python3.11.0解释器安装(centos7)

## 1 依赖下载

```bash
yum install -y epel-release
yum update -y
yum install gcc patch libffi-devel python-devel  zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel -y
```

## 2 从官网下载Python的tar包

https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz

![image-20240215220631343](assets\image-20240215220631343.png)

## 3 将python3.11下载并且解压安装到`/opt`目录下

```bash
cd /opt/
mkdir python311
wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz
tar xvf Python-3.11.0.tgz

[root@cs local]# cd /opt/
[root@cs opt]# mkdir python311
[root@cs opt]# wget https://www.python.org/ftp/python/3.11.0/Python-3.11.0.tgz
[root@cs opt]# tar xvf Python-3.11.0.tgz
[root@cs opt]# ls
Python-3.11.0					# 解压包解压后的安装包
Python-3.11.0.tgz			    # 最初的从官网上下载的压缩包
python311                       # 将来Python3.11.4版本的解释器最终的安装目录
```

## 4 编译安装

```bash
cd /opt/Python-3.11.0/
./configure --prefix=/opt/python311/  && make -j$(nproc) && make install -j$(nproc)

[root@cs opt]# cd /opt/Python-3.11.0/
[root@cs Python-3.11.0]# ./configure --prefix=/opt/python311/  && make -j$(nproc) && make install -j$(nproc)
```

## 5 添加环境变量并且设置软连接

```bash
echo "export PATH=/opt/python311/bin:\$PATH" >> /etc/profile
source /etc/profile

rm -rf /usr/bin/python3
rm -rf /usr/bin/pip3
ln -s /opt/python311/bin/python3 /usr/bin/python3
ln -s /opt/python311/bin/pip3 /usr/bin/pip3


# 删除可能存在一些其他版本的遗留的软连，然后重新建立软连接
[root@cs opt]# rm -rf /usr/bin/python3
[root@cs opt]# rm -rf /usr/bin/pip3
[root@cs opt]# ln -s /opt/python311/bin/python3 /usr/bin/python3
[root@cs opt]# ln -s /opt/python311/bin/pip3 /usr/bin/pip3
```

## 6 测试

```bash
python3 -V
pip3 -V


[root@cs opt]# python3 -V
Python 3.11.4
[root@cs opt]# pip3 -V
pip 23.1.2 from /opt/python311/lib/python3.11/site-packages/pip (python 3.11)
```





# 相关问题

### ModuleNotFoundError: No module named '_ssl'

尝试导入ssl，看是否报错

![img](assets\1168165-20231122195039876-1769554304.png)

### 解决方法：

#### 1 下载依赖

```bash
yum update -y
yum install -y perl-IPC-Cmd
yum install -y openssl openssl-devel
yum install -y zlib zlib-devel openssl-devel sqlite-devel bzip2-devel libffi libffi-devel gcc gcc-c++
yum install -y wget
```

#### 2 下载tar并编译安装

```bash
mv /usr/bin/openssl /usr/bin/openssl.bak
mv /usr/include/openssl /usr/include/openssl.bak
cd /opt
wget https://www.openssl.org/source/openssl-1.1.1w.tar.gz
tar -zxf openssl-1.1.1w.tar.gz
cd openssl-1.1.1w
./config -Wl,-rpath=/usr/lib64 --prefix=/usr/local/openssl --openssldir=/usr/local/openssl --libdir=/usr/lib64 && make -j 4 && make install
ln -s /usr/local/openssl/bin/openssl /usr/bin/openssl
openssl version
```

#### 3 重新编译Python

```bash
cd /opt/Python-3.11.0/
./configure --prefix=/opt/python311/ --with-openssl=/usr/local/openssl  && make -j$(nproc) && make install -j$(nproc)

[root@cs openssl-1.1.1]# cd ../Python-3.11.0
[root@cs Python-3.11.0]# ./configure --prefix=/opt/python311/ --with-openssl=$HOME/openssl  && make && make install
```

#### 4 测试

```bash
[root@cs Python-3.11.0]# python3
Python 3.11.0 (main, Nov 22 2023, 19:43:29) [GCC 4.8.5 20150623 (Red Hat 4.8.5-44)] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import ssl      
>>> ssl.OPENSSL_VERSION_INFO
(1, 1, 1, 23, 15)
```

