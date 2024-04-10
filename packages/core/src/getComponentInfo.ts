import tsCompiler from 'typescript';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ignoreArr } from './constant';
import findImportItem from '../util/index';


export class analysis {
    public dirPath: string; // 开始扫描的根文件夹
    public outputData = new Map<tsCompiler.__String, string[]>(); // 输出的数据
    public comName: string;

    constructor (args: {
        dirPath: string;
        comName: string;
        ui: boolean;
    }) {
        this.dirPath = args.dirPath;
        this.comName = args.comName;
    }

    // 递归查找文件夹里面的每一个文件并排除指定文件夹
    private async recursiveSearch (dirPath: string) {
        const dirs = await fs.readdir(dirPath);
        for (let file of dirs) {
            const fullPath = path.join(dirPath, file);
            const fileStat = await fs.stat(fullPath);
            if (fileStat.isDirectory()) {
                if (!ignoreArr.includes(file)) {
                    await this.recursiveSearch(fullPath);
                }
            } else {
                // 处理文件
                const content = await fs.readFile(fullPath ,'utf8');
                const ast = tsCompiler.createSourceFile('xxx', content, tsCompiler.ScriptTarget.Latest, true);
                const importItem = findImportItem(ast, fullPath);

                // 转换数据结构
                if (this.comName === '') {
                    for (let [key, values] of importItem) {
                        for (let item of values) {
                            if (this.outputData.has(item)) {
                                this.outputData.set(item, (this.outputData.get(item) as string[]) ?.concat(key));
                            } else {
                                this.outputData.set(item, [key]);
                            }
                        }
                    }
                } else {
                    for (let [key, values] of importItem) {
                        for (let item of values) {
                            if (item === this.comName) {
                                if (this.outputData.has(item)) {
                                    this.outputData.set(item, (this.outputData.get(item) as string[]) ?.concat(key));
                                } else {
                                    this.outputData.set(item, [key]);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // 将结果写入文件
    public async OutputFile() {
        await this.recursiveSearch(this.dirPath);
        const jsonStr = JSON.stringify(Object.fromEntries(this.outputData), null, 2);
        const filePath = path.join(__dirname, '../output/componentInfo.json');
        // 获取目录路径
        const dirPath = path.dirname(filePath);
        // 创建目录
        fs.mkdir(dirPath, {recursive: true})
        .then(() => {
            fs.writeFile(filePath, jsonStr, 'utf-8')
            .then(() => {
                console.log('写入成功');
            })
            .catch((err) => {
                console.error('写入失败', err);
            })
        })
        .catch((err) => {
            console.log(console.error(err));
        })
    }
}
