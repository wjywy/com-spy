import tsCompiler from 'typescript';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ignoreArr } from './constant';
import { findImportItem } from '../util';

/**忽视.gitignore中的文件，默认忽略node_modules, dist等文件夹 */
export const ignoreFile = async (baseName: string, ignoreFiles: string[]) => {
    const files = await fs.readdir(baseName);
    for (let i = 0; i < files.length; i++) {
        if (ignoreFiles.includes(files[i])) {
            files.splice(i, 1);
        }
    }

    return files;
}

// 递归查找文件夹里面的每一个文件
const recursiveSearch = async(directory: string) => {
    const dirs = await ignoreFile(directory, ignoreArr);
    for (let file of dirs) {
        const fullPath = path.join(directory, file);
        const fileStat = await fs.stat(fullPath);
        if (fileStat.isDirectory()) {
            recursiveSearch(fullPath);
        } else {
            // 处理文件
            const content = await fs.readFile(fullPath ,'utf8');
            const ast = tsCompiler.createSourceFile('xxx', content, tsCompiler.ScriptTarget.Latest, true);
            const importItem = findImportItem(ast, fullPath);
            console.log(importItem);
        }
    }
}

// 调用函数，传入需要遍历的目录路径
recursiveSearch('../com-spy');