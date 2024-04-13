import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { CONFIGE_JSON } from "./constant";
import { defaultConfig } from '@com-spy/core';
import { ConfigProp } from '@com-spy/core';

interface optionsProp {
    '--': any[]; // 如果你确切知道数组中应该是什么类型，可以将 any 替换为那个类型
    comName: string[];
    ui: boolean[];
}

export const getLocalJson = async () => {
    const resolvePath = path.join(process.cwd(), CONFIGE_JSON);
    console.log(resolvePath, 'resolvePath');
    if (fs.existsSync(resolvePath)) {
        try {
            const localConfig = await import(pathToFileURL(CONFIGE_JSON).toString(), {
                assert: {
                    type: 'json',
                }
            });
            return localConfig.default   
        } catch (error) {
            console.log(error);
        }
    } else {
        return {};
    }
}

export const confirmOptions = async (options: optionsProp) => {
    const ans: ConfigProp = defaultConfig;

    // 获取本地配置
    const jsonDefault = await getLocalJson();

    if (jsonDefault) {
        if (jsonDefault.dirPath) {
            ans.dirPath = jsonDefault.dirPath;
        }
        if (jsonDefault.ignore) {
            ans.ignore = Array.from(new Set(ans.ignore.concat(jsonDefault.ignore))); // ignore 不应该被全量覆盖，合并去重就好
        }
        if (jsonDefault.outDir) {
            ans.outDir = jsonDefault.outDir;
        }
        if (jsonDefault.ignoreExtensions) {
            ans.findExtensions = Array.from(new Set(ans.findExtensions.concat(jsonDefault.findExtensions))); // ignoreExtensions 也不应该被全量覆盖
        }
    }

    // 获取命令行参数
    for (let key of Object.keys(options)) {
        if (key === '--') {
            continue;
        }
        if (key === 'comName') {
            ans['comName'] = options[key][0];
        }
        if (key === 'ui') {
            ans['ui'] = options[key][0];
        }
    }

    return ans;
}