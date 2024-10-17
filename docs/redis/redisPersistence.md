# redis持久化

所谓持久化，就是将内存中的数据刷写到本地，达到持久化和数据恢复的目的

在Redis中，有RDB快照(snapshotting)和AOF(appendonly-file)两种持久化方式

## RDB

想要触发持久化的动作有两种方式，分别是手动触发和自动触发。

但无论如何触发，都是以覆盖写的形式写入到同一份RDB文件中，即RDB的形式，持久化文件都只有一份，比较方便管理。

### 手动触发持久化

- `save`，同步命令，也就是该命令会占用Redis的主进程，在`save`命令执行期间，Redis将会阻塞所有的客户端请求，所以，当数据量非常大使，不推荐使用该命令。
- `bgsave`，异步命令，Redis使用Linux的`fork()`生成一个子进程来做持久化的工作，而主进程则继续提供其他服务。（推荐）

![image-20240316211219933](assets\image-20240316211219933.png)

手动触发这里只需要在配置文件中配置（注意配置读写权限）

```bash
dir "/data/redis6379/"   # 持久化文件保存的目录，目录位置可以更改为其它目录
dbfilename redis6379.rdb   	 # 持久化文件名，可以带端口号也可以不带，文件名也可以随意，只要是.rdb结尾就行


# 执行命令
mkdir -p /data/redis6379/
chmod 777 /data/redis6379
vim /opt/redis6379/conf/redis6379.conf

# 添加如下配置
dir "/data/redis6379/"
dbfilename redis6379.rdb
```

模拟操作：

```bash
redis-cli set k1 v1
redis-cli set k2 v2
redis-cli set k3 v3
redis-cli SAVE
redis-cli set k4 v4
redis-cli set k5 v5
redis-cli keys \*
pkill -9 redis
systemctl start redis
redis-cli keys \*

[root@cs ~]# redis-cli set k1 v1
OK
[root@cs ~]# redis-cli set k2 v2
OK
[root@cs ~]# redis-cli set k3 v3
OK
[root@cs ~]# redis-cli SAVE
OK
[root@cs ~]# redis-cli set k4 v4
OK
[root@cs ~]# redis-cli set k5 v5
OK
[root@cs ~]# redis-cli keys \*
1) "k1"
2) "k4"
3) "k2"
4) "k5"
5) "k3"
[root@cs ~]# pkill -9 redis
[root@cs ~]# systemctl start redis
[root@cs ~]# redis-cli keys \*
1) "k2"
2) "k3"
3) "k1"
# 丢了两条数据
```

`save`和`bgsave`对比：

| 命令     | save               | bgsave                                 |
| :------- | :----------------- | :------------------------------------- |
| I/O类型  | 同步               | 异步                                   |
| 是否阻塞 | 是                 | 是(阻塞发生在fock()阶段，但通常非常快) |
| 复杂度   | O(n)               | O(n)                                   |
| 优点     | 不会消耗额外的内存 | 不阻塞客户端命令                       |
| 缺点     | 阻塞客户端命令     | 需要fork子进程，消耗额外内存           |

**生产中一般不会使用上述两个命令，而是使用自动触发机制。**

### 自动触发持久化

自动触发需要在配置文件中配置相关触发规则。

```bash
# RDB 自动持久化规则，当满足一下任意一个条件时，自动触发bgsave进行持久化
# 当然，你也可以自定义其它规则，比如 save 30 100 
# 当 900 秒内至少有 1 个key 被改动时，自动执行持久化操作
save 900 1

# 当 300 秒内至少有 10 个key 被改动时，自动执行持久化操作
save 300 10

# 当 60 秒内至少有 10000 个key被改动时，自动执行持久化操作
save 60 10000

# 数据持久化文件存储目录
dir "/data/redis6379/"

# RDB持久化文件名
dbfilename redis.rdb       # 持久化文件名，可以带端口号也可以不带，文件名也可以随意，只要是.rdb结尾就行

# bgsave过程中发生错误时，是否停止写入，通常为 yes
rdbcompression yes

# 是否对RDB文件进行校验，通常为 yes
rdbchecksum yes

# 最终拷贝这些命令到配置文件
vim /opt/redis6379/conf/redis6379.conf

dir "/data/redis6379/"
dbfilename redis.rdb
save 900 1
save 300 10
save 60 10000
rdbcompression yes
rdbchecksum yes

# 重启redis
systemctl restart redis
```

当你用下面三种方式关闭Redis服务，都会在进程退出之前，自动执行一次bgsave之后，再退出

