import createRequest from './createRequest';

export default class UserApi {
  static async new(payload) {
    const response = await createRequest({
      url: '/new-user',
      method: 'POST',
      body: payload,
    });

    return await response.json();
  }
}