
import tsCompiler from 'typescript';

const tsCode =  
    `import { readdir } from 'fs/promises';

    const dataLen = 3;
    let name = 'iceman';

    async function getInfos (info: string) {
        const readdir = 3;
        console.log(readdir);
        if(await readdir('./src')){
            console.log(name);
        }
        const result = await readdir(info);
        return result;
    }`

const ast = tsCompiler.createSourceFile('xxx', tsCode, tsCompiler.ScriptTarget.Latest, true);
console.log(ast);

function walk (node: tsCompiler.Node) {
    tsCompiler.forEachChild(node, walk);
    console.log(node);
}

walk(ast);