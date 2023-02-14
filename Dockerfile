# 基于 Node.js 的 lts镜像
FROM node:lts as builder

# 定义环境变量
ENV BUILD_DIR=/data/node/build
ENV NODE_PORT=3002
ENV WORK_DIR=/data/node/app

RUN npm install pnpm -g --registry=https://registry.npmmirror.com

# 设置工作目录
WORKDIR $BUILD_DIR

# 复制文件到工作目录
COPY  package*.json $BUILD_DIR

RUN pnpm install --registry=https://registry.npmmirror.com

COPY . $BUILD_DIR

ENV NODE_ENV=production
RUN echo ls

WORKDIR $WORK_DIR
COPY  ./service $WORK_DIR
RUN rm -rf $BUILD_DIR

RUN pnpm install

# # 暴露主机端口
EXPOSE $NODE_PORT

# 应用程序启动命令
CMD [ "npm","run", "start" ]