import tsCompiler from 'typescript';
const wsPath = "ws://localhost:1982";

export const wsConnect = (
    init: (data: Map<tsCompiler.__String, string[]>) => void
) => {
    const ws = new WebSocket(wsPath);

    switch (ws.readyState) {
        case WebSocket.CONNECTING:
            console.log('正在连接');
            break;
    
        case WebSocket.OPEN:
            console.log('连接成功');
            break;
        case WebSocket.CLOSING:
            console.log('连接关闭中');
            break;
        case WebSocket.CLOSED:
            console.log('连接已关闭');
            break;
        default:
            break;
    }

    ws.addEventListener('open', (event) => {
        console.log(event, 'open');
        ws.send(JSON.stringify({
            type: 'init'
        }));
        ws.addEventListener('message', (event) => {
            const {type, data} = formatReq(event.data);
            if (type === 'init') {
                init(JSON.parse(data));          
            }
        });
    });

    ws.addEventListener('close', (event) => {
        console.log(event, 'close');
    });

    ws.addEventListener('error', (event) => {
        console.log(event, 'error');
    });
}

const formatReq = (data: string) => {
    return JSON.parse(data);
}