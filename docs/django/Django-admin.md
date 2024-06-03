# Django-admin单例模式和懒加载

## 单例模式

```python
class Foo:
    def __init__(self):
        self.name = "张三"
        
    def __new__(cls, *args, **kwargs):
        empty_object = super().__new__(cls)
        return empty_object

obj1 = Foo()
obj2 = Foo()
```

当我们实例化对象时，就会在内存开一个空间

python的执行顺序是：

- 调用`__new__`方法创建一个空对象
- 调用`__init__`方法向空对象中赋值`name="张三"`
- 所以称`__new__`方法为构造方法，`__init__`方法为初始化方法

单例模式的目的，就是让我们在创建类对象时，都使用第一次创建的类对象，而不是像上文那样每次使用时都创建一个对象

例如：

```python
import admin	# 1

admin.site		# 2

import admin	# 3

admin.site		# 4
```

python的执行顺序是

- 1加载admin.py文件
- 2实例化一个对象

- 3当我们再次导入admin.py文件时，python不会重新加载，步骤4也就是一开始创建的admin对象，并不会重新创建一个新的对象

### 如何实现一个单例模式

```python
class Foo:
    instance = None

    def __init__(self):
        self.name = "张三"

    def __new__(cls, *args, **kwargs):
        if cls.instance:
            return cls.instance
        cls.instance = empty_object = super().__new__(cls)
        return empty_object


obj1 = Foo()
obj2 = Foo()
```

这样如果还没有创建实例化的类，`instance=None`，创建并同时将创建的类赋值给`instance`

如果已经创建对象，即`instance=对象`，就直接返回这个对象

![image-20240428200728946](assets\image-20240428200728946-1714308960488-1.png)

可以看出两个对象的内存地址是一样的

python实例化创建对象时，不直接创建对象，而是先创建一个代理（不确定是否会使用实例化的功能）

当我们真正调用实例化的功能的时候，再真正创建对象

## 懒加载

在python中，我们实例化对象后，可以拿到实例化类中的变量，也可以修改

```python
class Info:
    def __init__(self):
        self.name = "张三"
        self.age = 999

obj = Info()
print(obj.name)
obj.name = "李四"
print(obj.name)
```

![image-20240428203043808](assets\image-20240428203043808.png)

当我们访问一个实例化类中不存在的对象时，一般情况下会报错

但是如果我们在实例化的类中定义`__getattr__`方法，如果访问一个实例化类中不存在的对象时，会返回这个方法的`return`值

```python
class Info:
    def __init__(self):
        self.name = "张三"
        self.age = 999

    def __getattr__(self, item):
        return "访问了不存在的类变量"


obj = Info()
print(obj.xxxxxxxxxxx)
```

![image-20240428203334676](assets\image-20240428203334676.png)

# django-admin如何实现单例模式和懒加载

django-admin源码中实例化`site`对象时，并不会真正实例化创建这个对象

当它调用`register`方法时，并没有这个方法，就会执行它的父类`LazyObject`中的`__getattr__`方法

![image-20240428203824126](assets\image-20240428203824126.png)

![image-20240428203912956](assets\image-20240428203912956.png)

![image-20240428204339952](assets\image-20240428204339952.png)

而这里的`__getattr__`方法实际上时执行`new_method_proxy`方法

![image-20240428204519387](assets\image-20240428204519387.png)

我们需要注意，父类`LazyObject`中有一个类变量`_wrapped`默认为`None`

![image-20240428204710087](assets\image-20240428204710087.png)

当我们执行`new_method_proxy`方法时，会执行`_setup()`方法并将它赋值给`_wrapped`

这样当下次实例化对象时，由于`_wrapped`不为空，就会直接返回，不会再次创建对象，这就实现了**单例模式**

`self._wrapped`其实就是真正的实例化对象，这就实现了**懒加载**

![image-20240428205133813](assets\image-20240428205133813.png)





