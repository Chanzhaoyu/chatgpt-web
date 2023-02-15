
cd ./service
nohup pnpm start > service.log &
echo "Start service complete!"

cd ..
nohup pnpm dev > front.log &
echo "Start front complete!"

tail -f front.log