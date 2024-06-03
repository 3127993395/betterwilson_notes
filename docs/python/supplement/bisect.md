# bisect模块

在Python中，如果我们想维持一个已排序的序列，可以使用内置的`bisect`模块，例如：

```python
import bisect

# 用于处理已排序的序列
inter_list = []
bisect.insort(inter_list, 3)
bisect.insort(inter_list, 2)
bisect.insort(inter_list, 5)
bisect.insort(inter_list, 1)
bisect.insort(inter_list, 6)
print(inter_list)	# [1, 2, 3, 5, 6]
print(bisect.bisect(inter_list, 3))		# 3
```

`bisect`内部使用二分查找算法来添加数据

默认使用`insort_right`函数（如果有两个相同数据，新数据添加到老数据右边），而`insort_right`内部调用的是`bisect_right`函数来实现二分查找算法

![image-20240512145030407](assets\image-20240512145030407.png)

如果需要查找，可以使用`bisect`函数，默认调用的也是`bisect_right`函数