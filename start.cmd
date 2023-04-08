cd ./service
start npm start > service.log &
echo "Start service complete!"


cd ..
echo "" > front.log
start npm dev > front.log &
echo "Start front complete!"
