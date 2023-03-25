# build front-end
FROM node:lts-alpine AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# build backend
FROM node:lts-alpine as backend

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install

COPY /service /app

RUN pnpm build

# service
FROM node:lts-alpine

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install --production && rm -rf /root/.npm /root/.pnpm-store /usr/local/share/.cache /tmp/*

COPY /service /app

COPY --from=frontend /app/dist /app/public

COPY --from=backend /app/build /app/build



# env
# ENV OPENAI_API_KEY=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
ENV AUTH_SECRET_KEY=gangzigang
ENV SOCKS_PROXY_HOST=192.168.31.16
ENV SOCKS_PROXY_PORT=7890
ENV HTTPS_PROXY=192.168.31.16:7890

EXPOSE 3002

CMD ["pnpm", "run", "prod"]
