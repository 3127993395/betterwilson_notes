# Python连接Redis集群

```python
from redis import RedisCluster
from redis.cluster import ClusterNode

if __name__ == '__main__':


    # 集群所有节点的列表
    nodes = [
        ClusterNode("192.168.10.150", port=6380), ClusterNode("192.168.10.150", port=6381),

        ClusterNode("192.168.10.151", port=6380), ClusterNode("192.168.10.151", port=6381),

        ClusterNode("192.168.10.152", port=6380), ClusterNode("192.168.10.152", port=6381),
    ]

    # 可以给定全部集群中的机器IP信息
    cluster = RedisCluster(startup_nodes=nodes, decode_responses=True)

    # 也可以随便指定一个节点（不管主从都可以，它会自动定位）
    # cluster = RedisCluster(host="192.168.10.150", port=6381, decode_responses=True)
    cluster.set("user", "zhangkai")
    print(cluster.get("user"))
```

