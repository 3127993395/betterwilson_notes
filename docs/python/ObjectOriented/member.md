# 成员，成员修饰符

## 1.成员

面向对象中的所有成员如下：

- 变量
  - 实例变量
  - 类变量
- 方法
  - 绑定方法
  - 类方法
  - 静态方法
- 属性

通过面向对象进行编程时，会遇到很多种情况，也会使用不同的成员来实现，接下来我们来逐一介绍成员特性和应用场景。



### 1.1 变量

- 实例变量，属于对象，每个对象中各自维护自己的数据。
- 类变量，属于类，可以被所有对象共享，一般用于给对象提供公共数据（类似于全局变量）。





```python
class Person(object):
    country = "中国"

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def show(self):
        # message = "{}-{}-{}".format(Person.country, self.name, self.age)
        message = "{}-{}-{}".format(self.country, self.name, self.age)
        print(message)

print(Person.country) # 中国


p1 = Person("wilson",20)
print(p1.name)
print(p1.age)
print(p1.country) # 中国

p1.show() # 中国-wilson-20
```

提示：当把每个对象中都存在的相同的示例变量时，可以选择把它放在类变量中，这样就可以避免对象中维护多个相同数据。



#### 易错点 & 面试题

第一题：注意读和写的区别。



```python
class Person(object):
    country = "中国"

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def show(self):
        message = "{}-{}-{}".format(self.country, self.name, self.age)
        print(message)

print(Person.country) # 中国

p1 = Person("wilson",20)
print(p1.name) # wilson
print(p1.age) # 20
print(p1.country) # 中国
p1.show() # 中国-wilson-20

p1.name = "root"     # 在对象p1中讲name重置为root
p1.num = 19          # 在对象p1中新增实例变量 num=19
p1.country = "china" # 在对象p1中新增实例变量 country="china"

print(p1.country)   # china
print(Person.country) # 中国
```

```python
class Person(object):
    country = "中国"

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def show(self):
        message = "{}-{}-{}".format(self.country, self.name, self.age)
        print(message)

print(Person.country) # 中国

Person.country = "美国"


p1 = Person("wilson",20)
print(p1.name) # wilson
print(p1.age) # 20
print(p1.country) # 美国
```





第二题：继承关系中的读写



```python
class Base(object):
    country = "中国"


class Person(Base):

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def show(self):
        message = "{}-{}-{}".format(Person.country, self.name, self.age)
        # message = "{}-{}-{}".format(self.country, self.name, self.age)
        print(message)


# 读
print(Base.country) # 中国
print(Person.country) # 中国

obj = Person("wilson",19)
print(obj.country) # 中国

# 写
Base.country = "china"
Person.country = "泰国"
obj.country = "日本"
```

面试题

```python
class Parent(object):
    x = 1


class Child1(Parent):
    pass


class Child2(Parent):
    pass


print(Parent.x, Child1.x, Child2.x) # 1 1 1

Child1.x = 2
print(Parent.x, Child1.x, Child2.x) # 1 2 1

Parent.x = 3
print(Parent.x, Child1.x, Child2.x) # 3 2 3
```



### 1.2 方法

- 绑定方法，默认有一个self参数，由对象进行调用（此时self就等于调用方法的这个对象）【对象&类均可调用】
- 类方法，默认有一个cls参数，用类或对象都可以调用（此时cls就等于调用方法的这个类）【对象&类均可调用】
- 静态方法，无默认参数，用类和对象都可以调用。【对象&类均可调用】



```python
class Foo(object):

    def __init__(self, name,age):
        self.name = name
        self.age = age

    def f1(self):
        print("绑定方法", self.name)

    @classmethod
    def f2(cls):
        print("类方法", cls)

    @staticmethod
    def f3():
        print("静态方法")
        
# 绑定方法（对象）
obj = Foo("wilson",20)
obj.f1() # Foo.f1(obj)


# 类方法
Foo.f2()  # cls就是当前调用这个方法的类。（类）
obj.f2()  # cls就是当前调用这个方法的对象的类。


# 静态方法
Foo.f3()  # 类执行执行方法（类）
obj.f3()  # 对象执行执行方法
```

在Python中比较灵活，方法都可以通过对象和类进行调用；而在java、c#等语言中，绑定方法只能由对象调用；类方法或静态方法只能由类调用。

