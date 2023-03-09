# build front-end
FROM node:lts-alpine AS builder

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# service
FROM node:lts-alpine

RUN npm install pnpm -g

WORKDIR /app

COPY /service/package.json /app

COPY /service/pnpm-lock.yaml /app

RUN pnpm install --production

COPY /service /app

RUN pnpm build

COPY --from=builder /app/dist /app/public

EXPOSE 3002

CMD ["pnpm", "run", "prod"]
