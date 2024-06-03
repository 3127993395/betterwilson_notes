# Django-admin组件

admin是`django`中提供的一套可视化工具：用于对ORM中定义的表进行增删改查。

## 1 概览

在django项目启动时，自动找到注册到admin中的所有model中定义的类，然后为这些类生成一系列的URL和视图函数，实现基本增删改查等功能。

```python
# admin.py
admin.site.register(models.Depart)
```

```python
路由:
    /admin/app名称/model名称/
    /admin/app名称/model名称/add/
    /admin/app名称/model名称/ID值/history/
    /admin/app名称/model名称/ID值/change/
    /admin/app名称/model名称/ID值/delete/
```

## 2 基本使用

- 创建表数据

  ![image-20240428163610913](assets\image-20240428163610913.png)

- 创建超级用户，用于登录admin

  ```python
  python manage.py createsuperuser
  
  # 按提示数输入账号，邮箱，密码
  ```

- 创建的超级用户数据会保存在数据库`user_auth`表中

  ![image-20240428162113139](assets\image-20240428162113139.png)

- 登录

  访问路由`http://localhost:8000/admin/`

  ![image-20230205071631627](assets\image-20230205071631627.png)

- 配置

  在每一个app中有一个`admin.py`文件，我们可以在这个文件中对想要增删改查的表进行配置

  ![image-20240428162922005](assets\image-20240428162922005.png)

  此时再次访问，就可以管理我们已注册的表
  ![image-20240428163042460](assets\image-20240428163042460.png)

  关于添加数据的三个选项

  ![image-20240428163410940](assets\image-20240428163410940.png)

## 3 admin配置方式

- 方法一：使用`admin.site.register`，将自定义的配置类作为参数传递

  ![image-20240428164934307](assets\image-20240428164934307.png)

- 方法二：在自定义类上方使用装饰器`admin.register`对表进行注册

  ![image-20240428170612983](assets\image-20240428170612983.png)

## 4 源码分析

### 4.1 加载`admin.py`

当我们启动Django项目时，Django会首先启动每个app目录下的`admin.py`文件

执行代码为`autodiscover_modules("admin", register_to=site)`

![image-20240428201346638](assets\image-20240428201346638.png)

![image-20240428201402894](assets\image-20240428201402894.png)

此时如果我们自定义`autodiscover_modules("xxxx")`

每次执行django项目时就会默认先去寻找每个项目下的`xxxx.py`文件执行

当加载`admin.py`时就会执行`admin.site`方法

![image-20240428183333186](assets\image-20240428183333186.png)

进入`admin.site`文件内部，发现site是实例化一个对象

![image-20240428183506456](assets\image-20240428183506456.png)

`site`实例化的对象实际上是`AdminSite`，而`DefaultAdminSite()`实际上是一个**懒加载**的机制

![image-20240428183616977](assets\image-20240428183616977.png)

在`AdminSite`的初始化方法中，定义了一个`_registry`空字典

![image-20240428183856240](assets\image-20240428183856240.png)

### 4.2 注册时执行`register`方法

![image-20240428185249667](assets\image-20240428185249667.png)

`self._registry[model] = admin_class(model, self)`

将model类作为字典的类，将model的配置对象作为值传到初始化的`_registry`空字典中

### 4.3 动态生成URL

在`urls.py`中执行`admin.site.urls`本质上就是走到`sites.py`中，并执行`get_urls()`方法

返回的是一个列表，里面包含了路由分发的数据

**注意：由于单例模式，这里`admin.site`创建的对象与`ModelAdmin`中创建的对象是同一个**,（这使得放数据拿数据是在同一个对象中）

![image-20240428185647207](assets\image-20240428185647207.png)

![image-20240428185820449](assets\image-20240428185820449.png)

最终返回的就是基本的`urlpatterns`和我们注册的每一个类自动生成的URL

![image-20240428190116538](assets\image-20240428190116538.png)

这里又做了一个嵌套，以app名和表名做前缀，里面又套用了`model_admin.urls`

如果要看具体的路由分发，要到具体的类下面的urls下面找

这样做可以方便我们进行路由的自定制，重写某个类的urls

![image-20240428190629071](assets\image-20240428190629071.png)

下面来看`ModelAdmin`中的路由分发，本质上返回的就是一个列表，包含增删改查的具体路由

![image-20240428191357011](assets\image-20240428191357011.png)

![image-20240428191632466](assets\image-20240428191632466.png)



## 4 常见配置