```python
import os
import requests


class Download(object):

    def __init__(self, folder_path):
        self.folder_path = folder_path

    @staticmethod
    def download_dou_yin():
        # 下载抖音
        res = requests.get('.....')

        with open("xxx.mp4", mode='wb') as f:
            f.write(res.content)

    def download_dou_yin_2(self):
        # 下载抖音
        res = requests.get('.....')
        path = os.path.join(self.folder_path, 'xxx.mp4')
        with open(path, mode='wb') as f:
            f.write(res.content)


obj = Download("video")
obj.download_dou_yin()

```

面试题：

在类中 @classmethod 和 @staticmethod 的作用？



### 1.3 属性

属性其实是由绑定方法 + 特殊装饰器 组合创造出来的，让我们以后在调用方法时可以不加括号，例如：

```python
class Foo(object):

    def __init__(self, name):
        self.name = name

    def f1(self):
        return 123

    @property
    def f2(self):
        return 123


obj = Foo("wilson")

v1 = obj.f1()
print(v1)

v2 = obj.f2
print(v2)
```



示例：以之前开发的分页的功能。

```python
class Pagination:
    def __init__(self, current_page, per_page_num=10):
        self.per_page_num = per_page_num
        
        if not current_page.isdecimal():
            self.current_page = 1
            return
        current_page = int(current_page)
        if current_page < 1:
            self.current_page = 1
            return
        self.current_page = current_page
	
    def start(self):
        return (self.current_page - 1) * self.per_page_num
	
    def end(self):
        return self.current_page * self.per_page_num


user_list = ["用户-{}".format(i) for i in range(1, 3000)]

# 分页显示，每页显示10条
while True:
    page = input("请输入页码：")
	
    # page，当前访问的页码
    # 10，每页显示10条数据
	# 内部执行Pagination类的init方法。
    pg_object = Pagination(page, 20)
    
    page_data_list = user_list[ pg_object.start() : pg_object.end() ]
    for item in page_data_list:
        print(item)
```

```python
class Pagination:
    def __init__(self, current_page, per_page_num=10):
        self.per_page_num = per_page_num

        if not current_page.isdecimal():
            self.current_page = 1
            return
        current_page = int(current_page)
        if current_page < 1:
            self.current_page = 1
            return
        self.current_page = current_page

    @property
    def start(self):
        return (self.current_page - 1) * self.per_page_num

    @property
    def end(self):
        return self.current_page * self.per_page_num


user_list = ["用户-{}".format(i) for i in range(1, 3000)]

# 分页显示，每页显示10条
while True:
    page = input("请输入页码：")

    pg_object = Pagination(page, 20)
    page_data_list = user_list[ pg_object.start : pg_object.end ]
    
    for item in page_data_list:
        print(item)
```



其实，除了咱们写的示例意外，在很多模块和框架的源码中也有porperty的身影，例如：requests模块。

```python
import requests

# 内部下载视频，并将下载好的数据分装到Response对象中。
res = requests.get(
    url="https://aweme.snssdk.com/aweme/v1/playwm/?video_id=v0200f240000buuer5aa4tij4gv6ajqg",
    headers={
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36 FS"
    }
)

# 去对象中获取text，其实需要读取原始文本字节并转换为字符串
res.text
```



关于属性的编写有两种方式：

- 方式一，基于装饰器

  ```python
  class C(object):
      
      @property
      def x(self):
          pass
      
      @x.setter
      def x(self, value):
          pass
      
      @x.deleter
      def x(self):
  		pass
          
  obj = C()
  
  obj.x
  obj.x = 123
  del obj.x
  ```

- 方式二，基于定义变量

  ```python
  class C(object):
      
      def getx(self): 
  		pass
      
      def setx(self, value): 
  		pass
          
      def delx(self): 
  		pass
          
      x = property(getx, setx, delx, "I'm the 'x' property.")
      
  obj = C()
  
  obj.x
  obj.x = 123
  del obj.x
  ```

  

Django源码一撇：

```python
class WSGIRequest(HttpRequest):
    def __init__(self, environ):
        script_name = get_script_name(environ)
        # If PATH_INFO is empty (e.g. accessing the SCRIPT_NAME URL without a
        # trailing slash), operate as if '/' was requested.
        path_info = get_path_info(environ) or '/'
        self.environ = environ
        self.path_info = path_info
        # be careful to only replace the first slash in the path because of
        # http://test/something and http://test//something being different as
        # stated in https://www.ietf.org/rfc/rfc2396.txt
        self.path = '%s/%s' % (script_name.rstrip('/'),
                               path_info.replace('/', '', 1))
        self.META = environ
        self.META['PATH_INFO'] = path_info
        self.META['SCRIPT_NAME'] = script_name
        self.method = environ['REQUEST_METHOD'].upper()
        # Set content_type, content_params, and encoding.
        self._set_content_type_params(environ)
        try:
            content_length = int(environ.get('CONTENT_LENGTH'))
        except (ValueError, TypeError):
            content_length = 0
        self._stream = LimitedStream(self.environ['wsgi.input'], content_length)
        self._read_started = False
        self.resolver_match = None

    def _get_scheme(self):
        return self.environ.get('wsgi.url_scheme')

    def _get_post(self):
        if not hasattr(self, '_post'):
            self._load_post_and_files()
        return self._post

    def _set_post(self, post):
        self._post = post

    @property
    def FILES(self):
        if not hasattr(self, '_files'):
            self._load_post_and_files()
        return self._files

    POST = property(_get_post, _set_post)
```



