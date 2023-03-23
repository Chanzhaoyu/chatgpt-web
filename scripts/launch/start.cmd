@echo off
setlocal
start cmd /c "pnpm -F chatgpt-web-service start%1"
start cmd /c "pnpm dev%1"
exit
