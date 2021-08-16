import * as fs from 'fs-extra';
import { join, basename } from 'path';
import { TextDecoder, TextEncoder } from 'util';
import { window, Uri, workspace, WorkspaceEdit, Position, commands, FileType } from 'vscode';
import { ISettingsContainer } from '../settings';
import { getConfiguration } from './settings';
import { getLineNoFromString } from './utils';

type GeneratedFileType = "middleware" | "service" | "controller";

export async function createFile(name: string, extension: string, path: Uri): Promise<Uri | null> {
  if (fs.existsSync(join(path.fsPath, name.toLowerCase() + `.${extension}`))) {
    window.showErrorMessage('A file already exists with given name');
    return null;
  } else {
    const stats = await workspace.fs.stat(path);

    if (stats.type === FileType.Directory) {
        path = Uri.parse(path + '/' + name + "." + extension);
    }
    else {
        path = Uri.parse(path.fsPath.replace(basename(path.fsPath), '') + '/' + name + "." + extension);
    }

    try {
      await workspace.fs.writeFile(path, new TextEncoder().encode(""));
      return path;
    } catch {
      return null;
    }
  }
}

export function getWorkspaceDirectory(): Uri | null {
  const workspaces = workspace.workspaceFolders || [];
	if (workspaces.length > 0) {
    return workspaces[0].uri;
  }
  return null;
}

export async function formatTextDocument(uri: Uri) {
  return workspace.openTextDocument(uri)
      .then((doc) => {
          return window.showTextDocument(doc);
      })
      .then(() => {
          return commands.executeCommand('editor.action.formatDocument');
      });
}

export async function addToServerConfiguration(type: GeneratedFileType, modulePath: Uri) {
  let config: ISettingsContainer = await getConfiguration();
  let configName: string = config.configuration.filename + "." + config.configuration.lang;
  let serverFiles: Uri[] = await workspace.findFiles('**/' + configName, '**/node_modules/**', 1);

  if (serverFiles.length > 0) {
    if (type === "middleware") {
      addMiddleware(serverFiles[0], modulePath, config).then(() => {
        formatTextDocument(serverFiles[0]);
      });
    }
  }
}

export async function addMiddleware(configPath: Uri, modulePath: Uri, config: ISettingsContainer) {
    const folderPath = modulePath.fsPath.split("src/")[1];
    const formattedModulePath = "`${rootDir}/" + folderPath + "/**/*." + config.configuration.lang + "`";

    workspace.fs.readFile(configPath).then((data) => {
      let configContents = new TextDecoder().decode(data);
      const componentPattern = "componentsScan: [";
      const configPattern = "Configuration({";

      if (configContents.includes(formattedModulePath)) {
        return;
      }

      if (configContents.includes(componentPattern)) {
        const pos = getLineNoFromString(configContents, componentPattern);
        const toInsert = '\n' + formattedModulePath + ', \n';
        let edit = new WorkspaceEdit();
        edit.insert(configPath, pos, toInsert);
        return workspace.applyEdit(edit);

      } else if (configContents.includes(configPattern)) {
        const pos = getLineNoFromString(configContents, configPattern);
        const toInsert = '\n componentsScan: [ \n   ' + 
          formattedModulePath + '\n ], \n';
        let edit = new WorkspaceEdit();
        edit.insert(configPath, pos, toInsert);
        return workspace.applyEdit(edit);
      }
    });
}
