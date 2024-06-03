# Django-auth组件

## 1 表结构

我们从`python manage.py migrate`为我们创建的`auth`组件内置的表开始看

- `auth_user`：用户表存储用户信息（登录admin后台）

  里面的字段分两类：用户基本信息（用户名，邮箱，密码等）和2张M2M表（用户+权限，用户+组）（与权限相关）

- `auth_permission`：权限表，存储所有表生成的增删改查的URL（每张表4个路由<——>路由的别名）

- `auth_user_user_permissions`：用户表和权限表的多对多关系表，里面放`user_id`和`permission_id`

- `auth_group`：组表，里面放id和组名，和权限表有多对多的关系（对权限进行分组）

- `auth_user_groups`：用户表和组表的关系表，给用户分组

- `auth_group_permissions`： 组表和权限表的关系表，给权限分组



## 2 登录路由

当我们执行`python manage.py createsuperuser`时，会创建超级用户

我们从超级用户的登录路由来看

![image-20240526093534520](assets\image-20240526093534520.png)

源码嵌套比较多（要重复看），重点在重用和解耦，可实现比较多的自定义



## 3 首页权限分配

当用户登录成功后，展示的是基于admin注册的表，其中

- 超级用户全部可见

  ![image-20240526103329872](assets\image-20240526103329872.png)

- 其他用户，只要增删改查4个权限有一个权限被分配，就可以看见

  ![image-20240526105619193](assets\image-20240526105619193.png)

我们来看auth源码中是如何控制这种权限的分配

从前面的路由分析中，当我们通过登录成功后，就是执行`self.index`来展示首页的信息

![image-20240526140027403](assets\image-20240526140027403.png)



总结：

- 获取所有通过admin注册的Model
- 根据当前的request.user去数据库校验，判断是否展示



## 4 按钮控制

auth组件中我们可以控制是否展示add、delete等按钮

上文的分析图中我们可以得到`app_list`中包含的是获取的具体权限信息

```json
app_list:
[
  {
    "name": "App01",
    "app_label": "app01",
    "app_url": "/admin/app01/",
    "has_module_perms": true,
    "models": [
      {
        "model": "<class 'app01.models.Depart'>",
        "name": "Departs",
        "object_name": "Depart",
        "perms": {
          "add": false,
          "change": false,
          "delete": false,
          "view": true
        },
        "admin_url": "/admin/app01/depart/",
        "add_url": "None",
        "view_only": true
      }
    ]
  },
  {
    "name": "Authentication and Authorization",
    "app_label": "auth",
    "app_url": "/admin/auth/",
    "has_module_perms": true,
    "models": [
      {
        "model": "<class 'django.contrib.auth.models.Group'>",
        "name": "Groups",
        "object_name": "Group",
        "perms": {
          "add": true,
          "change": true,
          "delete": true,
          "view": true
        },
        "admin_url": "/admin/auth/group/",
        "add_url": "/admin/auth/group/add/",
        "view_only": false
      }
    ]
  }
]
```

我们可以通过每个app下每张表的权限true/false来判断是否有权限

具体判断则在每张表的HTML模板中

![image-20240526141743040](assets\image-20240526141743040.png)
