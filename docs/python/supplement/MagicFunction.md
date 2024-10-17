# 魔法函数

在Python的类中存在一些特殊的方法，这些方法都是 `__方法__` 格式，这种方法在内部均有特殊的含义，接下来我们来讲一些常见的特殊成员：

# 字符串表示

- `__repr__`：控制此函数为它的实例所返回的内容。

  `__str__`：定义一个对象的字符串表示形式

  区别：`__str__`是面向用户的，而`__repr__`面向开发者

  本质上两者区别不大，我们开发者在使用时普遍使用`__str__`方法

  - 只定义`__str__`
  
  ```python
  class Foo():
      def __init__(self, name):
          self.name = name
  
      def __str__(self):
          return "哈哈哈"
  
      # def __repr__(self):
      #     return self.name + "自定义的内容"
  
  foo = Foo("wilson")
  print(foo)				# 哈哈哈
  print(foo.__str__())    # 哈哈哈
  ```
  
  - 只定义`__repr__`
  
  ```python
  class Foo():
      def __init__(self, name):
          self.name = name
  
      # def __str__(self):
      #     return "哈哈哈"
  
      def __repr__(self):
          return self.name + "自定义的内容"
  
  foo = Foo("wilson")
  print(foo)				# wilson自定义的内容
  print(foo.__repr__())   # wilson自定义的内容
  ```
  
  - 两者都定义
  
  ```python
  class Foo():
      def __init__(self, name):
          self.name = name
  
      def __str__(self):
          return "哈哈哈"
  
      def __repr__(self):
          return self.name + "自定义的内容"
  
  foo = Foo("wilson")
  print(foo)				# 哈哈哈
  print(foo.__str__())    # 哈哈哈
  print(foo.__repr__())   # wilson自定义的内容
  ```
  
  

# 集合、序列相关

- `__len()__`：返回指定长度

  我们可以在类中重写该方法，调用`len(类的实例化对象)`时就会执行该方法，可自定义返回类中某个或多个对象的长度

- ```python
  class Foo(object):
      def __init__(self, name_list):
          self.name_list = name_list
          
      def __len__(self):
          return len(self.name_list)
      
  foo = Foo(["wilson", "tom"])    
  print(len(foo))		# 2
  ```
  
- `__getitem__`：把类中传递的变量转化为**可迭代类型**，便于索引或循环

  `__setitem__`

  `__delitem__`

  ```python
  class Foo(object):
  
      def __getitem__(self, item):
          pass
  
      def __setitem__(self, key, value):
          pass
  
      def __delitem__(self, key):
          pass
  
  
  obj = Foo("Wilson", 19)
  
  obj["x1"]
  obj['x2'] = 123
  del obj['x3']
  ```

  我们可以通过以上方法实现对象的切片，例如：

  ```python
  import numbers
  
  
  class Group:
      def __init__(self, group_name, company_name, staffs):
          self.group_name = group_name
          self.company_name = company_name
          self.staffs = staffs
  
      def __getitem__(self, item):
          cls = type(self)
          if isinstance(item, slice):
              return cls(group_name=self.group_name, company_name=self.company_name, staffs=self.staffs[item])
          elif isinstance(item, numbers.Integral):
              return cls(group_name=self.group_name, company_name=self.company_name, staffs=[self.staffs[item]])
  
      def __setitem__(self, key, value):
          pass
  
      def __delitem__(self, key):
          pass
  
  
  staffs = ["wilson1", "wilson2", "wilson3"]
  group = Group(company_name="Wilson", group_name="users", staffs=staffs)
  group[:2]
  ```

  在上述代码中，当我们实现了`__getitem__`方法后，对`Group`对象进行切片，获得的还是一个`Group`对象

  ![image-20240512141204008](assets\image-20240512141204008.png)

- `__contains__`：用于判断整体是否包含部分

  在Python中，我们要判断我们要判断`x`是否在列表`list`中，可以用`if x in list`来判断

  其内部实际上是调用了`__contains__`方法

  我们也可以在类中自定义`__contains__`方法

  ![image-20240512142748816](assets\image-20240512142748816.png)

- `__reversed__`：通过重写该方法实现对元素顺序的自定义化操作

  如果我们调用`reversed()`函数，Python内部会执行`__reverse__`方法

  ![image-20240512143557499](assets\image-20240512143557499.png)

### 可调用

- `__call__`

  ```python
  class Foo(object):
      def __call__(self, *args, **kwargs):
          print("执行call方法")
  
  
  obj = Foo()
  obj()
  ```

### 上下文管理器

- `__enter__`、`__exit__`

  ```python
  class Foo(object):
  
      def __enter__(self):
          print("进入了")
          return 666
  
      def __exit__(self, exc_type, exc_val, exc_tb):
          print("出去了")
  
  
  obj = Foo()
  with obj as data:
      print(data)
  ```
  
  关于上下文管理器，也可以使用Python内置函数`contextlib`来实现：
  
  ```python
  import contextlib
  
  
  @contextlib.contextmanager
  def file_open(file_name):
      print("进入了")
      yield {}
      print("出去了")
  
  
  with file_open("a.txt") as f:
      print("file")
  
  >>>进入了
  >>>file
  >>>出去了
  ```
  
  

