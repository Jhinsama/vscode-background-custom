const fs = require('fs')
const path = require('path')
import * as vscode from 'vscode'
import outCss from './outcss'

const author: string = 'Jhin <a598805559@hotmail.com>'
const cssPath: string = path.resolve('resources', 'app', 'out', 'vs', 'workbench', 'workbench.main.css')
const cssHead: string = '/*:JHIN-BACKGROUND-CUSTOM-START:*/'
const cssFoot: string = '/*:JHIN-BACKGROUND-CUSTOM-END:*/'
const clsCssReg: RegExp = /\/\*:JHIN-BACKGROUND-CUSTOM-START:\*\/([\s\S]*)\/\*:JHIN-BACKGROUND-CUSTOM-END:\*\//g
const trimReg: RegExp = /^[\s\r\n\t]*|[\s\r\n\t]*$/g

class Background {
    config: vscode.WorkspaceConfiguration
    constructor () {
        // 获取并保存用户配置
        this.config = this.getConfig().now
    }

    getConfig () {
        // 获取用户配置
        let config = vscode.workspace.getConfiguration('backgroundCustom')
        let result = {
            old: this.config,
            now: config
        }
        return result
    }

    getCss () {
        // 读取到css文件内容
        return fs.readFileSync(cssPath, 'utf-8')
    }

    setCss (content: string) {
        // 写入css文件内容
        fs.writeFileSync(cssPath, content, 'utf-8')
    }

    clsCss (content: string) {
        // 清除css中新增的样式
        return content.replace(clsCssReg, '').replace(trimReg, '')
    }

    init () {
        let loadPath = path.resolve(__dirname, './loadend')
        let loadend = fs.existsSync(loadPath)
        if (loadend) return false
        fs.writeFileSync(loadPath, author)
        this.install()
        this.vsInfo('很高兴您能使用 background-custom, 插件的相关配置可以在 settings.json 修改.')
    }

    install () {
        let config = this.getConfig()
        let refresh = JSON.stringify(config.old) !== JSON.stringify(config.now)
        if (!config.now.enabled) return this.uninstall(refresh)
        let content = this.getCss()
        content = this.clsCss(content)
        let cssContent = outCss(config.now)
        content = content + cssHead + cssContent + cssFoot
        this.setCss(content)
        if (refresh) this.vsReloadInfo('background-custom 配置发生改变，重启 vscode 生效。')
    }

    uninstall (refresh: boolean = false) {
        let content = this.getCss()
        content = this.clsCss(content)
        this.setCss(content)
        if (refresh) this.vsReloadInfo('已清除 background-custom 生成的背景图，重启 vscode 生效。')
    }

    watch () {
        this.init()
        return vscode.workspace.onDidChangeConfiguration(() => this.install())
    }

    vsInfo (content: string, config: object = {}) {
        return vscode.window.showInformationMessage(content, config)
    }

    vsReloadInfo (content: string) {
        this.vsInfo(content, {
            title: 'Restart vscode'
        }).then(bool => {
            if (!bool) return false
            vscode.commands.executeCommand('workbench.action.reloadWindow')
        })
    }

    author () {
        this.vsInfo(author, {
            title: ''
        }).then(bool => {
            if (!bool) return false
            // TODO 打卡浏览器
        })
    }
}

export default new Background