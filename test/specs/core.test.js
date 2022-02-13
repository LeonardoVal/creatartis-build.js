import build from '../../src/creatartis-build';

describe('Test', () => {
  it('layout', () => {
    const {
      execTask,
      run,
      taskBuild,
      taskCheck,
      taskDoc,
      taskLint,
      taskPwd,
      taskRelease,
      taskTest,
      taskUnrelease,
    } = build;
    [
      execTask, run, taskBuild, taskCheck, taskDoc, taskLint, taskPwd,
      taskRelease, taskTest, taskUnrelease,
    ].forEach((fun) => {
      expect(fun).toBeOfType('function');
    });
  });
});
