## 简介
**comSpy **意为组件间谍，具有能够按照**入口文件**监视与分析组件与文件之间的依赖关系的能力，暂时只提供了本地 **CLI** 一种查询方式。

- 快速开始
### 本地 CLI
将 ComSpy 安装到项目，使用 pnpm
`pnpm add @com-spy/cli`
之后你可以在 `package.json` 中添加 **script** 脚本
```json
"scripts": {
  "ca" : "ca"
},
```
如果想根据默认配置直接生成依赖分析 JSON 文件，直接在命令行中运行
`pnpm run ca`
默认配置如下
```json
{
  "dirPath": process.cwd(), // 检索入口, 默认项目的根目录
}
```
具体详情请查看**配置**
### 配置
在项目的根目录下，支持配置文件 `ca.config.json`，在命令行运行命令的时候，会优先读取文件中的配置以覆盖默认配置，示例配置如下:
```json
{
    "dirPath": "../../source-component-plugin" // 值取相对路径即可
}
```
### 接口
......待完善项目包组织架构
