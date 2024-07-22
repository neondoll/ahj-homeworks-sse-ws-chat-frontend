import Chat from './chat';

const app = document.querySelector('#app');

const chat = new Chat(app);
chat.init();