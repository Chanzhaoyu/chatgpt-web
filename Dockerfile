# build front-end
FROM node:lts AS builder

COPY ./ /app
WORKDIR /app

RUN npm install pnpm -g && pnpm install && pnpm run build

# service
FROM node:lts

COPY /service /app
COPY --from=builder /app/dist /app/public

WORKDIR /app
RUN npm install pnpm -g && pnpm install
RUN pnpm run start

EXPOSE 3002