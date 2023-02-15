FROM node:lts

# copy resource
RUN mkdir /app
COPY ./ /app
WORKDIR /app

# build
RUN npm install pnpm -g
RUN pnpm bootstrap
WORKDIR /app/service
RUN pnpm install
WORKDIR /app

EXPOSE 1002
EXPOSE 3002

CMD ["/bin/bash","./start.sh"]

