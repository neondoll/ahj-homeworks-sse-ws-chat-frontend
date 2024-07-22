export default class Chat {
  constructor(container) {
    this._container = container;
    this._user = undefined;
  }

  init() {
   document.body.insertAdjacentHTML('beforeEnd', Chat.markupModal);
   document.body.querySelector('.modal').classList.add('active')
  }

  static get markupModal() {
    return `
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
}