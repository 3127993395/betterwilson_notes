# socket模块

我们先来看一个socket编程流程图

![image-20240518145239078](assets\image-20240518145239078.png)

这里的server端就是部署到服务器上的服务端，client端就是对应我们的PC软件浏览器，不过浏览器内部已经帮我们封装了socket

## 简单的socket通信

- socket_server.py

  ```python
  import socket
  
  server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server.bind(('0.0.0.0', 8000))
  server.listen()
  sock, addr = server.accept()
  
  # 获取从客户端发送的数据
  # 一次获取1024个字节的数据
  data = sock.recv(1024)
  print(data.decode('utf-8'))
  sock.send(f"hello {data.decode('utf-8')}".encode('utf-8'))
  sock.close()
  ```

- socket_client.py

  ```python
  import socket
  
  client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  client.connect((('127.0.0.1', 8000)))
  client.send("Wilson".encode('utf-8'))
  data = client.recv(1024)
  print(data.decode('utf-8'))
  client.close()
  ```

首先启动server端（如果先启动client端会因为无法连接server端而导致启动失败），server端会挂起等待client端发送网络请求，server端接收到网络请求后也会向client端发送数据

![image-20240518152412799](assets\image-20240518152412799.png)

**注意**：数据传输时是二进制，我们打印时需要转换成utf-8

## socket实现简单实时聊天和多用户连接

关于实时聊天，我们可以采用While循环

关于多用户连接，我们可以使用多线程技术

- socket_server.py

  ```python
  import socket
  import threading
  
  server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  server.bind(('0.0.0.0', 8000))
  server.listen()
  
  
  def handle_sock(sock, addr):
      data = sock.recv(1024)
      print(data.decode('utf-8'))
      re_data = input()
      sock.send(re_data.encode('utf-8'))
  
  
  while True:
      sock, addr = server.accept()
  
      # 用线程去处理新接受的用户连接
      client_thread = threading.Thread(target=handle_sock, args=(sock, addr))
      client_thread.start()
  
      data = sock.recv(1024)
      print(data.decode('utf-8'))
      re_data = input()
      sock.send(re_data.encode('utf-8'))
  ```

- server_client.py

  ```python
  import socket
  
  client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  client.connect((('127.0.0.1', 8000)))
  
  while True:
      re_data = input()
      client.send(re_data.encode('utf-8'))
      data = client.recv(1024)
      print(data.decode('utf-8'))
  ```

![image-20240518154037645](assets\image-20240518154037645.png)

## socket模拟HTTP请求

```python
import socket
from urllib.parse import urlparse


def get_url(url):
    # 通过socket请求html
    url = urlparse(url=url)
    host = url.netloc
    path = url.path
    if path == "":
        path = "/"

    # 建立socket连接
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, 80))
    client.send(f"GET {path} HTTP/1.1\r\nHost:{host}\r\nConnection:close\r\n\r\n".encode('utf-8'))
    data = b""
    while True:
        d = client.recv(1024)
        if d:
            data += d
        else:
            break
    data = data.decode('utf-8')
    html_data = data.split("\r\n\r\n")[1]
    print(html_data)
    client.close()


if __name__ == "__main__":
    get_url("http://www.baidu.com")
```

这个案例中通过scoket模拟http请求获得百度的前端页面数据

![image-20240518161958596](assets\image-20240518161958596.png)









## 报错解决：

### OSError: [WinError 10038] 在一个非套接字上尝试了一个操作。

每次循环的时候把socket的客户端给关闭了，所以无法正常连接导致报错

![image-20240518154423928](assets\image-20240518154423928.png)

简单粗暴的解决办法就是client端和server端连接通道不人为关闭，就是删除最后的close代码块













