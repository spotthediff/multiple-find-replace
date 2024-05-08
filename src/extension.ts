// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "node:fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multiple-find-replace" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let find_disposable = vscode.commands.registerCommand("multiple-find-replace.openTemplate", () => {
		const findAndReplace = new FindAndReplace(context.extension);
		findAndReplace.find();
	});

	let replace_disposable = vscode.commands.registerCommand("multiple-find-replace.replace", () => {
		const findAndReplace = new FindAndReplace(context.extension);
		findAndReplace.replace();
	});

	context.subscriptions.push(find_disposable);
	context.subscriptions.push(replace_disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}


export class FindAndReplace {
	ext: vscode.Extension<any>;
	finishWithError: boolean;
	template_path: string;

	constructor(ext: vscode.Extension<any>) {
		this.ext = ext;
		this.finishWithError = false;
		this.template_path = path.join(ext.extensionPath, "multiple-find-replace-template.txt");

	}
	async find() {
		this.finishWithError = false;
		const default_text = "Find and replace me" + vscode.workspace.getConfiguration().get("splitSyntax") + "Replaced!!";
		if (fs.existsSync(this.template_path)) {
			const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(this.template_path));
			if (vscode.workspace.getConfiguration().get("displayNotifications")) {
				vscode.window.showInformationMessage("Your last template has been opened");
			}
			vscode.window.showTextDocument(doc);
		} else {
			fs.readFile(this.template_path, (err, data) => {
				if (err) {
					fs.writeFile(this.template_path, default_text, async (err) => {
						if (err) {
							if (vscode.workspace.getConfiguration().get("displayNotifications")) {
								vscode.window.showErrorMessage("The template could not be created");
							}
						}
						const doc = await vscode.workspace.openTextDocument(this.template_path);
						vscode.window.showTextDocument(doc);
						this.finishWithError = true;
						if (this.finishWithError && vscode.workspace.getConfiguration().get("displayNotifications")) {
							vscode.window.showInformationMessage("Multiple find and Replace", {detail: 'A new template has been created and opened'});
						}
					});
				}
			});
		}
	}

	replace() {
		this.finishWithError = false;
		let text = "";
		const editor = vscode.window.activeTextEditor;
	
		if (editor) {
			const selection = editor.selection;
			if (selection && !selection.isEmpty) {
				const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
				text = editor.document.getText(selectionRange);
				editor.edit((editBuilder) => {
					editBuilder.replace(selection, this.doreplace(text));
				});
				if (!this.finishWithError && vscode.workspace.getConfiguration().get("displayNotifications")) {
					vscode.window.showInformationMessage('Done it only in your selection');
				}
			} else {
				text = editor.document.getText();
				editor.edit((editBuilder) => {
					const entire_range  = new vscode.Range(editor.document.lineAt(0).range.start, editor.document.lineAt(editor.document.lineCount-1).range.end);
					editBuilder.replace(entire_range, this.doreplace(text));
				});
			}
		} else {
			if (vscode.workspace.getConfiguration().get("displayNotifications")) {
				vscode.window.showErrorMessage("You are out of the editor!");
			}
		}
	}

	doreplace(text: string) : string {
		this.finishWithError = false;
		const default_text = "Find and replace me" + vscode.workspace.getConfiguration().get("splitSyntax") + "Replaced!!";
		fs.readFile(this.template_path, (err, data) => {
			if (err) {
				fs.writeFile(this.template_path, default_text, async (err) => {
					if (err) {
						if (vscode.workspace.getConfiguration().get("displayNotifications")) {
							vscode.window.showErrorMessage("Multiple Find and Replace", {detail: "The template could not be created", modal: true});
						}
					}
					const doc = await vscode.workspace.openTextDocument(this.template_path);
					vscode.window.showTextDocument(doc);
					this.finishWithError = true;
					if (this.finishWithError && vscode.workspace.getConfiguration().get("displayNotifications")) {
						vscode.window.showWarningMessage("Multiple find and Replace", {detail: 'A new template has been created and opened', modal: true});
					}
				});
			}
		});
		const fileExists = fs.existsSync(this.template_path);
		if (fileExists) {
			let data = fs.readFileSync(this.template_path);
			const fulltext = data.toString();
			let lines = [];
			lines = fulltext.split(/\r?\n/g);
			const lineQuantity = lines.length - 1;
			for (let i = 0; i < lineQuantity; i++) {
				let findRegExp; 
				if (lines[i].includes(vscode.workspace.getConfiguration().get("splitSyntax")!)) {
					const line = lines[i].split(vscode.workspace.getConfiguration().get("splitSyntax")!);
					line[0];
					line[1];
					if (vscode.workspace.getConfiguration().get("matchCase") && vscode.workspace.getConfiguration().get("wholeWord")) {
						findRegExp = new RegExp("\\b" + line[0] + "\\b", "g");
					}
					if (!vscode.workspace.getConfiguration().get("matchCase") && !vscode.workspace.getConfiguration().get("wholeWord")) {
						findRegExp = new RegExp(line[0], "gi");
					}
					if (vscode.workspace.getConfiguration().get("matchCase") && !vscode.workspace.getConfiguration().get("wholeWord")) {
						findRegExp = new RegExp(line[0], "g");
					}
					if (vscode.workspace.getConfiguration().get("wholeWord") && !vscode.workspace.getConfiguration().get("matchCase")) {
						findRegExp = new RegExp("\\b" + line[0] + "\\b", "gi");
					}
					text = text.replace(findRegExp!, line[1].toString());

				} else {
					vscode.window.showErrorMessage("Multiple Find and Replace", {detail: "The template has a line without the correct FIND and REPLACE splitter syntax, please check it out.", modal: true});
					vscode.workspace.openTextDocument(this.template_path).then((doc) => {
						vscode.window.showTextDocument(doc);
					});
					this.finishWithError = true;
					break;
				}
			}
		} else {
			this.finishWithError = true;
		}
		return text;
	
	}
}

