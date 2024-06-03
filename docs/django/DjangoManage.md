# Django自定义命令

我们知道，Django内部内置了很多命令，例如

```bash
python manage.py runserver
python manage.py makemigrations
python manage.py migrate
```

我们可以在python控制台中查看所有命令

![image-20240519124855291](assets\image-20240519124855291.png)

我们也可以自定义命令，让`python manage.py`执行

- 在已注册的app中创建指定的文件夹`management`和二级文件夹`commands`(文件夹名称固定)
- 在文件夹`commands`中创建文件`wilson.py`，命令就为`python manage.py wilson`

在`wilson.py`文件中，我们需要写一个`Command`类，继承`BaseCommand`，并重写`handle()`方法

当我们执行`python manage.py wilson`时，具体的操作就在`handle()`方法中

```python
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        print("wilson")
```

![image-20240519125723241](assets\image-20240519125723241.png)

在其父类`BaseCommand`中，有一个`add_arguments`方法，可以支持我们解析命令后的参数（字典形式）

```python
from django.core.management.base import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        print("wilson", options)

    def add_arguments(self, parser):
        parser.add_argument("v1")
        parser.add_argument("v2")
```

![image-20240519130206298](assets\image-20240519130206298.png)

我们也可以为每个参数添加解释，让用户知道参数的作用（可以通过`python manage.py wilson -h`获取解释信息）

![image-20240525191340325](assets\image-20240525191340325.png)

### 关于`python manage.py createsuperuser`命令

在django中的auth-app中，有一个`createsupersuer.py`文件

![image-20240519131239180](assets\image-20240519131239180.png)

在其初始化方法中，执行函数`get_user_model()`，本质上是去寻找每个app中的model类，并读取配置文件中的`AUTH_USER_MODEL = "auth.User"`，也就是auth中的User表

![image-20240519131336481](assets\image-20240519131336481.png)

然后去寻找`USERNAME_FIELD`字段，也就是配置文件中定义的`"username"`

在其`handle()`函数中，主要执行提示信息和接受我们输入的用户名，密码，邮箱

![image-20240519132408154](assets\image-20240519132408154.png)

在其最后执行了

```python
self.UserModel._default_manager.db_manager(database).create_superuser(**user_data)
```

本质上就是执行了内部的自定义命令`create_superuser`来创建超级用户

```python
User.objects.create_superuser(**user_data)
```

注：其中`db_manager(database)`用来选择数据库，默认是`default`