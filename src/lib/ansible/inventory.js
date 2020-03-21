const path = require('path')
const fs = require('fs')
const { inventory } = require('../dataManip/inventory')
const { Paths } = require('../utils/paths')

const paths = new Paths()

async function createNamespace(projectPath) {
  console.log('...creating namespace')

  const gantreeInventoryPath = path.join(projectPath, 'gantree')
  const activeInventoryPath = path.join(projectPath, 'active')

  // create paths recursively
  fs.mkdirSync(gantreeInventoryPath, { recursive: true })
  fs.mkdirSync(activeInventoryPath, { recursive: true })

  // do stuff
  // create gantree folder
  // create active folder
  console.log('...created namespace!')
}

async function createGantreeInventory(gantreeConfigObj, projectPath) {
  console.log('...creating gantree inventory')

  const gantreeInventoryPath = await path.join(projectPath, 'gantree')
  const gantreeInventoryFilePath = await path.join(
    projectPath,
    'gantreeInventory.json'
  )
  const gantreeShFilePathSrc = await paths.getInventoryPath('gantree.sh')
  const gantreeShFilePathTarget = await path.join(
    gantreeInventoryPath,
    'gantree.sh'
  )
  const projectPathTxtFilePath = await path.join(
    gantreeInventoryPath,
    'project_path.txt'
  )

  // turn config object into a gantree inventory
  const gantreeInventoryObj = await inventory(gantreeConfigObj, projectPath)

  // write the gantree inventory to inventory/{NAMESPACE}/gantreeInventory.json
  await fs.writeFileSync(
    gantreeInventoryFilePath,
    JSON.stringify(gantreeInventoryObj),
    'utf8'
  )

  // copy gantree.sh into inventory/{NAMESPACE}/gantree/
  fs.copyFileSync(gantreeShFilePathSrc, gantreeShFilePathTarget)

  // write project's path to project_path.txt (used as CLI argument)
  await fs.writeFileSync(projectPathTxtFilePath, `${projectPath}`, 'utf8')

  console.log('...created gantree inventory!')

  return gantreeInventoryPath
}

module.exports = {
  createNamespace,
  createGantreeInventory
}

// const projectName = gantreeConfigObj.metadata.project
// const namespace = process.env.GANTREE_OVERRIDE_NAMESPACE || projectName
// if (!namespace) {
//     throwGantreeError(
//         'INVALID_NAMESPACE',
//         Error(
//             `No project name or GANTREE_OVERRIDE_NAMESPACE environment variable specified: ${namespace}`
//         )
//     )
// }
// return namespace