- list_display，列表时，定制显示的列。     `@admin.display(description="自定义")`修改页面显示的标题

  ```python
  class DepartAdmin(admin.ModelAdmin):
      list_display = ('id', 'title', 'mine1', 'mine2')
  
      @admin.display(description="自定义列")
      def mine1(self, obj):
          return obj.title + "123"
      
      @admin.display(description="自定义可跳转的列")
      def mine2(self, obj):
          return mark_safe(f"<a href='https://www.google.com'>{obj.title}</a>")
      
  admin.site.register(models.Depart, DepartAdmin)    
  ---------------------------------------------------------------------------------------------------------
  # 或者	mine.short_description = "自定义"	等同于使用装饰器	@admin.display(description="自定义")
  ```

  ![image-20240428165553633](assets\image-20240428165553633.png)

- list_display_links，列表时，列可以点击跳转。

  ```python
  @admin.register(models.Depart)
  class DepartAdmin(admin.ModelAdmin):
      list_display = ('id', 'title', 'mine')
      list_display_links = ['title']
  
      @admin.display(description="我的自定义")
      def mine(self, obj):
          return obj.title + "123"
  ```

- list_filter，列表时，定制右侧快速筛选。

  ```python
  from django.utils.translation import ugettext_lazy as _
   
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      list_display = ('user', 'pwd')
   
      class Ugg(admin.SimpleListFilter):
          title = _('decade born')
          parameter_name = 'xxxxxx'
   
          def lookups(self, request, model_admin):
              """
              显示筛选选项
              :param request:
              :param model_admin:
              :return:
              """
              return models.UserGroup.objects.values_list('id', 'title')
   
          def queryset(self, request, queryset):
              """
              点击查询时，进行筛选
              :param request:
              :param queryset:
              :return:
              """
              v = self.value()
              return queryset.filter(ug=v)
   
      list_filter = ('user',Ugg,)
  ```

- list_select_related，列表时，连表查询是否自动select_related

- 分页相关

  ```python
  # 分页，每页显示条数
      list_per_page = 100
   
  # 分页，显示全部（真实数据<该值时，才会有显示全部）
      list_max_show_all = 200
   
  # 分页插件
      paginator = Paginator
  ```

- list_editable，列表时，可以编辑的列

  ```python
  @admin.register(models.Depart)
  class DepartAdmin(admin.ModelAdmin):
      list_display = ('id', 'title')
  	list_display_links = ['title']
  ```

  ![image-20240428171149768](assets\image-20240428171149768.png)

- search_fields，列表时，模糊搜索的功能

  ```python
  @admin.register(models.Depart)
  class DepartAdmin(admin.ModelAdmin):
       
      search_fields = ['id', 'title']
  ```

  ![image-20240428172019921](assets\image-20240428172019921.png)

- date_hierarchy，列表时，对Date和DateTime类型进行搜索

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
   
      date_hierarchy = 'ctime'
  ```

- preserve_filters，详细页面，删除、修改，更新后跳转回列表后，是否保留原搜索条件

- save_as = False，详细页面，按钮为“Sava as new” 或 “Sava and add another”

- save_as_continue = True，点击保存并继续编辑

  ```python
  save_as_continue = True
   
  # 如果 save_as=True，save_as_continue = True， 点击Sava as new 按钮后继续编辑。
  # 如果 save_as=True，save_as_continue = False，点击Sava as new 按钮后返回列表。
  ```

- save_on_top = False，详细页面，在页面上方是否也显示保存删除等按钮

- inlines，详细页面，如果有其他表和当前表做FK，那么详细页面可以进行动态增加和删除

  ```python
  class UserInfoInline(admin.StackedInline): # TabularInline
      extra = 0
      model = models.UserInfo
   
   
  class GroupAdminMode(admin.ModelAdmin):
      list_display = ('id', 'title',)
      inlines = [UserInfoInline, ]
  ```

- action，列表时，定制action中的操作

  ```python
  @admin.register(models.Depart)
  class DepartAdmin(admin.ModelAdmin):
   
      # 定制Action行为具体方法
      def func(self, request, queryset):
          print(self, request, queryset)
          print(request.POST.getlist('_selected_action'))
   
      func.short_description = "中文显示自定义Actions"
      actions = [func, ]
   
      # Action选项都是在页面上方显示
      actions_on_top = True
      # Action选项都是在页面下方显示
      actions_on_bottom = False
   
      # 是否显示选择个数
      actions_selection_counter = True
  ```

  ![image-20240428171545633](assets\image-20240428171545633.png)

  当我们选择时会以post请求将表单中的数据发送，可以在`request.POST`中获取到

- 定制HTML模板

  ```python
  add_form_template = None
  change_form_template = None
  change_list_template = None
  delete_confirmation_template = None
  delete_selected_confirmation_template = None
  object_history_template = None
  ```

- raw_id_fields，详细页面，针对FK和M2M字段变成以Input框形式

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
   
      raw_id_fields = ('FK字段', 'M2M字段',)
  ```

