const enum Ignore_File {
    GitIgnore = '.gitignore',
    NodeModules = 'node_modules',
    Dist = 'dist',
    Git = '.git'
}

export const ignoreArr: string[] = [Ignore_File.GitIgnore, Ignore_File.NodeModules, Ignore_File.Git, Ignore_File.Dist]
