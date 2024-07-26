const createRequest = async (options) => {
  const init = {
    headers: { 'Content-Type': 'application/json' },
    method: options.method,
  };

  if (options.method === 'POST' || options.method === 'PUT') {
    init.body = JSON.stringify(options.body);
  }

  return await fetch('https://ahj-homeworks-sse-ws-chat-backend-64z9.onrender.com' + options.url, init);
};

export default createRequest;
