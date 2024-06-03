# 前后端分离项目部署

```
本文采用阿里云服务器，centos7.9操作系统
本文默认服务器已安装nginx,mysql并且可以正常运行

Django + vue + uwsgi + nginx
```

**注意**：先部署后端，使用`postman`测试请求没有问题后在修改`vue`中的`axios`文件中`baseURL`，顺序不要弄错



## 前置消息

### 1 服务器安全组端口设置

![image-20240327194311322](assets\image-20240327194311322.png)

### 2 服务器域名解析

![image-20240327183117979](assets\image-20240327183117979.png)

### 3 ssl证书申请

![image-20240327183634817](assets\image-20240327183634817.png)

![image-20240327183916816](assets\image-20240327183916816.png)

```
申请后很快就能通过，下载nginx格式证书，备用

有几个需要用到的二级域名就需要几个ssl证书，用来支持HTTPS请求
```



## 后端项目部署

项目规划：

- 所有项目文件都放在`/od/`文件夹中
- 我的项目中，纯前端项目放在`/od/qianmo/`文件夹中，前后端分离项目中前端项目放在`od/front/`文件夹中， 后端项目放在`/od/backend/`文件夹中
- 所有`ssl`证书也都上传到`/od/`文件夹中，并且在此文件夹中解压，每个`ssl`证书都有一个单独的文件夹
- 关于`python`的虚拟环境放在`/od/backend/`文件夹中，与项目根目录同级；`uwsgi`的启动脚本放在`/od/backend/script/`文件夹中；日志文件放在`/od/backend/log/`文件夹中

![image-20240327185736072](assets\image-20240327185736072.png)



### 1 修改Django配置文件

将Django项目`settings.py`中`DEBUG`改为`True`,`ALLOWED_HOSTS`写成`["*"]`

![image-20240327194957533](assets\image-20240327194957533.png)

```bash
# 项目目录规划
mkdir -p /od/backend
cd /od/backend


yum install unzip
unzip dahe.zip -d /od/backend/dahe/

# 启动虚拟环境
cd /od/backend
pip3 install virtualenv
virtualenv venv
source /od/backend/venv/bin/activate
# 安装依赖包
pip -V
pip install --upgrade pip
pip install uwsgi==2.0.23
pip install -r /od/backend/dahe/requirements.txt

# 检查是否包依赖安装成功
(venv) [root@iZgc7d0d1szot7fke40ez9Z od]# pip list
Package                 Version
----------------------- ------------
asgiref                 3.7.2
async-timeout           4.0.3
certifi                 2023.7.22
charset-normalizer      3.2.0
Django                  4.2.5
django-redis            5.3.0
djangorestframework     3.14.0
idna                    3.4
pip                     24.0
pycryptodome            3.19.0
PyJWT                   2.8.0
PyMySQL                 1.1.0
pytz                    2023.3.post1
redis                   5.0.0
requests                2.31.0
setuptools              69.1.0
sqlparse                0.4.4
tencentcloud-sdk-python 3.0.986
tzdata                  2023.3
urllib3                 2.0.5
uWSGI                   2.0.23
wheel                   0.42.0
```

### 2 数据库迁移

```mysql
# 云服务器中执行
cd到data.sql文件所在的目录，执行下面的命令
mysql -uroot -p123 <dahe_data.sql
```

### 3 测试项目能否运行（重要的一步）

```bash
cd /od
source /od/backend/venv/bin/activate
cd /od/backend/dahe/
python3 manage.py  runserver 0.0.0.0:8000
```

![image-20240327190111409](assets\image-20240327190111409.png)

这里可以使用`postman`向后端的接口发送请求，看看能否得到正确的返回值

没有问题了再进行下面的部署配置

### 4 配置uwsgi

创建uwsig.ini文件：

```bash
cd /od/backend/
mkdir script
mkdir logs
vim /od/backend/script/uwsgi.ini
```

```bash
[uwsgi]
socket=0.0.0.0:8000
chdir=/od/backend/dahe/
module=dahe.wsgi
processes=3
home=/od/backend/venv/
master=true
vacuum=true
buffer-size=32768
# logto=/od/backend/logs/uwsgi.log
```

文件内容解释：

```ini
[uwsgi]

# 填写订单项目的根目录
chdir=/od/backend/dahe/

# 填写与项目同名的目录，这是个相对路径，主要就是找到其内的wsgi.py这个文件
module=dahe.wsgi

# 虚拟环境的根目录，也就是工作目录
home=/od/backend/venv/

# uwsgi的主进程，其他的uwsgi的进程都是这个主进程的子进程，当你kill时，杀掉的也是这个master主进程
master=true

# uwsgi并发时的工作进程的数量，官网的建议是：2 * cup核数 + 1
# 由这几个进程来分摊并发请求
processes=3

# 临时使用http，实际部署时，通过nginx反向代理，就要把http换成socket，这点别忘了改
http=0.0.0.0:8000
# socket=0.0.0.0:8000

# 当服务器退出时，自动删除unix socket文件和pid文件
vacuum=true

# 默认的请求的大小为4096，如果你接收到了一个更大的请求 (例如，带有大cookies或者查询字符串)，那么超过4096的限制就会报错invalid request block size: 4547 (max 4096)...skip，所以我们这里提前调整下
# https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/Options.html#buffer-size
buffer-size=32768

# uwsgi的日志文件
logto=/od/logs/uwsgi.log
```

