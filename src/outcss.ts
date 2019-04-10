import { WorkspaceConfiguration } from 'vscode';

const PS2V:any = {
    'lt': '0% 0%', 'tl': '0% 0%',
    'lc': '50% 0%', 'cl': '50% 0%',
    'lb': '100% 0%', 'bl': '100% 0%',
    'ct': '0% 50%', 'tc': '0% 50%',
    'cc': '50% 50%',
    'cb': '100% 50%', 'bc': '100% 50%',
    'rt': '0% 100%', 'tr': '0% 100%',
    'rc': '50% 100%', 'cr': '50% 100%',
    'rb': '100% 100%', 'br': '100% 100%'
};

const SS2V: any = {
    'auto': 'auto',
    'full': '100% 100%',
    'width': '100% auto',
    'height': 'auto 100%',
    'cover': 'cover',
    'contain': 'contain'
};

function fixed (num: number) {
    num = num * 100;
    return num.toFixed(8).replace(/\.?0*$/, '');
}

function outKeyframes (arr: any, minute: number) {
    if (arr.length % 2 === 1) { arr = arr.concat(...arr); }
    let before = '';
    let after = '';
    let len = arr.length;
    let sec = minute * 60 + 3;
    let count = sec * len;
    for (let i = 0; i < len / 2; i++) {
        let num = 2 * i;

        before += `
        ${fixed(sec * num / count)}% {
            background-image: url(${arr[num]});
        }
        ${fixed(sec * (num + 1) / count)}% {
            background-image: url(${arr[num + 2] || arr[0]});
        }`;

        after += `
        ${fixed(sec * num / count)}% {
            opacity: 0;
            background-image: url(${arr[num + 1]});
        }
        ${fixed((sec * (num + 1) - 3) / count)}% {
            opacity: 0;
        }
        ${fixed(sec * (num + 1) / count)}% {
            opacity: 1;
        }
        ${fixed((sec * (num + 2) - 3) / count)}% {
            opacity: 1;
            background-image: url(${arr[num + 1]});
        }`;
    }
    if (len) {
        before += `
        100% {
            background-image: url(${arr[0]});
        }`;
        after += `
        100% {
            opacity: 0;
            background-image: url(${arr[1]});
        }`;
    }
    return `
    @keyframes jhinanimationbefore {${before}}
    @-webkit-keyframes jhinanimationbefore {${before}}
    @keyframes jhinanimationafter {${after}}
    @-webkit-keyframes jhinanimationafter {${after}}
    .monaco-workbench:before, .monaco-workbench:after {
        backface-visibility: hidden;
        transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
    }
    .monaco-workbench:before {
        animation: jhinanimationbefore ${count}s infinite;
        -webkit-animation: jhinanimationbefore ${count}s infinite;
    }
    .monaco-workbench:after {
        animation: jhinanimationafter ${count}s infinite;
        -webkit-animation: jhinanimationafter ${count}s infinite;
    }`;
}

function outOpacity (opa: number, front: boolean = false) {
    opa = opa < 0 ? 0 : opa > 100 ? 100 : opa;
    if (front) { return opa / 100; }
    return (200 - opa * 2 + 800) / 1000;
}

function outRandom (arr: string[]) {
    let res: any = [];
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let index = outRandomNum(arr.length);
        res.push(arr.splice(index, 1)[0]);
    }
    return res;
}

function outRandomNum (max: number, min: number = 0) {
    return ~~(Math.random() * (max - 0.001)) + min;
}
function outSingleRandom (arr: string[]) {
    let index = outRandomNum(arr.length);
    return arr[index];
}

export default function outCss (options: WorkspaceConfiguration) {
    let body = options.body;
    let bImge = body.image;
    let bOpac = body.opacity;
    let bSetS = body.setSize;
    let bAuto = body.autoSize;
    let bPosi = body.position;
    let bRepe = body.repeat;
    let bShow = body.show;
    let bMode = body.mode;
    let bImgs = body.images;

    bImge = bMode === 'random' ? bImgs.length > 0 ? outSingleRandom(bImgs) : bImge : bImge;

    let loop = options.loop;
    let lRun = bMode === 'loop';
    let lImg = bImgs;
    let lMin = loop.minute;
    let lRan = loop.random;

    let edit = options.edit;
    let eImge = edit.image;
    let eOpac = edit.opacity;
    let eSetS = edit.setSize;
    let eAuto = edit.autoSize;
    let ePosi = edit.position;
    let eRepe = edit.repeat;
    let eImgs = edit.images;
    let eRand = edit.random;
    let eStyl = edit.styles;
    let eShow = edit.show;

    let cssStr = '';

    if (bShow && lRun) { cssStr += outKeyframes(lRan ? outRandom(lImg) : lImg, lMin); }

    if (bShow) { cssStr += `
    .monaco-workbench:before,
    .monaco-workbench:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${bImge});
        background-size: ${bSetS ? bSetS : SS2V[bAuto]};
        background-repeat: ${bRepe ? 'repeat' : 'no-repeat'};
        background-position: ${PS2V[bPosi]};
    }
    .monaco-workbench:before { z-index: -2 }
    .monaco-workbench:after { z-index: -1 }
    .monaco-workbench>div { opacity: ${outOpacity(bOpac)} }
    .monaco-workbench>.titlebar { z-index: 1 }`;
    }

    if (!eShow) { return cssStr; }

    cssStr += `
    [id="workbench.parts.editor"] [id="workbench.editors.files.textFileEditor"] { position: relative; z-index: 0 }
    [id="workbench.parts.editor"] [id="workbench.editors.files.textFileEditor"]:after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url(${eImge});
        background-size: ${eSetS ? eSetS : SS2V[eAuto]};
        background-repeat: ${eRepe ? 'repeat' : 'no-repeat'};
        background-position: ${PS2V[ePosi]};
        opacity: ${outOpacity(eOpac, true)};
        pointer-events: none;
        z-index: 1;
    }`;

    if (!eImgs.length) { return cssStr; }

    if (eRand) { eImgs = outRandom(eImgs); }
    cssStr += eImgs.reduce((str: string, img: string, index: number) => {
        let style = eStyl[index] || {};
        let sSetS = typeof(style.setSize) === 'string' ? style.setSize : eSetS;
        let sAuto = typeof(style.autoSize) === 'string' ? style.autoSize : eAuto;
        let sRepe = typeof(style.repeat) === 'boolean' ? style.repeat : eRepe;
        let sPosi = typeof(style.position) === 'string' ? style.position : ePosi;
        let sOpac = typeof(style.opacity) === 'number' ? style.opacity : eOpac;
        str += `
        [id="workbench.parts.editor"] .split-view-view:nth-child(${index + 1}) [id="workbench.editors.files.textFileEditor"]:after {
            background-image: url(${img});
            background-size: ${sSetS ? sSetS : SS2V[sAuto]};
            background-repeat: ${sRepe ? 'repeat' : 'no-repeat'};
            background-position: ${PS2V[sPosi]};
            opacity: ${outOpacity(sOpac, true)};
        }`;
        return str;
    }, '');

    return cssStr;
}
