#!/bin/bash

# 更新包列表并安装 Docker
echo "Installing Docker..."
if sudo apt-get update &> /dev/null && sudo apt-get install -y docker.io &> /dev/null; then
    echo "Docker installed successfully!"
else
    echo "Error installing Docker."
    exit 1
fi

# 启动 Docker 并设置开机自启
echo "Starting Docker service..."
if sudo systemctl start docker &> /dev/null && sudo systemctl enable docker &> /dev/null; then
    echo "Docker service started successfully!"
else
    echo "Error starting Docker service."
    exit 1
fi

# 安装 Docker Compose
echo "Installing Docker Compose..."
if sudo apt-get install -y docker-compose &> /dev/null; then
    echo "Docker Compose installed successfully!"
else
    echo "Error installing Docker Compose."
    exit 1
fi

echo "All done!"
