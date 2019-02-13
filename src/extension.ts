// 模块 “vscode” 包含 VS Code 扩展性API
// 导入模块并在下面的代码中用别名 vscode 引用它
import * as vscode from 'vscode';
import main from './main';

// 激活扩展时调用此方法
// 您的扩展在第一次执行命令时被激活
export function activate(context: vscode.ExtensionContext) {
	// 已在 package.json 文件中定义的命令
	// 使用 registerCommand 注册该命令并设置执行的函数
	// 命令名称 必须与 package.json 中的定义的命令字段匹配
	let disposable = vscode.commands.registerCommand('extension.BackgroundCustomAuthor', () => {
		// 每次执行命令时，都会执行您在此处放置的代码。

		// 向用户显示消息框
		main.author();
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(main.watch());
}

// 当扩展被停用时调用此方法
export function deactivate() {

}
