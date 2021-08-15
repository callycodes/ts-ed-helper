

export interface ISettingsContainer {
  controllerSettings: Object
}

export default class SettingsContainer {
  controllerSettings:Object = {
    async: true,
    active: {
      getAll: true,
      getOne: true,
      delete: true,
      patch: true,
      put: true,
      post: true
    }
  };

  getConfig() {
    let config = {
      "controllerSettings": this.controllerSettings
    };

    return config;
  }
}