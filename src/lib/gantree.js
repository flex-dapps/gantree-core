const configUtils = require('./config')
const { Platform } = require('./platform')
const { Application } = require('./application')
const cmd = require('./cmd')

class Gantree {
  constructor() {
    this.returnConfig = this.returnConfig.bind(this)
    this.syncAll = this.syncAll.bind(this)
    this.syncPlatform = this.syncPlatform.bind(this)
    this.syncApplication = this.syncApplication.bind(this)
  }

  async returnConfig(gantreeConfigPath) {
    const gantreeConfigObj = configUtils.read(gantreeConfigPath)
    configUtils.validate(gantreeConfigObj)
    return Promise.resolve(gantreeConfigObj)
  }

  async syncAll(gantreeConfigObj) {
    console.log('[START] sync platform')

    const infraObj = await this.syncPlatform(gantreeConfigObj)

    console.log('[DONE ] sync platform')

    const { validatorIpAddresses } = infraObj

    console.log(
      `Validator ip addresses: ${JSON.stringify(validatorIpAddresses)}`
    )

    console.log('[START] sync application')

    await this.syncApplication(gantreeConfigObj, infraObj)

    console.log('[DONE ] sync application')
  }

  async ansibleSyncAll(inventoryPath, ansiblePath) {
    const cmdOptions = { verbose: true }
    console.log(
      'Syncing platform + application with temp function (ansible only)'
    )
    await cmd.exec('pwd', cmdOptions)
    await cmd.exec(
      `ansible-playbook -i ${inventoryPath}/gantree -i ${inventoryPath}/active ${ansiblePath}/infra_and_operation.yml`,
      cmdOptions
    )
    console.log(
      'Done syncing platform + application! (temp ansible-only function)'
    )
  }

  async ansibleCleanAll(inventoryPath, ansiblePath) {
    const cmdOptions = { verbose: true }
    console.log(
      'Cleaning platform + application with temp function (ansible only)'
    )
    await cmd.exec('pwd', cmdOptions)
    await cmd.exec(
      `ansible-playbook -i ${inventoryPath}/gantree -i ${inventoryPath}/active ${ansiblePath}/clean_infra.yml`,
      cmdOptions
    )
    console.log(
      'Done cleaning platform + application! (temp ansible-only function)'
    )
  }

  async syncPlatform(gantreeConfigObj) {
    const platform = new Platform(gantreeConfigObj)
    const platformSyncResult = await platform.sync()
    return Promise.resolve(platformSyncResult)
  }

  async cleanPlatform(gantreeConfigObj) {
    const platform = new Platform(gantreeConfigObj)
    const platformCleanResult = await platform.clean()
    return Promise.resolve(platformCleanResult)
  }

  async syncApplication(gantreeConfigObj, infraObj) {
    const app = new Application(gantreeConfigObj, infraObj)
    const applicationSyncResult = await app.sync()
    return Promise.resolve(applicationSyncResult)
  }
}

module.exports = {
  Gantree
}
