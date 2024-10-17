# Redis集群-主从复制

**主库负责写，从库负责读，主从库始终保持数据一致性**

## 实验

从库可以配置多台，比如一主一从，一主多从，并且所有从库配置主库都是一条命令搞定。

此时我的服务器：

- db01，主节点，192.168.10.150
- db02，从节点，192.168.10.151

#### **在db01创建一些key**

```bash
cat /dev/null > /opt/redis6379/logs/redis6379.log
du -sh /opt/redis6379/logs/redis6379.log
for i in {1..10000}; do redis-cli set wilson$i $i;echo $i;done
redis-cli bgsave
redis-cli dbsize

[root@cs opt]# for i in {1..10000}; do redis-cli set wilson$i $i;echo $i;done
[root@cs ~]# redis-cli bgsave
Background saving started
[root@cs ~]# redis-cli dbsize
(integer) 10000
```

#### 在redis02配置主从

临时生效，就是直接执行SLAVEOF命令

```bash
# SLAVEOF 主库IP 端口
cat /dev/null > /opt/redis6379/logs/redis6379.log
du -sh /opt/redis6379/logs/redis6379.log
redis-cli flushall
redis-cli SLAVEOF 192.168.10.150 6379
redis-cli dbsize

[root@cs ~]# redis-cli flushall
OK
[root@cs ~]# redis-cli dbsize
(integer) 0
[root@cs ~]# redis-cli SLAVEOF 192.168.10.150 6379
OK
[root@cs ~]# redis-cli dbsize
(integer) 10000


vim /opt/redis6379/conf/redis6379.conf

SLAVEOF 192.168.10.144 6379
```

永久生效就是写入到Redis配置文件中:

```bash
echo "SLAVEOF 192.168.43.128 6379" >> /opt/redis6379/conf/redis6379.conf
cat /opt/redis6379/conf/redis6379.conf
```

其它命令：

```bash
# 查看主从状态的各种信息
INFO REPLICATION
# 查看自己的角色
ROLE

[root@cs ~]# redis-cli INFO REPLICATION
# Replication
role:slave
master_host:192.168.10.150
master_port:6379
master_link_status:up
master_last_io_seconds_ago:1
master_sync_in_progress:0
slave_repl_offset:196
slave_priority:100
slave_read_only:1
connected_slaves:0
master_replid:1c2c8c97d3b3c4e4ba6fc1237b3742161f114cbc
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:196
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:1
repl_backlog_histlen:196
[root@cs ~]# redis-cli ROLE
1) "slave"
2) "192.168.43.128"
3) (integer) 6379
4) "connected"
5) (integer) 196
```

## Replication工作原理

Redis Replication是一种简单、易用的主从模式（master-slave）的复制机制，它能够使得slave节点成为与master节点完全相同的副本。每次与master节点连接中断后slave节点会自动重联，并且无论master节点发生什么，slave节点总是尝试达到与master节点一致的状态。Redis采取了一系列的辅助措施来保证数据安全。

```
Redis主从复制技术有两个版本：在2.8版本之前，每次slave节点断线重联后，只能进行全量同步。在2.8版本之后进行了重新设计，引入了部分同步的概念。本文将以Redis 5.0.7版本为基础对主从复制原理进行介绍。
```

旧版主从复制采用的是“全量同步+命令传播”机制完成主从数据同步，这里的硬伤是从机重连后，哪怕主从之间只有少量的数据不一致，也要执行一个耗时、耗资源的全量同步操作来达到数据一致。为此，Redis团队引入了若干机制确保在少量数据不一致时，采用代价较低的部分同步来完成主从复制。所以，当前的主从复制机制包含三个部分：全量同步、部分同步、命令传播。

为保证内容完整性，还是先介绍一下全量同步、命令传播两个历史的概念。

- 全量同步：master节点创建全量数据的RDB快照文件，通过网络连接发送给slave节点，slave节点加载快照文件恢复数据，然后再继续发送复制过程中复制积压缓冲区内新增的命令，使之达到数据一致状态。
- 命令传播：如果master-slave节点保持连接，master节点将持续向slave节点发送命令流，以保证master节点数据集发生的改变同样作用在slave节点数据集上，这些命令包含：客户端写请求、key过期、数据淘汰以及其他所有引起数据集变更的操作。

## 同步原理

在主从复制模式下，Redis使用一对`Replicaion ID, offset`来唯一识别Master节点数据集的版本，要理解这个“版本“的概念需要认识Redis的以下三个概念：

