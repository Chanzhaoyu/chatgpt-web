# 使用nginx实现负载均衡

​	基于一个前端，启动多个docker-compose后端，配置nginx使用ip hash方式实现accesstoken负载均衡，同一个ip地址的访问同一个后端实例，尽大可能避免出现同一时间只能一个对话的错误，也保证了具有上下文对话的功能。



工作原理：

1. 连接mysql数据库chatgpt，获得所有chatgpt账号和密码
2. 使用账号密码，通过反向代理接口登录账号获得token
3. 连接mysql数据库tokens，获取token(google登录的账号无法使用反向代理自动登录获得token)
4. 通过template.yml即后端docker-compose配置模版文件，通过config.yaml配置文件，生成多个docker-compose文件，启动这些容器
5. 修改nginx配置，动态写入后端节点信息.重启nginx



环境要求:

```she
apt install python3 python3-pip
pip3 install requests pymysql pyyaml
```



使用教程:

1. 编辑config.yaml，配置数据库信息，网站的密码，保证baseport后无应用占用这些端口，反向代理地址为go-chatgpt-api项目搭建的代理，可换成自己的代理，或者保持默认，使用我搭建的反向代理
2. 在mysql中创建chatgpt名字的数据库，执行项目中的chatgpt.sql，和tokens.sql建表
3. 将账号和密码填入到chatgpt表中，除去这些账号外，如果有额外的token可填写到tokens表中。
4. 可按照自己的需求去修改template.yml文件，例如增加翻墙代理配置信息.
5. 将web.conf放到/etc/nginx/con.d/目录下，按照自己的需求修改server部分
6. python3 main.py 运行man.py



一些建议:

* 通过以下库生成ssl证书，修改web.conf中域名和证书地址，使网站支持https访问

```shell
sudo apt-get install certbot  python3-certbot-nginx -y
sudo certbot --nginx -d example.com
```

* 使用root用户运行main.py
* 使用mysql数据库并且表中还有别的字段的用意是便于后续扩展

一些想法:

​	通过mysql表中的信息，启动别的程序来监听这些后端服务，例如做心跳检测，动态来修改nginx配置文件，增强可用性。例如token过期，程序自动检测，自动重新登录获取新的token，重新配置后端节点

