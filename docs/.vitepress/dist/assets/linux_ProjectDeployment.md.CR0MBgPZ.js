import{_ as s,c as i,o as a,a1 as n}from"./chunks/framework.DCKU21so.js";const l="/assets/image-20240327194311322.DzhShJO9.png",p="/assets/image-20240327183117979.CcYFmlaz.png",h="/assets/image-20240327183634817.CsEMJEJY.png",e="/assets/image-20240327183916816.DTKmrq_F.png",t="/assets/image-20240327185736072.BAofqy9I.png",k="/assets/image-20240327194957533.BBC1WlXX.png",d="/assets/image-20240327190111409.Zzve5mZe.png",r="/assets/image-20240327192722530.Cm9bltTx.png",c="/assets/image-20240327192943689.i3AjAd_0.png",g="/assets/image-20240327193259203.CeXkB1Mh.png",E="/assets/image-20240327192330206.BHm53kgF.png",o="/assets/image-20240327194546837.6bvVPMi3.png",x=JSON.parse('{"title":"前后端分离项目部署","description":"","frontmatter":{},"headers":[],"relativePath":"linux/ProjectDeployment.md","filePath":"linux/ProjectDeployment.md"}'),y={name:"linux/ProjectDeployment.md"},F=n(`<h1 id="前后端分离项目部署" tabindex="-1">前后端分离项目部署 <a class="header-anchor" href="#前后端分离项目部署" aria-label="Permalink to &quot;前后端分离项目部署&quot;">​</a></h1><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>本文采用阿里云服务器，centos7.9操作系统</span></span>
<span class="line"><span>本文默认服务器已安装nginx,mysql并且可以正常运行</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Django + vue + uwsgi + nginx</span></span></code></pre></div><p><strong>注意</strong>：先部署后端，使用<code>postman</code>测试请求没有问题后在修改<code>vue</code>中的<code>axios</code>文件中<code>baseURL</code>，顺序不要弄错</p><h2 id="前置消息" tabindex="-1">前置消息 <a class="header-anchor" href="#前置消息" aria-label="Permalink to &quot;前置消息&quot;">​</a></h2><h3 id="_1-服务器安全组端口设置" tabindex="-1">1 服务器安全组端口设置 <a class="header-anchor" href="#_1-服务器安全组端口设置" aria-label="Permalink to &quot;1 服务器安全组端口设置&quot;">​</a></h3><p><img src="`+l+'" alt="image-20240327194311322"></p><h3 id="_2-服务器域名解析" tabindex="-1">2 服务器域名解析 <a class="header-anchor" href="#_2-服务器域名解析" aria-label="Permalink to &quot;2 服务器域名解析&quot;">​</a></h3><p><img src="'+p+'" alt="image-20240327183117979"></p><h3 id="_3-ssl证书申请" tabindex="-1">3 ssl证书申请 <a class="header-anchor" href="#_3-ssl证书申请" aria-label="Permalink to &quot;3 ssl证书申请&quot;">​</a></h3><p><img src="'+h+'" alt="image-20240327183634817"></p><p><img src="'+e+`" alt="image-20240327183916816"></p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>申请后很快就能通过，下载nginx格式证书，备用</span></span>
<span class="line"><span></span></span>
<span class="line"><span>有几个需要用到的二级域名就需要几个ssl证书，用来支持HTTPS请求</span></span></code></pre></div><h2 id="后端项目部署" tabindex="-1">后端项目部署 <a class="header-anchor" href="#后端项目部署" aria-label="Permalink to &quot;后端项目部署&quot;">​</a></h2><p>项目规划：</p><ul><li>所有项目文件都放在<code>/od/</code>文件夹中</li><li>我的项目中，纯前端项目放在<code>/od/qianmo/</code>文件夹中，前后端分离项目中前端项目放在<code>od/front/</code>文件夹中， 后端项目放在<code>/od/backend/</code>文件夹中</li><li>所有<code>ssl</code>证书也都上传到<code>/od/</code>文件夹中，并且在此文件夹中解压，每个<code>ssl</code>证书都有一个单独的文件夹</li><li>关于<code>python</code>的虚拟环境放在<code>/od/backend/</code>文件夹中，与项目根目录同级；<code>uwsgi</code>的启动脚本放在<code>/od/backend/script/</code>文件夹中；日志文件放在<code>/od/backend/log/</code>文件夹中</li></ul><p><img src="`+t+'" alt="image-20240327185736072"></p><h3 id="_1-修改django配置文件" tabindex="-1">1 修改Django配置文件 <a class="header-anchor" href="#_1-修改django配置文件" aria-label="Permalink to &quot;1 修改Django配置文件&quot;">​</a></h3><p>将Django项目<code>settings.py</code>中<code>DEBUG</code>改为<code>True</code>,<code>ALLOWED_HOSTS</code>写成<code>[&quot;*&quot;]</code></p><p><img src="'+k+`" alt="image-20240327194957533"></p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 项目目录规划</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -p</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">yum</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> unzip</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">unzip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dahe.zip</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -d</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/dahe/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动虚拟环境</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> virtualenv</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">virtualenv</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> venv</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">source</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/venv/bin/activate</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装依赖包</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -V</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --upgrade</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> pip</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> uwsgi==</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">2.0.23</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -r</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/dahe/requirements.txt</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 检查是否包依赖安装成功</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">venv</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">) [root@iZgc7d0d1szot7fke40ez9Z od]# pip list</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Package</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                 Version</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">-----------------------</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> ------------</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">asgiref</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                 3.7.2</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">async-timeout</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">           4.0.3</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">certifi</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                 2023.7.22</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">charset-normalizer</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      3.2.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">Django</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                  4.2.5</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">django-redis</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            5.3.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">djangorestframework</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">     3.14.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">idna</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                    3.4</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pip</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                     24.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pycryptodome</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">            3.19.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PyJWT</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                   2.8.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">PyMySQL</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                 1.1.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pytz</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">                    2023.3.post1</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">redis</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                   5.0.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">requests</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                2.31.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">setuptools</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">              69.1.0</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">sqlparse</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                0.4.4</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tencentcloud-sdk-python</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 3.0.986</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">tzdata</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                  2023.3</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">urllib3</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                 2.0.5</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uWSGI</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                   2.0.23</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">wheel</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">                   0.42.0</span></span></code></pre></div><h3 id="_2-数据库迁移" tabindex="-1">2 数据库迁移 <a class="header-anchor" href="#_2-数据库迁移" aria-label="Permalink to &quot;2 数据库迁移&quot;">​</a></h3><div class="language-mysql vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mysql</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span># 云服务器中执行</span></span>
<span class="line"><span>cd到data.sql文件所在的目录，执行下面的命令</span></span>
<span class="line"><span>mysql -uroot -p123 &lt;dahe_data.sql</span></span></code></pre></div><h3 id="_3-测试项目能否运行-重要的一步" tabindex="-1">3 测试项目能否运行（重要的一步） <a class="header-anchor" href="#_3-测试项目能否运行-重要的一步" aria-label="Permalink to &quot;3 测试项目能否运行（重要的一步）&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">source</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/venv/bin/activate</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/dahe/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">python3</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> manage.py</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  runserver</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> 0.0.0.0:8000</span></span></code></pre></div><p><img src="`+d+`" alt="image-20240327190111409"></p><p>这里可以使用<code>postman</code>向后端的接口发送请求，看看能否得到正确的返回值</p><p>没有问题了再进行下面的部署配置</p><h3 id="_4-配置uwsgi" tabindex="-1">4 配置uwsgi <a class="header-anchor" href="#_4-配置uwsgi" aria-label="Permalink to &quot;4 配置uwsgi&quot;">​</a></h3><p>创建uwsig.ini文件：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> script</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">mkdir</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> logs</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">vim</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/script/uwsgi.ini</span></span></code></pre></div><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">[uwsgi]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">socket</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">0.0.0.0:8000</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">chdir</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/od/backend/dahe/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">module</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">dahe.wsgi</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">processes</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">3</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">home</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">/od/backend/venv/</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">master</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">vacuum</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">buffer-size</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">=</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">32768</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># logto=/od/backend/logs/uwsgi.log</span></span></code></pre></div><p>文件内容解释：</p><div class="language-ini vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">ini</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">[uwsgi]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 填写订单项目的根目录</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">chdir</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=/od/backend/dahe/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 填写与项目同名的目录，这是个相对路径，主要就是找到其内的wsgi.py这个文件</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">module</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=dahe.wsgi</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 虚拟环境的根目录，也就是工作目录</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">home</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=/od/backend/venv/</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># uwsgi的主进程，其他的uwsgi的进程都是这个主进程的子进程，当你kill时，杀掉的也是这个master主进程</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">master</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># uwsgi并发时的工作进程的数量，官网的建议是：2 * cup核数 + 1</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 由这几个进程来分摊并发请求</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">processes</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=3</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 临时使用http，实际部署时，通过nginx反向代理，就要把http换成socket，这点别忘了改</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">http</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=0.0.0.0:8000</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># socket=0.0.0.0:8000</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 当服务器退出时，自动删除unix socket文件和pid文件</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">vacuum</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=true</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 默认的请求的大小为4096，如果你接收到了一个更大的请求 (例如，带有大cookies或者查询字符串)，那么超过4096的限制就会报错invalid request block size: 4547 (max 4096)...skip，所以我们这里提前调整下</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># https://uwsgi-docs-zh.readthedocs.io/zh_CN/latest/Options.html#buffer-size</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">buffer-size</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=32768</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># uwsgi的日志文件</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">logto</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">=/od/logs/uwsgi.log</span></span></code></pre></div><p>启动后端项目：</p><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">source</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> /od/backend/venv/bin/activate</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uwsgi</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --ini</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> script/uwsgi.ini</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 以后台方式运行(直接回车就行)</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">uwsgi</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> --ini</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> script/uwsgi.ini</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> &amp;</span></span></code></pre></div><h3 id="_5-配置nginx和ssl证书" tabindex="-1">5 配置nginx和ssl证书 <a class="header-anchor" href="#_5-配置nginx和ssl证书" aria-label="Permalink to &quot;5 配置nginx和ssl证书&quot;">​</a></h3><p>配置流程：</p><ul><li>首先我们要明白，我们服务器上一共有3个项目，并且我们会为每个项目都配置<code>ssl</code>证书，所有我们的nginx配置在<code>http{}</code>模块下一共就有6个<code>server</code>模块</li><li>这里建议直接删除原本<code>nginx.conf</code>里面的所有内容，在本地编辑完成之后拷贝到文件里</li><li>下面将以前后端分离项目的nginx部署为例，纯前端项目类似</li></ul><p><img src="`+r+'" alt="image-20240327192722530"></p><p>后端项目部署好之后我们需要再次进行postman测试</p><p>因为我们这里已经配置了<code>HTTPS</code>和<code>uwsgi</code>，所以我们postman测试的URL需要更改为我们的域名</p><p><img src="'+c+'" alt="image-20240327192943689"></p><p>这里测试没问题之后我们就可以进行前端的配置了</p><h2 id="前端项目部署" tabindex="-1">前端项目部署 <a class="header-anchor" href="#前端项目部署" aria-label="Permalink to &quot;前端项目部署&quot;">​</a></h2><h3 id="_1-修改axios文件中baseurl" tabindex="-1">1 修改<code>axios</code>文件中<code>baseURL</code> <a class="header-anchor" href="#_1-修改axios文件中baseurl" aria-label="Permalink to &quot;1 修改`axios`文件中`baseURL`&quot;">​</a></h3><p><strong>注意：将<code>baseURL</code>改为我们上述在postman中测试的地址，这一点非常重要，不要忘记</strong></p><p><img src="'+g+'" alt="image-20240327193259203"></p><h3 id="_2-项目编译" tabindex="-1">2 项目编译 <a class="header-anchor" href="#_2-项目编译" aria-label="Permalink to &quot;2 项目编译&quot;">​</a></h3><div class="language-bash vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">npm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> build</span></span></code></pre></div><p>项目根路径下会生成<code>dist</code>文件夹(编译过后的文件)，本地压缩成zip(不要压成rar)</p><p>将zip文件夹上传到云服务器指定地点，我的上传到云服务器的<code>/od/front/</code>和<code>/od/qianmo/</code>文件夹中</p><h3 id="_3-在nginx配置文件中添加前端模块" tabindex="-1">3 在<code>nginx</code>配置文件中添加前端模块 <a class="header-anchor" href="#_3-在nginx配置文件中添加前端模块" aria-label="Permalink to &quot;3 在`nginx`配置文件中添加前端模块&quot;">​</a></h3><p><img src="'+E+`" alt="image-20240327192330206">添加完成之后重新加载配置文件(重启nginx)</p><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>nginx -s reload</span></span></code></pre></div><p>最后访问前端路由就可以访问你的项目了</p><p>部署成功</p><h2 id="我的nginx文件总配置" tabindex="-1">我的nginx文件总配置： <a class="header-anchor" href="#我的nginx文件总配置" aria-label="Permalink to &quot;我的nginx文件总配置：&quot;">​</a></h2><div class="language-nginx vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">nginx</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">worker_processes </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">events</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    worker_connections </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 2048</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">http</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    include </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">      mime.types;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    default_type </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> application/octet-stream;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    sendfile </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">       on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    keepalive_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> 65</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> qianmo.betterwilson.com;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        charset </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">utf-8;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            root </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/qianmo/dist;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            index </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            try_files </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$uri $uri/ /index.html;   </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #HTTPS的默认访问端口443。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">443</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ssl;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书绑定的域名</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">qianmo.betterwilson.com;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/qianmo.betterwilson.com_nginx/qianmo.betterwilson.com.pem;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书私钥文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate_key </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/qianmo.betterwilson.com_nginx/qianmo.betterwilson.com.key;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_cache </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">shared:SSL:1m;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5m</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_ciphers </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_protocols </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TLSv1.1 TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #表示优先使用服务端加密套件。默认开启</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_prefer_server_ciphers </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            root </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/qianmo/dist;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            index </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            try_files </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$uri $uri/ /index.html;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      80</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> shipper.betterwilson.com;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        rewrite</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> ^(.*) https://$</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">server_name$1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #HTTPS的默认访问端口443。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">443</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ssl;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书绑定的域名</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">shipper.betterwilson.com;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/shipper.betterwilson.com_nginx/shipper.betterwilson.com.pem;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书私钥文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate_key </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/shipper.betterwilson.com_nginx/shipper.betterwilson.com.key;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_cache </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">shared:SSL:1m;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5m</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_ciphers </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_protocols </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TLSv1.1 TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #表示优先使用服务端加密套件。默认开启</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_prefer_server_ciphers </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            root </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/front/dist;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            index </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">index.html;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            try_files </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">$uri $uri/ /index.html;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> /media </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">            alias </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/backend/dahe/media;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">      8080</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> dahe.betterwilson.com;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        rewrite</span><span style="--shiki-light:#032F62;--shiki-dark:#DBEDFF;"> ^(.*) https://$</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">server_name$1 </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">redirect</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">    server</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> {</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #HTTPS的默认访问端口443。</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #如果未在此处配置HTTPS的默认访问端口，可能会造成Nginx无法启动。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        listen </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">443</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> ssl;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书绑定的域名</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        server_name </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">dahe.betterwilson.com;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/dahe.betterwilson.com_nginx/dahe.betterwilson.com.pem;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #填写证书私钥文件绝对路径</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_certificate_key </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">/od/dahe.betterwilson.com_nginx/dahe.betterwilson.com.key;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">     </span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_cache </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">shared:SSL:1m;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_session_timeout </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">5m</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #自定义设置使用的TLS协议的类型以及加密套件（以下为配置示例，请您自行评估是否需要配置）</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #TLS协议版本越高，HTTPS通信的安全性越高，但是相较于低版本TLS协议，高版本TLS协议对浏览器的兼容性较差。</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_ciphers </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_protocols </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">TLSv1.1 TLSv1.2 TLSv1.3;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">        #表示优先使用服务端加密套件。默认开启</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        ssl_prefer_server_ciphers </span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">on</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">        location</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;"> / </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">{</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           include </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">uwsgi_params;</span></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">           uwsgi_pass </span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">0.0.0.0:8000;  </span><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 端口要和uwsgi里配置的一样</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # uwsgi_param UWSGI_SCRIPT dahe.wsgi;  #wsgi.py所在的目录名+.wsgi</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;">           # uwsgi_param UWSGI_CHDIR /od/backend/dahe; # 项目路径</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        }</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    }   </span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">}</span></span></code></pre></div><h2 id="项目优化" tabindex="-1">项目优化 <a class="header-anchor" href="#项目优化" aria-label="Permalink to &quot;项目优化&quot;">​</a></h2><h3 id="_1-修改云服务器安全组的端口" tabindex="-1">1 修改云服务器安全组的端口 <a class="header-anchor" href="#_1-修改云服务器安全组的端口" aria-label="Permalink to &quot;1 修改云服务器安全组的端口&quot;">​</a></h3><p>在部署和测试完成后关闭云服务器mysql和redis的端口，增加云服务器的安全性</p><p><img src="`+o+'" alt="image-20240327194546837"></p>',62),C=[F];function D(m,A,u,b,B,_){return a(),i("div",null,C)}const S=s(y,[["render",D]]);export{x as __pageData,S as default};
