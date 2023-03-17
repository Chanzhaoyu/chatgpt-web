# syntax = docker/dockerfile-upstream:master-labs
ARG GO_VERSION="1.20"
# build front-end
FROM node:lts-alpine AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY . /app

RUN pnpm run build

# Build goservice binary
FROM --platform=$BUILDPLATFORM golang:${GO_VERSION}-alpine AS goservice-builder
ARG TARGETPLATFORM
ARG TARGETOS
ARG TARGETARCH

ENV GOOS=${TARGETOS}
ENV GOARCH=${TARGETARCH}

WORKDIR /build

# Cache dependencies
COPY goservice/go.mod goservice/go.sum ./
RUN --mount=type=cache,target=/root/.cache/go-build go mod download

COPY goservice/ .
COPY --link --from=frontend /app/dist ./html
ADD --link goservice/html/html.go ./html/html.go
RUN --mount=type=cache,target=/root/.cache/go-build CGO_ENABLED=0 go build -ldflags "-s -w" -trimpath

FROM gcr.io/distroless/static-debian11 as goservice
COPY --from=goservice-builder /build/goservice /
CMD ["/goservice"]

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

EXPOSE 3002

CMD ["pnpm", "run", "prod"]
