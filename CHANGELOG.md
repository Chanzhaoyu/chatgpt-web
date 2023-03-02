## v2.9.1

`2023-03-02`

### Feature
- 代码块添加当前代码语言显示和复制功能[#197][#196]
- 完善多语言，现在可以切换中英文显示

## Enhancement
- 由[Zo3i](https://github.com/Chanzhaoyu/chatgpt-web/pull/187) 完善 `docker-compose` 部署文档

### BugFix
- 由 [ottocsb](https://github.com/Chanzhaoyu/chatgpt-web/pull/200) 修复头像修改不同步的问题
## Other
- 更新依赖至最新
- 修改 `README` 内容
## v2.9.0

`2023-03-02`

### Feature
- 现在能复制带格式的消息文本
- 新设计的设定页面，可以自定义姓名、描述、头像（链接方式）
- 新增`403`和`404`页面以便扩展

## Enhancement
- 更新 `chatgpt` 使 `ChatGPTAPI` 支持 `gpt-3.5-turbo-0301`（默认）
- 取消了前端超时限制设定

## v2.8.3

`2023-03-01`

### Feature
- 消息已输出内容不会因为中断而消失[#167]
- 添加复制消息按钮[#133]

### Other
- `README` 添加声明内容

## v2.8.2

`2023-02-28`
### Enhancement
- 代码主题调整为 `One Dark - light|dark` 适配深色模式
### BugFix
- 修复普通文本代码渲染和深色模式下的问题[#139][#154]

## v2.8.1

`2023-02-27`

### BugFix
- 修复 `API` 版本不是 `Markdown` 时，普通 `HTML` 代码会被渲染的问题 [#146]

## v2.8.0

`2023-02-27`

- 感谢 [puppywang](https://github.com/Chanzhaoyu/chatgpt-web/commit/628187f5c3348bda0d0518f90699a86525d19018) 修复了 `2.7.0` 版本中关于流输出数据的问题（使用 `nginx` 需要自行配置 `octet-stream` 相关内容）

- 关于为什么使用 `octet-stream` 而不是 `sse`，是因为更好的兼容之前的模式。

- 建议更新到此版本获得比较完整的体验

### Enhancement
- 优化了部份代码和类型提示
- 输入框添加换行提示
- 移动端输入框现在回车为换行，而不是直接提交
- 移动端双击标题返回顶部，箭头返回底部

### BugFix
- 流输出数据下的问题[#122]
- 修复了 `API Key` 下部份代码不换行的问题
- 修复移动端深色模式部份样式问题[#123][#126]
- 修复主题模式图标不一致的问题[#126]

## v2.7.3

`2023-02-25`

### Feature
- 适配系统深色模式 [#118](https://github.com/Chanzhaoyu/chatgpt-web/issues/103)
### BugFix
- 修复用户消息能被渲染为 `HTML` 问题 [#117](https://github.com/Chanzhaoyu/chatgpt-web/issues/117)

## v2.7.2

`2023-02-24`
### Enhancement
- 消息使用 [github-markdown-css](https://www.npmjs.com/package/github-markdown-css) 进行美化，现在支持全语法
- 移除测试无用函数

## v2.7.1

`2023-02-23`

因为消息流在 `accessToken` 中存在解析失败和消息不完整等一系列的问题，调整回正常消息形式

### Feature
- 现在可以中断请求过长没有答复的消息
- 现在可以删除单条消息
- 设置中显示当前版本信息

### BugFix
- 回退 `2.7.0` 的消息不稳定的问题

## v2.7.0

`2023-02-23`

### Feature
- 使用消息流返回信息，反应更迅速

### Enhancement
- 样式的一点小改动

## v2.6.2

`2023-02-22`
### BugFix
- 还原修改代理导致的异常问题

## v2.6.1

`2023-02-22`

### Feature
- 新增 `Railway` 部署模版

### BugFix
- 手动打包 `Proxy` 问题

## v2.6.0

`2023-02-21`
### Feature
- 新增对 `网页 accessToken` 调用 `ChatGPT`，更智能不过不太稳定 [#51](https://github.com/Chanzhaoyu/chatgpt-web/issues/51)
- 前端页面设置按钮显示查看当前后端服务配置

### Enhancement
- 新增 `TIMEOUT_MS` 环境变量设定后端超时时常（单位：毫秒）[#62](https://github.com/Chanzhaoyu/chatgpt-web/issues/62)

## v2.5.2

`2023-02-21`
### Feature
- 增加对 `markdown` 格式的支持 [Demo](https://github.com/Chanzhaoyu/chatgpt-web/pull/77)
### BugFix
- 重载会话时滚动条保持

## v2.5.1

`2023-02-21`

### Enhancement
- 调整路由模式为 `hash`
- 调整新增会话添加到
- 调整移动端样式


## v2.5.0

`2023-02-20`

### Feature
- 会话 `loading` 现在显示为光标动画
- 会话现在可以再次生成回复
- 会话异常可以再次进行请求
- 所有删除选项添加确认操作

### Enhancement
- 调整 `chat` 为路由页面而不是组件形式
- 更新依赖至最新
- 调整移动端体验

### BugFix
- 修复移动端左侧菜单显示不完整的问题

## v2.4.1

`2023-02-18`

### Enhancement
- 调整部份移动端上的样式
- 输入框支持换行

## v2.4.0

`2023-02-17`

### Feature
- 响应式支持移动端
### Enhancement
- 修改部份描述错误

## v2.3.3

`2023-02-16`

### Feature
- 添加 `README` 部份说明和贡献列表
- 添加 `docker` 镜像
- 添加 `GitHub Action` 自动化构建

### BugFix
- 回退依赖更新导致的 [Eslint 报错](https://github.com/eslint/eslint/issues/16896)

## v2.3.2

`2023-02-16`

### Enhancement
- 更新依赖至最新
- 优化部份内容

## v2.3.1

`2023-02-15`

### BugFix
- 修复多会话状态下一些意想不到的问题

## v2.3.0

`2023-02-15`
### Feature
- 代码类型信息高亮显示
- 支持 `node ^16` 版本
- 移动端响应式初步支持
- `vite` 中 `proxy` 代理

### Enhancement
- 调整超时处理范围

### BugFix
- 修复取消请求错误提示会添加到信息中
- 修复部份情况下提交请求不可用
- 修复侧边栏宽度变化闪烁的问题

## v2.2.0

`2023-02-14`
### Feature
- 会话和上下文本地储存
- 侧边栏本地储存

## v2.1.0

`2023-02-14`
### Enhancement
- 更新依赖至最新
- 联想功能移动至前端提交，后端只做转发

### BugFix
- 修复部份项目检测有关 `Bug`
- 修复清除上下文按钮失效

## v2.0.0

`2023-02-13`
### Refactor
重构并优化大部分内容

## v1.0.5

`2023-02-12`

### Enhancement
- 输入框焦点，连续提交

### BugFix
- 修复信息框样式问题
- 修复中文输入法提交问题

## v1.0.4

`2023-02-11`

### Feature
- 支持上下文联想

## v1.0.3

`2023-02-11`

### Enhancement
- 拆分 `service` 文件以便扩展
- 调整 `Eslint` 相关验证

### BugFix
- 修复部份控制台报错

## v1.0.2

`2023-02-10`

### BugFix
- 修复新增信息容器不会自动滚动到问题
- 修复文本过长不换行到问题 [#1](https://github.com/Chanzhaoyu/chatgpt-web/issues/1)
