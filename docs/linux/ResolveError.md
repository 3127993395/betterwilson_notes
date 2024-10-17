# 虚拟环境下安装uwsgi

#### ERROR: Could not build wheels for uwsgi, which is required to install pyproject.toml-based projects

![image-20240216225748743](assets\image-20240216225748743.png)

**更新并安装 yum 软件包**

```bash
yum update
yum install openssl-devel bzip2-devel libffi-devel
```

**下载最新的OpenSSL源码，解压并编译**

我选择了`/usr/src`目录来对源代码进行操作。

```bash
cd /usr/src
wget https://www.openssl.org/source/openssl-3.0.13.tar.gz --no-check-certificate
tar -xzvf openssl-3.0.13.tar.gz
cd openssl-3.0.13
./config --prefix=/usr --openssldir=/etc/ssl --libdir=lib no-shared zlib-dynamic
make
make test
make install

检查是否安装了 OpenSSL
[root@iZgc7d0d1szot7fke40ez9Z ~]# openssl version
OpenSSL 3.0.13 30 Jan 2024 (Library: OpenSSL 3.0.13 30 Jan 2024)
[root@iZgc7d0d1szot7fke40ez9Z ~]# which openssl
/usr/bin/openssl

# 移除openssl-devel
yum remove openssl-devel2.0.

# 重新编译python
cd /opt/Python-3.11.0/
./configure --enable-optimizations --with-openssl=/usr
make altinstall

检查Python 3.11是否已安装
[root@iZgc7d0d1szot7fke40ez9Z Python-3.11.0]# python3.11 -V
Python 3.11.0
[root@iZgc7d0d1szot7fke40ez9Z Python-3.11.0]# pip3 -V
pip 22.3 from /opt/python311/lib/python3.11/site-packages/pip (python 3.11)

source /od/backend/venv/bin/activate
pip install uwsgi==2.0.23
```



# ssl证书配置时nginx提示缺少`ngx_http_ssl_module`模块

### nginx: [emerg] the "ssl" parameter requires ngx_http_ssl_module in...

重新编译nginx配置文件(nginx第一次下载时即可配置)

```bash
cd /opt/nginx-1.24.0
./configure --prefix=/opt/my_nginx --with-http_stub_status_module --with-http_ssl_module

make -j$(nproc) && make install -j$(nproc)	# 覆盖原文件
```