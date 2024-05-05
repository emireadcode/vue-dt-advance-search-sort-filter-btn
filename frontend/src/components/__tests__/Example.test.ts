import { describe, expect, vi, test } from 'vitest';

describe('Mocking Suite', () => {
  const fn = vi.fn();
    
  fn('hello', 1);

  test('Test function is a mocked function', () => {
    
    expect(
      vi.isMockFunction(
        fn
      )
    ).toBe(true);
  });

  test('Test Argument passed through mocked function to be array of hello, 1', () => {
    
    expect(
      fn.mock.calls[
        0
      ]
    ).toEqual([
      'hello', 1
    ]);
    
    fn.mockImplementation(
     arg => arg
    );

    fn('world', 2);
    
    expect(
      fn.mock.results[
        1
      ].value
    ).toBe('world');
  });
});