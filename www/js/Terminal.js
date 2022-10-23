class Terminal {
    static closeTerminalButton = document.getElementsByClassName('js-close-terminal-button')[0];

    openTerminal() {
        const terminal = document.getElementsByClassName('terminal')[0]
        if (terminal.classList.contains('closed')) {
            terminal.classList.remove('closed')
            const editor = document.getElementsByClassName('editor')[0]
            if (isEmbed) {
                editor.style.height = "calc(100vh - 100px - 30px)" // hack for now
            } else {
                editor.style.height = "calc(100vh - 250px - 115px)" // hack for now
            }
        }
    }

    closeTerminal() {
        const editor = document.getElementsByClassName('editor')[0]
        if (isEmbed) {
            editor.style.height = "calc(100vh - 30px)" // hack for now
        } else {
            editor.style.height = "calc(100vh - 70px)"
        }
        const terminal = document.getElementsByClassName('terminal')[0]
        terminal.classList.add('closed')
    }

    getTerminalOutputElement() {
        return document.getElementsByClassName("terminal-output")[0];
    }

    writeToTerminal(text) {
        this.getTerminalOutputElement().innerHTML += text;
        this.openTerminal()
    }

    clearTerminal() {
        this.getTerminalOutputElement().innerHTML = "";
    }

    initListeners() {
        if (Terminal.closeTerminalButton === undefined) {
            return;
        }

        Terminal.closeTerminalButton.addEventListener('click', () => {
            this.closeTerminal()
        });
    }
}
