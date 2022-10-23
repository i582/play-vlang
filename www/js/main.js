const html = document.querySelector("html");
const theme = window.localStorage.getItem('theme') || 'dark';
const editorFontSize = window.localStorage.getItem('editor-font-size')
const savedCode = window.localStorage.getItem('code') || ""
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

window.onload = function () {
    if (theme === 'dark') {
        turnDarkTheme()
    } else {
        turnLightTheme()
    }

    setEditorFontSize(editorFontSize)
    html.style.opacity = '1'
}

const editorConfig = {
    mode: 'v',
    lineNumbers: true,
    matchBrackets: true,
    extraKeys: {
        'Ctrl-Space': 'autocomplete',
        'Ctrl-/': 'toggleComment'
    },
    indentWithTabs: false,
    indentUnit: 4,
    autoCloseBrackets: true,
    showHint: true,
    lint: {
        async: true,
        lintOnChange: true,
        delay: 20,
    },
    toggleLineComment: {
        indent: true,
        padding: " "
    },
    theme: theme,
}

const editorTextArea = document.getElementById('editor')
const editor = CodeMirror.fromTextArea(editorTextArea, editorConfig)

const moonIcon = `<span class="icon">
<svg class="theme-icon"  width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M27.1371 20.5912C25.7519 21.0833 24.2605 21.3512 22.7065 21.3512C15.3985 21.3512 9.47424 15.4269 9.47424 8.11889C9.47424 6.10409 9.92454 4.19447 10.73 2.48517C5.60094 4.30725 1.92825 9.20347 1.92825 14.9575C1.92825 22.2655 7.85255 28.1898 15.1605 28.1898C20.4537 28.1898 25.021 25.0818 27.1371 20.5912Z" fill="white"/>
</svg>
</span>
`
const sunIcon = `<span class="icon">
<svg class="theme-icon" width="30" height="30" viewBox="0 0 30 30" fill="none"xmlns="http://www.w3.org/2000/svg">
    <g clip-path="url(#clip0_4_47)">
    <path d="M14.9854 1.92059C14.7382 1.92445 14.5026 2.02624 14.3304 2.20361C14.1581 2.38099 14.0633 2.61946 14.0667 2.86668V5.66668C14.0649 5.79036 14.0878 5.91315 14.1339 6.02792C14.18 6.14269 14.2485 6.24715 14.3353 6.33523C14.4222 6.42331 14.5256 6.49325 14.6398 6.54098C14.7539 6.58872 14.8763 6.61331 15 6.61331C15.1237 6.61331 15.2462 6.58872 15.3603 6.54098C15.4744 6.49325 15.5778 6.42331 15.6647 6.33523C15.7515 6.24715 15.82 6.14269 15.8661 6.02792C15.9122 5.91315 15.9351 5.79036 15.9333 5.66668V2.86668C15.935 2.74181 15.9117 2.61786 15.8646 2.50219C15.8176 2.38651 15.7478 2.28145 15.6594 2.19323C15.571 2.10501 15.4658 2.03542 15.35 1.98859C15.2343 1.94176 15.1103 1.91863 14.9854 1.92059ZM6.41042 5.47892C6.2249 5.47933 6.04372 5.53501 5.88999 5.63885C5.73626 5.7427 5.61696 5.89 5.54732 6.06195C5.47768 6.2339 5.46086 6.4227 5.499 6.60425C5.53714 6.7858 5.62852 6.95187 5.76146 7.08126L7.74115 9.06095C7.82715 9.15052 7.93016 9.22204 8.04415 9.2713C8.15814 9.32056 8.28081 9.34659 8.40498 9.34785C8.52915 9.34912 8.65232 9.32559 8.76728 9.27865C8.88225 9.23172 8.98669 9.16231 9.0745 9.07451C9.1623 8.9867 9.23171 8.88226 9.27864 8.76729C9.32558 8.65233 9.34911 8.52915 9.34784 8.40498C9.34658 8.28081 9.32056 8.15814 9.27129 8.04416C9.22203 7.93017 9.15051 7.82716 9.06094 7.74116L7.08125 5.76147C6.99406 5.67184 6.88975 5.60065 6.77451 5.55211C6.65928 5.50357 6.53546 5.47868 6.41042 5.47892V5.47892ZM23.5604 5.47892C23.3179 5.48614 23.0878 5.58748 22.9188 5.76147L20.9391 7.74116C20.8495 7.82716 20.778 7.93017 20.7287 8.04416C20.6795 8.15814 20.6534 8.28081 20.6522 8.40498C20.6509 8.52915 20.6744 8.65233 20.7214 8.76729C20.7683 8.88225 20.8377 8.9867 20.9255 9.0745C21.0133 9.16231 21.1178 9.23171 21.2327 9.27865C21.3477 9.32558 21.4709 9.34911 21.595 9.34785C21.7192 9.34659 21.8419 9.32056 21.9559 9.2713C22.0698 9.22203 22.1729 9.15052 22.2589 9.06095L24.2385 7.08126C24.3734 6.95016 24.4655 6.78138 24.5028 6.59703C24.5401 6.41268 24.5209 6.22136 24.4476 6.04814C24.3742 5.87493 24.2503 5.7279 24.092 5.62633C23.9337 5.52475 23.7484 5.47337 23.5604 5.47892ZM15 8.46668C13.2673 8.46668 11.6055 9.15501 10.3802 10.3802C9.155 11.6055 8.46667 13.2673 8.46667 15C8.46667 16.7328 9.155 18.3945 10.3802 19.6198C11.6055 20.845 13.2673 21.5333 15 21.5333C16.7328 21.5333 18.3945 20.845 19.6198 19.6198C20.845 18.3945 21.5333 16.7328 21.5333 15C21.5333 13.2673 20.845 11.6055 19.6198 10.3802C18.3945 9.15501 16.7328 8.46668 15 8.46668V8.46668ZM2.86667 14.0667C2.74299 14.0649 2.6202 14.0878 2.50543 14.1339C2.39066 14.18 2.2862 14.2485 2.19812 14.3353C2.11004 14.4222 2.0401 14.5257 1.99237 14.6398C1.94463 14.7539 1.92004 14.8763 1.92004 15C1.92004 15.1237 1.94463 15.2462 1.99237 15.3603C2.0401 15.4744 2.11004 15.5779 2.19812 15.6647C2.2862 15.7515 2.39066 15.82 2.50543 15.8661C2.6202 15.9122 2.74299 15.9351 2.86667 15.9333H5.66667C5.79035 15.9351 5.91314 15.9122 6.02791 15.8661C6.14268 15.82 6.24714 15.7515 6.33522 15.6647C6.4233 15.5779 6.49324 15.4744 6.54098 15.3603C6.58871 15.2462 6.6133 15.1237 6.6133 15C6.6133 14.8763 6.58871 14.7539 6.54098 14.6398C6.49324 14.5257 6.4233 14.4222 6.33522 14.3353C6.24714 14.2485 6.14268 14.18 6.02791 14.1339C5.91314 14.0878 5.79035 14.0649 5.66667 14.0667H2.86667ZM24.3333 14.0667C24.2097 14.0649 24.0869 14.0878 23.9721 14.1339C23.8573 14.18 23.7529 14.2485 23.6648 14.3353C23.5767 14.4222 23.5068 14.5257 23.459 14.6398C23.4113 14.7539 23.3867 14.8763 23.3867 15C23.3867 15.1237 23.4113 15.2462 23.459 15.3603C23.5068 15.4744 23.5767 15.5779 23.6648 15.6647C23.7529 15.7515 23.8573 15.82 23.9721 15.8661C24.0869 15.9122 24.2097 15.9351 24.3333 15.9333H27.1333C27.257 15.9351 27.3798 15.9122 27.4946 15.8661C27.6093 15.82 27.7138 15.7515 27.8019 15.6647C27.89 15.5779 27.9599 15.4744 28.0076 15.3603C28.0554 15.2462 28.08 15.1237 28.08 15C28.08 14.8763 28.0554 14.7539 28.0076 14.6398C27.9599 14.5257 27.89 14.4222 27.8019 14.3353C27.7138 14.2485 27.6093 14.18 27.4946 14.1339C27.3798 14.0878 27.257 14.0649 27.1333 14.0667H24.3333ZM8.38282 20.6565C8.14034 20.6637 7.9102 20.7651 7.74115 20.9391L5.76146 22.9188C5.67189 23.0048 5.60038 23.1078 5.55111 23.2218C5.50185 23.3357 5.47582 23.4584 5.47456 23.5826C5.4733 23.7068 5.49683 23.8299 5.54376 23.9449C5.5907 24.0599 5.6601 24.1643 5.74791 24.2521C5.83572 24.3399 5.94016 24.4093 6.05512 24.4563C6.17009 24.5032 6.29326 24.5267 6.41743 24.5255C6.5416 24.5242 6.66427 24.4982 6.77825 24.4489C6.89224 24.3996 6.99525 24.3281 7.08125 24.2386L9.06094 22.2589C9.19581 22.1278 9.28793 21.959 9.32522 21.7746C9.36252 21.5903 9.34325 21.399 9.26995 21.2257C9.19664 21.0525 9.07272 20.9055 8.91442 20.8039C8.75612 20.7024 8.57082 20.651 8.38282 20.6565ZM21.5898 20.6565C21.4042 20.6566 21.2227 20.712 21.0687 20.8157C20.9147 20.9194 20.7951 21.0667 20.7253 21.2387C20.6554 21.4107 20.6384 21.5997 20.6765 21.7814C20.7146 21.9631 20.806 22.1294 20.9391 22.2589L22.9188 24.2386C23.0048 24.3281 23.1078 24.3996 23.2218 24.4489C23.3357 24.4982 23.4584 24.5242 23.5826 24.5254C23.7067 24.5267 23.8299 24.5032 23.9449 24.4562C24.0598 24.4093 24.1643 24.3399 24.2521 24.2521C24.3399 24.1643 24.4093 24.0599 24.4562 23.9449C24.5032 23.8299 24.5267 23.7068 24.5254 23.5826C24.5242 23.4584 24.4982 23.3357 24.4489 23.2218C24.3996 23.1078 24.3281 23.0048 24.2385 22.9188L22.2589 20.9391C22.1719 20.8497 22.0679 20.7786 21.953 20.7301C21.8381 20.6815 21.7146 20.6565 21.5898 20.6565V20.6565ZM14.9854 23.3873C14.7382 23.3911 14.5026 23.4929 14.3304 23.6703C14.1581 23.8477 14.0633 24.0861 14.0667 24.3333V27.1333C14.0649 27.257 14.0878 27.3798 14.1339 27.4946C14.18 27.6094 14.2485 27.7138 14.3353 27.8019C14.4222 27.89 14.5256 27.9599 14.6398 28.0077C14.7539 28.0554 14.8763 28.08 15 28.08C15.1237 28.08 15.2462 28.0554 15.3603 28.0077C15.4744 27.9599 15.5778 27.89 15.6647 27.8019C15.7515 27.7138 15.82 27.6094 15.8661 27.4946C15.9122 27.3798 15.9351 27.257 15.9333 27.1333V24.3333C15.935 24.2085 15.9117 24.0845 15.8646 23.9689C15.8176 23.8532 15.7478 23.7481 15.6594 23.6599C15.571 23.5717 15.4658 23.5021 15.35 23.4553C15.2343 23.4084 15.1103 23.3853 14.9854 23.3873V23.3873Z" fill="white"/>
    </g>
    <defs>
    <clipPath id="clip0_4_47">
    <rect width="28" height="28" fill="white" transform="translate(1 1)"/>
    </clipPath>
    </defs>
</svg>
</span>
`

