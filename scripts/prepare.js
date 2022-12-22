const fs = require('fs')
const path = require('path')

function copyFileIfNotExist(src, target) {
  if (!fs.existsSync(target)) {
    fs.copyFileSync(src, target)
  }
}

function createEnvFilesIfNotExist() {
  const envFiles = ['.env.development', '.env.production']
  envFiles.forEach(envFile => {
    copyFileIfNotExist(path.join(__dirname, '..', `${envFile}.example`), path.join(__dirname, '..', envFile))
  })
}

createEnvFilesIfNotExist()