### 数值转换

- `__abs__`：返回数值的绝对值

  ```python
  class Foo():
      def __init__(self, num):
          self.num = num
  
      def __abs__(self):
          return abs(self.num)
  
  
  foo = Foo(-1)
  print(abs(foo))	# 1
  ```

- `__bool__`

- `__int__`

- `__float__`

- `__hash__`

- `__index__`

### 元类相关

- `__new__`：传递的第一个参数是类，被称为构造方法，在`__init__`方法之前执行

  ```python
  class Foo(object):
      def __init__(self, name):
          print("第二步：初始化对象，在空对象中创建数据")
          self.name = name
  
      def __new__(cls, *args, **kwargs):
          print("第一步：先创建空对象并返回")
          return object.__new__(cls)
  
  
  obj = Foo("Wilson")
  ```

  注：kwargs接收字典参数，args接收元组参数

- `__init__`：传递的第一个参数是self，被称为初始化方法

  ```python
  class Foo(object):
      def __init__(self, name):
          self.name = name
  
  
  obj = Foo("Wilson")
  ```


![image-20240516140920103](assets\image-20240516140920103.png)

### 属性相关

- `__getattr__`：当python调用了不存在的变量或属性时，就会调用类中的`__getattr__`方法

  `__setattr__`

  ![image-20240516131118212](assets\image-20240516131118212.png)

- `__getattribute__`：当定义此方法时 ，无论访问类中的任何属性或变量是否定义，都会调用此方法，并返回此方法的返回值

  `__setattribute__`

  ![image-20240516131547492](assets\image-20240516131547492.png)

- `__dir__`

### 属性描述符

- `__get__`、`__set__`、`__delete__`

  在类中实现这三种方法中的任意一种方法，就能将该类转化为属性描述符

  当我们向该类中放值的时候，会自动调用`__set__`方法；取值时自动调用`__get__`方法；删除值时自动调用`__delete__`方法

  可以利用这个特点来对类中变量的属性进行约束，原理同Django中的Model

  例如：

  ![image-20240516133218316](assets\image-20240516133218316.png)
  
  当一个类只定义了`__get__`方法，则这个描述符被称为**非数据描述器**(non-data descriptor)
  
  当一个类定义了`__get__`、`__set__`、`__delete__`三种方法，则这个描述符被称为**数据描述器**(data descriptor)
  
  ### 补充：Python中的属性查找过程
  
  ```python
  '''
  如果user是某个类的实例，那么user.age（以及等价的getattr(user,’age’)）
  首先调用__getattribute__。如果类定义了__getattr__方法，
  那么在__getattribute__抛出 AttributeError 的时候就会调用到__getattr__，
  而对于描述符(__get__）的调用，则是发生在__getattribute__内部的。
  user = User(), 那么user.age 顺序如下：
  
  （1）如果“age”是出现在User或其基类的__dict__中， 且age是data descriptor， 那么调用其__get__方法, 否则
  
  （2）如果“age”出现在obj(user)的__dict__中， 那么直接返回 obj.__dict__[‘age’]， 否则
  
  （3）如果“age”出现在User或其基类的__dict__中
  
  （3.1）如果age是non-data descriptor，那么调用其__get__方法， 否则
  
  （3.2）返回 __dict__[‘age’]
  
  （4）如果User有__getattr__方法，调用__getattr__方法，否则
  
  （5）抛出AttributeError
  '''
  ```

### 协程

- `__aeait__`、`__aiter__`、`__anext__`、`__aenter__`、`__aexit__`

### 迭代器和生成器

迭代器是访问集合内元素的一种方式，一般用来遍历数据

迭代器和用下标访问方式不一样，迭代器是不支持切片的

生成器提供了一种惰性访问数据的方式

`__iter__`和`__next__`

- 迭代器

  ```python
  # 迭代器类型的定义：
      1.当类中定义了 __iter__ 和 __next__ 两个方法。
      2.__iter__ 方法需要返回对象本身，即：self
      3. __next__ 方法，返回下一个数据，如果没有数据了，则需要抛出一个StopIteration的异常。
  	官方文档：https://docs.python.org/3/library/stdtypes.html#iterator-types
          
  # 创建迭代器类型 ：
  class IT(object): 
      def __init__(self):
          self.counter = 0
  
      def __iter__(self):
          return self 
  
      def __next__(self):
          self.counter += 1
          if self.counter == 3:
              raise StopIteration()
          return self.counter
  
  
  # 根据类实例化创建一个迭代器对象：
      obj1 = IT()
      
      # v1 = obj1.__next__()
      # v2 = obj1.__next__()
      # v3 = obj1.__next__() # 抛出异常
      
      v1 = next(obj1) # obj1.__next__()
      print(v1)
  
      v2 = next(obj1)
      print(v2)
  
      v3 = next(obj1)
      print(v3)
  
  
      obj2 = IT()
      for item in obj2:  # 首先会执行迭代器对象的__iter__方法并获取返回值，一直去反复的执行 next(对象) 
          print(item)
          
  迭代器对象支持通过next取值，如果取值结束则自动抛出StopIteration。
  for循环内部在循环时，先执行__iter__方法，获取一个迭代器对象，然后不断执行的next取值（有异常StopIteration则终止循环）。
  ```

