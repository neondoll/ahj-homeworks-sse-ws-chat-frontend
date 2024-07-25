export default class ChatApi {
  constructor() { this._api = new WebSocket('ws://localhost:3000'); }

  addEventListener(type, callback, options = undefined) {
    this._api.addEventListener(type, callback, options);
  }

  send(data) { this._api.send(data); }
}