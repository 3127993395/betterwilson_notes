# vue-cookie组件

官网：[GitHub - KanHarI/vue3-cookies: A simple Vue.js plugin for handling browser cookies](https://github.com/KanHarI/vue3-cookies)

## 安装与配置

`npm install vue3-cookies`

安装完成之后需要在main.js文件中进行注册：

```js
import {createApp} from 'vue'
import {createPinia} from 'pinia'


import App from './App.vue'
import router from './router'
import VueCookies from "vue3-cookies";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies)

app.mount('#app')
```

## 简单操作

```js
import {useCookies} from "vue3-cookies";
const {cookies} = useCookies()

cookies.set("key", "value", 30)	//30s是有效期
cookies.get("key")
cookies.remove("key")
```

## cookie重写用户登录逻辑

store/counter.js

```js
import {ref, computed} from 'vue'
import {defineStore} from 'pinia'
import {useCookies} from "vue3-cookies";

const {cookies} = useCookies()

export const useInfoStore = defineStore('useInfoStore', () => {
	const userDict = ref(cookies.get("info"))

	const userID = computed(() => userDict.value ? userDict.value.id : null)
	const userName = computed(() => userDict.value ? userDict.value.name : null)
	const userToken = computed(() => userDict.value ? userDict.value.token : null)

	function doLogin(info) {
		// info={id:1, name:"wilson", token:"xxx"}
		// 登录成功后，用户信息写到cookie中
		cookies.set("info", JSON.stringify(info), 60 * 60 * 24 * 7)	// 7天的有效期
		userDict.value = info
	}

	function doLogout() {
		cookies.remove("info")
		userDict.value = null
	}

	return {userString, userID, userName, userToken, doLogin, doLogout}
})
```



