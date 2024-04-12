import tsCompiler from 'typescript';

export const findImportItem = (ast: tsCompiler.SourceFile, filePath: string) => {
    const importItems = new Map<string, tsCompiler.__String[]>();

    // 处理 imports 相关map
    const dealImports = (filePath: string, name: tsCompiler.__String) => {
        if (importItems.has(filePath)) {
            importItems.set(filePath, (importItems.get(filePath) as tsCompiler.__String[]).concat(name));
        } else {
            importItems.set(filePath, [name]);
        }
    }

    // 遍历 AST 寻找 import 节点
    function walk(node: tsCompiler.Node) {
        const stack = [node]; // 使用数组作为显式栈
    
        while (stack.length > 0) {
            const currentNode = stack.pop(); // 取出栈顶元素
            if (!currentNode) continue;
    
            // 分析引入情况
            if (tsCompiler.isImportDeclaration(currentNode)) {
                if (currentNode.moduleSpecifier && currentNode.moduleSpecifier.getText()) {
                    // 存在导入项
                    if (currentNode.importClause) {
                        // default 直接引入场景
                        if (currentNode.importClause.name) {
                            const name = currentNode.importClause.name.escapedText;
                            dealImports(filePath, name);
                        }
    
                        // 检查具名导入或全量导入场景
                        if (currentNode.importClause.namedBindings) {
                            // 拓展导入情况，包含 as 情况
                            if (tsCompiler.isNamedImports(currentNode.importClause.namedBindings)) {
                                const tempArr = currentNode.importClause.namedBindings.elements;
                                tempArr.forEach((element) => {
                                    if (tsCompiler.isImportSpecifier(element)) {
                                        const name = element.name.escapedText;
                                        dealImports(filePath, name);
                                    }
                                });
                            }
    
                            // 全量导入 as 场景
                            if (tsCompiler.isNamespaceImport(currentNode.importClause.namedBindings) && currentNode.importClause.namedBindings.name) {
                                const name = currentNode.importClause.namedBindings.name.escapedText;
                                dealImports(filePath, name);
                            }
                        }
                    }
                }
            }
    
            // 将当前节点的所有子节点推入栈中
            tsCompiler.forEachChild(currentNode, child => stack.push(child));
        }
    }
    
    walk(ast);
    return importItems;
}