- fields，详细页面时，显示字段的字段

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      fields = ('user',)
  ```

- exclude，详细页面时，排除的字段

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      exclude = ('user',)
  ```

- readonly_fields，详细页面时，只读字段

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      readonly_fields = ('user',)
  ```

- fieldsets，详细页面时，使用fieldsets标签对数据进行分割显示

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      fieldsets = (
          ('基本数据', {
              'fields': ('user', 'pwd', 'ctime',)
          }),
          ('其他', {
              'classes': ('collapse', 'wide', 'extrapretty'),  # 'collapse','wide', 'extrapretty'
              'fields': ('user', 'pwd'),
          }),
      )
  ```

- 详细页面时，M2M显示时，数据移动选择（方向：上下和左右）

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      filter_vertical = ("m2m字段",) # 或filter_horizontal = ("m2m字段",)
  ```

- ordering，列表时，数据排序规则

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      ordering = ('-id',)
      或
      def get_ordering(self, request):
          return ['-id', ]
  ```

- view_on_site，编辑时，是否在页面上显示view on set

  ```python
  view_on_site = False
  或
  def view_on_site(self, obj):
      return 'https://www.baidu.com'
  ```

- radio_fields，详细页面时，使用radio显示选项（FK默认使用select）

  ```python
  radio_fields = {"ug": admin.VERTICAL} # 或admin.HORIZONTAL
  ```

- show_full_result_count = True，列表时，模糊搜索后面显示的数据个数样式

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      # show_full_result_count = True # 1 result (12 total)
      # show_full_result_count = False  # 1 result (Show all)
      search_fields = ('user',)
  ```

- formfield_overrides = {}，详细页面时，指定现实插件

  ```python
  from django.forms import widgets
  from django.utils.html import format_html
   
  class MyTextarea(widgets.Widget):
      def __init__(self, attrs=None):
          # Use slightly better defaults than HTML's 20x2 box
          default_attrs = {'cols': '40', 'rows': '10'}
          if attrs:
              default_attrs.update(attrs)
          super(MyTextarea, self).__init__(default_attrs)
   
      def render(self, name, value, attrs=None):
          if value is None:
              value = ''
          final_attrs = self.build_attrs(attrs, name=name)
          return format_html('<textarea {}>\r\n{}</textarea>',final_attrs, value)
   
   
   
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
   
      formfield_overrides = {
          models.models.CharField: {'widget': MyTextarea},
      }
  ```

- prepopulated_fields = {}，添加页面，当在某字段填入值后，自动会将值填充到指定字段。

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
   
      prepopulated_fields = {"email": ("user","pwd",)}
  ```

  >*DjangoAdmin中使用js实现功能，页面email字段的值会在输入：user、pwd时自动填充*

- form = ModelForm，用于定制用户请求时候表单验证显示的字段

  ```python
  from app01 import models
  from django.forms import ModelForm
  from django.forms import fields
   
   
  class DepartForm(ModelForm):
      others = fields.CharField()
   
      class Meta:
          model = models.Depart
          fields = ['id']
   
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      form = DepartForm
  ```

  ![image-20240428172602912](assets\image-20240428172602912.png)

- empty_value_display = "列数据为空时，显示默认值"

  ```python
  @admin.register(models.UserInfo)
  class UserAdmin(admin.ModelAdmin):
      empty_value_display = "列数据为空时，默认显示"
   
      list_display = ('user','pwd','up')
   
      def up(self,obj):
          return obj.user
      up.empty_value_display = "指定列数据为空时，默认显示"
  ```

## 5 自定义stark组件

参照admin的源码，构建自己更便捷的实现增删改查的组件。

- 文档

  https://www.cnblogs.com/wupeiqi/tag/crm%E9%A1%B9%E7%9B%AE/

- 视频

  链接: https://pan.baidu.com/s/1UJ51lZqzcgcy9tgC_dmqTg 提取码: pll4 