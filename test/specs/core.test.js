import build from '../../src/creatartis-build';

describe('Test', () => {
  it('layout', () => {
    const { execTask, run, TASKS } = build;
    expect(execTask).toBeOfType('function');
    expect(run).toBeOfType('function');
    expect(TASKS).toBeOfType(Array);
    TASKS.forEach(([selector, taskFunction]) => {
      expect(selector).toBeOfType(RegExp);
      expect(taskFunction).toBeOfType('function');
    });
  });
});
