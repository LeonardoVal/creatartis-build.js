/* globals describe it expect */
import build from '../../src/index';

describe('Test', () => {
  it('layout', () => {
    expect(build.tasks).toBeOfType('function');
  });
});
