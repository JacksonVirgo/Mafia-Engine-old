const local = "ws://localhost:5000";
const production = 'ws://www.mafiaengine.com'
export const websocketUrl = local;

/**
 * 
 * @param {*} start 
 * @param {*} message 
 * @param {*} end 
 */
export function createWebSocket(start, message, end) {
    const ws = new WebSocket(websocketUrl);

    ws.addEventListener('connect')
    return ws;
}
// Create a managable abstraction over this.