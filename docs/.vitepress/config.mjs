import {defineConfig} from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
	title: "BetterWilson Notes",
	description: "Notes from BetterWilson",
	ignoreDeadLinks: true,
	themeConfig: {
		// https://vitepress.dev/reference/default-theme-config
		siteTitle: "BetterWilson Notes",

		logo: "logo.png",

		head: [
			['link', {rel: 'icon', href: '/favicon.ico'}],
		],

		nav: [
			{
				text: 'Python', items: [
					{text: 'python并发编程', link: '/python/ConcurrentProgramming/'},
					{text: 'python面向对象', link: '/python/ObjectOriented/'},
					{text: 'python补充', link: '/python/supplement/'},
				],
			},
			{text: 'Git', link: '/git/'},
			{text: 'Django', link: '/django/'},
			{text: 'DRF', link: '/drf/'},
			{text: 'Vue', link: '/vue/'},
			{text: 'Redis', link: '/redis/'},
			{text: 'Linux', link: '/linux/'},
			{text: 'hadoop', link: '/hadoop/'},
		],

		sidebar: {
			'/python/ConcurrentProgramming/': {
				text: 'python并发编程',
				items: [
					{text: '进程', link: '/python/ConcurrentProgramming/processing'},
					{text: '线程', link: '/python/ConcurrentProgramming/threading'},

				]
			},
			'/python/ObjectOriented/': {
				text: 'python面向对象',
				items: [
					{text: '成员，成员修饰符', link: '/python/ObjectOriented/member'},
					{text: '内置函数，异常，反射', link: '/python/ObjectOriented/function-error-reflection'},
					{
						text: 'self对象，封装，继承，多态',
						link: '/python/ObjectOriented/self-encapsulation-inherit-polymorphism'
					},

				]
			},
			'/python/supplement/': {
				text: 'python补充',
				items: [
					{text: '魔法函数', link: '/python/supplement/MagicFunction'},
					{text: 'bisect模块', link: '/python/supplement/bisect'},
					{text: 'isinstance和type区别', link: '/python/supplement/IsinstanceAndType'},
					{text: 'is和==的关系', link: '/python/supplement/IsAnd=='},
					{text: 'python中的常见内置类型分类', link: '/python/supplement/BuiltInTypes'},
					{text: 'type,object,class三者关系', link: '/python/supplement/TypeAndObjectAndClass'},
					{text: 'type元类', link: '/python/supplement/type'},
					{text: 'socket模块', link: '/python/supplement/socket'},
					{text: 'cookie,session缓存', link: '/python/supplement/cookie-session'},
					{text: 'JWT', link: '/python/supplement/jwt'},
				]
			},
			'/git': {
				text: 'GIT',
				items: [
					{text: 'Git常用命令清单', link: '/git/GitUseful'},
				]
			},
			'/drf': {
				text: 'DRF',
				items: [
					{text: 'drf返回值，事务，Logging日志', link: '/drf/response-transaction-logging'},
					{text: 'drf解析器，序列化器，分页', link: '/drf/parser-serializer-pagination'},
					{text: 'drf认证，权限，限流，版本', link: '/drf/auth-permission-throttle-version'},
					{text: 'drf视图，路由，筛选器', link: '/drf/views-url-filter'},
				]
			},
			'/django': {
				text: 'Django',
				items: [
					{text: 'Django-admin单例模式和懒加载', link: '/django/Django-admin'},
					{text: 'Django-admin组件', link: '/django/DjangoAdmin'},
					{text: 'Django-auth组件', link: '/django/Django-auth'},
					{text: 'Django-signal组件', link: '/django/Django-signal'},
					{text: 'Django模板查找顺序', link: '/django/DjangoModel'},
					{text: 'Django自定义命令', link: '/django/DjangoManage'},
					{text: 'model中的抽象类', link: '/django/modelClass'},
					{text: 'model中的Manager对象', link: '/django/modelManager'},
				]
			},
			'/redis': {
				text: 'Redis',
				items: [
					{text: '多台服务器无密码传输数据', link: '/redis/no-password'},
					{text: 'Django连接redis', link: '/redis/Django-redis'},
					{text: 'Python连接redis', link: '/redis/Python-redis'},
					{text: 'Python连接Redis集群', link: '/redis/PythonRedisCluster'},
					{text: 'Python连接Redis哨兵', link: '/redis/PythonRedisSentinel'},
					{text: 'redis持久化', link: '/redis/redisPersistence'},
					{text: 'Redis大key热key过期key', link: '/redis/RedisKey'},
					{text: 'Redis集群Cluster', link: '/redis/RedisCluster'},
					{text: 'Redis哨兵Sentinel', link: '/redis/RedisSentinel'},
					{text: 'Redis数据类型', link: '/redis/RedisDataType'},
					{text: 'Redis主从复制', link: '/redis/RedisMaster-slaveReplication'},
				]
			},
			'/linux': {
				text: 'linux',
				items: [
					{text: '项目准备', link: '/linux/ProjectPreparation'},
					{text: 'MySQL8.0安装(centos7)', link: '/linux/mysql8.0(centos7)'},
					{text: 'nginx1.24.0安装(centos7)', link: '/linux/nginx1.24.0(centos7)'},
					{text: 'Python3.11.0解释器安装(centos7)', link: '/linux/python3.11.0(centos7)'},
					{text: 'Redis5.0.7安装(centos7)', link: '/linux/redis5.0.7(centos7)'},
					{text: '报错解决', link: '/linux/ResolveError'},
					{text: '项目部署', link: '/linux/ProjectDeployment'},
				]
			},
			'/hadoop': {
				text: 'hadoop',
				items: [
					{text: 'Hadoop3.3.5(win11)安装', link: '/hadoop/hadoop3.3.5(win11)-install'},
					{text: 'Hadoop3.3.5(centos7)安装', link: '/hadoop/hadoop3.3.5(centos7)-install'},
					{text: 'Hadoop集群', link: '/hadoop/hadoop-cluster'},
				]
			},
			'/vue': {
				text: 'vue',
				items: [
					{text: 'vue知识点', link: '/vue/notes'},
					{text: 'vue-router', link: '/vue/router'},
					{text: 'vue-pinia', link: '/vue/pinia'},
					{text: 'vue-axios', link: '/vue/axios'},
					{text: 'vue-cookie', link: '/vue/cookie'},
				]
			},
		},

		socialLinks: [
			{icon: 'github', link: 'https://github.com/3127993395/Notes'},
		],

		footer: {
			message: '部分内容网络所学，如有侵权可联系QQ:3127993395',
			copyright: '苏ICP备2023051137号',
		}
	}
})
