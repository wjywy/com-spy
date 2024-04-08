import * as glob from 'glob';
import * as path from 'path';

export const scanFile = (scanPath: string) => {
    // 扫描ts和tsx文件
    const tsFiles = glob.sync(path.join(process.cwd(), `sec/**/*.ts`));
    const tsxFiles = glob.sync(path.join(process.cwd(), `src/**/*.tsx`));

    return tsFiles.concat(tsxFiles);
}
