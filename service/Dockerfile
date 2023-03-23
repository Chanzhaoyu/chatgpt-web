# service
FROM node:lts-alpine

# 在容器中创建一个目录
RUN mkdir -p /usr/src/app

# 将当前目录下的所有文件复制到容器中的 /usr/src/app 目录下
COPY . /usr/src/app

# COPY /service /app
# COPY --from=builder /app/dist /app/public

# 指定接下来的工作路径为 /usr/src/app
WORKDIR /usr/src/app

RUN npm install pnpm -g && pnpm install

EXPOSE 3002

CMD ["pnpm", "run", "start"]