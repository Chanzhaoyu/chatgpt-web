# ChatGPT Web Bot

使用 express 和 vue3 搭建的 ChartGPT 演示网页

![cover](./docs/cover-2.png)

## 待实现路线
[x] 多会话储存和上下文逻辑

[x] 对代码等消息类型的格式化美化处理

[x] 用户模块（注册、登录、个人中心）

[x] 界面多语言

[x] 界面主题

[x] More...

## 前置要求

### Node

`node` 版本需要 >= 18，使用 [nvm](https://github.com/nvm-sh/nvm) 可管理本地多个 `node` 版本

```shell
node -v
```

### PNPM
如果你没有安装过 `pnpm`
```shell
npm install pnpm -g
```

### OpenAI API Key
获取 [OpenAI API key](https://platform.openai.com/overview) 并填写到本地环境变量
```
# service/.env 文件

OPENAI_API_KEY='Your key'
```

## 安装依赖

> 为了简便 `后端开发人员` 的了解负担，所以并没有采用前端 `workspace` 模式，而是分文件夹存放。如果只需要前端页面做二次开发，删除 `service` 文件夹即可。

### 后端服务

进入文件夹 `/service` 运行以下命令

```shell
pnpm install
```

### 网页
根目录下运行以下命令
```shell
pnpm bootstrap
```


## 运行
### 后端服务

进入文件夹 `/service` 运行以下命令

```shell
pnpm start
```

### 网页
根目录下运行以下命令
```shell
pnpm dev
```

## 打包
### 后端服务
> 如果你不需要本项目的 `node` 接口，可以省略如下操作

复制 `service` 文件夹到你有 `node` 服务环境的服务器上。（搜索关键字：`express部署`）

操作上述 `安装` 和 `运行` 服务。

### 网页
根目录下运行以下命令，然后将 `dist` 文件夹复制到你的托管服务器上

```shell
pnpm build
```

### 常见问题
Q: 为什么 `Git` 提交总是报错？

A: 因为有提交信息验证，请遵循 [Commit 指南](./CONTRIBUTING.md)

Q: 如果只使用前端页面，在哪里改请求接口？

A: 根目录下 `.env` 文件中的 `VITE_GLOB_API_URL` 字段。

Q: 文件保存时全部爆红?

A: `vscode` 请安装项目推荐插件，或手动安装 `Eslint` 插件。

## License
MIT © [ChenZhaoYu](./license)