- Replication ID（复制ID）：每个Redis的主节点都用一个随机生成的字符串来表示在某一时刻其内部存储数据的状态，“某一时刻”可以理解为其成为master角色的那一刻，由源码可知在第一个从节点加入时，Redis初始化了复制ID。
- offset（复制偏移量）：主从模式下，主节点会持续不断的向从节点传播引起数据集更改的命令，offset所表示的是主节点向从节点传递命令字节总数。它不是孤立存在的，需要配合复制积压缓冲区才能工作。
- backlog（复制积压缓冲区）：它是一个环形缓冲区，用来存储主节点向从节点传递的命令，它的大小是固定的，可存储的命令有限，超出部分将会被删除。它即可用于部分同步，也可用于命令传播阶段的命令重推。

![image-20240316211322483](assets\image-20240316211322483.png)

我们也能从日志来着手印证下，下面是我按照打印日志的时间顺序整理了下其过程(部分关键日志)

```bash
从库：
# 从库向主库发送主从同步请求
54340:S 03 Aug 2023 23:20:30.274 * REPLICAOF 192.168.10.150:6379 enabled (user request from 'id=10 addr=127.0.0.1:33956 fd=7 name= age=0 idle=0 flags=N db=0 sub=0 psub=0 multi=-1 qbuf=48 qbuf-free=32720 obl=0 oll=0 omem=0 events=r cmd=slaveof')


主库：
# 主库接收到了主库的请求
21566:M 03 Aug 2023 15:20:30.667 * Replica 192.168.10.151:6379 asks for synchronization
21566:M 03 Aug 2023 15:20:30.667 * Partial resynchronization not accepted: Replication ID mismatch (Replica asked for '6dd2fe7d7518ca1547f387d5158fd2015c9b39f5', my replication IDs are '113f5106075b494c44df2ff79ac68e7044a6a59b' and '0000000000000000000000000000000000000000')
# 主库立即执行bgsave，拍个最新的快照保存到本地并向从库发送rdb数据
21566:M 03 Aug 2023 15:20:30.667 * Starting BGSAVE for SYNC with target: disk
21566:M 03 Aug 2023 15:20:30.667 * Background saving started by pid 42854
42854:C 03 Aug 2023 15:20:30.672 * DB saved on disk
42854:C 03 Aug 2023 15:20:30.673 * RDB: 0 MB of memory used by copy-on-write
21566:M 03 Aug 2023 15:20:30.774 * Background saving terminated with success
21566:M 03 Aug 2023 15:20:30.779 * Synchronization with replica 192.168.10.151:6379 succeeded

从库：
# 从库接受主库发来的rdb数据
54340:S 03 Aug 2023 23:20:30.834 * Connecting to MASTER 192.168.10.150:6379
54340:S 03 Aug 2023 23:20:30.834 * MASTER <-> REPLICA sync started
54340:S 03 Aug 2023 23:20:30.834 * Non blocking connect for SYNC fired the event.
54340:S 03 Aug 2023 23:20:30.849 * Master replied to PING, replication can continue...
54340:S 03 Aug 2023 23:20:30.851 * Trying a partial resynchronization (request 6dd2fe7d7518ca1547f387d5158fd2015c9b39f5:329).
54340:S 03 Aug 2023 23:20:30.899 * Full resync from master: 113f5106075b494c44df2ff79ac68e7044a6a59b:835852
54340:S 03 Aug 2023 23:20:30.899 * Discarding previously cached master state.
# 接收到了来自主库的168951 bytes
54340:S 03 Aug 2023 23:20:31.004 * MASTER <-> REPLICA sync: receiving 168951 bytes from master
# 重要动作：清空从库自己老的数据，然后加载主库同步过来的rdb数据到内存中
54340:S 03 Aug 2023 23:20:31.010 * MASTER <-> REPLICA sync: Flushing old data
54340:S 03 Aug 2023 23:20:31.010 * MASTER <-> REPLICA sync: Loading DB in memory
54340:S 03 Aug 2023 23:20:31.013 * MASTER <-> REPLICA sync: Finished with success
# 上面已经同步成功了rdb数据，接下来就是同步aof了，执行aof重写机制处理aof文件
54340:S 03 Aug 2023 23:20:31.014 * Background append only file rewriting started by pid 54450
54340:S 03 Aug 2023 23:20:31.092 * AOF rewrite child asks to stop sending diffs.
54450:C 03 Aug 2023 23:20:31.093 * Parent agreed to stop sending diffs. Finalizing AOF...
54450:C 03 Aug 2023 23:20:31.093 * Concatenating 0.00 MB of AOF diff received from parent.
54450:C 03 Aug 2023 23:20:31.093 * SYNC append only file rewrite performed
54450:C 03 Aug 2023 23:20:31.093 * AOF rewrite: 8 MB of memory used by copy-on-write
54340:S 03 Aug 2023 23:20:31.142 * Background AOF rewrite terminated with success
54340:S 03 Aug 2023 23:20:31.142 * Residual parent diff successfully flushed to the rewritten AOF (0.00 MB)
54340:S 03 Aug 2023 23:20:31.142 * Background AOF rewrite finished successfully
# aof搞定之后，主从同步也正式完毕了
# 后续只要在主库的修改操作，都会实时同步到从库
```