```bash
SHUTDOWN
kill 2490		# 2490是redis进程id
pkill redis
```

另外，当只配置了RDB的持久化时，重启Redis服务时，会自动读取RDB文件进行数据恢复。

#### **关于kill/pkill/pkill -9/shutdown的补充**

kill 是指定进程ID杀死进程，其实默认参数是发送-15信号，即通知进程退出，进程在退出之前可以清理并释放资源。
pkill 是指定进程名杀死进程，也是默认发送发送-15信号，即通知进程退出，进程在退出之前可以清理并释放资源。
而-9参数则是直接强制杀死进程。

那么在redis中，你可以通过kill和pkill或者shutdown来关闭redis，那么背后其实都是通知进程退出，而退出前，redis则是会自动执行下bgsave，拍个快照保存数据到本地。

如果是用`pkill -9 redis`则是直接干掉了redis进程，不会触发bgsave命令，那么丢数据也就不足为奇了。

所以，在生产中使用redis，不要用`-9`参数。

## AOF

RDB持久化并不是完美的，如果Redis因为某些原因造成了宕机，那么将会丢失最近写入、但并未保存到快照中的数据。
在Redis1.1开始，增加了AOF来补充RDB的不足。
AOF持久化的工作机制是，每当Redis执行修改数据集的命令时，这个命令就会被追加到AOF文件的末尾。数据恢复时重放这个AOF文件即可恢复数据。

主要参数:

```bash
# 是否开启aof，默认是no
appendonly no

# 触发持久化的条件
appendfsync always/everyesc/no
```

其中：

- `appendonly`：是(`yes`)否(`no`)开启AOF持久化，默认`no`。
- `appendsync`：触发持久化的条件，有下面三种选项：
  - `always`：每当修改数据集都会记录，慢但非常安全。
  - `everysec`：每秒钟fync一次，足够快（和使用 RDB 持久化差不多），就算有故障时也只会丢失 1 秒钟的数据。推荐（并且也是默认）使用该策略， 这种 fsync 策略可以兼顾速度和安全性。
  - `no`：由操作系统来决定什么时候同步数据，这个选项不常用。

### AOF重写机制

因为AOF会一直将命令追加到文件末尾，导致该文件的体积会越来越大，而且它会保存一些重复性的命令，而这些重复性的命令可以用一条或者极少的命令就能替代....
为了优化这种情况，Redis支持：在不妨碍正常处理客户端请求中，对AOF文件进行重建(rebuild)，也就是执行`bgrewriteaof`命令，会生成一个新的AOF文件，这个文件包含重建当前数据集所需要的最少命令。
在Redis2.2版本之前，需要手动执行`bgrewriteaof`命令，该命令会异步执行一个AOF文件重写操作，重写时会创建一个当前AOF文件的优化版本，即使`bgrewriteaof`执行失败，也不会有任何数据丢失，因为旧的AOF文件在`bgrewriteaof`执行成功之前不会被修改和覆盖。
到了Redis2.4则开始支持配置自动触发AOF重写机制了。
AOF重写机制的特点：减少AOF文件对磁盘的空间占用；加速数据恢复。

举例（伪文件）：

```bash
redis-cli	 	aof记录	 	   redis⾥的数据
set k1 v1 		set k1 k1		k1/v1

set k2 v2 		set k1 v1		k1/v1
		 		set k2 v2		k2/v2

set k3 v3 		set k1 v1		k1/v1
		 		set k2 v2		k2/v2
		 		set k3 v3 		k3/v3

del k1			set k1 v1		k2/v2
				set k2 v2		k3/v3
				set k3 v3
				del k1

del k2			set k1 v1		k3/v3
				set k2 v2
				set k3 v3
				del k1
				del k2

# 问题来了，此时aof中，有意义的记录只有一条：
				set k3 v3
```

所以，对于aof文件特别大的话， 类似于这种情况会很多，所以要进行重写，把无效的命令精简掉。

其它参数：

```bash
# 是否开启aof，默认是no
appendonly no

# 触发持久化的条件
appendfsync always/everyesc/no

# 数据持久化文件存储目录，如果单独使用aof，那么配置项就需要加上dir，如果同时使用了rdb，有了dir参数，aof这里则直接指定文件名即可
dir "/data/redis_data/6379"

# 是否在执行重写时不同步数据到AOF文件
# 这里的 yes，就是执行重写时不同步数据到AOF文件
no-appendfsync-on-rewrite yes

# 触发AOF文件执行重写的最小尺寸，如果将来真的用这个参数，且重度使用redis，则这个64兆就太小了，你可以调整以G为单位
auto-aof-rewrite-min-size 64mb

# 触发AOF文件执行重写的增长率
auto-aof-rewrite-percentage 100


# aof文件保存位置,
# dir "/data/redis6379/"
appendfilename "redis.aof"		



# 最终拷贝这些命令到配置文件
vim /opt/redis6379/conf/redis6379.conf

appendonly yes
appendfsync everysec
appendfilename "redis.aof"	
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb
no-appendfsync-on-rewrite yes

# 重启redis
systemctl restart redis
```

