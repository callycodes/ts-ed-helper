import { commands, Uri, window, workspace } from "vscode";
import { createFile, getWorkspaceDirectory } from "./files";
import * as fs from "fs-extra";
import SettingsContainer, { ISettingsContainer } from "../settings";

const configName: string = "tsed";
const configExtension: string = "config.json";
const configFullName: string = configName + "." + configExtension;

export async function createConfigurationFile(path: Uri) {
  const result = await createFile(configName, configExtension, path);
  if (result) {
    const container = new SettingsContainer();
    await fs.writeJSON(result.fsPath, container.getConfig());
    workspace.openTextDocument(result).then((doc) => {
      return window.showTextDocument(doc);
    }).then(() => {
      return commands.executeCommand('editor.action.formatDocument');
      //commands.executeCommand('editor.action.saveDocument');
    });
  }
}

export async function configurationFileExists() {
  const workspaceDir = getWorkspaceDirectory();
  const fileExists = fs.existsSync(workspaceDir?.fsPath + "/" + configFullName);
  if (fileExists) { 
    return true;
  } else {
    return false;
  }
}

export async function getConfiguration(): Promise<ISettingsContainer> {
  const container = new SettingsContainer();
  const workspaceDir = getWorkspaceDirectory();
  try {
    const json = JSON.parse(await fs.readFile(workspaceDir?.fsPath + "/" + configFullName, "utf-8"));
    const merged = await mergeConfigurations(container.getConfig(), json);
    return merged;
  } catch {
    return container.getConfig();
  }
}

async function mergeConfigurations(existing: object, data: object) {
  const merged = overwriteObjectValues(existing, data);
  return merged;
}

function overwriteObjectValues(template: any, values: any) {
  Object.keys(values).forEach(function(key) {
    if (key in template) {
        //If the property type is an object, must have nested
        //properties, so call function recursively to replace
        //nested fields.
        if (typeof values[key] === "object") {
          overwriteObjectValues(template[key], values[key]);
        } else {
          //Otherwise, overwrite the value, loop to next.
          template[key] = values[key];
        }
    }
});
return template;
}