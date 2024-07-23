const createRequest = async (options) => {
  const init = {
    headers: { 'Content-Type': 'application/json' },
    method: options.method,
  };

  if (options.method === 'POST' || options.method === 'PUT') {
    init.body = JSON.stringify(options.body);
  }

  return await fetch('http://localhost:3000' + options.url, init);
};

export default createRequest;