const changeThemeButton = document.getElementsByClassName('js-change-theme')[0];

function turnDarkTheme() {
    editor.setOption('theme', 'dark')
    html.setAttribute('data-theme', 'dark')
    changeThemeButton.innerHTML = sunIcon
    window.localStorage.setItem('theme', 'dark');
}

function turnLightTheme() {
    editor.setOption('theme', 'light')
    html.setAttribute('data-theme', 'light')
    changeThemeButton.innerHTML = moonIcon
    window.localStorage.setItem('theme', 'light');
}

changeThemeButton.addEventListener('click', function () {
    const theme = editor.getOption('theme')

    if (theme === 'light') {
        turnDarkTheme();
    } else {
        turnLightTheme();
    }
})

const closeTerminalButton = document.getElementsByClassName('close-terminal-button')[0];
closeTerminalButton.addEventListener('click', function () {
    closeTerminal()
});

const formatButton = document.getElementsByClassName('js-format-code')[0];
formatButton.addEventListener('click', function () {
    formatCode()
});

const runButton = document.getElementsByClassName('js-run-code')[0];
runButton.addEventListener('click', function () {
    runCode()
    openTerminal()
});

const exampleElementTemplate = function (name, index) {
    let checked = "";
    if (index === 0) {
        checked = 'checked="checked"'
    }
    return `
<div class="select-box__value">
    <input class="select-box__input" type="radio" id="__select-id-${index}" value="1" name="Some" ${checked}/>
    <p class="select-box__input-text">${name}</p>
</div>
`
}
const exampleElementListTemplate = function (name, index) {
    return `
<li>
    <label class="select-box__option" for="__select-id-${index}" aria-hidden="true">${name}</label>
</li>
`
}
const examplesSelectList = document.querySelector('.js-examples-select .select-box__list');
const examplesSelectBox = document.querySelector('.js-examples-select .select-box__current');

