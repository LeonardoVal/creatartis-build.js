const { distPackageJSON, run } = require('./common');

function getNPMRegistry(id) {
  if (!id) return null;
  if (/^(verdaccio|local)$/.test(id)) return 'http://localhost:4873';
  if (/^(npm)$/.test(id)) return 'https://registry.npmjs.org/';
  if (/^\d+/.test(id)) return `http://localhost:${id}`;
  throw new Error(`Unrecognized NPM registry ${id}!`);
}

async function taskRelease(id) {
  const registryURL = getNPMRegistry(id);
  const registry = registryURL ? `--registry ${registryURL}` : '';
  return run(`npm publish ${registry}`);
}

async function taskUnrelease(id) {
  const registryURL = getNPMRegistry(id);
  const registry = registryURL ? `--registry ${registryURL}` : '';
  return run(`npm unpublish ${registry} --force`);
}

module.exports = {
  getNPMRegistry,
  taskRelease,
  taskUnrelease,
};