## Replication相关其他问题

#### 从库只读

默认情况下，从机工作在只读模式下，即无法对从机执行写指令

```bash
[root@cs ~]# redis-cli get zhangkai1
"1"
[root@cs ~]# redis-cli set k1 v1
(error) READONLY You can't write against a read only replica.
```

若要更改此模式，可在配置文件修改如下选项

```bash
# 默认是yes-只读，no-可写
slave-read-only yes/no
```

**但一般，我们从库不负责写入**

#### 过期key处理

Redis可以通过设置key的过期时间来限制key的生存时间，Redis处理key过期有惰性删除和定期删除两种机制，这一机制依赖Redis实例的计时能力。如果主机、从机同时启用key过期的处理机制，可能会导致一些问题。为此，Redis采取了三个技术手段来解决key过期的问题：

- 从机禁用主动key过期机制。主机在执行key过期后，会以`DEL`指令的方式向所有从机传播指令，从而保证从机移除过期的key。
- 依赖主机的key过期机制是无法做到实时性的，所以针对读操作，从机将会按照自己的时钟向客户端返回key不存在。
- 为防止Lua脚本执行期间key过期，Lua脚本将会传播给从机执行。

#### 心跳机制

在命令传播阶段，每隔一秒，slave节点向master节点发送一次心跳信息，命令格式为`REPLCONF ACK <offset>`。

命令中的offset是就是slave最新的复制偏移量，master接收后便会与自己的offset对比。如果从节点数据缺失，主节点会推送缺失的数据。

**不仅仅是Redis有，MySQL, MongoDB等都有**

#### min-replica机制

Redis主从复制不仅仅是解决主机、从机之间数据同步的问题，它还需要保证数据的安全性。这里的安全性主要是指主从之间数据同步达到一致的效率，以及主从结构下读写分离场景中分布式系统的可靠性。

Redis采用异步复制机制，它无法真正保证每个从机都能准确的收到传播的指令，所以主从之间必然会存在命令丢失的时间窗口。

为此，Redis引入了`min-replicas`选项，该机制在redis.conf中有两个配置项：

- min-replicas-to-write ：至少有N个从机才能写入数据。保证从机最低数量。
- min-replicas-max-lag ：如果每个从机的延迟值大于N，则拒绝写入数据。保证主从同步延迟。

通过`info replication`可以查看从机数量（connected_slaves）、每个从机的延迟值（lag）

```bash
[root@cs ~]# redis-cli INFO REPLICATION
# Replication
role:master
connected_slaves:2
slave0:ip=192.168.10.151,port=6379,state=online,offset=8453211,lag=0
slave1:ip=192.168.10.152,port=6379,state=online,offset=8453211,lag=1
master_replid:1c2c8c97d3b3c4e4ba6fc1237b3742161f114cbc
master_replid2:0000000000000000000000000000000000000000
master_repl_offset:8453211
second_repl_offset:-1
repl_backlog_active:1
repl_backlog_size:1048576
repl_backlog_first_byte_offset:7404636
repl_backlog_histlen:1048576
```

这一机制是通过从机与主机之间心跳来实现的，如上文所讲，从机每隔一秒向主机发送一次心跳数据，基于心跳，主节点可以：

- 更新从机同步确认时间：基于主节点时间及同步确认时间计算延迟值。
- 更新主从最后通信时间：用于从机通信超时检测，如果通信超时，主机会移除从机。

#### 主库关闭持久化时的复制安全性

当master关闭了持久化时，如果发生故障后自动重启时，由本地没有保存持久化的数据，重启的Redis内存数据为空，而slave会自动同步master的数据，就会导致slave的数据也会被清空。

所以，我们应该尽可能为master节点开启持久化，这样可以防止Redis故障重启时数据丢失，进而导致slave数据被清除。如果确实无法开启持久化机制，那应该配置master节点无法自动重启，确保从机可以成为新的master节点，防止数据被清除。

## 断开主从复制

```bash
redis-cli SLAVEOF no one

[root@cs opt]# redis-cli SLAVEOF no one
OK
```

## 主从复制注意事项

1. 从节点只读不可写
2. 从节点不会自动故障转移，他会⼀直尝试同步主节点，并且依然不可写
3. 主从复制故障转移需要介入的地方
   - 修改代码指向新主的IP
   - 从节点需要执行slaveof no one
4. 从库建立同步时会清空自己的数据，如果同步对象写错了，就清空了
5. 断开主从复制状态后，从库会自动变成主库
6. ⼀定要做好数据备份，无论是主节点还是从节点，操作前最好做下备份
