import { commands, Uri, window, workspace } from "vscode";
import { createFile, getWorkspaceDirectory } from "./files";
import * as fs from "fs-extra";
import SettingsContainer from "../settings";

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

export async function getConfiguration(): Promise<Object> {
  let container = new SettingsContainer();
  const workspaceDir = getWorkspaceDirectory();
  try {
    const json: Object = JSON.parse(await fs.readFile(workspaceDir?.fsPath + "/" + configFullName, "utf-8"));
    const merged = await container.merge(json);
    return merged;
  } catch {
    return container.getConfig();
  }
}