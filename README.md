# ChatGPT Web

## 系统截图

客户端
<img width="1438" alt="image" src="https://user-images.githubusercontent.com/13517412/230752830-06bcb883-1a27-48de-8162-b42f2abb2d1e.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752840-efd890fb-0457-4c2a-a8e3-cde93948f99e.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752867-84c6e619-a151-4f7d-848a-120ccc64d5cf.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752872-b1670e7e-cce9-4744-becb-f0d657a58598.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752885-776f357c-2c4a-4e1e-aaf5-f02ca6551be2.png">

<img width="1277" alt="image" src="https://user-images.githubusercontent.com/13517412/232736158-45458700-a61d-4c86-8f81-e7a842ebe073.png">

管理端
<img width="1439" alt="登录" src="https://user-images.githubusercontent.com/13517412/230766669-9eb38029-e0f3-4ba1-985d-abf0757505b4.png">
<img width="1277" alt="修改密码" src="https://user-images.githubusercontent.com/13517412/232736883-43cd549e-1d18-4f48-a5f7-af8c65c5718b.png">
<img width="1279" alt="image" src="https://user-images.githubusercontent.com/13517412/232737651-471e0116-bc04-47ad-ac20-1dd0c14e46f1.png">

<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752907-586329a6-e395-48ef-9bdf-cce8b8610cdf.png">

<img width="1438" alt="image" src="https://user-images.githubusercontent.com/13517412/230752920-87d24962-9452-496a-ad6f-7d67252a49e8.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752936-8460e759-6ace-4a89-a146-8d6c5380a536.png">
<img width="1278" alt="image" src="https://user-images.githubusercontent.com/13517412/232738306-2239a5de-bd70-4c39-84e8-a9825933ef97.png">

<img width="1437" alt="image" src="https://user-images.githubusercontent.com/13517412/230752949-4a92334d-cc69-4d09-b587-a44e92845c57.png">
<img width="1438" alt="image" src="https://user-images.githubusercontent.com/13517412/230752958-c2a67800-84bd-4c45-b98e-a629042ee5c7.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752964-b57da9e1-1a42-4967-ae6c-1da1c64c547e.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752973-2dac4562-51af-4fe5-9138-0331b228cfe6.png">
<img width="1439" alt="image" src="https://user-images.githubusercontent.com/13517412/230752984-67ff808f-c87e-44f0-9957-bfcb0b6c1802.png">

<img width="1279" alt="image" src="https://user-images.githubusercontent.com/13517412/232735670-2d277962-1312-4900-b6f1-248531835a9e.png">

<img width="1436" alt="image" src="https://user-images.githubusercontent.com/13517412/230753011-125fe575-8947-4d1e-8496-b3afb4f2db7e.png">

