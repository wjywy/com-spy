import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';
import { CONFIGE_JSON } from "./constant";

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
    const ans: {
        comName: string;
        ui: boolean;
        dirPath: string;
    } = {
        comName: '',
        ui: true,
        dirPath: process.cwd()
    };
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
    const defaultConfig = await getLocalJson();
    if (defaultConfig.dirPath) {
        ans.dirPath = defaultConfig.dirPath;
    }

    return ans;
}