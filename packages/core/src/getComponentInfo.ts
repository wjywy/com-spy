import tsCompiler from 'typescript';
import * as fs from 'fs/promises';
import * as path from 'path';
import findImportItem from '../util/index';
import { ConfigProp } from './constant';
import { defaultConfig } from './constant';

export class analysis {
    public outputData = new Map<tsCompiler.__String, string[]>(); // 输出的数据
    private stack: string[];

    constructor (private readonly args: ConfigProp = defaultConfig ) {
        this.stack = [];
    }

    // 迭代查找文件夹里面的每一个文件并排除指定文件夹
    private async recursiveSearch (dirPath: string) {
        this.stack.push(dirPath);
        while (this.stack.length > 0) {
            const curPath = this.stack.pop()!;
            const dirs = await fs.readdir(curPath);
            let { comName, ignore } = this.args;

            for (let file of dirs) {
                const fullPath = path.join(curPath, file);
                const fileStat = await fs.stat(fullPath);
                if (fileStat.isDirectory()) {
                    if (!ignore.includes(file)) {
                        this.stack.push(fullPath);
                    }
                } else {
                    // 处理文件
                    const content = await fs.readFile(fullPath ,'utf8');
                    const ast = tsCompiler.createSourceFile('xxx', content, tsCompiler.ScriptTarget.Latest, true);
                    const importItem = findImportItem(ast, fullPath);
    
                    // 转换数据结构
                    if (comName === '') {
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
                                if (item === comName) {
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
    }

    // 将结果写入文件
    public async OutputFile() {
        const { dirPath, outDir } = this.args;
        await this.recursiveSearch(dirPath);
        const jsonStr = JSON.stringify(Object.fromEntries(this.outputData), null, 2);
        const filePath = path.join(process.cwd(), outDir);
        // 获取目录路径
        const dirName = path.dirname(filePath);
        // 创建目录
        fs.mkdir(dirName, {recursive: true})
        .then(() => {
            fs.writeFile(filePath, jsonStr, 'utf-8')
            .then(() => {
                console.log(filePath, 'filePath的路径');
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
