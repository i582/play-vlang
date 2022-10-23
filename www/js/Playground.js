class Playground {
    constructor() {
        this.repository = CodeRepositoryManager.selectRepository()
        this.themeManager = new ThemeManager()
        this.editor = new Editor(this.repository, this.themeManager)
        this.examplesManager = new ExamplesManager(this.editor)
        this.helpManager = new HelpManager()
    }

    run() {
        this.examplesManager.initListeners()
        this.themeManager.initListeners()
        this.helpManager.initListeners()
        this.initListeners()

        window.onload = () => {
            const html = document.querySelector("html");
            this.themeManager.onLoad()
            html.style.opacity = '1'
        }

        document.addEventListener("keydown", ev => {
            this.editor.saveCode()

            if (ev.ctrlKey && (ev.key === "Enter" || ev.key === "r")) {
                this.runCode()
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "l") {
                this.formatCode()
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "=") {
                this.editor.changeEditorFontSize(1);
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "-") {
                this.editor.changeEditorFontSize(-1);
                ev.preventDefault();
            }
            if (ev.ctrlKey && ev.key === "h") {
                this.helpManager.toggleHelp()
                ev.preventDefault();
            }
            if ((ev.ctrlKey || ev.metaKey) && ev.key === "s") {
                this.repository.saveCode(this.editor.getCode())
                ev.preventDefault();
            }

            if (ev.key === "Escape") {
                this.helpManager.closeHelp()
                ev.preventDefault();
            }
        })
    }

    initListeners() {
        const formatButton = document.getElementsByClassName('js-format-code')[0];
        if (formatButton !== undefined) {
            formatButton.addEventListener('click', () => {
                this.formatCode()
            });
        }

        const runButton = document.getElementsByClassName('js-run-code')[0];
        runButton.addEventListener('click', () => {
            this.runCode()
            this.editor.terminal.openTerminal()
        });

        const shareButton = document.getElementsByClassName('js-share-code')[0];
        if (shareButton !== undefined) {
            shareButton.addEventListener('click', () => {
                this.shareCode()
            });
        }
    }

    runCode() {
        const code = this.editor.getCode()
        const data = new FormData()
        data.append("code", code)

        this.clearTerminal();
        this.writeToTerminal("Running code...\n")

        fetch("http://localhost:5555/run", {
            method: "post",
            body: data,
        })
            .then(resp => resp.text())
            .then(output => {
                this.clearTerminal();
                this.writeToTerminal(output)
            })
            .catch(err => {
                console.log(err);
                this.writeToTerminal("Can't run code. Please try again.")
            })
    }

    formatCode() {
        const code = this.editor.getCode()
        const data = new FormData()
        data.append("code", code)

        this.clearTerminal();
        this.writeToTerminal("Formatting code...\n")

        fetch("http://localhost:5555/format", {
            method: "post",
            body: data
        })
            .then(resp => resp.json())
            .then(data => {
                const json = JSON.parse(data)
                if (json.ok) {
                    this.editor.setCode(json.output)
                    this.writeToTerminal("Code formatted successfully!\n")
                } else {
                    this.clearTerminal();
                    this.writeToTerminal(json.output)
                }
            })
            .catch(err => {
                console.log(err);
                this.writeToTerminal("Can't format code. Please try again.")
            })
    }

    shareCode() {
        const code = this.editor.getCode()
        const data = new FormData()
        data.append("code", code)

        this.clearTerminal();

        fetch("http://localhost:5555/share", {
            method: "post",
            body: data
        })
            .then(resp => resp.text())
            .then(data => {
                this.writeToTerminal("Code shared successfully!\n")
                this.writeToTerminal("Share link: http://localhost:63342/play-vlang/www/index.html?query=" + data + "\n")

                const newURL = updateURLParameter(window.location.href, 'query', data);
                window.history.replaceState('', '', newURL);
            })
            .catch(err => {
                console.log(err);
                this.writeToTerminal("Can't share code. Please try again.")
            })
    }

    clearTerminal() {
        this.editor.terminal.clearTerminal()
    }

    writeToTerminal(text) {
        this.editor.terminal.writeToTerminal(text)
    }
}
