# model中的抽象类

当我们在app中`models.py`文件中定义model表并执行`python manage.py makemigrations`和`python manage.py migrate`后，Django就会在数据库中创建表

但是我们也可以对其默认配置修改，定义model类但是不在数据库中创建

```python
from django.db import models


class Info(models.Model):
    title = models.CharField(verbose_name="标题", max_length=32)

    class Meta:
        abstract = True
```

![image-20240519121201584](assets\image-20240519121201584.png)

`abstract = True`是一个标识，标识当前类只用于为其他类提供公共的字段（继承关系），并不会单独创建一张表

![image-20240519122021319](assets\image-20240519122021319.png)

在`Mine`这张表中，除了有自己定义的`size`字段，还有继承过来的`title`字段

![image-20240519122120702](assets\image-20240519122120702.png)
