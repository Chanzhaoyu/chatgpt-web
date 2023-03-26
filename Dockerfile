# build front-end
FROM node:lts-alpine AS frontend

ARG USE_CHINA_NPM_REGISTRY=0
RUN \
    if [ "$USE_CHINA_NPM_REGISTRY" = 1 ]; then \
    		echo "setting registry" && \
        npm config set registry https://registry.npm.taobao.org; \
    fi;
RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# build backend
FROM node:lts-alpine as backend

ARG USE_CHINA_NPM_REGISTRY=0
RUN \
    if [ "$USE_CHINA_NPM_REGISTRY" = 1 ]; then \
    		echo "setting registry" && \
        npm config set registry https://registry.npm.taobao.org; \
    fi;
RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install

COPY /service /app

RUN pnpm build

# service
FROM node:lts-alpine

ARG USE_CHINA_NPM_REGISTRY=0
RUN \
    if [ "$USE_CHINA_NPM_REGISTRY" = 1 ]; then \
    		echo "setting registry" && \
        npm config set registry https://registry.npm.taobao.org; \
    fi;
RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

COPY /service /app

COPY --from=frontend /app/dist /app/public

COPY --from=backend /app/build /app/build

EXPOSE 3002

CMD ["pnpm", "run", "prod"]
