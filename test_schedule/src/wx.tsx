const ws = new WebSocket('ws://192.168.0.248:5555/');

ws.onopen = () => {
    console.log("WS Connection Sucess");
};
console.log(ws)
export const send = (type: any, data: any, sender: string) => {
    ws.send(JSON.stringify({
        type,
        id: sender,
        data: {
            message: data,
            from: sender
        }
    }));
}

export default ws;