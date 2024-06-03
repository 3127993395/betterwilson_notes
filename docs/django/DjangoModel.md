## Django模板查找顺序

首先看django项目的`settings.py`文件中是否定义`DIRS`

如果有定义，首先去这个目录下面查找（根目录下`templates`），找到了后续就不找了；如果没有，就顺着app的注册顺序进行查找

![image-20240428182317051](assets\image-20240428182317051.png)