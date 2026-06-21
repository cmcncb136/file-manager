const fs = require('fs')
const path = require('path')
const Module = require('module')

const misplacedRuntimeDeps = [
  {
    name: 'call-bind-apply-helpers',
    fallbackSource: path.join('call-bind', 'node_modules', 'call-bind-apply-helpers')
  }
]

function getAppDir(context) {
  const resourcesDir =
    typeof context.packager.getResourcesDir === 'function'
      ? context.packager.getResourcesDir(context.appOutDir)
      : path.join(context.appOutDir, 'resources')

  return path.resolve(resourcesDir, 'app')
}

function copyMissingRuntimeDeps(appDir) {
  const nodeModulesDir = path.join(appDir, 'node_modules')

  for (const dep of misplacedRuntimeDeps) {
    const target = path.join(nodeModulesDir, dep.name)
    const source = path.join(nodeModulesDir, dep.fallbackSource)

    if (fs.existsSync(target)) {
      continue
    }

    if (!fs.existsSync(source)) {
      throw new Error(`Cannot repair packaged dependency "${dep.name}": source not found at ${source}`)
    }

    fs.cpSync(source, target, { recursive: true })
    console.log(`[afterPack] copied ${dep.name} to packaged node_modules root`)
  }
}

function verifyRuntimeDeps(appDir) {
  const nodeModulesDir = path.join(appDir, 'node_modules')
  const requireFromApp = Module.createRequire(path.join(appDir, 'package.json'))
  const requiredModules = ['call-bind-apply-helpers', 'dunder-proto/get', 'get-proto', 'typeorm']

  for (const moduleName of requiredModules) {
    requireFromApp.resolve(moduleName, { paths: [nodeModulesDir] })
  }
}

module.exports = async function afterPack(context) {
  const appDir = getAppDir(context)

  if (!fs.existsSync(appDir)) {
    throw new Error(`Cannot find packaged app directory at ${appDir}. This afterPack hook expects asar: false.`)
  }

  copyMissingRuntimeDeps(appDir)
  verifyRuntimeDeps(appDir)
}
