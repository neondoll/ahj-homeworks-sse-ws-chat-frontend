import createRequest from './api/createRequest';

export default class Chat {
  constructor(container) {
    this._chat = undefined;
    this._container = container;
    this._modal = undefined;
    this._user = undefined;
  }

  bindToDOM() {
    if (!(this._container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }

    this._container.innerHTML = Chat.markup;

    this._chat = this._container.querySelector(Chat.chatSelector);
    this._modal = this._container.querySelector(Chat.modalSelector);

    // this._chat.classList.add('hidden');
    // this._modal.classList.add('active');

    this._modal.querySelector('form').addEventListener('submit', this.onSubmitModalForm.bind(this));
  }

  init() {
    this.bindToDOM();
  }

  async onSubmitModalForm(event) {
    event.preventDefault();

    const formHint = event.target.querySelector(Chat.modalFormHintSelector);
    const formInput = event.target.querySelector(Chat.modalFormInputSelector);

    formHint.textContent = '';

    const response = await createRequest({
      url: '/new-user',
      method: 'POST',
      body: { name: formInput.value },
    });

    if (!response.ok) {
      const data = await response.json();

      console.error(data.status, data.message);

      formHint.textContent = data.message;

      return;
    }

    const data = await response.json();

    this._user = data.user;

    this._modal.classList.remove('active');
    formInput.value = '';
  }

  static get chatSelector() { return '.chat'; }

  static get markup() {
    return `
      <div class="chat">
        <ul class="chat__user-list">
          <li class="chat__user">Alexandra</li>
          <li class="chat__user">Petr</li>
          <li class="chat__user">Ivan</li>
          <li class="chat__user chat__user--yourself">You</li>
        </ul>
        <div class="chat__container">
          <div class="chat__messages"></div>
        </div>
      </div>
      <div class="modal">
        <form class="modal__content">
          <h2 class="modal__header">Выберите псевдоним</h2>
          <div class="modal__body">
            <div class="modal__form-group">
              <input class="modal__form-input">
              <div class="modal__form-hint hidden"></div>
            </div>
          </div>
          <div class="modal__footer">
            <button class="modal__ok" type="submit">Продолжить</button>
          </div>
        </form>
      </div>
    `;
  }

  static get modalFormHintSelector() { return '.modal__form-hint'; }

  static get modalFormInputSelector() { return '.modal__form-input'; }

  static get modalSelector() { return '.modal'; }
}
