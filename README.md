# ChatGPT Web Bot

中文 | [English](./README.en.md)

使用 express 和 vue3 搭建的 ChartGPT 演示网页

![cover](./docs/cover.png)

## 使用
> 确保 `node >= 18`

如果你没有安装过 `pnpm`
```shell
npm install pnpm -g
```

安装依赖
```shell
pnpm install
```

获取 [OpenAI API key](https://platform.openai.com/overview) 到本地环境变量

```
# .env
OPENAI_API_KEY="Your Key"
```

运行服务
```shell
pnpm run service
```

运行网页
```shell
pnpm run dev
```

## License
MIT © [ChenZhaoYu](./license)
