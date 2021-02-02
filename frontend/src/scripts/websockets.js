export const plusSlides = (n) => {
    showSlides(slideIndex += n);
}

export const generateWebSocket = (url, response) => {
    const protocol = location.protocol === 'https' ? 'wss' : 'ws';
    const domain = 'localhost:5000';
    const finalUrl = protocol + '://' + domain;

    const ws = new WebSocket(finalUrl);
    ws.addEventListener('open', () => {
        response('open', {});
    });
    ws.addEventListener('message', e => {
        try {
            const json = JSON.parse(e);
            response(json.cmd, json);
        } catch (err) {
            console.log(err);
        }
    });
}