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
        const localConfig = await import(pathToFileURL(CONFIGE_JSON).toString(), {
            assert: {
                type: 'json',
            }
        });
        return localConfig.default;
    } else {
        return {};
    }
}

export const confirmOptions = async (options: optionsProp) => {
    const ans: ConfigProp = defaultConfig;

    // 获取本地配置
    const jsonDefault = await getLocalJson();
    if (jsonDefault.dirPath) {
        ans.dirPath = jsonDefault.dirPath;
    }
    if (jsonDefault.ignore) {
        ans.ignore = jsonDefault.ignore;
    }
    if (jsonDefault.outDir) {
        ans.outDir = jsonDefault.outDir;
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