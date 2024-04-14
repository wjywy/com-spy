export interface G6Props {
    id: string;
    label: string;
    children?: G6Props[];
}

export interface wsProps {
    [key: string]: string[]
}

// 将ws传过来的数据结构转换为G6Props  
export const tran = (data: wsProps): G6Props => {
    let count = 0;
    const result: G6Props = {
        id: String(-1),
        label: 'lingjing',
        children: []
    };

    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            const child = {
                id: String(count++),
                label: key,
                children: data[key].map(path => ({ id: String(count++), label: path }))
            };
            result.children?.push(child);
        }
    }

    return result;
}

