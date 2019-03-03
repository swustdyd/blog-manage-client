const shelljs = require('shelljs');
const path = require('path');
const fs = require('fs');

const commitMessage = process.argv[2] ? `auto deploy(${process.argv[2]})` : 'auto deploy';

shelljs.exec('cross-env ESLINT=none NODE_ENV=staging roadhog build', (code) => {
  if (code !== 0) {
    throw new Error('build failed');
  }
  const deployPath = path.resolve(__dirname, '../../blog-manage-client-deploy');
  if (!fs.existsSync(deployPath)) {
    throw new Error(`depoly path '${deployPath}' not exist`);
  }
  
  shelljs.cd(deployPath);
  shelljs.exec('git checkout staging');
  shelljs.exec('git pull origin staging', () => {
    const distPath = path.resolve(deployPath, 'dist');
    // eslint-disable-next-line
    console.log(`distPath: ${distPath}/`);
    if (fs.existsSync(distPath)) {
      const rmCommand = `rm -rf ${distPath}`;
      // eslint-disable-next-line
      console.log(rmCommand);
      shelljs.exec(rmCommand);
    }
    shelljs.mkdir(distPath);
    const cpCommand = `cp -rf ${path.resolve(__dirname, '../dist')}/ ${distPath}/`
    // eslint-disable-next-line
    console.log(cpCommand);
    shelljs.exec(cpCommand);
    shelljs.exec('git add .');
    shelljs.exec(`git commit -m "${commitMessage}"`);
    shelljs.exec('git push origin staging');
    process.exit(0);
  });
});
