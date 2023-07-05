// Uncomment the code below and write your tests
import axios from 'axios';
import { throttledGetDataFromApi } from './index';

const path = '/users';

describe('throttledGetDataFromApi', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should create instance with provided base url', async () => {
    const axiosCreateSpy = jest.spyOn(axios, 'create');
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: [] });

    await throttledGetDataFromApi(path);

    expect(axiosCreateSpy).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const axiosGetSpy = jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: [] });

    await throttledGetDataFromApi(path);
    await jest.runOnlyPendingTimersAsync();

    expect(axiosGetSpy).toHaveBeenCalledWith(path);
  });

  test('should return response data', async () => {
    const usersMock = { users: [{ name: 'u1' }, { name: 'u2' }] };

    jest
      .spyOn(axios.Axios.prototype, 'get')
      .mockResolvedValueOnce({ data: usersMock });

    const result = await throttledGetDataFromApi(path);
    await jest.runOnlyPendingTimersAsync();

    expect(result).toStrictEqual(usersMock);
  });
});
