# ChatGPT Web

<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>
</br>

> Disclaimer: This project is only released on GitHub, under the MIT License, free and for open-source learning purposes. There will be no account selling, paid services, discussion groups, or forums. Beware of fraud.

![cover](./docs/c1.png)
![cover2](./docs/c2.png)

- [ChatGPT Web](#chatgpt-web)
	- [Introduction](#introduction)
	- [Roadmap](#roadmap)
	- [Prerequisites](#prerequisites)
		- [Node](#node)
		- [PNPM](#pnpm)
		- [Fill in the Keys](#fill-in-the-keys)
	- [Install Dependencies](#install-dependencies)
		- [Backend](#backend)
		- [Frontend](#frontend)
	- [Run in Test Environment](#run-in-test-environment)
		- [Backend Service](#backend-service)
		- [Frontend Webpage](#frontend-webpage)
	- [Packaging](#packaging)
		- [Using Docker](#using-docker)
			- [Docker Parameter Example](#docker-parameter-example)
			- [Docker Build \& Run](#docker-build--run)
			- [Docker Compose](#docker-compose)
		- [Deployment with Railway](#deployment-with-railway)
			- [Railway Environment Variables](#railway-environment-variables)
		- [Manual packaging](#manual-packaging)
			- [Backend service](#backend-service-1)
			- [Frontend webpage](#frontend-webpage-1)
	- [Frequently Asked Questions](#frequently-asked-questions)
	- [Contributing](#contributing)
	- [Sponsorship](#sponsorship)
	- [License](#license)

## Introduction

Supports dual models, provides two unofficial `ChatGPT API` methods:

| Method                                        | Free?  | Reliability | Quality |
| --------------------------------------------- | ------ | ----------- | ------- |
| `ChatGPTAPI(gpt-3.5-turbo-0301)`                           | No     | Reliable    | Relatively clumsy |
| `ChatGPTUnofficialProxyAPI(Web accessToken)` | Yes    | Relatively unreliable | Smart |

Comparison:
1. `ChatGPTAPI` uses `gpt-3.5-turbo-0301` to simulate `ChatGPT` through the official `OpenAI` completion `API` (the most reliable method, but it is not free and does not use models specifically tuned for chat).
2. `ChatGPTUnofficialProxyAPI` accesses `ChatGPT`'s backend `API` via an unofficial proxy server to bypass `Cloudflare` (uses the real `ChatGPT`, is very lightweight, but depends on third-party servers and has rate limits).

[Details](https://github.com/Chanzhaoyu/chatgpt-web/issues/138)

Switching Methods:
1. Go to the `service/.env.example` file and copy the contents to the `service/.env` file.
2. For `OpenAI API Key`, fill in the `OPENAI_API_KEY` field [(Get apiKey)](https://platform.openai.com/overview).
3. For `Web API`, fill in the `OPENAI_ACCESS_TOKEN` field [(Get accessToken)](https://chat.openai.com/api/auth/session).
4. When both are present, `OpenAI API Key` takes precedence.

Reverse Proxy:

Available when using `ChatGPTUnofficialProxyAPI`.[Details](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy)

```shell
# service/.env
API_REVERSE_PROXY=
```

Environment Variables:

For all parameter variables, check [here](#docker-parameter-example) or see:

```
/service/.env
```

## Roadmap
[✓] Dual models

[✓] Multiple session storage and context logic

[✓] Formatting and beautifying code-like message types

[✓] Access rights control

[✓] Data import and export

[✓] Save message to local image

[✓] Multilingual interface

[✓] Interface themes

[✗] More...

## Prerequisites

### Node

`node` requires version `^16 || ^18` (`node >= 14` requires installation of [fetch polyfill](https://github.com/developit/unfetch#usage-as-a-polyfill)), and multiple local `node` versions can be managed using [nvm](https://github.com/nvm-sh/nvm).

```shell
node -v
```

### PNPM
If you have not installed `pnpm` before:
```shell
npm install pnpm -g
```

### Fill in the Keys

Get `Openai Api Key` or `accessToken` and fill in the local environment variables [jump](#introduction)

```
# service/.env file

# OpenAI API Key - https://platform.openai.com/overview
OPENAI_API_KEY=

# change this to an `accessToken` extracted from the ChatGPT site's `https://chat.openai.com/api/auth/session` response
OPENAI_ACCESS_TOKEN=
```

## Install Dependencies

> To make it easier for `backend developers` to understand, we did not use the front-end `workspace` mode, but stored it in different folders. If you only need to do secondary development of the front-end page, delete the `service` folder.

### Backend

Enter the `/service` folder and run the following command

```shell
pnpm install
```

### Frontend
Run the following command in the root directory
```shell
pnpm bootstrap
```

## Run in Test Environment
### Backend Service

Enter the `/service` folder and run the following command

```shell
pnpm start
```

### Frontend Webpage
Run the following command in the root directory
```shell
pnpm dev
```

## Packaging

### Using Docker

#### Docker Parameter Example

- `OPENAI_API_KEY` one of two
- `OPENAI_ACCESS_TOKEN` one of two, `OPENAI_API_KEY` takes precedence when both are present
- `OPENAI_API_BASE_URL` optional, available when `OPENAI_API_KEY` is set
- `OPENAI_API_MODEL` optional, available when `OPENAI_API_KEY` is set
- `API_REVERSE_PROXY` optional, available when `OPENAI_ACCESS_TOKEN` is set [Reference](#introduction)
- `AUTH_SECRET_KEY` Access Password，optional
- `TIMEOUT_MS` timeout, in milliseconds, optional
- `SOCKS_PROXY_HOST` optional, effective with SOCKS_PROXY_PORT
- `SOCKS_PROXY_PORT` optional, effective with SOCKS_PROXY_HOST
- `HTTPS_PROXY` optional, support http，https, socks5
- `ALL_PROXY` optional, support http，https, socks5

![docker](./docs/docker.png)

#### Docker Build & Run

```bash
docker build -t chatgpt-web .

# foreground operation
docker run --name chatgpt-web --rm -it -p 3002:3002 --env OPENAI_API_KEY=your_api_key chatgpt-web

# background operation
docker run --name chatgpt-web -d -p 3002:3002 --env OPENAI_API_KEY=your_api_key chatgpt-web

# running address
http://localhost:3002/
```

#### Docker Compose

[Hub Address](https://hub.docker.com/repository/docker/chenzhaoyu94/chatgpt-web/general)

```yml
version: '3'

services:
  app:
    image: chenzhaoyu94/chatgpt-web # always use latest, pull the tag image again when updating
    ports:
      - 3002:3002
    environment:
      # one of two
      OPENAI_API_KEY: xxxxxx
      # one of two
      OPENAI_ACCESS_TOKEN: xxxxxx
      # api interface url, optional, available when OPENAI_API_KEY is set
      OPENAI_API_BASE_URL: xxxx
      # api model, optional, available when OPENAI_API_KEY is set
      OPENAI_API_MODEL: xxxx
      # reverse proxy, optional
      API_REVERSE_PROXY: xxx
      # access password，optional
      AUTH_SECRET_KEY: xxx
      # timeout, in milliseconds, optional
      TIMEOUT_MS: 60000
      # socks proxy, optional, effective with SOCKS_PROXY_PORT
      SOCKS_PROXY_HOST: xxxx
      # socks proxy port, optional, effective with SOCKS_PROXY_HOST
      SOCKS_PROXY_PORT: xxxx
      # HTTPS Proxy，optional, support http, https, socks5
      HTTPS_PROXY: http://xxx:7890
```
The `OPENAI_API_BASE_URL` is optional and only used when setting the `OPENAI_API_KEY`.
The `OPENAI_API_MODEL` is optional and only used when setting the `OPENAI_API_KEY`.

### Deployment with Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/yytmgc)

#### Railway Environment Variables

| Environment Variable | Required | Description                                                                                       |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `PORT`               | Required | Default: `3002`                                                                                   |
| `AUTH_SECRET_KEY`         | Optional | access password                                                                          |
| `TIMEOUT_MS`         | Optional | Timeout in milliseconds                                                                      |
| `OPENAI_API_KEY`     | Optional | Required for `OpenAI API`. `apiKey` can be obtained from [here](https://platform.openai.com/overview). |
| `OPENAI_ACCESS_TOKEN`| Optional | Required for `Web API`. `accessToken` can be obtained from [here](https://chat.openai.com/api/auth/session).|
| `OPENAI_API_BASE_URL`  | Optional, only for `OpenAI API` |  API endpoint.                                                        |
| `OPENAI_API_MODEL`  | Optional, only for `OpenAI API` |  API model.                                                        |
| `API_REVERSE_PROXY`  | Optional, only for `Web API` | Reverse proxy address for `Web API`. [Details](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy) |
| `SOCKS_PROXY_HOST`   | Optional, effective with `SOCKS_PROXY_PORT` | Socks proxy.                      |
| `SOCKS_PROXY_PORT`   | Optional, effective with `SOCKS_PROXY_HOST` | Socks proxy port.                 |
| `HTTPS_PROXY`   | Optional | HTTPS Proxy.                 |
| `ALL_PROXY`   | Optional | ALL Proxy.                 |

> Note: Changing environment variables in Railway will cause re-deployment.

### Manual packaging

#### Backend service

> If you don't need the `node` interface of this project, you can skip the following steps.

Copy the `service` folder to a server that has a `node` service environment.

```shell
# Install
pnpm install

# Build
pnpm build

# Run
pnpm prod
```

PS: You can also run `pnpm start` directly on the server without packaging.

#### Frontend webpage

1. Refer to the root directory `.env.example` file content to create `.env` file, modify `VITE_GLOB_API_URL` in `.env` at the root directory to your actual backend interface address.
2. Run the following command in the root directory and then copy the files in the `dist` folder to the root directory of your website service.

[Reference information](https://cn.vitejs.dev/guide/static-deploy.html#building-the-app)

```shell
pnpm build
```

## Frequently Asked Questions

Q: Why does Git always report an error when committing?

A: Because there is submission information verification, please follow the [Commit Guidelines](./CONTRIBUTING.en.md).

Q: Where to change the request interface if only the frontend page is used?

A: The `VITE_GLOB_API_URL` field in the `.env` file at the root directory.

Q: All red when saving the file?

A: For `vscode`, please install the recommended plug-in of the project or manually install the `Eslint` plug-in.

Q: Why doesn't the frontend have a typewriter effect?

A: One possible reason is that after Nginx reverse proxying, buffering is turned on, and Nginx will try to buffer a certain amount of data from the backend before sending it to the browser. Please try adding `proxy_buffering off;` after the reverse proxy parameter and then reloading Nginx. Other web server configurations are similar.

## Contributing

Please read the [Contributing Guidelines](./CONTRIBUTING.en.md) before contributing.

Thanks to all the contributors!

<a href="https://github.com/Chanzhaoyu/chatgpt-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Chanzhaoyu/chatgpt-web" />
</a>

## Sponsorship

If you find this project helpful and circumstances permit, you can give me a little support. Thank you very much for your support~

<div style="display: flex; gap: 20px;">
	<div style="text-align: center">
		<img style="max-width: 100%" src="./docs/wechat.png" alt="WeChat" />
		<p>WeChat Pay</p>
	</div>
	<div style="text-align: center">
		<img style="max-width: 100%" src="./docs/alipay.png" alt="Alipay" />
		<p>Alipay</p>
	</div>
</div>

## License
MIT © [ChenZhaoYu](./license)
