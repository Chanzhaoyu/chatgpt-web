import requests
import os
import pymysql
import fileinput
import yaml


with open("config.yaml", "r") as file:
    config = yaml.safe_load(file)

secret = config["web"]["secret"]
basePort = config["web"]["basePort"]
proxy = config["web"]["reverseProxy"]

host = config["mysql"]["host"]
port = config["mysql"]["port"]
username = config["mysql"]["username"]
password = config["mysql"]["password"]

#停止所有的容器
os.system('bash stop.sh')
#删除当前目录下的所有文件夹
os.system('rm -rf */')


# 读取docker-compose模版文件
with open('template.yml', 'r') as f:
    content = f.read()


db = pymysql.connect(host=host,
                             port=port,
                             user=username,
                             password=password,
                             database='chatgpt')

cursor = db.cursor(cursor=pymysql.cursors.DictCursor)

# 查询数据库中的所有账号,登录获取token，生成docker-compose.yml文件
cursor.execute("select * from chatgpt")
datas = cursor.fetchall()
ports = []
for data in datas:
    username = data['username']
    password = data['password']
    loginUrl = proxy.replace('conversation', 'login')
    headers = {'Content-Type': 'application/json'}
    data = {'username': username, 'password': password}
    response = requests.post(loginUrl, headers=headers, json=data)
    if response.status_code == 200:
        data = response.json()
        token = data['accessToken']
        print(f'账号{username}登录成功')
        yml = content
        yml = yml.replace('$token', token)
        yml = yml.replace('$secret', secret)
        yml = yml.replace('$port', str(basePort))
        yml = yml.replace('$proxy', proxy)
        yml = yml.replace('$name', 'web-' + str(basePort))
        
        file_name = username + '-' +str(basePort) + '/docker-compose.yml'
        os.system(f'mkdir -p {username}-{basePort}')
        
        with open(file_name, 'w') as file:
            file.write(yml)
            print(f'账号{username}的docker-compose文件生成成功')
            #修改数据库中的port和status
            sql = f"update chatgpt set port={basePort}, status=1 where username='{username}'"
            cursor.execute(sql)
            db.commit()
            ports.append(basePort)
            basePort += 1
    else:
        print(f'账号{username}登录失败')
        errorMessage = response.json()['errorMessage']
        print(f'错误信息：{errorMessage}')



cursor.execute("select * from tokens")
token_data = cursor.fetchall()
for data in token_data:
    id = data['id']
    token = data['token']
    yml = content
    yml = yml.replace('$token', token)
    yml = yml.replace('$secret', secret)
    yml = yml.replace('$port', str(basePort))
    yml = yml.replace('$name', 'web-' + str(basePort))
    file_name = str(id) + '-' +str(basePort) + '/docker-compose.yml'
    os.system(f'mkdir -p {id}-{basePort}')
    
    with open(file_name, 'w') as file:
        file.write(yml)
        ports.append(basePort)
        basePort += 1
        


os.system('bash start.sh')

with fileinput.FileInput('/etc/nginx/conf.d/web.conf') as file:
    content = ''
    # 逐行读取文件
    for line in file:
        # 找到upstream模块，并删除所有的服务器节点配置
        if 'upstream mywebapp {' in line:
            content += line
            for line in file:
                if '}' in line:
                    # 将新的服务器节点配置写入到文件
                    content += '\tip_hash;\n'
                    for port in ports:
                        content += '\tserver localhost:' + str(port) + ';\n'
                    content += line
                    break
        else:
            content += line

# 将新的nginx配置写入到文件
with open('/etc/nginx/conf.d/web.conf', 'w') as new_file:
    new_file.write(content)
    print('nginx配置文件更新成功')

os.system('systemctl restart nginx')
print('nginx重启成功')

db.close()

