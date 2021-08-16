# Ts.ED Helper

![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/callycodes.ts-ed-helper)

VSCode extension to quickly generate Ts.ED controllers by simply right-clicking your project folders.


-----------------------------------------------------------------------------------------------------------

## Features

<!--\!\[feature X\]\(images/feature-x.png\)-->

* Generate a configuration file to configure the helper, simply right click anywhere on your project directory and select.
  > Tip: By default the extension will find the root of your project and place the config json there.

* Generate a Controller

* Generate a Middleware
  > Tip: By default, the middleware path will also be imported into your server configuration file.

* Generate a Service

-----------------------------------------------------------------------------------------------------------

## Requirements

Visual Studio Code 1.59.0+

-----------------------------------------------------------------------------------------------------------

## Configuration Settings
```
{
  "configuration": {
    "lang": "ts",
    "filename": "Server",
    "naming": "lower+dot"
  },
  "controllers": {
    "async": true,
    "active": {
      "getAll": true,
      "getOne": true,
      "delete": true,
      "patch": true,
      "put": true,
      "post": true
    }
  },
  "middlewares": { 
    "addToServerConfig": true 
  },
  "services": { 
    "injectable": true 
  }
}
```

### configuration
`lang` - Language extension, default `ts`<br>
`filename` - Server configuration filename, default `Server`<br>
`naming` - Naming style, can combine (lower|upper)+dot - example lower+dot would produce a controller named `Name.controller.ts` whereas upper would produce `NameController.ts`, default `lower+dot`

### controllers
`async` - Generate async methods with promises if true, default `true`<br>
`active` - Generate methods or disable individually, all default `true`

### middlewares
`addToServerConfig` - If true, add generated middleware path to server config componentsScan, default `true`

### services
`injectable` - Add injectable decorators to generated services, default `true`

-----------------------------------------------------------------------------------------------------------

## Known Issues

None currently

-----------------------------------------------------------------------------------------------------------

## Release Notes

### 1.1.0
* Middleware generation commands
* Middleware configuration options
* General configuration options for naming, language etc


### 1.0.1
* Logo updated, badge added

### 1.0.0
* Initial release of ts-ed-helper

-----------------------------------------------------------------------------------------------------------

**Enjoy!**
