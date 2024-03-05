import { check_matches } from '../src/check-matches';
describe('check_matches', () => {
  test('finds match single pattern', () => {
    expect(
      check_matches({ test: ['*'], test2: ['anything.js'] }, ['anything.ts']),
    ).toEqual({ test: true, test2: false });
  });
  test('finds match for patterns', () => {
    expect(
      check_matches({ test: ['src/test.js'], test2: ['src/testing/*'] }, [
        'src/testing/test.js',
      ]),
    ).toEqual({ test: false, test2: true });
  });
  test('finds match folder', () => {
    expect(
      check_matches({ test: ['src/*'], test2: ['src/testing/*'] }, [
        'src/testing/test.js',
      ]),
    ).toEqual({ test: true, test2: true });
  });
  test('finds match exact file', () => {
    expect(
      check_matches(
        { test: ['src/testing/test.js'], test2: ['src/testing/test.ts'] },
        ['src/testing/test.js'],
      ),
    ).toEqual({ test: true, test2: false });
  });
  test('finds match file type', () => {
    expect(
      check_matches(
        { test: ['src/testing/*.js'], test2: ['src/testing/*.ts'] },
        ['src/testing/test.js'],
      ),
    ).toEqual({ test: true, test2: false });
  });
});
