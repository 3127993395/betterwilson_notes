# type,object,class 三者关系

在python中，所有类的创建关系遵循：

```
type -> int -> 1
type -> class -> obj
```

例如：

```python
a = 1
b = "abc"
print(type(1))          # <class 'int'> 返回对象的类型
print(type(int))        # <class 'type'> 表明这个类是由type生成的
print(type(b))          # <class 'str'>
print(type(str))        # <class 'type'>
```

在python中，`type()`方法有两种使用

- 返回这个实例变量的类型，如1是整数类型`int`，"abc"是字符串类型`str`
- 返回这个类是由什么类生成的，如`int`和`str`都由`type`类生成

由此可见，类都是由`type`这个类所创建的一个个对象

而`type`这个类则是由它自身生成的

再来看`object`类：

```python
class Student:
    pass


stu = Student()
print(type(stu))            # <class '__main__.Student'>
print(type(Student))        # <class 'type'>
print(int.__bases__)        # (<class 'object'>,)
print(str.__bases__)        # (<class 'object'>,)
print(Student.__bases__)    # (<class 'object'>,)
print(type.__bases__)       # (<class 'object'>,)
print(object.__bases__)     # ()
print(type(object))         # (<class 'object'>,)
```

`__bases__`方法可以返回一个类的父类

我们可以看到，`object`类是所有类的父类（当然也包括`type`类）

即使我们不将继承关系直接写在代码块中，python也会默认所有的类继承`object`



三者关系图

![image-20240504102023071](assets\image-20240504102023071.png)