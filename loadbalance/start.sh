#!/bin/bash

# Find all docker-compose.yml files in the current directory and its subdirectories
files=$(find . -type f -name "docker-compose.yml")

# Loop through each file and start its Docker Compose stack
for file in $files; do
    echo "启动docker容器: $file"
    docker-compose -f $file up -d
done
