import tsCompiler from 'typescript';

/**
 * 解析ts文件代码，获取ast，checker
 * @param fileName 
 * @returns 
 */
export const parseTs = (fileName: string) => {
    
    // fileNames 参数表示文件路径列表，是一个数组，可以只传一个文件
    const program = tsCompiler.createProgram([fileName], {});

    // 从 program 中获取 SourceFile，即 AST 对象
    // fileName 表示文件路径
    const ast = program.getSourceFile(fileName);

    // 获取 TypeChecker 控制器
    const checker = program.getTypeChecker();

    return { ast, checker };
}