import * as fs from 'fs-extra';
import { join, basename } from 'path';
import { TextEncoder } from 'util';
import { window, Uri, workspace, WorkspaceEdit, Position, commands, FileType } from 'vscode';

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