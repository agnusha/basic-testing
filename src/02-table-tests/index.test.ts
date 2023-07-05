import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 5, b: 2, action: Action.Add, expected: 7 },
  { a: 5, b: 2, action: Action.Subtract, expected: 3 },
  { a: 5, b: 2, action: Action.Multiply, expected: 10 },
  { a: 10, b: 2, action: Action.Divide, expected: 5 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 5, b: 2, action: 'InvalidAction', expected: null },
  { a: 'invalid', b: 2, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  testCases.forEach((testCase) => {
    const { a, b, action, expected } = testCase;

    test(`should return ${expected} for ${a} ${action} ${b}`, () => {
      const input = { a, b, action };
      const result = simpleCalculator(input);
      expect(result).toBe(expected);
    });
  });
});
