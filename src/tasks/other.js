const { log, packageJSON } = require('./common');

function taskPwd() {
  return log.info(`creatartis-build is running at ${process.cwd()}.`);
}

function taskPackageJSON(qry) {
  const pkg = packageJSON();
  let data = pkg;
  if (qry) {
    qry.replace(/\.([-\w$]+)/g, ($0, $1) => {
      data = data[$1];
    });
  }
  return log.info(`package${qry}:  ${JSON.stringify(data, null, '  ')}`);
}

function taskTag(type) {
  // TODO git tag ${packageJSON.version} && git push origin --tags
}

module.exports = {
  taskPackageJSON,
  taskPwd,
  taskTag,
};
