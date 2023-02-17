# ChatGPT Web

使用 express 和 vue3 搭建的 ChartGPT 演示网页

![PC](./docs/cover.png)

> 提示：目前 `OpenAI` 开放的模型最高只有 `GPT-3`，和现在网页所使用的 `GPT-3.5` 或 `GPT-4` 有很大差距，需要等官方开放最新的模型接口。

## 待实现路线
[✓] 多会话储存和上下文逻辑

[✓] 对代码等消息类型的格式化美化处理

[✗] 用户模块（注册、登录、个人中心）

[✗] 界面多语言

[✗] 界面主题

[✗] More...

## 前置要求

### Node

`node` 需要 `^16 || ^18` 版本（或者 `node >= 14` 需要安装 [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)），使用 [nvm](https://github.com/nvm-sh/nvm) 可管理本地多个 `node` 版本

```shell
node -v
```

### PNPM
如果你没有安装过 `pnpm`
```shell
npm install pnpm -g
```

### OpenAI API Key
注册并获取 [OpenAI API key](https://platform.openai.com/overview) 并填写到本地环境变量
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

```shell
# 安装
pnpm install

# 打包
pnpm build

# 运行
pnpm prod
```

PS: 不进行打包，直接在服务器上运行 `pnpm start` 也可

## Docker build & run

[参考信息](https://github.com/Chanzhaoyu/chatgpt-web/pull/42)

```bash
docker build -t chatgpt-web .
```

## Docker compose

[Hub 地址](https://hub.docker.com/repository/docker/chenzhaoyu94/chatgpt-web/general)

```yml
version: '3'

services:
  app:
    image: chenzhaoyu94/chatgpt-web:main
    ports:
      - 3002:3002
    environment:
      OPENAI_API_KEY: xxxxxx
```


### 网页

根目录下运行以下命令，然后将 `dist` 文件夹复制到你的托管服务器上

[参考信息](https://cn.vitejs.dev/guide/static-deploy.html#building-the-app)

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

## 参与贡献

贡献之前请先阅读 [贡献指南](./CONTRIBUTING.md)

感谢所有做过贡献的人!

<a href="https://github.com/Chanzhaoyu/chatgpt-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Chanzhaoyu/chatgpt-web" />
</a>

## License
MIT © [ChenZhaoYu](./license)