关于AOF重写，当AOF文件的体积大于64Mb，并且AOF文件的体积比上一次重时的体积大了至少一倍（100%）时，Redis将执行 `bgrewriteaof `命令进行重写，当然这个命令也能手动执行。

### RDB和AOF的优先级

当AOF和RDB同时存在的时候，redis会优先读取AOF的数据进行恢复。

### AOF中设置了过期时间的key，Redis重启会如何处理？

Redis启动过程中，再根据aof文件恢复数据时，遇到过期的key，会校验一下是否过期，如果过期了，就按照过期处理

#### **AOF的优点**

- 使用AOF 会让你的Redis更加耐久: 你可以使用不同的fsync策略：每次写的时候fsync。使用默认的每秒fsync策略，Redis的性能依然很好(fsync是由后台线程进行处理的，主线程会尽力处理客户端请求)，一旦出现故障，你最多丢失1秒的数据。
- AOF文件是一个只进行追加的日志文件，即使由于某些原因(磁盘空间已满，写的过程中宕机等等)未执行完整的写入命令，你也也可使用redis-check-aof工具修复这些问题。（实际并不好用）
- Redis 可以在 AOF 文件体积变得过大时，自动地在后台对 AOF 进行重写： 重写后的新 AOF 文件包含了恢复当前数据集所需的最小命令集合。 整个重写操作是绝对安全的，因为 Redis 在创建新 AOF 文件的过程中，会继续将命令追加到现有的 AOF 文件里面，即使重写过程中发生停机，现有的 AOF 文件也不会丢失。 而一旦新 AOF 文件创建完毕，Redis 就会从旧 AOF 文件切换到新 AOF 文件，并开始对新 AOF 文件进行追加操作。
- AOF 文件有序地保存了对数据库执行的所有写入操作， 这些写入操作以 Redis 协议的格式保存， 因此 AOF 文件的内容非常容易被人读懂， 对文件进行分析（parse）也很轻松。 导出（export） AOF 文件也非常简单： 举个例子， 如果你不小心执行了 FLUSHALL 命令， 但只要 AOF 文件未被重写， 那么只要停止服务器， 移除 AOF 文件末尾的 FLUSHALL 命令， 并重启 Redis ， 就可以将数据集恢复到 FLUSHALL 执行之前的状态。

#### **AOF的缺点**

- 对于相同的数据集来说，AOF 文件的体积通常要大于 RDB 文件的体积。

## RDB和AOF对比：

| 选项           | RDB    | AOF          |
| :------------- | :----- | :----------- |
| 数据恢复优先级 | 低     | 高           |
| 体积           | 小     | 大           |
| 恢复速度       | 快     | 慢           |
| 数据安全性     | 丢数据 | 根据策略决定 |

那么AOF和RDB这两种持久化方式，在生产中，该怎么用呢？

- 官方推荐两个都启用，如果是主从环境，可以主库只开启aof，从库只开rdb做备份。
- 如果对数据不敏感，可以选单独用RDB。
- 不建议单独用 AOF，因为可能会出现Bug。
- 如果只是做纯内存缓存，可以都不用。

性能建议：

- 因为RDB文件通常只用作后备用途，如果是主从环境，建议只在Slave上持久化RDB文件，而且只要15分钟备份一次就够了，只保留save 900 1这条规则。
- 代价,一是带来了持续的IO，二是AOF rewrite的最后将rewrite过程中产生的新数据写到新文件造成的阻塞几乎是不可避免的。
- 只要硬盘许可，应该尽量减少AOF rewrite的频率，AOF重写的基础大小默认值64M太小了，可以设到5G以上。
- 默认超过原大小100%大小时重写可以改到适当的数值。

最后，如果同时配置了RDB和AOF，那么在数据恢复时，Redis会优先选择AOF文件进行数据恢复，如果你就想使用RDB恢复怎么办？可以在配置文件中先把AOF关闭，然后重启Redis，恢复完数据，在线开启AOF即可



