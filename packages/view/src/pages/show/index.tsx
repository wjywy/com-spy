import React, { useEffect, useState } from "react";
import G6, {Graph} from '@antv/g6';
import tsCompiler from 'typescript';
import {Input, Button} from 'antd';
import {G6Props, tran} from '../../util/tran';
import { wsConnect } from "../../util/ws";

const ShowRes: React.FC = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const graphRef = React.useRef<Graph>();

    const [res, setRes] = useState<G6Props | null>(null);
    const [value, setValue] = useState('');

    const init = (data: Map<tsCompiler.__String, string[]>) => {
        // @ts-expect-error _String与string
        const res = tran(data);
        setRes(res);
    };

    const searchKey = (data: G6Props | null, key: string): G6Props | null => {
        if (!data) return null;

        if (!key) return data;

        const res = data.children?.filter(item => item.label === key);
        if (res && res[0]) {
            return res[0];
        }
        return null;
    }

    const createView = (data: G6Props) => {
        if (graphRef.current || !containerRef.current) return;
        
        const container = containerRef.current;
        const width = container?.scrollWidth;
        const height = container?.scrollHeight || 500;
        const graph = new G6.TreeGraph({
            container: container,
            width,
            height,
            modes: {
              default: [
                {
                  type: 'collapse-expand',
                  onChange: function onChange(item, collapsed) {
                    const data = item?.get('model');
                    data.collapsed = collapsed;
                    return true;
                  },
                },
                'drag-canvas',
                'zoom-canvas',
              ],
            },
            defaultNode: {
              size: 26,
              anchorPoints: [
                [0, 0.5],
                [1, 0.5],
              ],
            },
            defaultEdge: {
              type: 'cubic-horizontal',
            },
            layout: {
              type: 'dendrogram',
              direction: 'LR', // H / V / LR / RL / TB / BT
              nodeSep: 30,
              rankSep: 100,
            },
          });
          graph.node(function (node) {
            return {
              label: node.label,
              labelCfg: {
                position: node.children && node.children.length > 0 ? 'left' : 'right',
                offset: 5,
              },
            };
          });

          graph.data(data);
          graph.render();
          graph.fitView();
          graphRef.current = graph;
      
          if (typeof window !== 'undefined')
            window.onresize = () => {
              if (!graph || graph.get('destroyed')) return;
              if (!container || !container.scrollWidth || !container.scrollHeight) return;
              graph.changeSize(container.scrollWidth, container.scrollHeight);
            };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value.trim());
    };

    const handleClick = () => {
        const newData = searchKey(res, value);
        if (newData !== null) {
            graphRef.current?.changeData(newData);
        } else {
            graphRef.current?.changeData({
                id: '-1',
                label: 'lingjing',
                children: [
                    {
                        id: '-2',
                        label: value,
                        children: []
                    }
                ]
            });
        }
    };

    useEffect(() => {
        wsConnect(init);
    }, []);

    useEffect(() => {
        if (res !== null) {
            createView(res);
        }
    }, [res])

    return (
        <>
            <div>
                <div style={{display: "flex", justifyContent: 'center'}}>
                    <Input placeholder={'请输入你要查询的组件名称'} onChange={handleChange} value={value} style={{width: '60%', marginRight: '20px'}}></Input>
                    <Button type="primary" onClick={handleClick}>点击确定</Button>
                </div>
                <div ref={containerRef} style={{width: '100%', height: '100vh'}}></div>
            </div>
        </>
    ) 
}

export default ShowRes;