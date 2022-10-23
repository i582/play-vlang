class Editor {
    editor
    terminal
    repository
    themeManager

    constructor(repository, themeManager) {
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
            theme: 'dark',
        }

        const editorTextArea = document.getElementById('editor')
        this.editor = CodeMirror.fromTextArea(editorTextArea, editorConfig)
        this.terminal = new Terminal()
        this.terminal.initListeners()
        this.repository = repository

        this.repository.getCode((code) => {
            this.setCode(code)
        });

        this.themeManager = themeManager
        this.themeManager.editor = this

        const fontSize = window.localStorage.getItem('editor-font-size')
        if (fontSize !== null) {
            this.setEditorFontSize(fontSize)
        }
    }

    changeEditorFontSize(delta) {
        const cm = document.getElementsByClassName("CodeMirror")[0];
        const fontSize = window.getComputedStyle(cm, null).getPropertyValue('font-size');
        if (fontSize) {
            const newFontSize = parseInt(fontSize) + delta
            cm.style.fontSize = newFontSize + "px"
            this.editor.refresh()
            window.localStorage.setItem('editor-font-size', newFontSize);
        }
    }

    setEditorFontSize(size) {
        const cm = document.getElementsByClassName("CodeMirror")[0];
        cm.style.fontSize = size + "px"
        this.editor.refresh()
    }

    setCode(code) {
        this.editor.setValue(code)
        this.repository.saveCode(code)
    }

    getCode() {
        return this.editor.getValue()
    }

    saveCode() {
        this.repository.saveCode(this.getCode())
    }

    refresh() {
        this.editor.refresh()
    }
}
