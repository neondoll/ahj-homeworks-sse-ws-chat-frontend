export default class ChatApi {
  constructor() { this._api = new WebSocket('wss://ahj-homeworks-sse-ws-chat-backend-64z9.onrender.com'); }

  addEventListener(type, callback, options = undefined) {
    this._api.addEventListener(type, callback, options);
  }

  send(data) { this._api.send(data); }
}
