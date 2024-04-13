export const defaultConfig = {
    ignore: ['node_modules', '.gitignore', 'dist', '.git', 'pnpm-lock.yaml', 'package-lock.json', '.DS_Store', 'yarn.lock'],
    dirPath: process.cwd(),
    comName: '',
    outDir: './output/component.json',
    ui: true,
    findExtensions: ['tsx', 'jsx', 'ts', 'js', 'vue', 'html', 'css', 'less']
}

export interface ConfigProp {
    ignore: string[];
    dirPath: string;
    comName: string;
    outDir: string;
    ui: boolean;
    findExtensions: string[];
}