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
    const walk = (node: tsCompiler.Node) => {
        tsCompiler.forEachChild(node, walk);

        // 分析引入情况
        if (tsCompiler.isImportDeclaration(node)) {
            if (node.moduleSpecifier && node.moduleSpecifier.getText()) {
                // 存在导入项
                if (node.importClause) {
                    // default 直接引入场景
                    if (node.importClause.name) {
                        const name = node.importClause.name.escapedText;
                        dealImports(filePath, name);
                    }

                    if (node.importClause.namedBindings) {
                        // 拓展导入情况，包含 as 情况
                        if (tsCompiler.isNamedImports(node.importClause.namedBindings)) {
                            if (node.importClause.namedBindings.elements && node.importClause.namedBindings.elements.length > 0) {
                                const tempArr = node.importClause.namedBindings.elements;
                                tempArr.forEach((element) => {
                                    if (tsCompiler.isImportSpecifier(element)) {
                                        const name = element.name.escapedText;
                                        dealImports(filePath, name);
                                    }
                                })
                            }
                        }

                        // 全量导入 as 场景
                        if (tsCompiler.isNamespaceImport(node.importClause.namedBindings) && node.importClause.namedBindings.name) {
                            const name = node.importClause.namedBindings.name.escapedText;
                            dealImports(filePath, name);
                        }
                    }
                }
            } 
        }
    }

    walk(ast);
    return importItems;
}