examples.forEach(function (example, index) {
    examplesSelectList.innerHTML += exampleElementListTemplate(example.name, index)
    examplesSelectBox.innerHTML += exampleElementTemplate(example.name, index)
})

const selectOptions = document.querySelectorAll('.select-box__option');
selectOptions.forEach(function (option) {
    option.addEventListener('click', function () {
        const exampleName = option.innerText
        const example = examples.find(function (example) {
            return example.name === exampleName
        })
        setCode(example.code)
    })
})

function toggleHelp() {
    const help = document.getElementsByClassName('js-help')[0];
    help.classList.toggle('opened')
    helpOverlay.classList.toggle('opened')
}

const helpOverlay = document.getElementsByClassName('js-help-overlay')[0];
const showHelpButton = document.getElementsByClassName('js-show-help')[0];

showHelpButton.addEventListener('click', function () {
    toggleHelp();
})
const closeHelpButton = document.getElementsByClassName('js-close-help')[0];
closeHelpButton.addEventListener('click', function () {
    toggleHelp();
})

helpOverlay.addEventListener('click', function () {
    toggleHelp();
})

// Replace shortcut with understandable for OS user:
//  - macOS: ⌃
//  - Windows/Linux: Ctrl
if (!isMac) {
    const shortcuts = document.querySelectorAll('.js-shortcut-value')
    shortcuts.forEach(function (shortcut) {
        shortcut.innerText = shortcut.innerText.replace('⌃', 'Ctrl')
    })
}

