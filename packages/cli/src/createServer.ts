import path  from 'path';
import express from 'express';
import ws from 'ws';
import analysis from '@com-spy/core'
import {staticPath} from '@com-spy/view'

const root = path.join(staticPath);

export const createServer = async() => {
    connectWs();
    const app = express();
    app.use(express.static(root));
    app.get('*', (_, res) => {
        res.sendFile(path.join(root, 'index.html'));
    })
    app.listen(2024, () => {
        console.log('服务器启动成功', "http://localhost:2024");
    });
}

const connectWs = () => {
    const wsServer = new ws.Server({
        port: 1982
    });

    wsServer.on('listening', () => {
        console.log('begin listening');
    });

    wsServer.on('connection', (socket: ws) => {
        socket.addEventListener('message', async (mes) => {
            console.log(JSON.parse(mes.data as string), 'message');
            const ana = new analysis();
            const res = await ana.getRes();
            socket.send(formatRes('init', res));
        });

        socket.addEventListener('close', () => {

        });
        
        socket.addEventListener('error', () => {

        });
    });
}

const formatRes = (type: string, data: unknown) => {
    return JSON.stringify({type, data});
}