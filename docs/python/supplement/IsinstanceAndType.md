# isinstance和type区别

在python中，我们由两种方式来判断一个类所属的类型：

- `isinstance(x, A)`用来判断x是不是由类A实例化得到，或者由A的子类实例化变量得到

- `type()`，返回这个类的类型

  通过`type(x) is A`来判断x是不是由A来创建的，与`isinstance`区别是**无默认继承关系**

```python
class A:
    pass


class B(A):
    pass


b = B()
print(isinstance(b, B))		# True
print(isinstance(b, A))		# True

print(type(b))				# <class '__main__.B'>

print(type(b) is B)			# True
print(type(b) is A)			# False
```

所以建议使用`isinstance`而不是`type`来判断类型

