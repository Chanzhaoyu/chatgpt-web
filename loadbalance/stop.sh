#!/bin/bash

# 获取所有容器名称
CONTAINERS=$(docker ps -a --format "{{.Names}}")

# 遍历容器，停止并删除名称以 "web-" 开头的容器
for container in $CONTAINERS; do
  if [[ $container == web-* ]]; then
    docker stop $container
    docker rm $container
    echo "容器已停止并删除：$container"
  fi
done