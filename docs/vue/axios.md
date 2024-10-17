# axios组件

## 安装与配置

`npm install axios`

新建plugins/axios.js

```js
import axios from "axios";

let config = {
	baseURL: "https://api.betterwilson.com",
	timeout: 20,
}
const _axios = axios.create(config)

// 请求拦截器
_axios.interceptors.request.use(function (config) {
	console.log("请求前", config)
	// 1.去pinia中读取当前用户的token
	// 2.发送请求时携带token
	if(config.params) {		//原本请求有参数，在后面添加
		config.params['token'] = "xxxxxxxx"
	} else {	//原本请求无参数，多一个params参数
		config.params = {token: "xxxxxxxx"}
	}
	return config;
})

export default _axios;
```

## 简单使用

```js
import _axios from "../../plugins/axios.js";

_axios.get("/demo").then((res) => {		// https://api.betterwilson.com/demo(URL拼接)
    console.log(res.data)
  })
```

