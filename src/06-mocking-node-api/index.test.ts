import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  const timeout = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const spySetTimeout = jest.spyOn(global, 'setTimeout');

    doStuffByTimeout(callback, timeout);

    expect(spySetTimeout).toHaveBeenCalledTimes(1);
    expect(spySetTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', async () => {
    const callback = jest.fn();
    doStuffByTimeout(callback, timeout);

    expect(callback).not.toHaveBeenCalled();
    await jest.advanceTimersByTimeAsync(timeout);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  const interval = 1000;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('should set interval with provided callback and interval', () => {
    const callback = jest.fn();
    jest.spyOn(global, 'setInterval');

    doStuffByInterval(callback, interval);

    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    doStuffByInterval(callback, interval);

    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(interval);
    expect(callback).toHaveBeenCalledTimes(3);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'example.txt';
    const joinSpy = jest.spyOn(path, 'join');

    await readFileAsynchronously(pathToFile);

    expect(joinSpy).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    existsSyncMock.mockReturnValue(false);

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBeNull();
    expect(existsSyncMock).toHaveBeenCalledWith(expect.any(String));
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'example.txt';
    const fileContent = 'This is an example file';

    const existsSyncMock = jest.spyOn(fs, 'existsSync');
    const readFileMock = jest.spyOn(fsPromises, 'readFile');

    existsSyncMock.mockReturnValue(true);
    readFileMock.mockResolvedValue(Buffer.from(fileContent));

    const result = await readFileAsynchronously(pathToFile);

    expect(result).toBe(fileContent);
    expect(existsSyncMock).toHaveBeenCalledWith(expect.any(String));
    expect(readFileMock).toHaveBeenCalledWith(expect.any(String));
  });
});
