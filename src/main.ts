const fs = require('fs');
const path = require('path');
import * as vscode from 'vscode';
import outCss from './outcss';
import outJs from './outjs';

const author: string = 'Jhin <a598805559@hotmail.com>';

const mainPath: string = path.resolve('resources', 'app', 'out', 'vs', 'code', 'electron-browser', 'workbench');
const htmlPath: string = path.resolve(mainPath, 'workbench.html');
const cssFileName: string = 'BACKGROUND-CUSTOM.CSS';
const jsFileName: string = 'BACKGROUND-CUSTOM.JS';
const linkPath: string = path.resolve(mainPath, cssFileName);
const scriptPath: string = path.resolve(mainPath, jsFileName);
const linkLine: string = `\n\t\t<link rel="stylesheet" href="${cssFileName}" />`;
const scriptLine: string = `\n\t<script src="${jsFileName}"></script>`;

class Main {
    config: vscode.WorkspaceConfiguration;
    changeConfig: any;
    constructor () {
        this.config = this.getConfig();
    }

    getConfig () {
        return vscode.workspace.getConfiguration('backgroundCustom');
    }

    setHtml (uninstall: boolean = false) {
        let content = fs.readFileSync(htmlPath, 'utf-8');
        let result = content;
        if (uninstall) { result = result.replace(linkLine, '').replace(scriptLine, ''); }
        else {
            if (!content.includes(linkLine)) { result = result.replace('\n\t</head>', linkLine + '\n\t</head>'); }
            if (!content.includes(scriptLine)) { result = result.replace('\n</html>', scriptLine + '\n</html>'); }
        }
        if (result !== content) { fs.writeFileSync(htmlPath, result, 'utf-8'); }
    }

    setCss (config: vscode.WorkspaceConfiguration) {
        let content = outCss(config);
        fs.writeFileSync(linkPath, content);
    }

    setJs (config: vscode.WorkspaceConfiguration) {
        let content = outJs(config);
        fs.writeFileSync(scriptPath, content);
    }

    install () {
        let config = this.getConfig();
        let strOldCon = JSON.stringify(this.config);
        let strNowCon = JSON.stringify(config);
        let refresh = strOldCon !== strNowCon;

        if (JSON.stringify(this.changeConfig) === strNowCon) { return false; }
        this.changeConfig = config;

        if (!config.$enabled) { return this.uninstall(refresh); }

        this.setHtml(false);
        this.setCss(config);
        this.setJs(config);

        if (refresh) { this.reloadInfo('background-custom 配置发生改变，重启 vscode 生效。'); }
    }

    uninstall (refresh: boolean = false) {
        this.setHtml(true);
        fs.unlink(linkPath, (err: any) => console.log(err || '已删除CSS文件'));
        fs.unlink(scriptPath, (err: any) => console.log(err || '已删除CSS文件'));
        if (refresh) { this.reloadInfo('已清除 background-custom 生成的背景图，重启 vscode 生效。'); }
    }

    info (content: string, config: object = {}) {
        return vscode.window.showInformationMessage(content, config);
    }

    reloadInfo (content: string) {
        this.info(content, {
            title: 'Restart vscode'
        }).then(bool => {
            if (!bool) { return false; }
            vscode.commands.executeCommand('workbench.action.reloadWindow');
        });
    }

    init () {
        this.install();
        let loadPath = path.resolve(__dirname, './loadend');
        let loadend = fs.existsSync(loadPath);
        if (loadend) { return false; }
        fs.writeFileSync(loadPath, author);
        this.info('欢迎使用 background-custom 插件, 插件的相关配置可以在 settings.json 修改.');
    }

    watch () {
        let file = path.resolve('resources', 'app', 'out', 'vs', 'workbench', 'workbench.main.css');
        fs.writeFileSync(file, fs.readFileSync(file, 'utf-8').replace(/\/\*:JHIN-BACKGROUND-CUSTOM-START:\*\/([\s\S]*)\/\*:JHIN-BACKGROUND-CUSTOM-END:\*\//g, '').replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, ''), 'utf-8');

        this.init();
        return vscode.workspace.onDidChangeConfiguration(() => this.install());
    }

    author () {
        this.info(author, {
            title: ''
        }).then(bool => {
            if (!bool) { return false; }
            // TODO 打开浏览器
        });
    }
}

export default new Main;
