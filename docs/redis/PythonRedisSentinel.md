## Python连接Redis哨兵

```python
from redis.sentinel import Sentinel

if __name__ == '__main__':
    # 哨兵监听的别名，这个就是你redis配置中的名字
    server_name = "myredis"

    # 设置哨兵组的IP和PORT
    sentinel_list = [
        ("192.168.10.150", 26379),
        ("192.168.10.151", 26379),
        ("192.168.10.152", 26379)
    ]
    # 初始化哨兵对象，并传递哨兵组的IP和端口信息
    sentinel = Sentinel(sentinel_list)

    # print(sentinel.discover_slaves(server_name))
    # print(sentinel.discover_master(server_name))

    # 从哨兵监视中获取master主库 ('192.168.10.150', 6379)
    master_client = sentinel.master_for(server_name, decode_responses=True)

    # 从哨兵监视中获取slave从库 [('192.168.10.151', 6379), ('192.168.10.152', 6379)]
    slave_client = sentinel.slave_for(server_name, decode_responses=True)

    # 主库中设置值
    master_client.set("user", "zhangkai")

    # 从库中获取值
    print(slave_client.get("user"))
```

**封装：**

```python
from redis.sentinel import Sentinel

class PyConnectionSentinel(object):
    """ Python连接Redis哨兵 """

    def __init__(self, server_name, sentinel_list, decode_responses=True):
        # 从库对象
        self.replica = None
        # 主库对象
        self.master = None
        # 哨兵对象
        self.sentinel_obj = None
        # 哨兵监听的别名，这个就是你redis配置中的名字
        self.server_name = server_name
        self.sentinel_list = sentinel_list
        # 根据需要决定是否自动对响应结果进行decode操作，这里默认是True
        self.decode_responses = decode_responses
        self.init_sentinel()
        self.get_master_client()
        self.get_replica_client()

    def init_sentinel(self):
        """ 初始化哨兵对象，并传递哨兵组的IP和端口信息 """
        self.sentinel_obj = Sentinel(self.sentinel_list)
        print("discover_master-->", self.sentinel_obj.discover_master(self.server_name))
        print("discover_slaves-->", self.sentinel_obj.discover_slaves(self.server_name))
        """
        discover_master--> ('192.168.10.150', 6379)
		discover_slaves--> [('192.168.10.151', 6379), ('192.168.10.152', 6379)]
        """

    def get_master_client(self):
        """ 从哨兵监视中获取master主库 """
        self.master = self.sentinel_obj.master_for(
            self.server_name,
            decode_responses=self.decode_responses,
            # 指Redis发出命令接收响应的时间不能超过此参数设置时间. 如果超过了此时间, 将会抛出异常redis.exceptions.TimeoutError: Timeout reading from socket, 即读取响应超时。
            # 建议设置这个时间，防止程序读取redis数据超时导致服务卡住，同时增加对这个的异常处理。
            # socket_timeout=0.5,

            # 指Redis建立连接超时时间. 当设置此参数时, 如果在此时间内没有建立连接, 将会抛出异常redis.exceptions.TimeoutError: Timeout connecting to server。
            # socket_connect_timeout不设置时，这个值等于socket_timeout。
            # 可以只设置socket_timeout
            # socket_connect_timeout=0.5

            # password='12345'

            # Boolean类型，建议设置为True,当设置False时, 一个命令超时后, 将会直接抛出timeout异常。
            # 当设置为True时, 命令超时后,将会重试一次, 重试成功则正常返回; 失败则抛出timeout异常。
            retry_on_timeout=True
        )

    def get_replica_client(self):
        """ 从哨兵监视中获取slave主库 """
        self.replica = self.sentinel_obj.master_for(self.server_name, decode_responses=self.decode_responses)


if __name__ == '__main__':
    # 哨兵监听的别名，这个就是你redis配置中的名字
    server_name = "myredis"

    # 设置哨兵组的IP和PORT
    sentinel_list = [
        ("192.168.10.150", 26379),
        ("192.168.10.151", 26379),
        ("192.168.10.152", 26379)
    ]
    # 关于哨兵的所有操作都可以通过这个类封装
    obj = PyConnectionSentinel(
        server_name=server_name,
        sentinel_list=sentinel_list
    )
    # 通过master可以进行读写操作
    obj.master.set('k1', 'v1111')
    print(obj.master.get("k1"))  # v1111
    # 你也可以通过从节点进行读操作，从而达到主从分离的目的
    print(obj.replica.get("k1"))  # v1111
```



