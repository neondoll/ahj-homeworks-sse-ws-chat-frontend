import ChatApi from './api/ChatApi';
import UserApi from './api/UserApi';

export default class Chat {
  constructor(container) {
    this._chat = undefined;
    this._container = container;
    this._modal = undefined;
    this._user = undefined;
    this._websocket = undefined;
  }

  bindToDOM() {
    if (!(this._container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this._container.innerHTML = Chat.markup;

    this._chat = this._container.querySelector(Chat.selectorChat);
    this._modal = this._container.querySelector(Chat.selectorModal);

    this._modal.querySelector('form').addEventListener('submit', this.onSubmitModalForm);

    this._chat.classList.add('hidden');
    this._modal.classList.add('active');
  }

  init() {
    this.registerEvents();
    this.bindToDOM();
  }

  onEnterChatInput(event) {
    this.sendMessage({ msg: event.target.value, type: 'send', user: this._user });

    event.target.value = '';
  }

  onMessageWebsocket(event) {
    const data = JSON.parse(event.data);

    const chatMessages = document.querySelector(Chat.selectorChatMessages);
    const chatUserList = document.querySelector(Chat.selectorChatUserList);
    const chatUsers = document.querySelectorAll(Chat.selectorChatUser);

    if (!data.type) {
      for (let index = 0; index < chatUsers.length; index++) {
        chatUsers[index].remove();
      }
    }

    for (let index = 0; index < data.length; index++) {
      const user = data[index];

      chatUserList.insertAdjacentHTML('beforeEnd', Chat.markupChatUser(user, this._user && this._user.name === user.name));
    }

    if (data.user !== undefined) {
      chatMessages.insertAdjacentHTML('beforeEnd', Chat.markupChatMessage(data, data.user.name === this._user.name));
    }
  }

  async onSubmitModalForm(event) {
    event.preventDefault();

    const formHint = event.target.querySelector(Chat.selectorModalFormHint);
    const formInput = event.target.querySelector(Chat.selectorModalFormInput);

    formHint.textContent = '';

    const data = await UserApi.new({ name: formInput.value });

    if (data.status !== 'ok') {
      console.error(data.status, data.message);

      formHint.textContent = data.message;

      return;
    }

    this._user = data.user;

    this._chat.classList.remove('hidden');
    this._modal.classList.remove('active');
    formInput.value = '';

    this.subscribeOnEvents();
  }

  onUnloadWindow() {
    this.sendMessage({ msg: 'вышел', type: 'exit', user: this._user });
  }

  registerEvents() {
    this.onEnterChatInput = this.onEnterChatInput.bind(this);
    this.onMessageWebsocket = this.onMessageWebsocket.bind(this);
    this.onSubmitModalForm = this.onSubmitModalForm.bind(this);
    this.onUnloadWindow = this.onUnloadWindow.bind(this);
  }

  sendMessage(data) { this._websocket.send(JSON.stringify(data)); }

  subscribeOnEvents() {
    this._websocket = new ChatApi();
    this._websocket.addEventListener('message', this.onMessageWebsocket);
    this._chat.querySelector(Chat.selectorChatInput).addEventListener('keyup', (event) => {
      if (event.code === 'Enter') {
        this.onEnterChatInput(event);
      }
    });
    window.addEventListener('unload', this.onUnloadWindow);
  }

  static get markup() {
    return `
      <div class="chat">
        <ul class="chat__user-list"></ul>
        <div class="chat__container">
          <div class="chat__messages"></div>
          <input class="chat__input" placeholder="Type your message here">
        </div>
      </div>
      <div class="modal">
        <form class="modal__content">
          <h2 class="modal__header">Выберите псевдоним</h2>
          <div class="modal__body">
            <div class="modal__form-group">
              <input class="modal__form-input">
              <div class="modal__form-hint"></div>
            </div>
          </div>
          <div class="modal__footer">
            <button class="modal__ok" type="submit">Продолжить</button>
          </div>
        </form>
      </div>
    `;
  }

  static markupChatMessage(data, isYourself) {
    return `
      <div class="chat__message chat-message${isYourself ? ' chat-message--yourself' : ''}">
        <p class="chat-message__header">${data.user.name}${isYourself ? ' (You)' : ''}</p>
        <p class="chat-message__text">${data.msg}</p>
      </div>
    `;
  }

  static markupChatUser(user, isYourself) {
    return `
      <li class="chat__user${isYourself ? ' chat__user--yourself' : ''}" data-id="${user.id}">
        ${user.name}${isYourself ? ' (You)' : ''}
      </li>
    `;
  }

  static get selectorChat() { return '.chat'; }

  static get selectorChatInput() { return '.chat__input'; }

  static get selectorChatMessages() { return '.chat__messages'; }

  static get selectorChatUser() { return '.chat__user'; }

  static get selectorChatUserList() { return '.chat__user-list'; }

  static get selectorModal() { return '.modal'; }

  static get selectorModalFormHint() { return '.modal__form-hint'; }

  static get selectorModalFormInput() { return '.modal__form-input'; }
}
