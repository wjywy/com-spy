const enum Ignore_File {
    GitIgnore = '.gitignore',
    NodeModules = 'node_modules',
    Dist = 'dist'
}

export const ignoreArr: string[] = [Ignore_File.Dist, Ignore_File.GitIgnore, Ignore_File.NodeModules]
