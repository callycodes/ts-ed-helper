export default class SettingsContainer {
  controllerSettings:Object = {
    active: true
  };

  async merge(data: Object): Promise<Object> {
    const merged = {...this.getConfig(), ...data};
    return merged;
  }

  getConfig() {
    let config = {
      "controllerSettings": this.controllerSettings
    };

    return config;
  }
}