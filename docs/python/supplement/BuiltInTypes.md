## python中的常见内置类型分类

- `None`类型

  在python的内置类型中，只有唯一一个类型可以设置为`None`，可以通过`id()`函数判断（`id()`可以用来获取变量的内存地址值）

  ```python
  a = None
  b = None
  print(id(a))	# 140704868887752
  print(id(b))	# 140704868887752
  ```

- 常见数值类型

  - `int`
  - `float`
  - `complex`(复数类型)
  - `bool`

- 迭代类型

- 序列类型

  - `list`
  - `bytes`、`bytearry`、`memoryview`(二进制序列)
  - `range`
  - `tuple`
  - `str`
  - `array`

- 映射类型

  - `dict`

- 集合

  - `set`
  - `frozenset`(不可修改的`set`)

- 上下文管理类型

  - `with`语句

- 其他类型

  - 模块类型
  - class和实例
  - 函数类型
  - 方法类型
  - 代码类型（python代码本身会被python解释器变成对象类型）
  - `object`对象
  - `type`类型
  - `ellipsis`类型
  - `notimplemented`类型