启动后端项目：

```bash
source /od/backend/venv/bin/activate
uwsgi --ini script/uwsgi.ini
# 以后台方式运行(直接回车就行)
uwsgi --ini script/uwsgi.ini &
```

### 5 配置nginx和ssl证书

配置流程：

- 首先我们要明白，我们服务器上一共有3个项目，并且我们会为每个项目都配置`ssl`证书，所有我们的nginx配置在`http{}`模块下一共就有6个`server`模块
- 这里建议直接删除原本`nginx.conf`里面的所有内容，在本地编辑完成之后拷贝到文件里
- 下面将以前后端分离项目的nginx部署为例，纯前端项目类似

![image-20240327192722530](assets\image-20240327192722530.png)

后端项目部署好之后我们需要再次进行postman测试

因为我们这里已经配置了`HTTPS`和`uwsgi`，所以我们postman测试的URL需要更改为我们的域名

![image-20240327192943689](assets\image-20240327192943689.png)

这里测试没问题之后我们就可以进行前端的配置了

## 前端项目部署

### 1 修改`axios`文件中`baseURL`

**注意：将`baseURL`改为我们上述在postman中测试的地址，这一点非常重要，不要忘记**

![image-20240327193259203](assets\image-20240327193259203.png)

### 2 项目编译

```bash
npm run build
```

项目根路径下会生成`dist`文件夹(编译过后的文件)，本地压缩成zip(不要压成rar)

将zip文件夹上传到云服务器指定地点，我的上传到云服务器的`/od/front/`和`/od/qianmo/`文件夹中

### 3 在`nginx`配置文件中添加前端模块

![image-20240327192330206](assets\image-20240327192330206.png)添加完成之后重新加载配置文件(重启nginx)

```
nginx -s reload
```

最后访问前端路由就可以访问你的项目了

部署成功



## 我的nginx文件总配置：

```nginx
worker_processes  2;



events {
    worker_connections  2048;
}


http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  qianmo.betterwilson.com;

        charset utf-8;

        location / {
            root /od/qianmo/dist;
            index index.html;
            try_files $uri $uri/ /index.html;   
        }
    }

    server {
        #HTTPS的默认访问端口443。
        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
        listen 443 ssl;
     
        #填写证书绑定的域名
        server_name qianmo.betterwilson.com;
     
        #填写证书文件绝对路径
        ssl_certificate /od/qianmo.betterwilson.com_nginx/qianmo.betterwilson.com.pem;
        #填写证书私钥文件绝对路径
        ssl_certificate_key /od/qianmo.betterwilson.com_nginx/qianmo.betterwilson.com.key;
     
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）
        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

        #表示优先使用服务端加密套件。默认开启
        ssl_prefer_server_ciphers on;
 
 
        location / {
            root /od/qianmo/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
    }

    server {
        listen       80;
        server_name  shipper.betterwilson.com;

        rewrite ^(.*) https://$server_name$1 redirect;
    }

    server {
        #HTTPS的默认访问端口443。
        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
        listen 443 ssl;
     
        #填写证书绑定的域名
        server_name shipper.betterwilson.com;
     
        #填写证书文件绝对路径
        ssl_certificate /od/shipper.betterwilson.com_nginx/shipper.betterwilson.com.pem;
        #填写证书私钥文件绝对路径
        ssl_certificate_key /od/shipper.betterwilson.com_nginx/shipper.betterwilson.com.key;
     
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）
        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

        #表示优先使用服务端加密套件。默认开启
        ssl_prefer_server_ciphers on;
 
 
        location / {
            root /od/front/dist;
            index index.html;
            try_files $uri $uri/ /index.html;
        }
        
        location /media {
            alias /od/backend/dahe/media;
        }
    }

    server {
        listen       8080;
        server_name  dahe.betterwilson.com;

        rewrite ^(.*) https://$server_name$1 redirect;
    }

    server {
        #HTTPS的默认访问端口443。
        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。
        listen 443 ssl;
     
        #填写证书绑定的域名
        server_name dahe.betterwilson.com;
     
        #填写证书文件绝对路径
        ssl_certificate /od/dahe.betterwilson.com_nginx/dahe.betterwilson.com.pem;
        #填写证书私钥文件绝对路径
        ssl_certificate_key /od/dahe.betterwilson.com_nginx/dahe.betterwilson.com.key;
     
        ssl_session_cache shared:SSL:1m;
        ssl_session_timeout 5m;
        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）
        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
        ssl_protocols TLSv1.1 TLSv1.2 TLSv1.3;

        #表示优先使用服务端加密套件。默认开启
        ssl_prefer_server_ciphers on;

        location / {
           include uwsgi_params;
           uwsgi_pass 0.0.0.0:8000;  # 端口要和uwsgi里配置的一样
           # uwsgi_param UWSGI_SCRIPT dahe.wsgi;  #wsgi.py所在的目录名+.wsgi
           # uwsgi_param UWSGI_CHDIR /od/backend/dahe; # 项目路径
        }
    }   
}
```

## 项目优化

### 1 修改云服务器安全组的端口

在部署和测试完成后关闭云服务器mysql和redis的端口，增加云服务器的安全性

![image-20240327194546837](assets\image-20240327194546837.png)











