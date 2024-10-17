# type元类

### 创建动态类的两种方法

当我们想要动态创建类时，可以采用一下函数：

```python
def create_class(name):
    if name == "user":
        class User:
            def __str__(self):
                return "User"

        return User
    elif name == "company":
        class Company:
            def __str__(self):
                return "company"

        return Company


if __name__ == "__main__":
    MyClass = create_class("user")
    my_obj = MyClass()
    print(my_obj)					# User
```

但是这种方法很麻烦，我们可以采用`type()`函数来创建类

```python
User = type("user", (), {})
```

我们可以在`type()`源码中查看其参数

- 第一个参数是类名称

- 第二个参数是其基类，也就是其父类，以元组方式传入（如果没有可以写为空元组）

  如果只有一个父类，元组中需要加一个逗号

- 第三个参数是定义类中的属性或变量，以字典的形式传入（相当于类变量）

  也可以传入函数，将函数名作为字典的键，返回值作为字典的值

```python
    def __init__(cls, what, bases=None, dict=None): # known special case of type.__init__
        """
        type(object) -> the object's type
        type(name, bases, dict, **kwds) -> a new type
        # (copied from class doc)
        """
        pass
```

```python
def create_class(name):
    if name == "user":
        class User:
            def __str__(self):
                return "User"

        return User
    elif name == "company":
        class Company:
            def __str__(self):
                return "company"

        return Company


class BaseClass:
    def answer(self):
        return "基类"


if __name__ == "__main__":
    User = type("user", (BaseClass,), {"name": "user", "func": lambda self: "wilson"})
    my_obj = User()
    print(my_obj.name)			# user
    print(my_obj.func())		# wilson
    print(my_obj.answer())		# 基类
```



### 元类是用来创建类的一种特殊类

我们一般的类都由`class`创建，而`class`其实也是一种类，就是由`type`创建的

当我们用`class`来创建类时，可以指定一个参数`metaclass`来指定该类是由哪个类创建的（元类），例如：

```python
class MetaClass(type):
    pass

class User(metaclass=MetaClass):
    pass
```

python中的类实例化过程：

- python会首先寻找创建类时的`metaclass`属性，如果有，则通过`metaclass`来创建类

  （寻找`metaclass`属性时包含继承关系，如果该类本身没有定义，而其父类定义了，则调用父类的`metaclass`属性来创建）

- 如果没有定义`metaclass`，会默认由`type`创建这个类对象

使用元类后，可以将创建这个类对象的过程交给元类来做，不需要在创建时实现`__new__`方法，使函数逻辑层次清晰

在我们python的`abc`模块中，就自定义了`metaclass`并重写了`__new__`方法

![image-20240516150231478](assets\image-20240516150231478.png)
