// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Uri, workspace, window } from 'vscode';
import { createConfigurationFile, configurationFileExists, getConfiguration } from './helpers/settings';
import { addToServerConfiguration, createFile, formatTextDocument, getWorkspaceDirectory } from './helpers/files';
import { getClassName, invalidFileNames, transformModuleName } from './helpers/utils';
import { getFileTemplate } from './helpers/mustache';
import { TextEncoder } from 'util';
import SettingsContainer, { ISettingsContainer } from './settings';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ts-ed-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ts-ed-helper.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		console.log('Trying');
		vscode.window.showInformationMessage('Hello World from Ts.Ed Helper!');
	});

	let disposableCreateConfigurationCommand = vscode.commands.registerCommand('ts-ed-helper.createConfig', () => {
		vscode.window.showInformationMessage('Creating configuration file...');
		try {
				const workspaceDir = getWorkspaceDirectory();
				if (workspaceDir) {
					createConfigurationFile(workspaceDir);
				}
		} catch {
			vscode.window.showErrorMessage('Sorry, there was an issue creating the config file. Please ensure you have only one project in your workspace and try again.');
		}
	});

	let disposableConfigurationExistsCommand = vscode.commands.registerCommand('ts-ed-helper.configExists', async () => {
		const exists = await configurationFileExists();
		console.log('Exists: ' + exists);
		if (exists) {
			vscode.window.showInformationMessage('Exists');
		} else {
			vscode.window.showErrorMessage('Does not exist');
		}
	});

	let disposableGetConfigurationCommand = vscode.commands.registerCommand('ts-ed-helper.getConfig', async () => {
		const config = await getConfiguration();
		vscode.window.showInformationMessage(JSON.stringify(config));
	});



	//Start of generators

	let disposableGenerateControllerCommand = vscode.commands.registerCommand('ts-ed-helper.generateController', async (resource: Uri) => {
		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		} else {
			return window.showInputBox({
				placeHolder: "Please enter controller name",
			})
			.then<any>(async (input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					const config: ISettingsContainer = await getConfiguration();
					createFile(getClassName(input) + transformModuleName("Controller", config), config.configuration.lang, resource).then(async (file) => {
						if (file) {
							getFileTemplate(input, "controller", config.controllers).then((template) => {
								return workspace.fs.writeFile(file, new TextEncoder().encode(template));
							}).then(() => {
								return formatTextDocument(file);
							}).then(() => {
								workspace.saveAll();
							});
						}
					});

				} else {
					return window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	let disposableGenerateMiddlewareCommand = vscode.commands.registerCommand('ts-ed-helper.generateMiddleware', async (resource: Uri) => {
		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		} else {
			return window.showInputBox({
				placeHolder: "Please enter middleware name",
			})
			.then<any>(async (input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {

					const config: ISettingsContainer = await getConfiguration();
					createFile(getClassName(input) + transformModuleName("Middleware", config), config.configuration.lang, resource).then(async (file) => {
						if (file) {
							getFileTemplate(input, "middleware", config.middlewares).then((template) => {
								return workspace.fs.writeFile(file, new TextEncoder().encode(template));
							}).then(() => {
								return formatTextDocument(file);
							}).then(() => {
								if (config.middlewares.addToServerConfig) {
									return addToServerConfiguration("middleware", resource);
								} else {
									return;
								}
							}).then(() => {
								workspace.saveAll();
							});
						}
					});
				} else {
					return window.showErrorMessage('Invalid filename');
				}
			});
		}
	});

	let disposableGenerateServiceCommand = vscode.commands.registerCommand('ts-ed-helper.generateService', async (resource: Uri) => {
		if (workspace === undefined) {
			return window.showErrorMessage('Please select a workspace first');
		} else {
			return window.showInputBox({
				placeHolder: "Please enter a service name",
			})
			.then<any>(async (input) => {
				if (input === undefined) { return; }
				if (!invalidFileNames.test(input)) {
					const config: ISettingsContainer = await getConfiguration();
					createFile(getClassName(input) + transformModuleName("Service", config), config.configuration.lang, resource).then(async (file) => {
						if (file) {
							getFileTemplate(input, "service", config.services).then((template) => {
								return workspace.fs.writeFile(file, new TextEncoder().encode(template));
							}).then(() => {
								return formatTextDocument(file);
							}).then(() => {
								workspace.saveAll();
							});
						}
					});

				} else {
					return window.showErrorMessage('Invalid filename');
				}
			});
		}
	});



	context.subscriptions.push(
		disposable,
		disposableCreateConfigurationCommand,
		disposableConfigurationExistsCommand,
		disposableGetConfigurationCommand,
		//Start of generator commands
		disposableGenerateControllerCommand,
		disposableGenerateMiddlewareCommand,
		disposableGenerateServiceCommand
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
