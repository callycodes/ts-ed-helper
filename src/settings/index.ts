export interface ISettingsContainer {
  configuration: {
    lang: string
    filename: string
    naming: string
  }
  controllers: {
    async: boolean,
    active: {
      getAll: boolean,
      getOne: boolean,
      delete: boolean,
      patch: boolean,
      put: boolean,
      post: boolean
    }
  }
  middlewares: {
    addToServerConfig: boolean
  },
  services: {
    injectable: boolean
  }
}

export default class SettingsContainer implements ISettingsContainer {
  configuration = {
    lang: "ts",
    filename: "Server",
    naming: "lower+dot"
  };

  controllers = {
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

  middlewares = {
    addToServerConfig: true
  };

  services = {
    injectable: true
  };

  getConfig() {
    let config = {
      "configuration": this.configuration,
      "controllers": this.controllers,
      "middlewares": this.middlewares,
      "services": this.services
    };

    return config;
  }
}