function saveCode() {
    window.localStorage.setItem('code', editor.getValue());
}

function setCode(code) {
    editor.setValue(code)
    saveCode()
}

setCode(savedCode)

function setEditorFontSize(size) {
    const cm = document.getElementsByClassName("CodeMirror")[0];
    cm.style.fontSize = size + "px"
    editor.refresh()
}

function changeEditorFontSize(delta) {
    const cm = document.getElementsByClassName("CodeMirror")[0];
    const fontSize = window.getComputedStyle(cm, null).getPropertyValue('font-size');
    if (fontSize) {
        const newFontSize = parseInt(fontSize) + delta
        cm.style.fontSize = newFontSize + "px"
        editor.refresh()
        window.localStorage.setItem('editor-font-size', newFontSize);
    }
}

document.addEventListener("keydown", ev => {
    saveCode()

    if (ev.ctrlKey && (ev.key === "Enter" || ev.key === "r")) {
        runCode()
        ev.preventDefault();
    }
    if (ev.ctrlKey && ev.key === "l") {
        formatCode()
        ev.preventDefault();
    }
    if (ev.ctrlKey && ev.key === "=") {
        changeEditorFontSize(1);
        ev.preventDefault();
    }
    if (ev.ctrlKey && ev.key === "-") {
        changeEditorFontSize(-1);
        ev.preventDefault();
    }
    if (ev.ctrlKey && ev.key === "h") {
        toggleHelp()
        ev.preventDefault();
    }
})

function openTerminal() {
    const terminal = document.getElementsByClassName('terminal')[0]
    if (terminal.classList.contains('closed')) {
        terminal.classList.remove('closed')
        const editor = document.getElementsByClassName('editor')[0]
        editor.style.height = "calc(100vh - 250px - 115px)" // hack for now
    }
}

function closeTerminal() {
    const editor = document.getElementsByClassName('editor')[0]
    editor.style.height = "calc(100vh - 70px)"
    const terminal = document.getElementsByClassName('terminal')[0]
    terminal.classList.add('closed')
}

function getTerminalOutputElement() {
    return document.getElementsByClassName("terminal-output")[0];
}

function writeToTerminal(text) {
    getTerminalOutputElement().innerHTML += text;
    openTerminal()
}

function clearTerminal() {
    getTerminalOutputElement().innerHTML = "";
}

function runCode() {
    const code = editor.getValue()
    const data = new FormData()
    data.append("code", code)

    clearTerminal()
    writeToTerminal("Running code...\n")

    fetch("http://localhost:5555/run", {
        method: "post",
        body: data,
    })
        .then(resp => resp.text())
        .then(output => {
            clearTerminal()
            writeToTerminal(output)
        })
        .catch(err => {
            console.log(err);
            writeToTerminal("Can't run code. Please try again.")
        })
}

function formatCode() {
    const code = editor.getValue()
    const data = new FormData()
    data.append("code", code)

    clearTerminal()
    writeToTerminal("Formatting code...\n")

    fetch("http://localhost:5555/format", {
        method: "post",
        body: data
    })
        .then(resp => resp.json())
        .then(data => {
            const json = JSON.parse(data)
            if (json.ok) {
                editor.setValue(json.output)
                writeToTerminal("Code formatted successfully!\n")
            } else {
                clearTerminal()
                writeToTerminal(json.output)
            }
        })
        .catch(err => {
            console.log(err);
            writeToTerminal("Can't format code. Please try again.")
        })
}