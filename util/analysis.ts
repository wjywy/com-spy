import tsCompiler from 'typescript';

export interface importItemProps {
    name: tsCompiler.__String; // 导入后再代码中真实调用的 API 名
    origin: string | null | tsCompiler.__String; // API别名。null则表示该非别名导入，name就是原本名字
    symbolPos: number; // symbol指向的声明节点在代码字符串中的起始位置
    symbolEnd: number; // 指向的声明节点在代码字符串中的结束位置
    identifiedPos: number; // API 名字信息节点在代码字符串中的起始位置
    identifiedEnd: number; // API 名字信息节点在代码字符串中的结束位置
    line: number; // import 语句所在代码行信息
}


// 对code解析的上层封装
export class codeAnalysis {
    constructor() {};

    findImportItem (ast: tsCompiler.SourceFile, filePath: string, baseLine = 0) {
        const importItems = new Map<tsCompiler.__String, importItemProps>();
        const that = this;

        // 处理 imports 相关map
        const dealImports = (temp: importItemProps) => {
            importItems.set(temp.name, {
                origin: temp.origin,
                symbolPos: temp.symbolPos,
                symbolEnd: temp.symbolEnd,
                identifiedPos: temp.identifiedPos,
                identifiedEnd: temp.identifiedEnd,
                line: temp.line,
                name: temp.name
            });
        }

        // 遍历 AST 寻找 import 节点
        const walk = (node: tsCompiler.Node) => {
            tsCompiler.forEachChild(node, walk);

            // 记录行数
            const line = ast.getLineAndCharacterOfPosition(node.getStart()).line + baseLine + 1;

            // 分析引入情况
            if (tsCompiler.isImportDeclaration(node)) {
                // 可能在这调用 getText() 方法不对
                if (node.moduleSpecifier && node.moduleSpecifier.getText()) {
                    // 存在导入项
                    if (node.importClause) {
                        // default 直接引入场景
                        if (node.importClause.name) {
                            const temp: importItemProps = {
                                name: node.importClause.name.escapedText,
                                origin: null,
                                symbolPos: node.importClause.pos,
                                symbolEnd: node.importClause.end,
                                identifiedPos: node.importClause.name.pos,
                                identifiedEnd: node.importClause.name.end,
                                line: line
                            }
                            dealImports(temp);
                        }

                        if (node.importClause.namedBindings) {
                            // 拓展导入情况，包含 as 情况
                            if (tsCompiler.isNamedImports(node.importClause.namedBindings)) {
                                if (node.importClause.namedBindings.elements && node.importClause.namedBindings.elements.length > 0) {
                                    const tempArr = node.importClause.namedBindings.elements;
                                    tempArr.forEach((element) => {
                                        if (tsCompiler.isImportSpecifier(element)) {
                                            const temp: importItemProps = {
                                                name: element.name.escapedText,
                                                origin: element.propertyName ? element.propertyName.escapedText : null,
                                                symbolPos: element.pos,
                                                symbolEnd: element.end,
                                                identifiedPos: element.name.pos,
                                                identifiedEnd: element.name.end,
                                                line: line
                                            };
                                            dealImports(temp);
                                        }
                                    })
                                }
                            }

                            // 全量导入 as 场景
                            if (tsCompiler.isNamespaceImport(node.importClause.namedBindings) && node.importClause.namedBindings.name) {
                                const temp: importItemProps = {
                                    name: node.importClause.namedBindings.name.escapedText,
                                    origin: '*',
                                    symbolPos: node.importClause.namedBindings.pos,
                                    symbolEnd: node.importClause.namedBindings.end,
                                    identifiedPos: node.importClause.namedBindings.name.pos,
                                    identifiedEnd: node.importClause.namedBindings.name.end,
                                    line: line
                                };
                                dealImports(temp);
                            }
                        }
                    }
                } 
            }
        }

        walk(ast);
        // console.log(importItems);
        return importItems;
    }

    dealAST(ImportItems: Map<tsCompiler.__String, importItemProps>, ast: tsCompiler.SourceFile, checker: tsCompiler.TypeChecker, filePath: string, baseLine = 0) {
        const importItemNames = Array.from(ImportItems.keys());
        const itemNode: tsCompiler.Node[] = [];
        // console.log(importItemNames);

        const walk = (node: tsCompiler.Node) => {
            tsCompiler.forEachChild(node, walk);
            const line = ast.getLineAndCharacterOfPosition(node.getStart()).line + baseLine + 1;

            // 判定当前导入的节点是否为 isIdentifier 类型节点
            // 判断从Import导入的 API 中是否存在与当前遍历节点名称相同的 API
            // 找到了所有与导入API同名的Identifier节点
            if (tsCompiler.isIdentifier(node) && node.escapedText && importItemNames.length > 0 && importItemNames.includes(node.escapedText)) {
                // 过滤掉不相干的 Identifier 之后

                // 获取对应的 import 节点信息
                const matchImportItem = ImportItems.get(node.escapedText);

                // 排除 Import 语句中同名节点的干扰
                if (node.pos != matchImportItem?.identifiedPos && node.end != matchImportItem?.identifiedEnd) {
                    console.log(filePath);
                    console.log(node);
                    const symbol = checker.getSymbolAtLocation(node);
                    console.log(symbol);

                    if (symbol && symbol.declarations && symbol.declarations.length > 0) {
                        const nodeSymbol = symbol.declarations[0];
                        console.log(node);
                        if (matchImportItem?.symbolPos == nodeSymbol.pos && matchImportItem.symbolEnd == nodeSymbol.end) {
                            // 属于导入 API 声明
                            itemNode.push(node);
                        } else {
                            // 同名 Identifier 干扰节点
                        }
                    } else {

                    }
                }                
            }
        }

        walk(ast);

        return itemNode;
    }

    analysis () {}
}

