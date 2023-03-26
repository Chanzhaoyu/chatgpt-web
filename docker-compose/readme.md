### docker-compose 部署教程
- 将打包好的前端文件放到 `nginx/html` 目录下
- ```shell
  # 运行脚本
  chmod +x install_docker.sh && ./install_docker.sh
  ```
- ```shell
  # 启动
  docker-compose up -d
  ```
- ```shell
  # 查看运行状态
  docker ps
  ```
- ```shell
  # 结束运行
  docker-compose down
  ```