为了方便大家沟通交流，同步消息，建了QQ群，目前已有 `1135` 人，群号 `145225165`，申请入群后请及时回复验证码，否则360秒后会被群机器人自动移除群。
![image](https://user-images.githubusercontent.com/13517412/230753075-0d815446-3e24-4a09-bee4-e3fa59dec76e.png)
<img width="679" alt="image" src="https://user-images.githubusercontent.com/13517412/230753144-0c5ea0ee-55a6-4d5d-8282-53fcbc9355c7.png">

## 功能列表
[✓] 支持最新模型 `GPT4.0`

[✓] 登录注册，管理后台可以设置首次登录赠送免费提问次数

[✓] 支持多 `key` 轮询池

[✓] 支持上下文对话

[✓] 支持百度敏感词过滤

[✓] 支持自定义回复内容，比如提问当前使用 `GPT` 版本，可以自定义回复内容为 4.0 版本

[✓] 提示词prompt商店管理

[✓] 卡密套餐管理、卡密生成和核销

[✗] 实现联网搜索

[✗] 解决输入的文本超出模型最大tokens

[✗] 支持分享获取免费次数

[✗] 支持分销

[✗] 支持代理商

## 手动部署
> 服务器无需安装任何环境，只需要安装 nginx 来配置域名，nginx 修改配置后需要重启才能生效

服务器放行 `3000` 端口，将数据库文件 `db.sql` 导入到 `mysql`，修改 `service` 目录下 `.env` 里数据库配置信息、邮箱配置、百度文本审核配置信息，其他配置信息无需改动

根据自己的系统选择对应的服务端，下面以 `linux` 环境为例，
进入 `service` 目录，运行 `nohup ./amd64.linux>gpt.log &` 启动后端服务
运行 `curl http://127.0.0.1:3000`，如果出现
```shell
{"Hello":"Gochat 后端服务启动成功"}
```
说明后端服务启动成功

将用户端绑定到 `chatgpt` 目录，如 `chat.baidu.com`，`nginx` 主要配置如下：
```shell
listen 80;
server_name chat.baidu.com;
index index.php index.html index.htm default.php default.htm default.html;

location / {
    root /www/wwwroot/chatgpt/fontend/; // 改成自己客户端项目实际路径
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}

location /api/{
    proxy_pass http://127.0.0.1:3000;
}
```
访问 `chat.baidu.com` 即可访问前台

将管理端域名绑定到 `admin` 目录，如 `admin.baidu.com`，`nginx` 主要配置如下：
```shell
listen 80;
server_name admin.baidu.com;
index index.php index.html index.htm default.php default.htm default.html;

location / {
    root /www/wwwroot/chatgpt/admin/; // 改成自己管理端项目实际路径
    index index.html index.htm;
    try_files $uri $uri/ /index.html;
}

location /backend/{
    proxy_pass http://127.0.0.1:3000/backend/;
}
```
访问 `chat.baidu.com` 即可访问管理后台，默认账号 `245629560@qq.com`, 密码 `123456`

## 宝塔部署
- 上传源码

  点击宝塔左侧文件菜单，将源码上传到 `www/wwwroot` 目录，如下图
  ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/001.png)
- 导入数据库
  
  点击宝塔左侧数据库菜单，点击添加数据库，填写数据库信息，并记下数据库密码，如下图
  ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/002.png)
  点击提交后找到新添加的数据库，点击导入按钮弹出上传框，点击从本地上传，选择 `db.sql` 文件进行上传
  ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/003.png)
  ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/004.png)
  ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/005.png)

- 修改配置信息

    点击宝塔左侧文件菜单，找到 `service/.env` 配置文件，修改里面的数据库配置信息、邮箱配置信息和百度文本审核配置信息
    ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/007.png)

- 启动服务端

    点击宝塔左侧网站菜单，选择 `go项目`，添加 `go项目`，选择要运行的二进制文件
    ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/008.png)
    ![](https://gouguoyin.oss-cn-beijing.aliyuncs.com/tools/images/2130706433/20230419/009.png)
    点击宝塔左侧终端菜单，输入 `curl http://127.0.0.1:3000`，如果出现
    ```shell
    {"Hello":"Gochat 后端服务启动成功"}
    ```
    说明后端服务启动成功

## 关联链接
自建代理开源项目：https://github.com/easychen/openai-api-proxy/

百度敏感词过滤接口申请：https://console.bce.baidu.com/ai/?fromai=1#/ai/antiporn/overview/resource/getFree

## 更新日志
### v1.0.4
- 增加百度敏感词过滤支持
- 增加对gpt-4.0、gpt-4-0314、gpt-4-32k、gpt-4-32k-0314 模型的支持
- 管理后台支持修改登录账号
- 管理后台新增对模型的细调
- 管理后台支持生成卡密时直接绑定用户
- 修复管理后台套餐保存报错的 bug
- 修复管理后台生成卡券选择套餐时勾选后是数字的 bug
### v1.0.3
- 修复无法流式输出的bug
- 修复无法关联上下文的bug，目前默认关联最近5条历史记录
- 优化会员登录状态判断
- 修复管理后台只有一个 `key` 时报错的 bug
- 修复会员多次叠加购买次卡时次数没有叠加的 bug
- 管理后台仪表盘显示真实数据
- 管理后台会员管理增加删除操作

## 鸣谢
[chatgpt-web 原项目](https://github.com/Chanzhaoyu/chatgpt-web)