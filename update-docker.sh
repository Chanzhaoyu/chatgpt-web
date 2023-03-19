echo "build docker start"
docker build -t chatgpt-web .
echo "build docker success"
echo "update container"
docker compose up -d
echo "update container done ✔"
