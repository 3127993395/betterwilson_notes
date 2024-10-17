# model中的Manager对象

当我们在执行ORM的增删改查操作时，一般会这样写：

```python
from app01 import models

models.Depart.objects.all(..)
models.Depart.objects.filter(..)
models.Depart.objects.create(..)
```

但是有时候我们需要自定义一些操作来实现某种功能，比如

```python
models.Depart.objects.func(...)
```

这时候我们就需自定义我们的Manager对象

```python
from django.db import models


class MyManager(models.Manager):
    def func(self, title):
        models.Depart.objects.create(title=title)
        models.Depart.objects.create(title=title)


class Depart(models.Model):
    title = models.CharField(verbose_name="标题", max_length=32)
    count = models.IntegerField(verbose_name="数量")

    objects = MyManager()
```

这样就实现了当我们执行`models.Depart.objects.func(...)`时，会在表中创建2条数据