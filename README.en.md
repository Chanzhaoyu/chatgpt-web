# ChatGPT Web

<div style="font-size: 1.5rem;">
  <a href="./README.md">中文</a> |
  <a href="./README.en.md">English</a>
</div>
</br>

## Introduction
> **This project is forked from [Chanzhaoyu/chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web), some unique features have been added:**

[✓] Register & Login & Reset Password

[✓] Sync chat history 

[✓] Front-end page setting apikey

[✓] Custom Sensitive Words

[✓] Set unique prompts for each chat room

[✓] Users manager

[✓] Random Key

</br>

## Screenshots
> Disclaimer: This project is only released on GitHub, under the MIT License, free and for open-source learning purposes. There will be no account selling, paid services, discussion groups, or forums. Beware of fraud.

![cover3](./docs/login.jpg)
![cover](./docs/c1.png)
![cover2](./docs/c2.png)
![cover3](./docs/basesettings.jpg)
![cover3](./docs/prompt_en.jpg)
![cover3](./docs/user-manager.jpg)
![cover3](./docs/key-manager-en.jpg)

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

[✓] Login or Register

[✓] Set API key and other information on the front-end page.

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
- `OPENAI_API_MODEL`  `ChatGPTAPI` OR `ChatGPTUnofficialProxyAPI`
- `API_REVERSE_PROXY` optional, available when `OPENAI_ACCESS_TOKEN` is set [Reference](#introduction)
- `AUTH_SECRET_KEY` Access Password，optional
- `TIMEOUT_MS` timeout, in milliseconds, optional
- `SOCKS_PROXY_HOST` optional, effective with SOCKS_PROXY_PORT
- `SOCKS_PROXY_PORT` optional, effective with SOCKS_PROXY_HOST
- `SOCKS_PROXY_USERNAME` optional, effective with SOCKS_PROXY_HOST and SOCKS_PROXY_PORT
- `SOCKS_PROXY_PASSWORD` optional, effective with SOCKS_PROXY_HOST and SOCKS_PROXY_PORT
- `HTTPS_PROXY` optional, support http，https, socks5

![docker](./docs/docker.png)

#### Docker Build & Run

```bash
docker build -t chatgpt-web .

# foreground operation
docker run --name chatgpt-web --rm -it -p 127.0.0.1:3002:3002 --env OPENAI_API_KEY=your_api_key chatgpt-web

# background operation
docker run --name chatgpt-web -d -p 127.0.0.1:3002:3002 --env OPENAI_API_KEY=your_api_key chatgpt-web

# running address
http://localhost:3002/
```

#### Docker Compose

[Hub Address](https://hub.docker.com/repository/docker/kerwin1202/chatgpt-web/general)

```yml
version: '3'

services:
  app:
    image: kerwin1202/chatgpt-web # always use latest, pull the tag image again when updating
    container_name: chatgptweb
    restart: unless-stopped
    ports:
      - 3002:3002
    depends_on:
      - database
    environment:
      TZ: Asia/Shanghai
      # Title for site
      SITE_TITLE: ChatGpt Web
      # access salt，optional Allow login if not empty.
      AUTH_SECRET_KEY: xxx
      # mongodb's connection string
      MONGODB_URL: 'mongodb://chatgpt:xxxx@database:27017'
      # After register enabled, Salt for password encryption
      PASSWORD_MD5_SALT: xxx
      # After register enabled, super administrator
      ROOT_USER: me@example.com
      # Allow anyone register, Must be turned on, otherwise administrators cannot register, can be turned off later.
      REGISTER_ENABLED: true
      # More configurations, register an administrator after running and set it in the administrator page.
    links:
      - database

  database:
    image: mongo
    container_name: chatgptweb-database
    restart: unless-stopped
    ports:
      - '27017:27017'
    expose:
      - '27017'
    volumes:
      - mongodb:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: chatgpt
      MONGO_INITDB_ROOT_PASSWORD: xxxx
      MONGO_INITDB_DATABASE: chatgpt

volumes:
  mongodb: {}
```
The `OPENAI_API_BASE_URL` is optional and only used when setting the `OPENAI_API_KEY`.

### Deployment with Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/yytmgc)

> Refer to this issue  https://github.com/Kerwin1202/chatgpt-web/issues/266

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

Q: The content returned is incomplete?

A: There is a length limit for the content returned by the API each time. You can modify the `VITE_GLOB_OPEN_LONG_REPLY` field in the `.env` file under the root directory, set it to `true`, and rebuild the front-end to enable the long reply feature, which can return the full content. It should be noted that using this feature may bring more API usage fees.

## Contributing

Please read the [Contributing Guidelines](./CONTRIBUTING.en.md) before contributing.

Thanks to all the contributors!

<a href="https://github.com/Chanzhaoyu/chatgpt-web/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Chanzhaoyu/chatgpt-web" />
</a>

## Sponsorship

If you find this project helpful, please give me a star.

## License
MIT © [Kerwin1202](./license)