- 生成器

  ```python
  # 创建生成器函数
  def func():
      yield 1
      yield 2
  
  
  # 创建生成器对象（内部是根据生成器类generator创建的对象），生成器类的内部也声明了：__iter__、__next__ 方法。
  # 生成器对象是在python编译字节码时产生的
  obj1 = func()
  
  v1 = next(obj1)
  print(v1)
  
  v2 = next(obj1)
  print(v2)
  
  v3 = next(obj1)
  print(v3)
  
  obj2 = func()
  for item in obj2:
      print(item)
      
  
  # 如果按照迭代器的规定来看，其实生成器类也是一种特殊的迭代器类（生成器也是一个中特殊的迭代器）。
  ```

- 可迭代对象

  如果一个类中有`__iter__`方法且返回一个迭代器对象 ；则我们称以这个类创建的对象为可迭代对象。

  ```python
  class Foo(object):
      
      def __iter__(self):
          return 迭代器对象(生成器对象)
      
  obj = Foo() # obj是 可迭代对象。
  
  # 可迭代对象是可以使用for来进行循环，在循环的内部其实是先执行 __iter__ 方法，获取其迭代器对象，然后再在内部执行这个迭代器对象的next功能，逐步取值。
  for item in obj:
      pass
  ```

  ```python
  class IT(object):
      def __init__(self):
          self.counter = 0
  
      def __iter__(self):
          return self
  
      def __next__(self):
          self.counter += 1
          if self.counter == 3:
              raise StopIteration()
          return self.counter
  
  
  class Foo(object):
      def __iter__(self):
          return IT()
  
  
  obj = Foo() # 可迭代对象
  
  
  for item in obj: # 循环可迭代对象时，内部先执行obj.__iter__并获取迭代器对象；不断地执行迭代器对象的next方法。
      print(item)
  ```

  ```python
  # 基于可迭代对象&迭代器实现：自定义range
  class IterRange(object):
      def __init__(self, num):
          self.num = num
          self.counter = -1
  
      def __iter__(self):
          return self
  
      def __next__(self):
          self.counter += 1
          if self.counter == self.num:
              raise StopIteration()
          return self.counter
  
  
  class Xrange(object):
      def __init__(self, max_num):
          self.max_num = max_num
  
      def __iter__(self):
          return IterRange(self.max_num)
  
  
  obj = Xrange(100)
  
  for item in obj:
      print(item)
  ```

  

  ```python
  class Foo(object):
      def __iter__(self):
          yield 1
          yield 2
  
  
  obj = Foo()
  for item in obj:
      print(item)
  ```

  ```python
  # 基于可迭代对象&生成器 实现：自定义range
  
  class Xrange(object):
      def __init__(self, max_num):
          self.max_num = max_num
  
      def __iter__(self):
          counter = 0
          while counter < self.max_num:
              yield counter
              counter += 1
  
  
  obj = Xrange(100)
  for item in obj:
      print(item)
  ```

- 常见的数据类型：

  ```python
  v1 = list([11,22,33,44])
  
  v1是一个可迭代对象，因为在列表中声明了一个 __iter__ 方法并且返回一个迭代器对象。
  ```

  ```python
  from collections.abc import Iterator, Iterable
  
  v1 = [11, 22, 33]
  print( isinstance(v1, Iterator) )  # false，判断是否是迭代器；判断依据是__iter__ 和 __next__。
  v2 = v1.__iter__()
  print( isinstance(v2, Iterator) )  # True
  
  
  
  v1 = [11, 22, 33]
  print( isinstance(v1, Iterable) )  # True，判断依据是是否有 __iter__且返回迭代器对象。
  
  v2 = v1.__iter__()
  print( isinstance(v2, Iterable) )  # True，判断依据是是否有 __iter__且返回迭代器对象。
  ```

### 其他

- `__dict__`：查询一个类或实例变量中的所有属性

  （也可以通过`dir()`函数来获取更详细的属性信息）

  ```python
  class Foo(object):
      def __init__(self, name, age):
          self.name = name
          self.age = age
  
  
  obj = Foo("Wilson",19)
  print(obj.__dict__)
  ```

- `__add__` 等。

  ```python
  class Foo(object):
      def __init__(self, name):
          self.name = name
  
      def __add__(self, other):
          return "{}-{}".format(self.name, other.name)
  
  
  foo1 = Foo("wilson")
  foo2 = Foo("123")
  
  # 对象+值，内部会去执行 对象.__add__方法，并将+号后面的值当做参数other传递过去。
  v3 = foo1 + foo2
  print(v3)	# wilson-123
  ```

  