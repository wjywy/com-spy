export const defaultConfig = {
    ignore: ['node_modules', '.gitignore', 'dist', '.git'],
    dirPath: process.cwd(),
    comName: '',
    outDir: '../output/component.json',
    ui: true
}

export interface ConfigProp {
    ignore: string[];
    dirPath: string;
    comName: string;
    outDir: string;
    ui: boolean;
}