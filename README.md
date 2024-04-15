## 简介
**comSpy **意为组件间谍，具有能够按照**入口文件**监视与分析组件与文件之间的依赖关系的能力，暂时只提供了本地 **CLI** 一种查询方式。
## 快速开始
### 本地 CLI
将 ComSpy 安装到项目，使用 pnpm

`pnpm add @com-spy/cli`

之后你可以在 `package.json` 中添加 **script** 脚本
```json
"scripts": {
  "cs" : "node ./node_modules/@com-spy/cli/bin/cli.js"  // 不够优雅，设置bin没起效果，delay研究
},
```
如果想根据默认配置直接生成依赖分析 JSON 文件，直接在命令行中运行
`pnpm run cs`

默认配置如下
```javascript
export const defaultConfig = {
  ignore: ['node_modules', '.gitignore', 'dist', '.git', 'pnpm-lock.yaml', 'package-lock.json', '.DS_Store', 'yarn.lock'], // 检索中忽略的文件夹
  dirPath: process.cwd(), // 默认检索入口，即根目录
  comName: '', // 默认检索的组件名，即全量
  outDir: './output/component.json', // 默认输出 json 结果的地址
  ui: true, // 是否开启 UI 可视化界面(待完成)
  findExtensions: ['tsx', 'jsx', 'ts', 'js', 'vue', 'html', 'css', 'less'] // 默认检索的文件后缀
}
```
具体详情请查看**配置**
### 配置
在项目的根目录下，支持配置文件 `ca.config.json`，在命令行运行命令的时候，会优先读取文件中的配置以覆盖默认配置，示例配置如下:
```json
{
    "dirPath": "../source-component-plugin" // 值取相对路径即可
    "ignore": [], // 配置想要忽略的文件名
    "comName": "", // 配置想要检索的组件名
    "outDir": "", // 配置想要输出的文件地址
    "ui": true // 是否开启可视化页面
}
```
### 接口
使用 `core` 包可以脱离 `cli` 包使用 `ComSpy` 的核心功能

- 引入
```json
  pnpm add @com-spy/core
```
......待完善具体细节