写在最后，对属性进行一个补充：

由于属性和实例变量的调用方式相同，所以在编写时需要注意：属性名称 不要 实例变量 重名。

```python
class Foo(object):

    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def func(self):
        return 123


obj = Foo("wilson", 123)
print(obj.name)
print(obj.func)
```



一旦重名，可能就会有报错。

```python
class Foo(object):

    def __init__(self, name, age):
        self.name = name  # 报错，错认为你想要调用 @name.setter 装饰的方法。
        self.age = age

    @property
    def name(self):
        return "{}-{}".format(self.name, self.age)


obj = Foo("wilson", 123)
```



```python
class Foo(object):

    def __init__(self, name, age):
        self.name = name 
        self.age = age

    @property
    def name(self):
        return "{}-{}".format(self.name, self.age) # 报错，循环调用自己（直到层级太深报错）

    @name.setter
    def name(self, value):
        print(value)


obj = Foo("wilson", 123)
print(obj.name)
```



**如果真的想要在名称上创建一些关系，可以让实例变量加上一个下划线。**

```python
class Foo(object):

    def __init__(self, name, age):
        self._name = name
        self.age = age

    @property
    def name(self):
        return "{}-{}".format(self._name, self.age)


obj = Foo("wilson", 123)
print(obj._name)
print(obj.name)
```



## 2.成员修饰符

Python中成员的修饰符就是指的是：公有、私有。

- 公有，在任何地方都可以调用这个成员。

- 私有，只有在类的内部才可以调用改成员（成员是以**两个下划线**开头，则表示该成员为私有）。

  在Python中是使用封装的方式，将`__name`私有属性封装成`_classname__attr`，即`_Foo__name`

示例一：

```python
class Foo(object):

    def __init__(self, name, age):
        self.__name = name
        self.age = age

    def get_data(self):
        return self.__name

    def get_age(self):
        return self.age


obj = Foo("wilson", 123)


# 公有成员
print(obj.age)
v1 = self.get_age()
print(v1)

# 私有成员
# print(obj.__name) # 错误，由于是私有成员，只能在类中进行使用。
v2 = obj.get_data()
print(v2)
```



示例2：

```python
class Foo(object):

    def get_age(self):
        print("公有的get_age")

    def __get_data(self):
        print("私有的__get_data方法")

    def proxy(self):
        print("公有的proxy")
        self.__get_data()


obj = Foo()
obj.get_age()

obj.proxy()
```



示例3：

```python
class Foo(object):

    @property
    def __name(self):
        print("公有的get_age")

    @property
    def proxy(self):
        print("公有的proxy")
        self.__name
        return 1


obj = Foo()
v1 = obj.proxy
print(v1)

```



**特别提醒：父类中的私有成员，子类无法继承。**

```python
class Base(object):

    def __data(self):
        print("base.__data")

    def num(self):
        print("base.num")


class Foo(Base):

    def func(self):
        self.num()
        self.__data() # # 不允许执行父类中的私有方法


obj = Foo()
obj.func()

```

```python
class Base(object):

    def __data(self):
        print("base.__data")

    def num(self):
        print("base.num")
        self.__data()  # 不允许执行父类中的私有方法


class Foo(Base):

    def func(self):
        self.num()


obj = Foo()
obj.func()
```





写在最后，按理说私有成员是无法被外部调用，但如果用一些特殊的语法也可以（Flask源码中有这种写法，大家写代码不推荐这样写）。

```python
class Foo(object):

    def __init__(self):
        self.__num = 123
        self.age = 19

    def __msg(self):
        print(1234)


obj = Foo()
print(obj.age)
print(obj._Foo__num)
obj._Foo__msg()
```



成员是否可以作为独立的功能暴露给外部，让外部调用并使用。

- 可以，公有。
- 不可以，内部其他放的一个辅助，私有。

