import { WorkspaceConfiguration } from 'vscode'

const positionSet: any = {
    'lt': '0% 0%',
    'lc': '50% 0%',
    'lb': '100% 0%',
    'ct': '0% 50%',
    'cc': '50% 50%',
    'cb': '100% 50%',
    'rt': '0% 100%',
    'rc': '50% 100%',
    'rb': '100% 100%'
}
const sizeSet: any = {
    'auto': 'auto',
    'full': '100% 100%',
    'width': '100% auto',
    'height': 'auto 100%',
    'cover': 'cover',
    'contain': 'contain'
}

export default function outCss (options: WorkspaceConfiguration) {
    let image = options.body.image
    let opacity = options.body.opacity || 0
    opacity = (200 - opacity * 2 + 800) / 1000
    opacity = opacity < .5 ? .5 : opacity > 1 ? 1 : opacity
    let setSize = options.body.setSize
    let autoSize = options.body.autoSize
    let position = options.body.position
    let repeat = options.body.repeat
    return `
    @keyframes jhinanimation {}
    @-webkit-keyframes jhinanimation {}
    [id="workbench.main.container"] {
        background-image: url(${image});
        background-size: ${setSize ? setSize : sizeSet[autoSize]};
        background-repeat: ${repeat ? 'repeat' : 'no-repeat'};
        background-position: ${positionSet[position]};
    }
    [id="workbench.main.container"]>div {
        opacity: ${opacity};
    }
    [id="workbench.main.container"]>div.titlebar {
        z-index: 1;
    }
    `
}
